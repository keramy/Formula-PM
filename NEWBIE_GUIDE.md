# 🔰 Formula PM - Complete Newbie Guide

**Welcome to Formula PM!** This guide will help you understand and use the Formula PM project management system, even if you're completely new to project management software or web applications.

## 📋 **What is Formula PM?**

Formula PM is a **project management system** specifically designed for construction and millwork projects. Think of it as a digital workspace where you can:

- **Manage Projects**: Keep track of construction/renovation projects
- **Assign Tasks**: Give specific jobs to team members
- **Track Progress**: See how much work is done
- **Store Documents**: Keep all project files in one place
- **Communicate**: Team members can collaborate in real-time
- **Generate Reports**: Create professional project reports

## 🚀 **Getting Started (Step by Step)**

### Step 1: Open Ubuntu Terminal
1. Press `Windows key + R`
2. Type `ubuntu` and press Enter
3. A black terminal window will open

### Step 2: Start Formula PM
1. In the terminal, copy and paste this command:
   ```bash
   cd /mnt/c/Users/Kerem/Desktop/formula-pm
   ```
2. Press Enter
3. Then run:
   ```bash
   chmod +x start-full-backend.sh
   ./start-full-backend.sh
   ```
4. **Wait patiently** - it will take 2-5 minutes to start everything
5. You'll see colorful text showing the progress
6. When it says "Formula PM is now running", you're ready!

### Step 3: Open Your Browser
The script will automatically open your browser to `http://localhost:3003`

If it doesn't open automatically:
1. Open any web browser (Chrome, Firefox, Edge)
2. Type in the address bar: `http://localhost:3003`
3. Press Enter

## 🌐 **What You'll See - Main Interface**

### **The Dashboard (Home Page)**
When you first open Formula PM, you'll see:

1. **Header Bar** (top):
   - Formula PM logo on the left
   - Search box in the middle
   - Notifications bell on the right
   - Your user profile picture

2. **Sidebar** (left):
   - Dashboard (overview)
   - Projects (list of all projects)
   - Tasks (things to do)
   - Team (people working)
   - Clients (customers)
   - Reports (documents)

3. **Main Content** (center):
   - Charts showing project progress
   - Recent activities
   - Quick statistics

## 📊 **Understanding the Different Sections**

### **1. Dashboard Tab**
**What it shows**: Overview of everything
- Project statistics (how many projects, completed, in progress)
- Recent activities (what happened recently)
- Performance charts

**How to use it**: This is your "home base" - check here to see the big picture

### **2. Projects Tab**
**What it shows**: All your construction/renovation projects
- Project names (e.g., "Downtown Office Renovation")
- Project status (Planning, Active, Completed)
- Budget information
- Team members assigned

**How to use it**:
- Click on any project name to see details
- Use the "Add Project" button to create new projects
- Filter projects by status or client

### **3. Tasks Tab**
**What it shows**: Specific jobs that need to be done
- Task descriptions (e.g., "Install kitchen cabinets")
- Who's responsible (assigned person)
- Due dates
- Priority levels (High, Medium, Low)

**How to use it**:
- Click "Add Task" to create new tasks
- Click on any task to see details or mark it complete
- Use filters to see only your tasks or overdue tasks

### **4. Team Tab**
**What it shows**: People working on projects
- Team member names and photos
- Their roles (Project Manager, Designer, etc.)
- Contact information
- Which projects they're working on

**How to use it**:
- Click on any person to see their details
- Add new team members with "Add Team Member"
- See workload distribution

### **5. Clients Tab**
**What it shows**: Your customers/clients
- Client company names
- Contact information
- Which projects they have
- Total project values

**How to use it**:
- Add new clients for new projects
- Keep contact information updated
- Track project history per client

### **6. Reports Tab**
**What it shows**: Professional documents and analytics
- Project progress reports
- Financial summaries
- Timeline reports
- PDF documents you can download

**How to use it**:
- Generate reports for clients or management
- Export data to PDF or Excel
- Schedule automatic reports

## 🔍 **Exploring the Database (Behind the Scenes)**

### **What is a Database?**
A database is like a digital filing cabinet where all your information is stored in an organized way. Formula PM stores all project data, tasks, team members, etc. in a database.

### **How to See Your Data**
1. **Option 1 - Database Browser** (Easy Way):
   - Open: `http://localhost:5555` in your browser
   - This opens "Prisma Studio" - a visual database browser
   - You'll see tables like "Projects", "Tasks", "Users", etc.
   - Click on any table to see the data inside

2. **Option 2 - Through the App** (Normal Way):
   - Use the regular Formula PM interface
   - The data you see comes from the database

### **Understanding Database Tables**
Think of tables like spreadsheets:

- **Users Table**: List of all people (team members)
- **Projects Table**: List of all projects
- **Tasks Table**: List of all tasks
- **Clients Table**: List of all clients
- **Scope_items Table**: Detailed project deliverables
- **Shop_drawings Table**: Technical drawings and documents

## 🎮 **Testing Different Features**

### **Try These Things** (Safe to explore):

1. **Create a Test Project**:
   - Go to Projects tab
   - Click "Add Project"
   - Fill in: Name = "Test Project", Client = any client
   - Click Save
   - Check if it appears in the list

2. **Add a Task**:
   - Go to Tasks tab
   - Click "Add Task"
   - Fill in: Title = "Test Task", Assign to someone
   - Set a due date
   - Click Save

3. **Search Function**:
   - Use the search box in the header
   - Type any project name or task
   - See the results appear instantly

4. **Real-time Features**:
   - Open Formula PM in two browser tabs
   - Make a change in one tab (add a task)
   - Watch it appear in the other tab automatically

5. **Generate a Report**:
   - Go to Reports tab
   - Click "Generate Report"
   - Select a project
   - Download the PDF

## 🗄️ **Database Exploration Guide**

### **Viewing Your Data Safely**
1. Open: `http://localhost:5555`
2. You'll see a list of tables on the left
3. Click any table to see its contents
4. This is **read-only** - you can look but not break anything

### **Understanding Relationships**
- **Projects** are connected to **Clients** (each project has one client)
- **Tasks** are connected to **Projects** (tasks belong to projects)
- **Tasks** are connected to **Users** (tasks are assigned to people)
- **Scope Items** are connected to **Projects** (project deliverables)

### **Sample Data to Look For**
The system comes with demo data:
- 5 demo projects (office renovations, kitchens, etc.)
- 10 sample tasks
- 5 team members
- 5 clients
- Various project documents

## ⚠️ **Important Things to Know**

### **What's Safe to Do**:
- ✅ Click around and explore
- ✅ Add test projects, tasks, clients
- ✅ Generate reports
- ✅ Use search functions
- ✅ View database in Prisma Studio

### **What to Be Careful With**:
- ⚠️ Don't delete important data in the database browser
- ⚠️ Don't change system settings unless you know what you're doing
- ⚠️ Don't close the terminal window while the system is running

### **If Something Goes Wrong**:
1. **App won't load**: Check if services are running with `./check-status.sh`
2. **Errors in browser**: Press F12 to see developer console, check for red errors
3. **System slow**: This is normal when starting up, wait a few minutes
4. **Can't access database**: Make sure PostgreSQL is running

## 🛠️ **Managing the System**

### **Checking Status**:
```bash
./check-status.sh
```
This shows you what's running and what's not.

### **Stopping Everything**:
```bash
./stop-full-backend.sh
```
Use this when you're done testing.

### **Starting Again**:
```bash
./start-full-backend.sh
```
Run this anytime to start the system.

### **Viewing Logs** (if something's wrong):
```bash
tail -f formula-project-app/backend/backend.log
```
This shows what the backend is doing.

## 🎯 **Common Scenarios**

### **Scenario 1: "I want to see a project workflow"**
1. Go to Projects tab
2. Click on "Downtown Office Renovation"
3. Look at the tasks assigned to this project
4. Check the team members working on it
5. See the project timeline and budget

### **Scenario 2: "I want to understand the data structure"**
1. Open `http://localhost:5555`
2. Click on "projects" table
3. See how each project has an ID, name, client_id, etc.
4. Click on "tasks" table
5. Notice how tasks have a "project_id" linking them to projects

### **Scenario 3: "I want to test real-time features"**
1. Open Formula PM in two browser windows
2. In one window, go to Tasks and add a new task
3. In the other window, watch the task appear automatically
4. This shows the real-time collaboration feature

## 📚 **Next Steps**

### **Once You're Comfortable**:
1. Read `DATABASE_EXPLORER_GUIDE.md` for deeper database understanding
2. Try creating more complex projects with multiple tasks
3. Experiment with different user roles
4. Generate reports and see what data is included
5. Explore the API endpoints at `http://localhost:5014/api/v1`

### **For Further Learning**:
- The system is built with React (frontend) and Node.js (backend)
- Database is PostgreSQL with Prisma as the ORM
- Real-time features use Socket.IO
- You can modify the code in the `src/` directory

## 🆘 **Getting Help**

### **Common Issues & Solutions**:

**"Page won't load"**:
- Check if you're using the right URL: `http://localhost:3003`
- Run `./check-status.sh` to see what's running
- Wait a few minutes after starting - it takes time

**"No data showing"**:
- The system starts in backend mode - you should see real data
- If you see "no projects", the database might not be seeded
- Check `http://localhost:5555` to see if database has data

**"Terminal shows errors"**:
- Red text is normal during installation
- Green checkmarks mean things are working
- If it stops with an error, read the message carefully

**"System is slow"**:
- This is normal when starting up
- Give it 5-10 minutes to fully load
- Your computer might need more RAM for all services

### **Understanding the Technology** (Optional):
- **Frontend**: What you see in the browser (React)
- **Backend**: The server handling data (Node.js + Express)
- **Database**: Where data is stored (PostgreSQL)
- **Cache**: Faster temporary storage (Redis)
- **Real-time**: Live updates (Socket.IO)

---

**🎉 Congratulations!** You now have a complete understanding of how to use Formula PM. Take your time exploring, and don't be afraid to click around - the system is designed to be user-friendly and safe to explore.

**Remember**: The goal is to understand how modern project management systems work and see how data flows between different parts of the application.