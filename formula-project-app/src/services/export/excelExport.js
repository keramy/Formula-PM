export const exportProjectsToExcel = async (projects, clients = [], teamMembers = []) => {
  try {
    // Lazy load XLSX and file-saver to reduce initial bundle size
    const [{ default: XLSX }, { saveAs }] = await Promise.all([
      import('xlsx'),
      import('file-saver')
    ]);
    // Helper functions
    const getClientName = (clientId) => {
      const client = clients.find(c => c.id === clientId);
      return client ? client.companyName : 'No Client Assigned';
    };

    const getProjectManager = (managerId) => {
      const manager = teamMembers.find(tm => tm.id === managerId);
      return manager ? manager.fullName : 'Unassigned';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    };

    const getStatusLabel = (status) => {
      const statusLabels = {
        'on-tender': 'On Tender',
        'awarded': 'Awarded',
        'on-hold': 'On Hold',
        'not-awarded': 'Not Awarded',
        'active': 'Active',
        'completed': 'Completed'
      };
      return statusLabels[status] || status;
    };

    const getTypeLabel = (type) => {
      const typeLabels = {
        'general-contractor': 'General Contractor',
        'fit-out': 'Fit-out',
        'mep': 'MEP',
        'electrical': 'Electrical',
        'millwork': 'Millwork',
        'management': 'Management'
      };
      return typeLabels[type] || type;
    };

    // Prepare data for Excel
    const excelData = projects.map((project, index) => ({
      'No': index + 1,
      'Project Name': project.name || '',
      'Client': getClientName(project.clientId),
      'Project Type': getTypeLabel(project.type),
      'Status': getStatusLabel(project.status),
      'Project Manager': getProjectManager(project.projectManager),
      'Start Date': formatDate(project.startDate),
      'End Date': formatDate(project.endDate),
      'Progress': project.progress !== undefined ? `${project.progress}%` : 'N/A',
      'Tasks Completed': project.completedTasks !== undefined ? `${project.completedTasks}/${project.totalTasks}` : 'N/A',
      'Due Status': project.dueStatus || 'N/A',
      'Description': project.description || '',
      'Created Date': formatDate(project.createdAt),
      'Budget': project.budget || 'Not set',
      'Location': project.location || 'Not specified'
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add projects sheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const columnWidths = [
      { wch: 5 },   // No
      { wch: 25 },  // Project Name
      { wch: 20 },  // Client
      { wch: 18 },  // Project Type
      { wch: 15 },  // Status
      { wch: 20 },  // Project Manager
      { wch: 12 },  // Start Date
      { wch: 12 },  // End Date
      { wch: 10 },  // Progress
      { wch: 15 },  // Tasks Completed
      { wch: 18 },  // Due Status
      { wch: 40 },  // Description
      { wch: 12 },  // Created Date
      { wch: 15 },  // Budget
      { wch: 20 }   // Location
    ];
    ws['!cols'] = columnWidths;

    // Add header styling (basic)
    const headerRange = XLSX.utils.decode_range(ws['!ref']);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
      const headerCell = XLSX.utils.encode_cell({ r: 0, c: col });
      if (ws[headerCell]) {
        ws[headerCell].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "2C3E50" } },
          alignment: { horizontal: "center" }
        };
      }
    }

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Projects');

    // Add summary sheet
    const summaryData = [
      ['Formula International - Projects Summary'],
      ['Generated on:', new Date().toLocaleDateString()],
      ['Total Projects:', projects.length],
      [''],
      ['Status Breakdown:'],
      ...getStatusBreakdown(projects),
      [''],
      ['Type Breakdown:'],
      ...getTypeBreakdown(projects)
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWs['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { 
      bookType: 'xlsx', 
      type: 'array',
      cellStyles: true 
    });
    
    const data = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `Formula_Projects_${timestamp}.xlsx`;
    
    saveAs(data, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to get status breakdown
const getStatusBreakdown = (projects) => {
  const statusCounts = projects.reduce((acc, project) => {
    const status = project.status || 'unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(statusCounts).map(([status, count]) => [
    status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
    count
  ]);
};

// Helper function to get type breakdown
const getTypeBreakdown = (projects) => {
  const typeCounts = projects.reduce((acc, project) => {
    const type = project.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(typeCounts).map(([type, count]) => [
    type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
    count
  ]);
};

// Export Tasks to Excel
export const exportTasksToExcel = async (tasks, projects = [], teamMembers = []) => {
  try {
    // Lazy load XLSX and file-saver
    const [{ default: XLSX }, { saveAs }] = await Promise.all([
      import('xlsx'),
      import('file-saver')
    ]);
    const getProjectName = (projectId) => {
      const project = projects.find(p => p.id === projectId);
      return project ? project.name : 'No Project Assigned';
    };

    const getAssigneeName = (assigneeId) => {
      const assignee = teamMembers.find(tm => tm.id === assigneeId);
      return assignee ? assignee.fullName : 'Unassigned';
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    };

    const getPriorityLabel = (priority) => {
      const priorityLabels = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High',
        'urgent': 'Urgent'
      };
      return priorityLabels[priority] || priority;
    };

    const getStatusLabel = (status) => {
      const statusLabels = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'completed': 'Completed'
      };
      return statusLabels[status] || status;
    };

    // Prepare data for Excel
    const excelData = tasks.map((task, index) => ({
      'No': index + 1,
      'Task Name': task.name || '',
      'Project': getProjectName(task.projectId),
      'Assigned To': getAssigneeName(task.assignedTo),
      'Priority': getPriorityLabel(task.priority),
      'Status': getStatusLabel(task.status),
      'Progress': `${task.progress || 0}%`,
      'Due Date': formatDate(task.dueDate),
      'Created Date': formatDate(task.createdAt),
      'Completed Date': task.status === 'completed' ? formatDate(task.completedAt) : 'Not completed',
      'Description': task.description || 'No description'
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Tasks sheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

    // Summary sheet
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const overdueTasks = tasks.filter(t => {
      const today = new Date();
      return t.status !== 'completed' && new Date(t.dueDate) < today;
    }).length;

    const summaryData = [
      { 'Metric': 'Total Tasks', 'Count': totalTasks },
      { 'Metric': 'Completed Tasks', 'Count': completedTasks },
      { 'Metric': 'Pending Tasks', 'Count': pendingTasks },
      { 'Metric': 'In Progress Tasks', 'Count': inProgressTasks },
      { 'Metric': 'Overdue Tasks', 'Count': overdueTasks },
      { 'Metric': 'Completion Rate', 'Count': totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%' }
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(data, `Formula_Tasks_Export_${timestamp}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting tasks to Excel:', error);
    return false;
  }
};

// Export Team Members to Excel
export const exportTeamMembersToExcel = async (teamMembers, tasks = []) => {
  try {
    // Lazy load XLSX and file-saver
    const [{ default: XLSX }, { saveAs }] = await Promise.all([
      import('xlsx'),
      import('file-saver')
    ]);
    const getRoleLabel = (role) => {
      const roleLabels = {
        'project_manager': 'Project Manager',
        'team_lead': 'Team Lead',
        'senior': 'Senior',
        'junior': 'Junior',
        'client': 'Client'
      };
      return roleLabels[role] || role;
    };

    const getDepartmentLabel = (department) => {
      const departmentLabels = {
        'construction': 'Construction',
        'millwork': 'Millwork',
        'electrical': 'Electrical',
        'mechanical': 'Mechanical',
        'management': 'Management',
        'client': 'Client'
      };
      return departmentLabels[department] || department;
    };

    const getMemberStats = (memberId) => {
      const memberTasks = tasks.filter(task => task.assignedTo === memberId);
      const completedTasks = memberTasks.filter(task => task.status === 'completed').length;
      return {
        total: memberTasks.length,
        completed: completedTasks,
        pending: memberTasks.length - completedTasks,
        completionRate: memberTasks.length > 0 ? Math.round((completedTasks / memberTasks.length) * 100) : 0
      };
    };

    // Prepare data for Excel
    const excelData = teamMembers.map((member, index) => {
      const stats = getMemberStats(member.id);
      return {
        'No': index + 1,
        'Full Name': member.fullName || '',
        'Email': member.email || '',
        'Phone': member.phone || 'Not provided',
        'Role': getRoleLabel(member.role),
        'Department': getDepartmentLabel(member.department),
        'Level': member.level || 'Not set',
        'Status': member.status === 'active' ? 'Active' : 'Inactive',
        'Hourly Rate': member.hourlyRate ? `$${member.hourlyRate}` : 'Not set',
        'Total Tasks': stats.total,
        'Completed Tasks': stats.completed,
        'Pending Tasks': stats.pending,
        'Task Completion Rate': `${stats.completionRate}%`,
        'Notes': member.notes || 'No notes'
      };
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Team Members sheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Team Members');

    // Summary sheet
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(m => m.status === 'active').length;
    const departmentCounts = teamMembers.reduce((acc, member) => {
      const dept = getDepartmentLabel(member.department);
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const summaryData = [
      { 'Metric': 'Total Team Members', 'Count': totalMembers },
      { 'Metric': 'Active Members', 'Count': activeMembers },
      { 'Metric': 'Inactive Members', 'Count': totalMembers - activeMembers },
      ...Object.entries(departmentCounts).map(([dept, count]) => ({
        'Metric': `${dept} Department`,
        'Count': count
      }))
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(data, `Formula_Team_Members_Export_${timestamp}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting team members to Excel:', error);
    return false;
  }
};

// Export Clients to Excel
export const exportClientsToExcel = async (clients) => {
  try {
    // Lazy load XLSX and file-saver
    const [{ default: XLSX }, { saveAs }] = await Promise.all([
      import('xlsx'),
      import('file-saver')
    ]);
    const getStatusLabel = (status) => {
      const statusLabels = {
        'active': 'Active',
        'inactive': 'Inactive',
        'potential': 'Potential'
      };
      return statusLabels[status] || status;
    };

    const getIndustryLabel = (industry) => {
      const industryLabels = {
        'construction': 'Construction',
        'finance': 'Finance',
        'technology': 'Technology',
        'healthcare': 'Healthcare',
        'retail': 'Retail',
        'manufacturing': 'Manufacturing',
        'education': 'Education',
        'government': 'Government',
        'hospitality': 'Hospitality',
        'real_estate': 'Real Estate',
        'automotive': 'Automotive',
        'other': 'Other'
      };
      return industryLabels[industry] || industry;
    };

    const getCompanySizeLabel = (size) => {
      const sizeLabels = {
        'startup': 'Startup (1-10)',
        'small': 'Small (11-50)',
        'medium': 'Medium (51-200)',
        'large': 'Large (201-1000)',
        'enterprise': 'Enterprise (1000+)'
      };
      return sizeLabels[size] || size;
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'Not set';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US');
    };

    // Prepare data for Excel
    const excelData = clients.map((client, index) => ({
      'No': index + 1,
      'Company Name': client.companyName || '',
      'Contact Person': client.contactPersonName || '',
      'Contact Title': client.contactPersonTitle || '',
      'Email': client.email || '',
      'Phone': client.phone || '',
      'Industry': getIndustryLabel(client.industry),
      'Company Size': getCompanySizeLabel(client.companySize),
      'Status': getStatusLabel(client.status),
      'Address': client.address || '',
      'City': client.city || '',
      'State': client.state || '',
      'Country': client.country || '',
      'Postal Code': client.postalCode || '',
      'Website': client.website || '',
      'Tax ID': client.taxId || '',
      'Services Required': Array.isArray(client.services) ? client.services.join(', ') : 'Not specified',
      'Created Date': formatDate(client.createdAt),
      'Updated Date': formatDate(client.updatedAt),
      'Notes': client.notes || 'No notes'
    }));

    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Clients sheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');

    // Summary sheet
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const potentialClients = clients.filter(c => c.status === 'potential').length;
    const inactiveClients = clients.filter(c => c.status === 'inactive').length;
    
    const industryCounts = clients.reduce((acc, client) => {
      const industry = getIndustryLabel(client.industry);
      acc[industry] = (acc[industry] || 0) + 1;
      return acc;
    }, {});

    const summaryData = [
      { 'Metric': 'Total Clients', 'Count': totalClients },
      { 'Metric': 'Active Clients', 'Count': activeClients },
      { 'Metric': 'Potential Clients', 'Count': potentialClients },
      { 'Metric': 'Inactive Clients', 'Count': inactiveClients },
      ...Object.entries(industryCounts).map(([industry, count]) => ({
        'Metric': `${industry} Industry`,
        'Count': count
      }))
    ];

    const summaryWorksheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(data, `Formula_Clients_Export_${timestamp}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting clients to Excel:', error);
    return false;
  }
};

export default {
  exportProjectsToExcel,
  exportTasksToExcel,
  exportTeamMembersToExcel,
  exportClientsToExcel
};