# 🎯 Formula PM → Iconoir Migration Plan

## Current Icon Inventory & Iconoir Mapping

### 🏠 **Navigation Icons**

| Current Icon (Source) | Iconoir Equivalent | Status | Notes |
|----------------------|-------------------|---------|-------|
| `Home` (@mui) | `Home` | ✅ Direct | Same name |
| `Dashboard` (@mui) | `Dashboard` | ✅ Direct | Same name |
| `Menu` (@mui) | `Menu` | ✅ Direct | Same name |
| `MenuOpen` (@mui) | `MenuScale` | 🔄 Alternative | Similar function |
| `Timeline` (@mui) | `Timeline` | ✅ Direct | Same name |

### ➕ **Action Icons**

| Current Icon (Source) | Iconoir Equivalent | Status | Notes |
|----------------------|-------------------|---------|-------|
| `Add` (@mui) | `Plus` | 🔄 Alternative | Standard plus icon |
| `FaPlus` (react-icons) | `Plus` | ✅ Direct | Same function |
| `Search` (@mui) | `Search` | ✅ Direct | Same name |
| `FaSearch` (react-icons) | `Search` | ✅ Direct | Same function |
| `Edit` (@mui) | `Edit` | ✅ Direct | Same name |
| `Delete` (@mui) | `Trash` | 🔄 Alternative | Standard delete icon |
| `Save` (react-icons) | `Save` | ✅ Direct | Same name |
| `FilterList` (@mui) | `Filter` | 🔄 Alternative | Similar function |
| `Sort` (@mui) | `SortUp` / `SortDown` | 🔄 Alternative | Directional sort |

### 👁️ **View Icons**

| Current Icon (Source) | Iconoir Equivalent | Status | Notes |
|----------------------|-------------------|---------|-------|
| `ViewKanban` (@mui) | `ViewGrid` | 🔄 Alternative | Grid view |
| `TableRows` (@mui) | `Table` | 🔄 Alternative | Table view |
| `ViewColumn` (@mui) | `ViewColumnsThree` | 🔄 Alternative | Column layout |
| `ViewModule` (@mui) | `ViewGrid` | 🔄 Alternative | Module grid |
| `ViewList` (@mui) | `List` | 🔄 Alternative | List view |
| `CalendarMonth` (@mui) | `Calendar` | 🔄 Alternative | Calendar view |

### ⚠️ **Status Icons**

| Current Icon (Source) | Iconoir Equivalent | Status | Notes |
|----------------------|-------------------|---------|-------|
| `CheckCircle` (@mui) | `CheckCircle` | ✅ Direct | Same name |
| `Warning` (@mui) | `Warning` | ✅ Direct | Same name |
| `Error` (@mui) | `Cancel` | 🔄 Alternative | Error state |
| `Info` (@mui) | `InfoCircle` | 🔄 Alternative | Info state |
| `FaStar` (react-icons) | `Star` | ✅ Direct | Same function |
| `FaRegStar` (react-icons) | `StarOutline` | 🔄 Alternative | Outline star |

### 🏗️ **Business & Construction Icons**

| Current Icon (Source) | Iconoir Equivalent | Status | Notes |
|----------------------|-------------------|---------|-------|
| `Engineering` (@mui) | `Hammer` | 🔄 Alternative | Construction tool |
| `Business` (@mui) | `Building` | 🔄 Alternative | Business building |
| `Assignment` (@mui) | `Task` | 🔄 Alternative | Task assignment |
| `Group` (@mui) | `Group` | ✅ Direct | Same name |
| `Person` (@mui) | `User` | 🔄 Alternative | User profile |
| `FaHardHat` (react-icons) | `Hammer` | 🔄 Alternative | Construction theme |
| `FaTools` (react-icons) | `Tools` | ✅ Direct | Same function |

### 🎛️ **UI Controls**

| Current Icon (Source) | Iconoir Equivalent | Status | Notes |
|----------------------|-------------------|---------|-------|
| `ExpandLess` (@mui) | `NavArrowUp` | 🔄 Alternative | Upward arrow |
| `ExpandMore` (@mui) | `NavArrowDown` | 🔄 Alternative | Downward arrow |
| `ChevronRight` (@mui) | `NavArrowRight` | 🔄 Alternative | Right arrow |
| `MoreHoriz` (@mui) | `MoreHoriz` | ✅ Direct | Same name |
| `Settings` (@mui) | `Settings` | ✅ Direct | Same name |
| `Close` | `Cancel` | 🔄 Alternative | Close button |

### 📤 **File & Share Icons**

| Current Icon (Source) | Iconoir Equivalent | Status | Notes |
|----------------------|-------------------|---------|-------|
| `Share` (@mui) | `Share` | ✅ Direct | Same name |
| `GetApp` (@mui) | `Download` | 🔄 Alternative | Download action |
| `Upload` | `Upload` | ✅ Direct | Same name |
| `Folder` (@mui) | `Folder` | ✅ Direct | Same name |
| `FolderOpen` (@mui) | `FolderOpen` | ✅ Direct | Same name |

## 📊 Migration Summary

- **✅ Direct Matches**: ~40% of icons have exact name matches
- **🔄 Alternative Names**: ~55% have suitable alternatives in Iconoir
- **❌ Missing**: ~5% may need custom implementation or different approach

## 🚀 Implementation Strategy

### Phase 1: Create Icon Mapping Service
```javascript
// src/services/iconMapping.js
import {
  Home, Dashboard, Menu, Plus, Search, Edit, Trash,
  ViewGrid, Table, List, Calendar, CheckCircle, Warning,
  Building, User, Group, NavArrowUp, NavArrowDown,
  Share, Download, Upload, Folder, Settings
} from 'iconoir-react';

export const iconMap = {
  // Material-UI mappings
  Home: Home,
  Dashboard: Dashboard,
  Add: Plus,
  Delete: Trash,
  ViewKanban: ViewGrid,
  // ... rest of mappings
};
```

### Phase 2: Global Icon Provider
```javascript
import { IconoirProvider } from 'iconoir-react';

<IconoirProvider iconProps={{
  color: 'currentColor',
  strokeWidth: 1.5,
  width: '1.2em',
  height: '1.2em'
}}>
  <App />
</IconoirProvider>
```

### Phase 3: Systematic Replacement
1. Update NotionStyleSidebar.jsx
2. Update EnhancedTabSystem.jsx  
3. Update UnifiedHeader.jsx
4. Update all feature components
5. Remove old icon dependencies

## ✅ Next Steps
1. Test core icons in development
2. Create mapping service
3. Start with main navigation components
4. Progressive replacement strategy