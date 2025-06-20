# FluentUI Icon System Usage Examples

## Basic Usage

### Import the UniversalIcon component:
```javascript
import UniversalIcon from '../components/icons';
// or
import { UniversalIcon } from '../components/icons';
```

### Basic icon usage:
```jsx
<UniversalIcon name="dashboard" size={24} />
<UniversalIcon name="projects" size={20} color="primary" />
<UniversalIcon name="tasks" size={16} filled />
```

## Specialized Icon Components

### Navigation Icons:
```jsx
import { NavigationIcon } from '../components/icons';

<NavigationIcon name="dashboard" active />
<NavigationIcon name="projects" />
```

### Action Icons:
```jsx
import { ActionIcon } from '../components/icons';

<ActionIcon name="add" onClick={handleAdd} />
<ActionIcon name="edit" size={16} />
```

### Status Icons:
```jsx
import { StatusIcon } from '../components/icons';

<StatusIcon type="success" />
<StatusIcon type="error" size={20} />
<StatusIcon type="warning" />
```

### File Type Icons:
```jsx
import { FileIcon } from '../components/icons';

<FileIcon type="pdf" />
<FileIcon type="excel" size={24} />
```

### Priority Icons:
```jsx
import { PriorityIcon } from '../components/icons';

<PriorityIcon level="high" />
<PriorityIcon level="medium" size={16} />
```

### View Icons:
```jsx
import { ViewIcon } from '../components/icons';

<ViewIcon view="grid" active />
<ViewIcon view="list" />
```

## Icon Button Component

```jsx
import { IconButton } from '../components/icons';

<IconButton 
  icon="add" 
  variant="primary"
  tooltip="Add Item"
  onClick={handleAdd}
/>

<IconButton 
  icon="delete" 
  variant="secondary"
  disabled={!canDelete}
/>
```

## Construction-Specific Icons

```jsx
import { getConstructionIcon } from '../components/icons';

const projectConfig = getConstructionIcon('residential', 'projectType');
// Returns: { iconName, icon, iconFilled, label, color, description }

<UniversalIcon 
  name={projectConfig.iconName} 
  color={projectConfig.color}
  size={24}
/>
```

## Available Icon Names

### Navigation Icons:
- dashboard, projects, tasks, team, clients, myWork
- shopDrawings, materials, timeline, procurement, activityFeed

### Action Icons:
- add, edit, delete, search, filter, export, save, share, more, close

### Status Icons:
- success, error, warning, info, star, starOff

### View Icons:
- gridView, listView, tableView, calendarView, boardView, timelineView
- visible, hidden

### File Icons:
- pdfFile, excelFile, imageFile, folder, document, attachFile
- cloudDownload, cloudUpload

### Communication Icons:
- email, phone, message, notifications, notificationsOff

### Settings Icons:
- settings, tune, refresh, sync, help

### Progress Icons:
- schedule, playArrow, pause, stop, priorityHigh, priority

### Chart Icons:
- barChart, pieChart, showChart, trendingUp

### Construction Icons:
- residential, commercial, industrial, institutional, mixedUse
- demolition, construction, mep, finishing, handover, tools
- lumber, hardware, panels, tiles, components, materials
- safety, approved, rejected, inspection, compliance

## Props Reference

### UniversalIcon Props:
- `name`: Icon name from the available icons list
- `size`: Icon size in pixels (default: 20)
- `filled`: Use filled variant (default: false)
- `color`: Icon color ('primary', 'secondary', 'error', 'warning', 'success', 'info', or custom)
- `hoverColor`: Color on hover
- `onClick`: Click handler function
- `disabled`: Disable the icon (default: false)
- `sx`: MUI sx prop for custom styling
- `title`: Tooltip text
- `aria-label`: Accessibility label

### Specialized Component Props:
- NavigationIcon: `name`, `active`, standard props
- ActionIcon: `name`, `size`, standard props  
- StatusIcon: `type` ('success', 'error', 'warning', 'info', 'pending', 'inProgress', 'completed', 'cancelled')
- FileIcon: `type` ('pdf', 'excel', 'image', 'folder', 'document', 'attachment')
- PriorityIcon: `level` ('low', 'medium', 'high', 'urgent')
- ViewIcon: `view` ('grid', 'list', 'table', 'calendar', 'board', 'timeline'), `active`

## Migration from Material-UI Icons

Use the provided migration script:
```bash
node icon-migration-script.js
```

This will:
1. Scan your codebase for Material-UI icon usage
2. Suggest FluentUI replacements
3. Optionally perform automatic migration
4. Generate a manual migration guide for complex cases