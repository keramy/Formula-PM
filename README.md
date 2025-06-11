# Formula Project Management System

A comprehensive project management application built with React and Node.js, featuring team management, project tracking, task assignment, and client database management.

## 🚀 Quick Start

### Option 1: Using Startup Scripts (Recommended)
```bash
# Start both servers
./start-servers.sh

# Stop both servers
./stop-servers.sh
```

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend Server
cd formula-backend
npm start

# Terminal 2 - Frontend Server  
cd formula-project-app
npm start
```

## 📱 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **API Health Check**: http://localhost:5001/api/health

## 🏗️ System Architecture

### Backend (Port 5001)
- **Framework**: Node.js with Express
- **Database**: File-based JSON storage with custom SimpleDB
- **API**: RESTful endpoints for all CRUD operations
- **Email**: Nodemailer integration for notifications

### Frontend (Port 3000)
- **Framework**: React 19 with Material-UI
- **State Management**: React Context API + local state
- **Styling**: Modular theme system with CSS-in-JS
- **Charts**: Recharts for analytics and Gantt charts

## 🎯 Features

### 📊 Dashboard
- Project statistics and KPIs
- Team workload overview
- Recent activity feed
- Visual analytics with charts

### 📁 Project Management ⭐ **Enhanced**
- Create and manage projects with client selection
- Advanced table view with sorting and context menus
- Comprehensive filtering system (status, type, client, manager, dates, budget)
- Quick filter presets for common searches
- Real-time search across project names and descriptions
- Professional Excel export with multiple sheets
- **Project Scope Management** 🆕 - Detailed scope items with categories and budget tracking
- **Scope Item Categories** - 12 predefined categories from General Construction to Technology
- **Budget Calculations** - Automatic total calculations with category breakdowns
- **Professional Scope Interface** - Full-screen scope management with summary analytics
- Project timeline tracking
- Budget and resource management
- Dual view modes: Table and Card layouts

### ✅ Task Management
- Task creation and assignment
- Progress tracking
- Priority management
- Due date monitoring
- Gantt chart visualization

### 👥 Team Management
- Team member profiles
- Role and permission management
- Workload distribution
- Contact information

### 🏢 Client Database ⭐ **NEW**
- **Company Information**: Name, industry, size, website
- **Contact Details**: Primary contact, email, phone
- **Address Management**: Full address with city/country
- **Service Tracking**: Multi-select services required
- **Status Management**: Active, inactive, potential clients
- **Notes**: Additional client information
- **Search & Filter**: Easy client lookup
- **Project Integration**: Select clients during project creation
- **Professional Card Layout**: Clean display with contact information

### 📈 Analytics
- Project progress visualization
- Team performance metrics
- Time tracking and reporting
- Gantt chart timeline view

## 🗂️ Navigation Structure

1. **Dashboard** - Overview and analytics
2. **Projects** - Enhanced project management with filtering and export 🆕
3. **My Projects** - Personal project view
4. **Tasks** - Task management and tracking
5. **Team** - Team member management
6. **Clients** - Client database management 🆕
7. **Procurement** - Procurement workflows
8. **Timeline & Gantt** - Project visualization

## 🔧 API Endpoints

### Clients API
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Scope Items API 🆕
- `GET /api/projects/:projectId/scope` - List project scope items
- `POST /api/projects/:projectId/scope` - Create new scope item
- `PUT /api/scope/:id` - Update scope item
- `DELETE /api/scope/:id` - Delete scope item

### Other APIs
- `/api/team-members` - Team management
- `/api/projects` - Project operations with scope integration
- `/api/tasks` - Task management
- `/api/send-notification` - Email notifications

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Install backend dependencies
cd formula-backend
npm install

# Install frontend dependencies
cd ../formula-project-app
npm install
```

### Environment Variables
Create `.env` file in `formula-backend/`:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5001
```

## 🎨 Customization

### Colors and Branding
Edit `formula-project-app/src/theme/colors.js`:
```javascript
export const colors = {
  primary: { main: '#37444B' },    // Main brand color
  secondary: { main: '#C0B19E' }   // Accent color
}
```

### Component Styling
Edit `formula-project-app/src/theme/components.js` for Material-UI overrides.

## 📝 Data Structure

### Client Data Model
```javascript
{
  id: number,
  companyName: string,
  contactPersonName: string,
  contactPersonTitle: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  state: string,
  country: string,
  postalCode: string,
  website: string,
  industry: string,
  companySize: string,
  services: string[],
  taxId: string,
  notes: string,
  status: 'active' | 'inactive' | 'potential',
  createdAt: ISO string,
  updatedAt: ISO string
}
```

### Scope Item Data Model 🆕
```javascript
{
  id: string,
  projectId: string,
  category: string,        // 12 predefined categories
  description: string,
  unit: string,           // sqm, lm, pcs, ls, kg, ton, etc.
  quantity: number,
  unitPrice: number,
  totalPrice: number,     // Calculated: quantity × unitPrice
  notes: string,
  createdAt: ISO string
}
```

## 🚨 Troubleshooting

### Servers Won't Start
```bash
# Check what's running on the ports
ss -tlnp | grep -E ":(3000|5001)"

# Kill existing processes
./stop-servers.sh

# Restart servers
./start-servers.sh
```

### Frontend Not Loading
1. Check if port 3000 is accessible: `curl http://localhost:3000`
2. Check frontend logs: `cat frontend.log`
3. Restart frontend: `cd formula-project-app && npm start`

### Backend API Errors
1. Check backend health: `curl http://localhost:5001/api/health`
2. Check backend logs: `cat backend.log`
3. Restart backend: `cd formula-backend && npm start`

### Client Tab Not Visible
1. Ensure both servers are running
2. Clear browser cache
3. Check browser console for errors
4. Verify API connectivity: `curl http://localhost:5001/api/clients`

## 🏢 About Formula International

This project management system is built for Formula International's internal operations, featuring:
- Turkish team member integration
- Formula branding and colors
- Industry-specific workflows
- Multi-language support considerations

## 📄 License

Internal use only - Formula International