/**
 * Formula PM Database Seeding Script
 * Seeds the database with initial data for development and testing
 */

const { PrismaClient } = require('@prisma/client');
const { migrate } = require('../migrations/001_init_migration');

const prisma = new PrismaClient();

async function validateDatabase() {
  console.log('🔍 Validating database connection...');
  
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);
    
    return true;
  } catch (error) {
    console.error('❌ Database validation failed:', error);
    return false;
  }
}

async function checkExistingData() {
  console.log('🔍 Checking for existing data...');
  
  const counts = {
    users: await prisma.user.count(),
    clients: await prisma.client.count(),
    projects: await prisma.project.count(),
    tasks: await prisma.task.count(),
    shopDrawings: await prisma.shopDrawing.count(),
    materialSpecs: await prisma.materialSpecification.count()
  };
  
  console.log('📊 Current database state:');
  Object.entries(counts).forEach(([table, count]) => {
    console.log(`   - ${table}: ${count} records`);
  });
  
  return counts;
}

async function seedAdditionalData() {
  console.log('🌱 Seeding additional development data...');
  
  try {
    // Create additional scope groups for existing projects
    const projects = await prisma.project.findMany();
    
    for (const project of projects) {
      // Create scope groups for each project
      const scopeGroups = [
        {
          name: 'Design Phase',
          description: 'Initial design and planning activities',
          orderIndex: 1
        },
        {
          name: 'Fabrication',
          description: 'Manufacturing and fabrication work',
          orderIndex: 2
        },
        {
          name: 'Installation',
          description: 'On-site installation and finishing',
          orderIndex: 3
        }
      ];
      
      for (const groupData of scopeGroups) {
        const scopeGroup = await prisma.scopeGroup.create({
          data: {
            ...groupData,
            projectId: project.id
          }
        });
        
        // Create sample scope items for each group
        const scopeItems = [
          {
            name: `${groupData.name} - Planning`,
            description: `Planning activities for ${groupData.name.toLowerCase()}`,
            status: 'completed',
            completionPercentage: 100,
            orderIndex: 1
          },
          {
            name: `${groupData.name} - Execution`,
            description: `Main execution activities for ${groupData.name.toLowerCase()}`,
            status: 'in_progress',
            completionPercentage: 60,
            orderIndex: 2
          },
          {
            name: `${groupData.name} - Quality Control`,
            description: `Quality control and verification for ${groupData.name.toLowerCase()}`,
            status: 'pending',
            completionPercentage: 0,
            orderIndex: 3
          }
        ];
        
        for (const itemData of scopeItems) {
          await prisma.scopeItem.create({
            data: {
              ...itemData,
              scopeGroupId: scopeGroup.id,
              projectId: project.id
            }
          });
        }
      }
      
      console.log(`✅ Scope groups created for project: ${project.name}`);
    }
    
    // Create sample notifications
    const users = await prisma.user.findMany();
    const notificationTypes = ['task_assigned', 'project_update', 'deadline_reminder', 'system_alert'];
    
    for (const user of users.slice(0, 3)) { // Create notifications for first 3 users
      for (let i = 0; i < 3; i++) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: notificationTypes[i],
            title: `Sample Notification ${i + 1}`,
            message: `This is a sample notification for ${user.firstName} ${user.lastName}`,
            readStatus: i === 0, // First notification is read
            data: {
              additionalInfo: `Notification data for ${user.firstName}`,
              priority: i === 2 ? 'high' : 'medium'
            }
          }
        });
      }
    }
    
    console.log('✅ Sample notifications created');
    
    // Create initial audit log entries
    await prisma.auditLog.create({
      data: {
        tableName: 'projects',
        recordId: projects[0].id,
        action: 'create',
        newValues: {
          name: projects[0].name,
          status: projects[0].status
        },
        changedFields: ['name', 'status'],
        userId: projects[0].createdBy,
        userEmail: 'system@formulapm.com',
        ipAddress: '127.0.0.1',
        userAgent: 'Formula PM Seeder'
      }
    });
    
    console.log('✅ Initial audit log entries created');
    
  } catch (error) {
    console.error('❌ Additional seeding failed:', error);
    throw error;
  }
}

async function createTestData() {
  console.log('🧪 Creating test data...');
  
  try {
    // Create a test client for development
    const testClient = await prisma.client.create({
      data: {
        name: 'Test Development Client',
        companyName: 'Dev Testing Co.',
        contactPerson: 'John Developer',
        email: 'dev@test.com',
        phone: '+1 (555) 999-0000',
        address: '123 Test Street, Dev City, TX 12345',
        type: 'commercial',
        industry: 'Software Development',
        status: 'active',
        totalProjectValue: 50000,
        notes: 'Test client for development purposes'
      }
    });
    
    // Create a test project
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });
    
    const testProject = await prisma.project.create({
      data: {
        name: 'Development Test Project',
        description: 'A test project for development and testing purposes',
        type: 'commercial',
        status: 'active',
        priority: 'low',
        budget: 25000,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        progress: 25,
        location: 'Development Environment',
        clientId: testClient.id,
        projectManagerId: adminUser.id,
        createdBy: adminUser.id
      }
    });
    
    // Create test tasks
    const testTasks = [
      {
        name: 'Setup Development Environment',
        description: 'Configure local development environment',
        status: 'completed',
        priority: 'high',
        progress: 100
      },
      {
        name: 'Database Migration Testing',
        description: 'Test database migration and seeding',
        status: 'in_progress',
        priority: 'high',
        progress: 75
      },
      {
        name: 'API Endpoint Testing',
        description: 'Test all API endpoints for functionality',
        status: 'pending',
        priority: 'medium',
        progress: 0
      }
    ];
    
    for (const taskData of testTasks) {
      await prisma.task.create({
        data: {
          ...taskData,
          projectId: testProject.id,
          assignedTo: adminUser.id,
          createdBy: adminUser.id,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }
      });
    }
    
    console.log('✅ Test data created successfully');
    
  } catch (error) {
    console.error('❌ Test data creation failed:', error);
    throw error;
  }
}

async function seed() {
  console.log('🌱 Starting Formula PM database seeding...');
  
  try {
    // Validate database connection
    const isValid = await validateDatabase();
    if (!isValid) {
      throw new Error('Database validation failed');
    }
    
    // Check existing data
    const currentCounts = await checkExistingData();
    
    // If database is empty, run initial migration
    if (currentCounts.users === 0) {
      console.log('🚀 Database is empty, running initial migration...');
      await migrate();
    } else {
      console.log('📚 Database already contains data, skipping initial migration');
    }
    
    // Seed additional development data
    await seedAdditionalData();
    
    // Create test data
    await createTestData();
    
    // Final validation
    const finalCounts = await checkExistingData();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Final database state:');
    Object.entries(finalCounts).forEach(([table, count]) => {
      console.log(`   - ${table}: ${count} records`);
    });
    
    // Create a summary report
    const summary = {
      seedingCompleted: true,
      timestamp: new Date().toISOString(),
      finalCounts,
      recommendations: [
        'Database is ready for development',
        'Use admin@formulapm.com / admin123 for admin access',
        'Regular users have password: password123',
        'Redis caching should be configured next'
      ]
    };
    
    console.log('📋 Seeding Summary:', JSON.stringify(summary, null, 2));
    
    return summary;
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seed()
    .then((summary) => {
      console.log('✅ Seeding completed:', summary.recommendations.join(', '));
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seed, validateDatabase, checkExistingData };