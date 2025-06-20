# Unified Components Migration Guide

## Overview
This guide helps you migrate from existing header, search, tab, and filter implementations to the new unified components.

## 1. MasterHeader Migration

### Before (Multiple Header Implementations)
```jsx
// Old EnhancedHeader.jsx
<EnhancedHeader 
  title="Projects"
  breadcrumbs={[...]}
  onSearch={handleSearch}
  // ... various props
/>

// Old UnifiedHeader.jsx
<UnifiedHeader
  title="Tasks"
  searchValue={search}
  onSearchChange={setSearch}
  // ... different props
/>
```

### After (Single MasterHeader)
```jsx
import { MasterHeader } from '../components/unified';

<MasterHeader
  title="Projects"
  subtitle="Manage your construction projects"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'Projects' }
  ]}
  
  // Search configuration
  searchValue={searchValue}
  onSearchChange={setSearchValue}
  onSearch={handleSearch}
  
  // Filter configuration
  filterEnabled={true}
  activeFiltersCount={activeFilters.length}
  onFilterToggle={() => setShowFilters(!showFilters)}
  
  // Export configuration
  exportOptions={[
    { format: 'pdf', label: 'Export as PDF', icon: <PdfIcon /> },
    { format: 'excel', label: 'Export as Excel', icon: <ExcelIcon /> }
  ]}
  onExport={handleExport}
  
  // Add button configuration
  addOptions={[
    { type: 'project', label: 'New Project', icon: <ProjectIcon /> },
    { type: 'task', label: 'New Task', icon: <TaskIcon /> }
  ]}
  onAdd={handleAdd}
  
  // More actions
  moreActions={[
    { key: 'share', label: 'Share', onClick: handleShare },
    { divider: true },
    { key: 'settings', label: 'Settings', onClick: handleSettings }
  ]}
  
  // User configuration
  user={{ name: 'John Doe', role: 'PM', avatar: null }}
  onUserAction={handleUserAction}
/>
```

### Key Changes:
- Standardized button order: [Search] [Filters] [Export] [Add] [More] [User]
- Integrated FluentUI icons throughout
- Support for dropdown menus on Export and Add buttons
- Built-in theme toggle in user menu
- Three variants: default, compact, minimal

## 2. UnifiedSearch Migration

### Before (LiveSearchDropdown)
```jsx
<LiveSearchDropdown
  value={searchTerm}
  onChange={setSearchTerm}
  onResultSelect={handleSelect}
  sx={{ width: 300 }}
/>
```

### After (UnifiedSearch)
```jsx
import { UnifiedSearch } from '../components/unified';

<UnifiedSearch
  value={searchValue}
  onChange={setSearchValue}
  onSearch={handleSearch}
  onResultSelect={handleResultSelect}
  
  // Search configuration
  searchDelay={300} // 300ms debounce
  minSearchLength={2}
  maxResults={8}
  
  // Features
  showHistory={true}
  showCategories={true}
  liveSearch={true}
  
  // Data source (async function)
  searchFunction={async (term, options) => {
    const results = await searchAPI(term, options);
    return results;
  }}
  
  // Categories for filtering
  categories={['all', 'projects', 'tasks', 'team', 'clients']}
  
  // Accessibility
  ariaLabel="Search projects and tasks"
/>
```

### Key Features:
- 300ms debouncing by default
- Keyboard navigation (arrows, enter, escape)
- Search history with localStorage
- Category filtering
- ARIA labels for accessibility
- Live search results with type indicators

## 3. UniversalTabs Migration

### Before (EnhancedTabSystem)
```jsx
<EnhancedTabSystem
  currentView="table"
  onViewChange={handleViewChange}
  hasActiveFilters={true}
  // ... limited options
/>
```

### After (UniversalTabs)
```jsx
import { UniversalTabs } from '../components/unified';

<UniversalTabs
  value={activeTab}
  onChange={handleTabChange}
  
  tabs={[
    {
      id: 'projects',
      label: 'Projects',
      icon: <ProjectIcon />,
      count: 12,
      badge: 3,
      badgeColor: 'error',
      status: 'success', // Shows status dot
      hasDropdown: true, // Shows dropdown arrow
      actions: [ // Tab-specific actions
        { label: 'Refresh', onClick: handleRefresh }
      ]
    },
    // ... more tabs
  ]}
  
  // Variants
  variant="enhanced" // standard, enhanced, pills
  size="medium" // small, medium, large
  orientation="horizontal" // horizontal, vertical
  
  // Features
  showIcons={true}
  showCounts={true}
  showBadges={true}
  allowTabCustomization={true} // Pin/hide tabs
  
  // Global tab actions
  tabActions={[
    { label: 'Reset Tab Order', onClick: handleReset }
  ]}
/>
```

### Key Features:
- Three variants: standard, enhanced, pills
- Tab customization (pin/hide)
- Per-tab actions and global actions
- Status indicators and badges
- Flexible icon integration

## 4. UniversalFilters Migration

### Before (UnifiedFilters)
```jsx
<UnifiedFilters
  show={showFilters}
  filters={filters}
  onFilterChange={handleFilterChange}
  filterConfig={[...]}
/>
```

### After (UniversalFilters)
```jsx
import { UniversalFilters } from '../components/unified';

<UniversalFilters
  filters={filters}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearAll}
  
  filterConfig={[
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      icon: 'active', // Construction icon
      iconCategory: 'status',
      options: [
        { value: 'active', label: 'Active', count: 5 },
        { value: 'completed', label: 'Completed', count: 12 }
      ]
    },
    {
      key: 'dateRange',
      label: 'Date Range',
      type: 'daterange'
    },
    {
      key: 'budget',
      label: 'Budget',
      type: 'range',
      min: 0,
      max: 1000000,
      step: 10000,
      marks: [
        { value: 0, label: '$0' },
        { value: 500000, label: '$500K' }
      ]
    }
  ]}
  
  // Layout options
  layout="dropdown" // dropdown, chips, sidebar
  position="right" // For sidebar: left, right
  
  // Features
  showQuickFilters={true}
  quickFilters={[
    { key: 'my-projects', label: 'My Projects', filters: {...} }
  ]}
  
  // Saved filters
  showSaveFilters={true}
  onSaveFilter={handleSaveFilter}
  savedFilters={savedFilters}
  
  // Construction context
  useConstructionIcons={true}
/>
```

### Key Features:
- Three layouts: dropdown, chips, sidebar
- Construction industry icons integration
- Quick filters for common selections
- Save/load filter sets
- Advanced field types: multiselect, date range, sliders
- Responsive design

## Migration Checklist

1. **Update imports**
   ```jsx
   import { MasterHeader, UnifiedSearch, UniversalTabs, UniversalFilters } from '../components/unified';
   ```

2. **Replace header implementations**
   - Find all uses of EnhancedHeader, UnifiedHeader, ProjectsHeader
   - Replace with MasterHeader
   - Update props to match new API

3. **Update search components**
   - Replace LiveSearchDropdown with UnifiedSearch
   - Implement searchFunction for async data
   - Add keyboard navigation handlers if needed

4. **Migrate tab systems**
   - Replace EnhancedTabSystem with UniversalTabs
   - Convert tab configurations to new format
   - Add icons from FluentUI

5. **Update filter implementations**
   - Replace UnifiedFilters with UniversalFilters
   - Choose appropriate layout (dropdown, chips, sidebar)
   - Add construction icons where relevant

6. **Test thoroughly**
   - Verify all interactions work as expected
   - Check responsive behavior
   - Test accessibility features
   - Validate dark mode support

## Example Page Migration

See `UnifiedComponentsExample.jsx` for a complete example of all components working together.

## Support

For questions or issues during migration:
1. Check the component prop types for detailed documentation
2. Review UnifiedComponentsExample.jsx for usage patterns
3. Test components in isolation before full integration