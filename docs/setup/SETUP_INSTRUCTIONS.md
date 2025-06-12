# Formula Project Management - Setup Instructions

## Prerequisites
- Node.js 18.x or higher
- npm 8.x or higher
- Git (for version control)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Quick Start

### 1. Install Dependencies

**Frontend Setup:**
```bash
cd formula-project-app
npm install
```

**Backend Setup:**
```bash
cd formula-backend
npm install
```

### 2. Start the Application

**Terminal 1 - Start Backend:**
```bash
cd formula-backend
npm start
```
Backend will run on: http://localhost:5000

**Terminal 2 - Start Frontend:**
```bash
cd formula-project-app
npm start
```
Frontend will run on: http://localhost:3000

### 3. Access the Application
Open your browser and navigate to: http://localhost:3000

## Environment Configuration

### Email Service (Optional)
To enable email notifications, create a `.env` file in the `formula-backend` folder:

```bash
# formula-backend/.env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note**: For Gmail, you'll need to use an App Password, not your regular password.

### Port Configuration
Default ports:
- Frontend: 3000
- Backend: 5000

To change ports, modify:
```bash
# Backend port
cd formula-backend
PORT=3001 npm start

# Frontend port  
cd formula-project-app
PORT=3001 npm start
```

## Development Scripts

### Frontend (formula-project-app)
```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
npm run eject      # Eject from Create React App (one-way)
```

### Backend (formula-backend)
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

## Project Structure Overview

```
project-root/
├── formula-project-app/     # React Frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # State management
│   │   ├── utils/          # Utility functions
│   │   └── services/       # API services
│   └── package.json
├── formula-backend/         # Node.js Backend
│   ├── server.js          # Main server file
│   └── package.json
└── documentation/           # Project docs
```

## Features Available

### ✅ Working Features
1. **Project Management**
   - Create new projects with details
   - View project list
   - Delete projects

2. **Task Management**
   - Create tasks assigned to team members
   - Set priority levels and due dates
   - Update task status and progress
   - Delete tasks

3. **Team Management**
   - Add team members with roles
   - View team member list
   - Edit member details
   - Remove team members

4. **Dashboard & Analytics**
   - Statistics overview
   - Charts and metrics
   - Project timeline (Gantt chart)
   - Real-time notifications

### 🔧 Data Storage
- **Current**: Browser LocalStorage
- **Persistence**: Data saved automatically
- **Limitations**: Data tied to browser/device

## Troubleshooting

### Common Issues

**1. "Module not found" errors:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. Port already in use:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

**3. CORS errors:**
- Ensure backend is running on port 5000
- Check browser console for specific errors
- Verify CORS is enabled in server.js

**4. Compilation errors:**
```bash
# Clear npm cache
npm cache clean --force

# Restart development server
npm start
```

### Browser Requirements
- JavaScript enabled
- Local storage enabled
- Modern ES6+ support
- CSS Grid and Flexbox support

## Production Deployment

### Frontend Build
```bash
cd formula-project-app
npm run build
```
This creates an optimized production build in the `build/` folder.

### Backend Production
```bash
cd formula-backend
NODE_ENV=production npm start
```

### Environment Variables for Production
```bash
# .env file
NODE_ENV=production
PORT=5000
EMAIL_USER=production-email@company.com
EMAIL_PASS=production-app-password
DATABASE_URL=your-database-connection-string
```

## Development Tips

### Hot Reloading
- Frontend: Automatic reload on file changes
- Backend: Install nodemon for auto-restart
  ```bash
  npm install -g nodemon
  npm run dev
  ```

### Debugging
- React DevTools browser extension
- Chrome DevTools for debugging
- Console logs in both frontend and backend

### Code Style
- ESLint configured for React best practices
- Prettier for code formatting (recommended)
- Material-UI components for consistency

## Getting Help

### Resources
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)

### Support
- Check console for error messages
- Review browser Network tab for API issues
- Examine server logs for backend problems

## Next Steps
After successful setup, refer to:
- `DEVELOPMENT_ROADMAP.md` for future enhancements
- `PROJECT_SUMMARY.md` for feature overview
- `BUG_FIXES_LOG.md` for known issues