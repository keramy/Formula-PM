# 🗄️ Database Explorer Guide - Understanding Your Data

**Welcome to the database exploration guide!** This will help you understand how Formula PM stores and organizes all the project data behind the scenes.

## 🤔 **What is a Database?**

Think of a database like a **digital filing cabinet** with multiple drawers (called "tables"). Each drawer contains specific types of information organized in rows and columns, like a spreadsheet.

**In Formula PM, we have these "drawers" (tables)**:
- **Users**: People who can log in and use the system
- **Projects**: Construction/renovation projects
- **Tasks**: Individual jobs within projects
- **Clients**: Customers who hire you for projects
- **Scope Items**: Detailed deliverables within projects
- **Shop Drawings**: Technical drawings and documents
- **Material Specifications**: Materials needed for projects
- And more...

## 🔍 **How to Access the Database Browser**

### **Method 1: Prisma Studio (Recommended)**
1. **Make sure Formula PM is running** (use `./start-full-backend.sh`)
2. **Open your web browser**
3. **Go to**: `http://localhost:5555`
4. **You'll see**: A clean interface with tables listed on the left

### **Method 2: Through Terminal** (Advanced)
```bash
cd /mnt/c/Users/Kerem/Desktop/formula-pm/formula-project-app/backend
npx prisma studio
```

## 📊 **Understanding the Prisma Studio Interface**

When you open `http://localhost:5555`, here's what you'll see:

### **Left Sidebar - Tables List**
```
📁 Users (5 records)
📁 Clients (5 records)  
📁 Projects (5 records)
📁 Tasks (10 records)
📁 Scope_groups (8 records)
📁 Scope_items (15 records)
📁 Shop_drawings (3 records)
📁 Material_specifications (3 records)
📁 Workflow_connections (12 records)
📁 Notifications (0 records)
📁 Audit_logs (50+ records)
```

### **Main Area - Data View**
- **Rows**: Each row is one record (like one project or one task)
- **Columns**: Properties of that record (name, date, status, etc.)
- **Actions**: Add, Edit, Delete buttons (be careful with these!)

## 📋 **Exploring Each Table**

### **👤 Users Table**
**What it contains**: People who can log into Formula PM

**Click on "Users" to see**:
- `id`: Unique identifier for each person
- `email`: Their login email
- `firstName` & `lastName`: Their name
- `role`: Their job role (Admin, Project Manager, Designer, etc.)
- `department`: Which team they're on
- `createdAt`: When they were added to the system

**Example Record**:
```
ID: team-1
Email: sarah.johnson@formulapm.com
Name: Sarah Johnson
Role: project_manager
Department: Project Management
```

### **🏢 Clients Table**
**What it contains**: Companies or people who hire you for projects

**Click on "Clients" to see**:
- `id`: Unique client identifier
- `name`: Company name
- `contactPerson`: Main person you talk to
- `email` & `phone`: Contact information
- `industry`: What type of business they're in
- `status`: Active, inactive, etc.

**Example Record**:
```
ID: client-1
Name: Apex Business Solutions
Contact: James Thompson
Email: james.thompson@apexbiz.com
Industry: Business Services
```

### **🏗️ Projects Table**
**What it contains**: Construction/renovation projects

**Click on "Projects" to see**:
- `id`: Unique project identifier
- `name`: Project title
- `description`: What the project is about
- `clientId`: Which client this project is for (links to Clients table)
- `status`: Planning, Active, Completed, etc.
- `budget`: How much money is allocated
- `startDate` & `endDate`: Project timeline
- `createdBy`: Who created this project

**Example Record**:
```
ID: proj-1
Name: Downtown Office Renovation
Client ID: client-1 (links to Apex Business Solutions)
Status: active
Budget: 850000
Start: 2024-01-15
End: 2024-12-31
```

### **✅ Tasks Table**
**What it contains**: Individual jobs within projects

**Click on "Tasks" to see**:
- `id`: Unique task identifier
- `projectId`: Which project this task belongs to
- `title`: What needs to be done
- `description`: Detailed instructions
- `assignedTo`: Which team member is responsible
- `status`: pending, in-progress, completed
- `priority`: urgent, high, medium, low
- `dueDate`: When it should be finished

**Example Record**:
```
ID: task-1
Project ID: proj-1 (Downtown Office Renovation)
Title: Complete design drawings
Assigned To: team-2 (Michael Chen)
Status: completed
Priority: high
Due: 2024-02-15
```

### **📦 Scope_groups & Scope_items Tables**
**What they contain**: Organized breakdown of project deliverables

**Scope Groups** are categories like:
- Kitchen Renovation
- Bathroom Renovation  
- Living Room Updates

**Scope Items** are specific deliverables like:
- Install kitchen cabinets
- Replace bathroom tiles
- Paint living room walls

### **📐 Shop_drawings Table**
**What it contains**: Technical drawings and blueprints

**Click on "Shop_drawings" to see**:
- `id`: Drawing identifier
- `projectId`: Which project this drawing belongs to
- `name`: Drawing title
- `filePath`: Where the file is stored
- `status`: draft, pending, approved, rejected
- `version`: Version number

### **🔩 Material_specifications Table**
**What it contains**: Materials, costs, and supplier information

**Click on "Material_specifications" to see**:
- `id`: Specification identifier
- `projectId`: Which project needs this material
- `description`: What the material is
- `quantity`: How much is needed
- `unitCost`: Price per unit
- `supplier`: Where to buy it
- `leadTime`: How long to get it

## 🔗 **Understanding Relationships**

**Think of relationships like connections between tables:**

### **One-to-Many Relationships**:
- **One Client** can have **Many Projects**
- **One Project** can have **Many Tasks**
- **One User** can be assigned to **Many Tasks**

### **How to See Connections**:
1. **In Projects table**: Look at the `clientId` column
2. **Find the client**: Go to Clients table and find that ID
3. **See the connection**: That's which client owns the project

### **Example Tracing**:
```
1. Task "Install kitchen cabinets" (task-3)
2. Has projectId: proj-2
3. Go to Projects table, find proj-2 = "Luxury Residential Kitchen"
4. That project has clientId: client-2
5. Go to Clients table, find client-2 = "Wilson Residence"
6. So: Wilson Residence → Luxury Kitchen Project → Install Cabinets Task
```

## 🛠️ **Safe Exploration Tips**

### **✅ What's Safe to Do**:
- **Browse and Read**: Click on any table and look at data
- **Search**: Use the search box to find specific records
- **Filter**: Use column filters to narrow down data
- **Sort**: Click column headers to sort data

### **⚠️ What to Be Careful With**:
- **Edit Button**: Only use if you know what you're doing
- **Delete Button**: Can permanently remove data
- **Add Record**: Creates new data in the system

### **🚫 What NOT to Do**:
- Don't delete system users (you might lose access)
- Don't delete projects with active tasks
- Don't change IDs (this breaks relationships)
- Don't modify audit logs (they're for tracking changes)

## 📊 **Understanding Data Types**

### **Common Field Types You'll See**:
- **String**: Text like names, descriptions
- **Integer**: Numbers like quantities, counts
- **Decimal**: Money amounts like $850,000.00
- **DateTime**: Dates and times like "2024-01-15T10:00:00Z"
- **Boolean**: True/false values like active/inactive
- **UUID**: Unique identifiers like "proj-1", "team-2"

### **Status Fields**:
Many tables have status fields with specific values:

**Project Status**:
- `planning`: Still being planned
- `active`: Currently working on it
- `on-hold`: Temporarily stopped
- `completed`: Finished
- `cancelled`: No longer happening

**Task Status**:
- `pending`: Not started yet
- `in-progress`: Currently working on it
- `completed`: Finished
- `blocked`: Can't proceed due to dependencies

## 🔍 **Advanced Exploration**

### **Finding Related Data**:
1. **Start with a Project**: Click on any project
2. **Note the ID**: Remember the project ID (like proj-1)
3. **Go to Tasks**: Look for tasks with that projectId
4. **Go to Scope Items**: Look for scope items with that projectId
5. **See the Full Picture**: How everything connects

### **Tracking Changes**:
1. **Go to Audit_logs table**
2. **See every change** made to the system
3. **Filter by table_name** to see changes to specific types
4. **Look at old_values and new_values** to see what changed

### **Understanding Workflow**:
1. **Check Workflow_connections table**
2. **See how** scope items connect to drawings and materials
3. **Track dependencies** between different project components

## 📈 **Data Analysis Tips**

### **Questions You Can Answer**:
- **How many active projects do we have?** (Count projects with status='active')
- **Which team member has the most tasks?** (Count tasks by assignedTo)
- **What's our total project value?** (Sum all project budgets)
- **Which projects are overdue?** (Compare endDate to today)

### **Using Filters**:
1. **Click any column header** in Prisma Studio
2. **Choose filter type**: equals, contains, greater than, etc.
3. **Enter filter value**: The criteria you want
4. **See filtered results**: Only matching records

### **Example Filters**:
- **Projects**: Filter status = "active" to see only active projects
- **Tasks**: Filter assignedTo = "team-1" to see Sarah's tasks
- **Clients**: Filter industry = "Healthcare" to see medical clients

## 🎯 **Practical Exercises**

### **Exercise 1: Project Overview**
1. Open Projects table
2. Find "Downtown Office Renovation"
3. Note its ID and client ID
4. Go to Tasks table
5. Filter by that project ID
6. Count how many tasks it has

### **Exercise 2: Team Workload**
1. Open Tasks table
2. Filter by assignedTo = "team-2" (Michael Chen)
3. Count his tasks
4. Check their status and due dates
5. See if he's overloaded

### **Exercise 3: Client Analysis**
1. Open Clients table
2. Find "Apex Business Solutions"
3. Note their ID
4. Go to Projects table
5. Filter by that client ID
6. See all their projects and total value

### **Exercise 4: Material Costs**
1. Open Material_specifications table
2. Look at unitCost and quantity columns
3. Calculate total cost for each item
4. Find the most expensive materials

## 🛡️ **Backup and Safety**

### **Before Making Changes**:
- **Understand the impact**: Will this affect other data?
- **Start small**: Test with one record first
- **Have a backup plan**: Know how to undo changes

### **If Something Goes Wrong**:
1. **Stop the system**: Use `./stop-full-backend.sh`
2. **Restart fresh**: Use `./start-full-backend.sh`
3. **Check audit logs**: See what changed recently
4. **Restore from backup**: If you have database backups

## 📚 **Next Steps**

### **Once You're Comfortable**:
1. **Try small edits**: Change a task description
2. **Add test data**: Create a test project
3. **Learn SQL**: For more advanced queries
4. **Explore API**: See how the frontend gets this data

### **Advanced Topics**:
- **Database Migrations**: How schema changes are applied
- **Indexing**: How the database finds data quickly
- **Relationships**: Foreign keys and joins
- **Performance**: Query optimization and caching

---

**🎉 Congratulations!** You now understand how Formula PM stores and organizes data. The database is the foundation that makes everything work - from the user interface to reports to real-time updates.

**Remember**: Take your time exploring, and don't be afraid to look around. Understanding the data structure will help you use Formula PM more effectively and troubleshoot any issues that might arise.