import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const exportProjectsToExcel = (projects, clients = [], teamMembers = []) => {
  try {
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

export default { exportProjectsToExcel };