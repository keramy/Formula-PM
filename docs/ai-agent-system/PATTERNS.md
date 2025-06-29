# Code Patterns Reference

## Component Structure

### Standard Page Component
```javascript
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import apiService from '../../../services/api/apiService';

const FeaturePage = ({ project, data = [], onUpdate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(data);

  useEffect(() => {
    if (project?.id) loadData();
  }, [project?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await apiService.getData(project.id);
      setItems(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box>
      {/* Your content here */}
    </Box>
  );
};

export default FeaturePage;
```

### Material-UI Card Pattern
```javascript
<Card elevation={2} sx={{ mb: 3 }}>
  <CardContent>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
      <Typography variant="h6" fontWeight={600}>
        Title
      </Typography>
      <Button variant="outlined" onClick={handleAction}>
        Action
      </Button>
    </Box>
    {/* Content */}
  </CardContent>
</Card>
```

### Dialog Pattern
```javascript
<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
  <DialogTitle>Title</DialogTitle>
  <DialogContent>
    {/* Form fields */}
  </DialogContent>
  <DialogActions>
    <Button onClick={onClose}>Cancel</Button>
    <Button onClick={handleSave} variant="contained" disabled={loading}>
      Save
    </Button>
  </DialogActions>
</Dialog>
```

## Service Usage

### API Service
```javascript
import apiService from '../../../services/api/apiService';

// Standard patterns
const data = await apiService.getData(projectId);
const result = await apiService.saveData(projectId, data);
const items = await apiService.getItems({ projectId, filters });
```

### Connection Service
```javascript
import connectionService from '../../../services/connectionService';

// Check dependencies
const analysis = connectionService.analyzeScopeItemDependencies(
  scopeItem, 
  shopDrawings, 
  materialSpecs
);

// Create connections
connectionService.connectScopeToDrawing(scopeItemId, drawingId, notes);
```

## State Management

### Update Patterns
```javascript
// Add item
setItems(prev => [...prev, newItem]);

// Remove item
setItems(prev => prev.filter(item => item.id !== id));

// Update item
setItems(prev => prev.map(item => 
  item.id === updatedItem.id ? updatedItem : item
));
```

### Error Handling
```javascript
try {
  const result = await apiService.action();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Show user-friendly message
}
```

## Authentication

### Permission Checks
```javascript
const { user, canEdit, canDelete } = useAuth();

// Conditional rendering
{canEdit && <Button onClick={handleEdit}>Edit</Button>}
{canDelete && <DeleteIcon onClick={handleDelete} />}
```

## Navigation

### Clean Page Layout
```javascript
import CleanPageLayout from '../../../components/layout/CleanPageLayout';

<CleanPageLayout
  title="Page Title"
  subtitle="Description"
  tabs={tabs}
>
  <Box className="clean-fade-in">
    {renderContent()}
  </Box>
</CleanPageLayout>
```

### Tab Navigation
```javascript
<CleanTab
  label="Overview"
  isActive={activeTab === 0}
  onClick={() => setActiveTab(0)}
  icon={<Icon />}
/>
```

## Project Structure
```
src/
├── features/        # Feature modules
├── components/      # Shared components
├── services/        # Core services (don't create new ones)
├── context/         # React contexts
├── hooks/           # Custom hooks
└── utils/           # Utilities
```