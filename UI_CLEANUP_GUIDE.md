# UI Cleanup Implementation Guide

## 🎯 **CleanPageLayout Pattern**

The Formula PM application now uses a consistent `CleanPageLayout` pattern across all major pages. Here's how to implement it:

### **Basic Implementation**
```jsx
import CleanPageLayout, { CleanTab } from '../components/layout/CleanPageLayout';

const YourPage = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const tabs = (
    <>
      <CleanTab 
        label="Tab 1" 
        isActive={activeTab === 'tab1'}
        onClick={() => setActiveTab('tab1')}
        icon={<SomeIcon sx={{ fontSize: 16 }} />}
        badge={itemCount} // optional
      />
      <CleanTab 
        label="Tab 2" 
        isActive={activeTab === 'tab2'}
        onClick={() => setActiveTab('tab2')}
        icon={<AnotherIcon sx={{ fontSize: 16 }} />}
      />
    </>
  );

  return (
    <CleanPageLayout
      title="Page Title"
      subtitle="Page description or context"
      tabs={tabs}
      showProjectHeader={false} // Only true for project pages
      projectInfo={null} // Only for project pages
    >
      <Box className="clean-fade-in">
        {renderTabContent()}
      </Box>
    </CleanPageLayout>
  );
};
```

### **Project Page Special Case**
```jsx
<CleanPageLayout
  title={project.name}
  subtitle={`${project.type || 'Construction'} project with ${projectTasks.length} tasks`}
  tabs={tabs}
  showProjectHeader={true}
  projectInfo={{
    name: project.name,
    status: project.status || 'active'
  }}
>
  {/* Project content */}
</CleanPageLayout>
```

## 🎨 **Design System Colors**

```javascript
const colors = {
  background: '#FBFAF8',        // Page background
  cardBackground: '#FFFFFF',    // Card/panel background
  textPrimary: '#1A1A1A',      // Main text
  textSecondary: '#6B7280',    // Secondary text
  textMuted: '#9CA3AF',        // Muted text
  border: '#E5E7EB',           // Border color
  caramelEssence: '#E3AF64',   // Primary accent (Formula brand)
  sapphireDust: '#516AC8',     // Secondary accent
  cosmicOdyssey: '#0F1939',    // Dark accent
  raptureLight: '#F6F3E7'      // Light accent background
};
```

## 🔧 **Icon Import Pattern**

### **Working Iconoir-React Icons**
```javascript
import {
  // Navigation & UI
  ArrowUp as TrendingUp,
  ArrowLeft,
  ArrowRight,
  Plus as Add,
  Search as SearchIcon,
  FilterList,
  Settings,
  
  // Status & Actions
  ClipboardCheck,
  Calendar,
  EditPencil,
  Building,
  Bell,
  StatsReport,
  
  // User & Team
  User as PersonIcon,
  Group as TeamIcon,
  
  // Status Icons
  CheckCircle,
  Clock as PendingIcon,
  Play as InProgressIcon,
  Warning,
  
  // View Controls
  List as ViewList,
  ViewGrid as ViewModule,
  Trash as MoreVert
} from 'iconoir-react';
```

### **Icons That DON'T Exist (Avoid These)**
- ❌ `TrendingUp` → Use `ArrowUp`
- ❌ `FileText` → Use `Page`
- ❌ `BarChart` → Use `StatsReport`

## 📐 **Layout Patterns**

### **Stats Cards Pattern**
```jsx
const StatsCard = ({ title, value, subtitle, icon, color = '#E3AF64' }) => (
  <Card className="clean-card">
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '13px', fontWeight: 500, mb: 1 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 700, color: '#0F1939', mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '12px' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2,
          backgroundColor: `${color}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {React.cloneElement(icon, { sx: { fontSize: 24, color: color } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);
```

### **Tab Content Pattern**
```jsx
const renderTabContent = () => {
  switch (activeTab) {
    case 'overview':
      return <OverviewComponent />;
    case 'details':
      return <DetailsComponent />;
    default:
      return <DefaultComponent />;
  }
};
```

## 🎯 **Status Chip Pattern**

### **Implementation**
```jsx
import StatusChip from '../components/ui/StatusChip';

// Usage examples
<StatusChip type="task" status="completed" />
<StatusChip type="project" status="active" />
<StatusChip type="priority" status="high" />
```

### **Status Capitalization**
Always use the `capitalizeStatus` helper for consistent formatting:
```javascript
const capitalizeStatus = (status) => {
  if (!status) return 'Active';
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
};

// "active" → "Active"
// "in-progress" → "In progress"
// "completed" → "Completed"
```

## 🚫 **What NOT to Include**

### **Avoid These Patterns**
- ❌ Duplicate breadcrumbs (only use top nav breadcrumb)
- ❌ Excessive action buttons in headers
- ❌ Redundant project name displays
- ❌ Non-existent iconoir-react icons
- ❌ Inconsistent spacing (use consistent padding/margins)

### **Deprecated Elements**
- Old Material-UI icons (replaced with Iconoir)
- FluentUI icons (completely removed)
- Duplicate header elements
- Compliance tab (removed per user request)

## ✅ **Quality Checklist**

Before marking any UI work complete:
- [ ] Uses CleanPageLayout consistently
- [ ] All icons are valid iconoir-react imports
- [ ] Status text uses proper capitalization
- [ ] No duplicate navigation elements
- [ ] Consistent color scheme and spacing
- [ ] Responsive design considerations
- [ ] Clean, semantic HTML structure
- [ ] No console errors during navigation