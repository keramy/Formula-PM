# Formula PM Icon Migration: iconoir-react → react-icons/md

## Critical Icon Mappings (Most Used)

### Navigation Icons
- `Home` → `MdHome`
- `Dashboard` → `MdDashboard` 
- `Menu` → `MdMenu`
- `ArrowUp` → `MdKeyboardArrowUp`
- `ArrowDown` → `MdKeyboardArrowDown`
- `NavArrowUp` → `MdExpandLess`
- `NavArrowDown` → `MdExpandMore`

### Action Icons  
- `Plus` → `MdAdd`
- `Search` → `MdSearch`
- `Edit` → `MdEdit`
- `Trash` → `MdDelete`
- `Check` → `MdCheck`
- `Cancel` → `MdClose`
- `Settings` → `MdSettings`

### Status Icons
- `CheckCircle` → `MdCheckCircle`
- `Warning` → `MdWarning`
- `WarningTriangle` → `MdWarning`
- `InfoCircle` → `MdInfo`

### Business Icons
- `Building` → `MdBusiness`
- `User` → `MdPerson`
- `Group` → `MdGroup`
- `Calendar` → `MdCalendarToday`
- `Clock` → `MdSchedule`

### View Icons
- `ViewGrid` → `MdViewModule`
- `List` → `MdViewList`
- `Eye` → `MdVisibility`
- `MoreVert` → `MdMoreVert`

## Pattern Changes

### Import Pattern
```jsx
// OLD
import { Check, ArrowUp, Plus } from 'iconoir-react';

// NEW  
import { MdCheck, MdKeyboardArrowUp, MdAdd } from 'react-icons/md';
```

### Size Pattern
```jsx
// OLD
<Check sx={{ fontSize: 16 }} />

// NEW
<MdCheck size={16} />
```

## Critical Files to Fix First
1. TasksPage.jsx - `Check` → `MdCheck`
2. StatusChip.jsx - Multiple icons
3. ProjectsPage.jsx - `ArrowUp`, `Check`
4. NotionStyleSidebar.jsx - Navigation icons