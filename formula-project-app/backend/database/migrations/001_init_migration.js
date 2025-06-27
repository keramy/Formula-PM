/**
 * Formula PM Database Migration - Initialize Database
 * Migrates existing demo data from JSON to PostgreSQL
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

// Import demo data from the frontend
const demoDataPath = path.join(__dirname, '../../../src/services/demoDataService.js');

// Helper function to read demo data
function loadDemoData() {
  // For now, we'll define the data inline since it's from a module
  // In production, this would be loaded from a JSON file or API
  const demoData = {
    users: [
      {
        id: 'team-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@formulapm.com',
        role: 'project_manager',
        position: 'Senior Project Manager',
        department: 'Project Management',
        phone: '+1 (555) 123-4567',
        avatarUrl: 'https://i.pravatar.cc/150?img=1',
        status: 'active',
        joinDate: new Date('2022-03-15'),
        skills: ['Project Management', 'Millwork Design', 'Client Relations'],
        certifications: ['PMP', 'LEED AP']
      },
      {
        id: 'team-2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@formulapm.com',
        role: 'designer',
        position: 'Lead Designer',
        department: 'Design',
        phone: '+1 (555) 234-5678',
        avatarUrl: 'https://i.pravatar.cc/150?img=2',
        status: 'active',
        joinDate: new Date('2021-06-01'),
        skills: ['AutoCAD', '3D Modeling', 'Material Selection'],
        certifications: ['NCIDQ']
      },
      {
        id: 'team-3',
        firstName: 'David',
        lastName: 'Martinez',
        email: 'david.martinez@formulapm.com',
        role: 'craftsman',
        position: 'Master Craftsman',
        department: 'Production',
        phone: '+1 (555) 345-6789',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
        status: 'active',
        joinDate: new Date('2020-01-10'),
        skills: ['Woodworking', 'CNC Operation', 'Finishing'],
        certifications: ['Master Carpenter']
      },
      {
        id: 'team-4',
        firstName: 'Emily',
        lastName: 'Brown',
        email: 'emily.brown@formulapm.com',
        role: 'craftsman',
        position: 'Millwork Specialist',
        department: 'Production',
        phone: '+1 (555) 456-7890',
        avatarUrl: 'https://i.pravatar.cc/150?img=4',
        status: 'active',
        joinDate: new Date('2022-09-01'),
        skills: ['Cabinet Making', 'Veneer Application', 'Hardware Installation']
      },
      {
        id: 'team-5',
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert.wilson@formulapm.com',
        role: 'coordinator',
        position: 'Installation Coordinator',
        department: 'Operations',
        phone: '+1 (555) 567-8901',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        status: 'active',
        joinDate: new Date('2023-02-15'),
        skills: ['Scheduling', 'Site Coordination', 'Quality Control']
      }
    ],
    
    clients: [
      {
        id: 'client-1',
        name: 'Apex Business Solutions',
        companyName: 'Apex Business Solutions',
        contactPerson: 'James Thompson',
        email: 'james.thompson@apexbiz.com',
        phone: '+1 (555) 111-2222',
        address: '123 Business Center, Suite 500, Downtown, NY 10001',
        type: 'commercial',
        industry: 'Business Services',
        status: 'active',
        totalProjectValue: 850000,
        notes: 'Long-term client, prefers modern minimalist designs',
        createdAt: new Date('2023-01-15T10:00:00Z')
      },
      {
        id: 'client-2',
        name: 'Wilson Residence',
        companyName: 'Wilson Residence',
        contactPerson: 'Patricia Wilson',
        email: 'p.wilson@email.com',
        phone: '+1 (555) 222-3333',
        address: '456 Oak Street, Westside, CA 90210',
        type: 'residential',
        industry: 'Residential',
        status: 'active',
        totalProjectValue: 125000,
        notes: 'High-end residential client, attention to detail important',
        createdAt: new Date('2023-08-20T09:00:00Z')
      },
      {
        id: 'client-3',
        name: 'HealthFirst Medical Group',
        companyName: 'HealthFirst Medical Group',
        contactPerson: 'Dr. Amanda Lee',
        email: 'alee@healthfirst.com',
        phone: '+1 (555) 333-4444',
        address: '789 Medical Plaza, Health District, NY 10002',
        type: 'commercial',
        industry: 'Healthcare',
        status: 'active',
        totalProjectValue: 450000,
        notes: 'Medical compliance requirements, sterile materials needed',
        createdAt: new Date('2024-01-10T11:00:00Z')
      },
      {
        id: 'client-4',
        name: 'Boutique Fashion Co',
        companyName: 'Boutique Fashion Co',
        contactPerson: 'Lisa Chen',
        email: 'lchen@boutiquefashion.com',
        phone: '+1 (555) 444-5555',
        address: '321 Shopping Plaza, Mall District, CA 90211',
        type: 'retail',
        industry: 'Fashion',
        status: 'active',
        totalProjectValue: 95000,
        notes: 'Completed project, very satisfied, potential repeat client',
        createdAt: new Date('2023-06-15T14:00:00Z')
      },
      {
        id: 'client-5',
        name: 'The Urban Kitchen',
        companyName: 'The Urban Kitchen',
        contactPerson: 'Chef Marco Rossi',
        email: 'marco@urbankitchen.com',
        phone: '+1 (555) 555-6666',
        address: '555 Entertainment Ave, Downtown, NY 10003',
        type: 'hospitality',
        industry: 'Restaurant',
        status: 'active',
        totalProjectValue: 320000,
        notes: 'Restaurant client, needs durable materials for high traffic',
        createdAt: new Date('2024-02-01T08:00:00Z')
      }
    ],
    
    projects: [
      {
        id: 'proj-1',
        name: 'Downtown Office Renovation',
        type: 'commercial',
        status: 'active',
        priority: 'high',
        description: 'Complete renovation of a 10,000 sq ft office space including custom millwork',
        budget: 850000,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
        progress: 65,
        clientId: 'client-1',
        projectManagerId: 'team-1',
        location: 'Downtown Business District',
        createdBy: 'team-1',
        createdAt: new Date('2024-01-01T10:00:00Z'),
        teamMembers: ['team-1', 'team-2', 'team-3']
      },
      {
        id: 'proj-2',
        name: 'Luxury Residential Kitchen',
        type: 'residential',
        status: 'active',
        priority: 'medium',
        description: 'High-end kitchen renovation with custom cabinetry and millwork',
        budget: 125000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-04-15'),
        progress: 40,
        clientId: 'client-2',
        projectManagerId: 'team-1',
        location: 'Westside Residential',
        createdBy: 'team-1',
        createdAt: new Date('2024-01-20T09:00:00Z'),
        teamMembers: ['team-1', 'team-4']
      },
      {
        id: 'proj-3',
        name: 'Medical Office Fit-out',
        type: 'commercial',
        status: 'on_tender',
        priority: 'high',
        description: 'Medical office construction with specialized millwork and compliance requirements',
        budget: 450000,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-08-30'),
        progress: 0,
        clientId: 'client-3',
        projectManagerId: 'team-2',
        location: 'Medical District',
        createdBy: 'team-2',
        createdAt: new Date('2024-03-01T08:00:00Z'),
        teamMembers: ['team-2', 'team-3', 'team-5']
      },
      {
        id: 'proj-4',
        name: 'Retail Store Fixtures',
        type: 'retail',
        status: 'completed',
        priority: 'medium',
        description: 'Custom retail fixtures and display units for boutique store',
        budget: 95000,
        startDate: new Date('2023-11-01'),
        endDate: new Date('2024-01-30'),
        progress: 100,
        clientId: 'client-4',
        projectManagerId: 'team-3',
        location: 'Shopping Mall Plaza',
        createdBy: 'team-3',
        createdAt: new Date('2023-10-15T10:00:00Z'),
        teamMembers: ['team-3', 'team-4']
      },
      {
        id: 'proj-5',
        name: 'Restaurant Interior Renovation',
        type: 'hospitality',
        status: 'active',
        priority: 'urgent',
        description: 'Complete interior renovation including custom bar and seating',
        budget: 320000,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-05-15'),
        progress: 30,
        clientId: 'client-5',
        projectManagerId: 'team-1',
        location: 'Entertainment District',
        createdBy: 'team-1',
        createdAt: new Date('2024-02-15T11:00:00Z'),
        teamMembers: ['team-1', 'team-2', 'team-4']
      }
    ],

    tasks: [
      {
        id: 'task-1',
        projectId: 'proj-1',
        name: 'Complete design drawings',
        title: 'Complete design drawings',
        description: 'Finalize all architectural and millwork drawings',
        status: 'completed',
        priority: 'high',
        assignedTo: 'team-2',
        dueDate: new Date('2024-02-15'),
        createdBy: 'team-1',
        createdAt: new Date('2024-01-15T10:00:00Z'),
        completedAt: new Date('2024-02-14T16:00:00Z')
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
        dueDate: new Date('2024-02-20'),
        createdBy: 'team-1',
        createdAt: new Date('2024-01-20T09:00:00Z'),
        completedAt: new Date('2024-02-18T14:00:00Z')
      },
      {
        id: 'task-3',
        projectId: 'proj-1',
        name: 'Install reception desk',
        title: 'Install reception desk',
        description: 'Custom reception desk installation and finishing',
        status: 'in_progress',
        priority: 'medium',
        assignedTo: 'team-3',
        dueDate: new Date('2024-03-25'),
        createdBy: 'team-1',
        createdAt: new Date('2024-03-01T08:00:00Z')
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
        dueDate: new Date('2024-04-10'),
        createdBy: 'team-1',
        createdAt: new Date('2024-03-10T10:00:00Z')
      },
      {
        id: 'task-5',
        projectId: 'proj-2',
        name: 'Kitchen cabinet measurements',
        title: 'Kitchen cabinet measurements',
        description: 'Final measurements for custom kitchen cabinets',
        status: 'completed',
        priority: 'high',
        assignedTo: 'team-4',
        dueDate: new Date('2024-02-10'),
        createdBy: 'team-1',
        createdAt: new Date('2024-02-01T09:00:00Z'),
        completedAt: new Date('2024-02-09T17:00:00Z')
      },
      {
        id: 'task-6',
        projectId: 'proj-2',
        name: 'Cabinet door fabrication',
        title: 'Cabinet door fabrication',
        description: 'Manufacture custom cabinet doors and drawer fronts',
        status: 'in_progress',
        priority: 'high',
        assignedTo: 'team-4',
        dueDate: new Date('2024-03-20'),
        createdBy: 'team-1',
        createdAt: new Date('2024-02-15T10:00:00Z')
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
        dueDate: new Date('2024-04-01'),
        createdBy: 'team-1',
        createdAt: new Date('2024-03-01T11:00:00Z')
      },
      {
        id: 'task-8',
        projectId: 'proj-5',
        name: 'Demolition of existing fixtures',
        title: 'Demolition of existing fixtures',
        description: 'Remove old bar and seating areas',
        status: 'completed',
        priority: 'urgent',
        assignedTo: 'team-4',
        dueDate: new Date('2024-03-10'),
        createdBy: 'team-1',
        createdAt: new Date('2024-03-01T08:00:00Z'),
        completedAt: new Date('2024-03-09T18:00:00Z')
      },
      {
        id: 'task-9',
        projectId: 'proj-5',
        name: 'Custom bar construction',
        title: 'Custom bar construction',
        description: 'Build and install new custom bar with integrated lighting',
        status: 'in_progress',
        priority: 'urgent',
        assignedTo: 'team-2',
        dueDate: new Date('2024-03-30'),
        createdBy: 'team-1',
        createdAt: new Date('2024-03-10T09:00:00Z')
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
        dueDate: new Date('2024-04-15'),
        createdBy: 'team-1',
        createdAt: new Date('2024-03-15T10:00:00Z')
      }
    ],

    shopDrawings: [
      {
        id: 'sd-1',
        projectId: 'proj-1',
        fileName: 'Reception_Desk_Assembly.pdf',
        drawingType: 'Assembly Drawing',
        room: 'Reception',
        status: 'approved',
        version: 'Rev C',
        uploadDate: new Date('2024-03-10'),
        approvedBy: 'team-1',
        approvedDate: new Date('2024-03-12'),
        fileSize: 2516582, // 2.4 MB in bytes
        createdBy: 'team-2'
      },
      {
        id: 'sd-2',
        projectId: 'proj-2',
        fileName: 'Kitchen_Cabinet_Details.pdf',
        drawingType: 'Detail Drawing',
        room: 'Kitchen',
        status: 'pending',
        version: 'Rev A',
        uploadDate: new Date('2024-03-15'),
        fileSize: 3250585, // 3.1 MB in bytes
        createdBy: 'team-2'
      },
      {
        id: 'sd-3',
        projectId: 'proj-5',
        fileName: 'Bar_Construction_Plans.pdf',
        drawingType: 'Construction Drawing',
        room: 'Bar Area',
        status: 'revision_required',
        version: 'Rev B',
        uploadDate: new Date('2024-03-18'),
        comments: 'Need to adjust height for ADA compliance',
        fileSize: 4404019, // 4.2 MB in bytes
        createdBy: 'team-2'
      }
    ],

    materialSpecs: [
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
        supplier: 'Premium Wood Suppliers',
        leadTime: '2 weeks',
        status: 'ordered',
        createdBy: 'team-3'
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
        supplier: 'Hardware Direct',
        leadTime: '1 week',
        status: 'in_stock',
        createdBy: 'team-4'
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
        supplier: 'Metal Fabricators Inc',
        leadTime: '3 weeks',
        status: 'pending_approval',
        createdBy: 'team-2'
      }
    ]
  };
  
  return demoData;
}

// Migration function
async function migrate() {
  console.log('🚀 Starting Formula PM database migration...');
  
  try {
    // Check if data already exists
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log(`📊 Database already contains ${existingUsers} users - skipping migration`);
      console.log('✅ Migration check completed - database is already populated');
      return;
    }
    
    const demoData = loadDemoData();
    
    // Create ID mappings for proper UUID relationships
    const userIdMap = new Map();
    const clientIdMap = new Map();
    const projectIdMap = new Map();
    const taskIdMap = new Map();
    const shopDrawingIdMap = new Map();
    const materialSpecIdMap = new Map();
    
    // Step 1: Create default admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@formulapm.com',
        passwordHash: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        position: 'System Administrator',
        department: 'IT',
        status: 'active',
        skills: ['System Administration', 'Database Management'],
        certifications: ['Database Administrator'],
        emailVerified: true
      }
    });
    
    console.log(`✅ Admin user created: ${adminUser.email}`);
    
    // Step 2: Migrate users
    console.log('👥 Migrating users...');
    
    for (const userData of demoData.users) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      const newUserId = uuidv4();
      
      const user = await prisma.user.create({
        data: {
          id: newUserId,
          email: userData.email,
          passwordHash: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          position: userData.position,
          department: userData.department,
          phone: userData.phone,
          avatarUrl: userData.avatarUrl,
          status: userData.status,
          joinDate: userData.joinDate,
          skills: userData.skills,
          certifications: userData.certifications,
          emailVerified: true
        }
      });
      
      userIdMap.set(userData.id, user.id);
      console.log(`✅ User migrated: ${user.email}`);
    }
    
    // Step 3: Migrate clients
    console.log('🏢 Migrating clients...');
    
    for (const clientData of demoData.clients) {
      const newClientId = uuidv4();
      
      const client = await prisma.client.create({
        data: {
          id: newClientId,
          name: clientData.name,
          companyName: clientData.companyName,
          contactPerson: clientData.contactPerson,
          email: clientData.email,
          phone: clientData.phone,
          address: clientData.address,
          type: clientData.type,
          industry: clientData.industry,
          status: clientData.status,
          totalProjectValue: clientData.totalProjectValue,
          notes: clientData.notes,
          createdAt: clientData.createdAt
        }
      });
      
      clientIdMap.set(clientData.id, client.id);
      console.log(`✅ Client migrated: ${client.name}`);
    }
    
    // Step 4: Migrate projects
    console.log('📁 Migrating projects...');
    
    for (const projectData of demoData.projects) {
      const newProjectId = uuidv4();
      
      const project = await prisma.project.create({
        data: {
          id: newProjectId,
          name: projectData.name,
          description: projectData.description,
          type: projectData.type,
          status: projectData.status,
          priority: projectData.priority,
          budget: projectData.budget,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          progress: projectData.progress,
          location: projectData.location,
          clientId: clientIdMap.get(projectData.clientId),
          projectManagerId: userIdMap.get(projectData.projectManagerId),
          createdBy: userIdMap.get(projectData.createdBy),
          createdAt: projectData.createdAt
        }
      });
      
      projectIdMap.set(projectData.id, project.id);
      console.log(`✅ Project migrated: ${project.name}`);
      
      // Create project team members
      for (const teamMemberId of projectData.teamMembers) {
        await prisma.projectTeamMember.create({
          data: {
            projectId: project.id,
            userId: userIdMap.get(teamMemberId),
            role: 'team_member'
          }
        });
      }
    }
    
    // Step 5: Migrate tasks
    console.log('📋 Migrating tasks...');
    
    for (const taskData of demoData.tasks) {
      const newTaskId = uuidv4();
      
      const task = await prisma.task.create({
        data: {
          id: newTaskId,
          projectId: projectIdMap.get(taskData.projectId),
          name: taskData.name,
          title: taskData.title,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          assignedTo: userIdMap.get(taskData.assignedTo),
          dueDate: taskData.dueDate,
          createdBy: userIdMap.get(taskData.createdBy),
          completedAt: taskData.completedAt,
          createdAt: taskData.createdAt
        }
      });
      
      taskIdMap.set(taskData.id, task.id);
      console.log(`✅ Task migrated: ${task.name}`);
    }
    
    // Step 6: Migrate shop drawings
    console.log('📐 Migrating shop drawings...');
    
    for (const drawingData of demoData.shopDrawings) {
      const newDrawingId = uuidv4();
      
      const drawing = await prisma.shopDrawing.create({
        data: {
          id: newDrawingId,
          projectId: projectIdMap.get(drawingData.projectId),
          fileName: drawingData.fileName,
          drawingType: drawingData.drawingType,
          room: drawingData.room,
          status: drawingData.status,
          version: drawingData.version,
          uploadDate: drawingData.uploadDate,
          approvedBy: drawingData.approvedBy ? userIdMap.get(drawingData.approvedBy) : null,
          approvedDate: drawingData.approvedDate,
          fileSize: drawingData.fileSize,
          comments: drawingData.comments,
          createdBy: userIdMap.get(drawingData.createdBy)
        }
      });
      
      shopDrawingIdMap.set(drawingData.id, drawing.id);
      console.log(`✅ Shop drawing migrated: ${drawing.fileName}`);
    }
    
    // Step 7: Migrate material specifications
    console.log('🔩 Migrating material specifications...');
    
    for (const specData of demoData.materialSpecs) {
      const newSpecId = uuidv4();
      
      const spec = await prisma.materialSpecification.create({
        data: {
          id: newSpecId,
          projectId: projectIdMap.get(specData.projectId),
          itemId: specData.itemId,
          description: specData.description,
          category: specData.category,
          material: specData.material,
          finish: specData.finish,
          quantity: specData.quantity,
          unit: specData.unit,
          unitCost: specData.unitCost,
          supplier: specData.supplier,
          leadTime: specData.leadTime,
          status: specData.status,
          createdBy: userIdMap.get(specData.createdBy)
        }
      });
      
      materialSpecIdMap.set(specData.id, spec.id);
      console.log(`✅ Material specification migrated: ${spec.description}`);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('📊 Migration Summary:');
    console.log(`   - Users: ${demoData.users.length + 1} (including admin)`);
    console.log(`   - Clients: ${demoData.clients.length}`);
    console.log(`   - Projects: ${demoData.projects.length}`);
    console.log(`   - Tasks: ${demoData.tasks.length}`);
    console.log(`   - Shop Drawings: ${demoData.shopDrawings.length}`);
    console.log(`   - Material Specifications: ${demoData.materialSpecs.length}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrate()
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { migrate };