// Demo data service for development and testing
// This provides mock data when the backend is not available

export const demoProjects = [
  {
    id: 'proj-1',
    name: 'Downtown Office Renovation',
    type: 'commercial',
    status: 'active',
    priority: 'high',
    description: 'Complete renovation of a 10,000 sq ft office space including custom millwork',
    budget: 850000,
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 65,
    clientId: 'client-1',
    projectManager: 'team-1',
    teamMembers: ['team-1', 'team-2', 'team-3'],
    location: 'Downtown Business District',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: 'proj-2',
    name: 'Luxury Residential Kitchen',
    type: 'residential',
    status: 'active',
    priority: 'medium',
    description: 'High-end kitchen renovation with custom cabinetry and millwork',
    budget: 125000,
    startDate: '2024-02-01',
    endDate: '2024-04-15',
    progress: 40,
    clientId: 'client-2',
    projectManager: 'team-1',
    teamMembers: ['team-1', 'team-4'],
    location: 'Westside Residential',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z'
  },
  {
    id: 'proj-3',
    name: 'Medical Office Fit-out',
    type: 'commercial',
    status: 'on-tender',
    priority: 'high',
    description: 'Medical office construction with specialized millwork and compliance requirements',
    budget: 450000,
    startDate: '2024-04-01',
    endDate: '2024-08-30',
    progress: 0,
    clientId: 'client-3',
    projectManager: 'team-2',
    teamMembers: ['team-2', 'team-3', 'team-5'],
    location: 'Medical District',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-20T16:00:00Z'
  },
  {
    id: 'proj-4',
    name: 'Retail Store Fixtures',
    type: 'retail',
    status: 'completed',
    priority: 'medium',
    description: 'Custom retail fixtures and display units for boutique store',
    budget: 95000,
    startDate: '2023-11-01',
    endDate: '2024-01-30',
    progress: 100,
    clientId: 'client-4',
    projectManager: 'team-3',
    teamMembers: ['team-3', 'team-4'],
    location: 'Shopping Mall Plaza',
    createdAt: '2023-10-15T10:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 'proj-5',
    name: 'Restaurant Interior Renovation',
    type: 'hospitality',
    status: 'active',
    priority: 'urgent',
    description: 'Complete interior renovation including custom bar and seating',
    budget: 320000,
    startDate: '2024-03-01',
    endDate: '2024-05-15',
    progress: 30,
    clientId: 'client-5',
    projectManager: 'team-1',
    teamMembers: ['team-1', 'team-2', 'team-4'],
    location: 'Entertainment District',
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-03-18T13:00:00Z'
  }
];

export const demoTasks = [
  // Downtown Office Renovation tasks
  {
    id: 'task-1',
    projectId: 'proj-1',
    name: 'Complete design drawings',
    title: 'Complete design drawings',
    description: 'Finalize all architectural and millwork drawings',
    status: 'completed',
    priority: 'high',
    assignedTo: 'team-2',
    dueDate: '2024-02-15',
    createdAt: '2024-01-15T10:00:00Z',
    completedAt: '2024-02-14T16:00:00Z'
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    name: 'Order custom millwork materials',
    title: 'Order custom millwork materials',
    description: 'Place orders for all custom wood and hardware',
    status: 'completed',
    priority: 'high',
    assignedTo: 'team-3',
    dueDate: '2024-02-20',
    createdAt: '2024-01-20T09:00:00Z',
    completedAt: '2024-02-18T14:00:00Z'
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    name: 'Install reception desk',
    title: 'Install reception desk',
    description: 'Custom reception desk installation and finishing',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'team-3',
    dueDate: '2024-03-25',
    createdAt: '2024-03-01T08:00:00Z'
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    name: 'Conference room millwork',
    title: 'Conference room millwork',
    description: 'Install custom conference room cabinetry and shelving',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'team-2',
    dueDate: '2024-04-10',
    createdAt: '2024-03-10T10:00:00Z'
  },
  // Luxury Residential Kitchen tasks
  {
    id: 'task-5',
    projectId: 'proj-2',
    name: 'Kitchen cabinet measurements',
    title: 'Kitchen cabinet measurements',
    description: 'Final measurements for custom kitchen cabinets',
    status: 'completed',
    priority: 'high',
    assignedTo: 'team-4',
    dueDate: '2024-02-10',
    createdAt: '2024-02-01T09:00:00Z',
    completedAt: '2024-02-09T17:00:00Z'
  },
  {
    id: 'task-6',
    projectId: 'proj-2',
    name: 'Cabinet door fabrication',
    title: 'Cabinet door fabrication',
    description: 'Manufacture custom cabinet doors and drawer fronts',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'team-4',
    dueDate: '2024-03-20',
    createdAt: '2024-02-15T10:00:00Z'
  },
  {
    id: 'task-7',
    projectId: 'proj-2',
    name: 'Install kitchen island',
    title: 'Install kitchen island',
    description: 'Custom kitchen island installation with electrical',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'team-1',
    dueDate: '2024-04-01',
    createdAt: '2024-03-01T11:00:00Z'
  },
  // Restaurant Interior tasks
  {
    id: 'task-8',
    projectId: 'proj-5',
    name: 'Demolition of existing fixtures',
    title: 'Demolition of existing fixtures',
    description: 'Remove old bar and seating areas',
    status: 'completed',
    priority: 'urgent',
    assignedTo: 'team-4',
    dueDate: '2024-03-10',
    createdAt: '2024-03-01T08:00:00Z',
    completedAt: '2024-03-09T18:00:00Z'
  },
  {
    id: 'task-9',
    projectId: 'proj-5',
    name: 'Custom bar construction',
    title: 'Custom bar construction',
    description: 'Build and install new custom bar with integrated lighting',
    status: 'in-progress',
    priority: 'urgent',
    assignedTo: 'team-2',
    dueDate: '2024-03-30',
    createdAt: '2024-03-10T09:00:00Z'
  },
  {
    id: 'task-10',
    projectId: 'proj-5',
    name: 'Booth seating installation',
    title: 'Booth seating installation',
    description: 'Install custom booth seating with upholstery',
    status: 'pending',
    priority: 'high',
    assignedTo: 'team-1',
    dueDate: '2024-04-15',
    createdAt: '2024-03-15T10:00:00Z'
  }
];

export const demoTeamMembers = [
  {
    id: 'team-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    initials: 'SJ',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@formulapm.com',
    role: 'project_manager',
    position: 'Senior Project Manager',
    department: 'Project Management',
    phone: '+1 (555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?img=1',
    status: 'active',
    joinDate: '2022-03-15',
    skills: ['Project Management', 'Millwork Design', 'Client Relations'],
    certifications: ['PMP', 'LEED AP']
  },
  {
    id: 'team-2',
    firstName: 'Michael',
    lastName: 'Chen',
    fullName: 'Michael Chen',
    initials: 'MC',
    name: 'Michael Chen',
    email: 'michael.chen@formulapm.com',
    role: 'designer',
    position: 'Lead Designer',
    department: 'Design',
    phone: '+1 (555) 234-5678',
    avatar: 'https://i.pravatar.cc/150?img=2',
    status: 'active',
    joinDate: '2021-06-01',
    skills: ['AutoCAD', '3D Modeling', 'Material Selection'],
    certifications: ['NCIDQ']
  },
  {
    id: 'team-3',
    firstName: 'David',
    lastName: 'Martinez',
    fullName: 'David Martinez',
    initials: 'DM',
    name: 'David Martinez',
    email: 'david.martinez@formulapm.com',
    role: 'craftsman',
    position: 'Master Craftsman',
    department: 'Production',
    phone: '+1 (555) 345-6789',
    avatar: 'https://i.pravatar.cc/150?img=3',
    status: 'active',
    joinDate: '2020-01-10',
    skills: ['Woodworking', 'CNC Operation', 'Finishing'],
    certifications: ['Master Carpenter']
  },
  {
    id: 'team-4',
    firstName: 'Emily',
    lastName: 'Brown',
    fullName: 'Emily Brown',
    initials: 'EB',
    name: 'Emily Brown',
    email: 'emily.brown@formulapm.com',
    role: 'craftsman',
    position: 'Millwork Specialist',
    department: 'Production',
    phone: '+1 (555) 456-7890',
    avatar: 'https://i.pravatar.cc/150?img=4',
    status: 'active',
    joinDate: '2022-09-01',
    skills: ['Cabinet Making', 'Veneer Application', 'Hardware Installation']
  },
  {
    id: 'team-5',
    firstName: 'Robert',
    lastName: 'Wilson',
    fullName: 'Robert Wilson',
    initials: 'RW',
    name: 'Robert Wilson',
    email: 'robert.wilson@formulapm.com',
    role: 'coordinator',
    position: 'Installation Coordinator',
    department: 'Operations',
    phone: '+1 (555) 567-8901',
    avatar: 'https://i.pravatar.cc/150?img=5',
    status: 'active',
    joinDate: '2023-02-15',
    skills: ['Scheduling', 'Site Coordination', 'Quality Control']
  }
];

export const demoClients = [
  {
    id: 'client-1',
    name: 'Apex Business Solutions',
    companyName: 'Apex Business Solutions',
    contactPerson: 'James Thompson',
    contactPersonName: 'James Thompson',
    email: 'james.thompson@apexbiz.com',
    phone: '+1 (555) 111-2222',
    address: '123 Business Center, Suite 500, Downtown, NY 10001',
    type: 'commercial',
    industry: 'Business Services',
    status: 'active',
    projects: ['proj-1'],
    totalProjectValue: 850000,
    notes: 'Long-term client, prefers modern minimalist designs',
    createdAt: '2023-01-15T10:00:00Z'
  },
  {
    id: 'client-2',
    name: 'Wilson Residence',
    companyName: 'Wilson Residence',
    contactPerson: 'Patricia Wilson',
    contactPersonName: 'Patricia Wilson',
    email: 'p.wilson@email.com',
    phone: '+1 (555) 222-3333',
    address: '456 Oak Street, Westside, CA 90210',
    type: 'residential',
    industry: 'Residential',
    status: 'active',
    projects: ['proj-2'],
    totalProjectValue: 125000,
    notes: 'High-end residential client, attention to detail important',
    createdAt: '2023-08-20T09:00:00Z'
  },
  {
    id: 'client-3',
    name: 'HealthFirst Medical Group',
    companyName: 'HealthFirst Medical Group',
    contactPerson: 'Dr. Amanda Lee',
    contactPersonName: 'Dr. Amanda Lee',
    email: 'alee@healthfirst.com',
    phone: '+1 (555) 333-4444',
    address: '789 Medical Plaza, Health District, NY 10002',
    type: 'commercial',
    industry: 'Healthcare',
    status: 'active',
    projects: ['proj-3'],
    totalProjectValue: 450000,
    notes: 'Medical compliance requirements, sterile materials needed',
    createdAt: '2024-01-10T11:00:00Z'
  },
  {
    id: 'client-4',
    name: 'Boutique Fashion Co',
    companyName: 'Boutique Fashion Co',
    contactPerson: 'Lisa Chen',
    contactPersonName: 'Lisa Chen',
    email: 'lchen@boutiquefashion.com',
    phone: '+1 (555) 444-5555',
    address: '321 Shopping Plaza, Mall District, CA 90211',
    type: 'retail',
    industry: 'Fashion',
    status: 'active',
    projects: ['proj-4'],
    totalProjectValue: 95000,
    notes: 'Completed project, very satisfied, potential repeat client',
    createdAt: '2023-06-15T14:00:00Z'
  },
  {
    id: 'client-5',
    name: 'The Urban Kitchen',
    companyName: 'The Urban Kitchen',
    contactPerson: 'Chef Marco Rossi',
    contactPersonName: 'Chef Marco Rossi',
    email: 'marco@urbankitchen.com',
    phone: '+1 (555) 555-6666',
    address: '555 Entertainment Ave, Downtown, NY 10003',
    type: 'hospitality',
    industry: 'Restaurant',
    status: 'active',
    projects: ['proj-5'],
    totalProjectValue: 320000,
    notes: 'Restaurant client, needs durable materials for high traffic',
    createdAt: '2024-02-01T08:00:00Z'
  }
];

// Demo shop drawings data
export const demoShopDrawings = [
  {
    id: 'sd-1',
    projectId: 'proj-1',
    fileName: 'Reception_Desk_Assembly.pdf',
    drawingType: 'Assembly Drawing',
    room: 'Reception',
    status: 'approved',
    version: 'Rev C',
    uploadDate: '2024-03-10',
    approvedBy: 'team-1',
    approvedDate: '2024-03-12',
    fileSize: '2.4 MB'
  },
  {
    id: 'sd-2',
    projectId: 'proj-2',
    fileName: 'Kitchen_Cabinet_Details.pdf',
    drawingType: 'Detail Drawing',
    room: 'Kitchen',
    status: 'pending',
    version: 'Rev A',
    uploadDate: '2024-03-15',
    fileSize: '3.1 MB'
  },
  {
    id: 'sd-3',
    projectId: 'proj-5',
    fileName: 'Bar_Construction_Plans.pdf',
    drawingType: 'Construction Drawing',
    room: 'Bar Area',
    status: 'revision_required',
    version: 'Rev B',
    uploadDate: '2024-03-18',
    comments: 'Need to adjust height for ADA compliance',
    fileSize: '4.2 MB'
  }
];

// Demo material specifications
export const demoMaterialSpecs = [
  {
    id: 'spec-1',
    projectId: 'proj-1',
    itemId: 'WOOD-001',
    description: 'Walnut Veneer - Reception Desk',
    category: 'Wood Materials',
    material: 'American Walnut',
    finish: 'Clear Satin Lacquer',
    quantity: 150,
    unit: 'sq ft',
    unitCost: 12.50,
    totalCost: 1875.00,
    supplier: 'Premium Wood Suppliers',
    leadTime: '2 weeks',
    status: 'ordered'
  },
  {
    id: 'spec-2',
    projectId: 'proj-2',
    itemId: 'HW-001',
    description: 'Soft-close Drawer Slides',
    category: 'Hardware',
    material: 'Stainless Steel',
    finish: 'Brushed',
    quantity: 24,
    unit: 'pairs',
    unitCost: 45.00,
    totalCost: 1080.00,
    supplier: 'Hardware Direct',
    leadTime: '1 week',
    status: 'in_stock'
  },
  {
    id: 'spec-3',
    projectId: 'proj-5',
    itemId: 'METAL-001',
    description: 'Bar Top - Stainless Steel',
    category: 'Metal',
    material: '316 Stainless Steel',
    finish: 'Brushed',
    quantity: 1,
    unit: 'piece',
    unitCost: 3500.00,
    totalCost: 3500.00,
    supplier: 'Metal Fabricators Inc',
    leadTime: '3 weeks',
    status: 'pending_approval'
  }
];

// Export all demo data as a single object
export const demoData = {
  projects: demoProjects,
  tasks: demoTasks,
  teamMembers: demoTeamMembers,
  clients: demoClients,
  shopDrawings: demoShopDrawings,
  materialSpecs: demoMaterialSpecs
};

// Helper function to get demo data by type
export const getDemoData = (type) => {
  return demoData[type] || [];
};

export default demoData;