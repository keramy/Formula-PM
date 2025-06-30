import React from 'react';

// Direct import test - we'll see which ones work and which fail during build
import {
  Md// Navigation icons
  Home as // Navigation icons
  Home,
  MdSearch as Search,
  MdMenu as Menu,
  Md// Action icons  
  Plus as // Action icons  
  Plus,
  MdEdit as Edit,
  Md// Status icons
  Check as // Status icons
  Check,
  Md// Try some common ones
  Settings as // Try some common ones
  Settings,
  MdPerson as User,
  MdCalendarToday as Calendar,
  Md// View icons
  Table as // View icons
  Table,
  MdList as List
} from 'react-icons/md';

const IconoirImportTest = () => {
  const iconTests = [
    { name: 'Home', component: Home },
    { name: 'Search', component: Search },
    { name: 'Menu', component: Menu },
    { name: 'Plus', component: Plus },
    { name: 'Edit', component: Edit },
    { name: 'Check', component: Check },
    { name: 'Settings', component: Settings },
    { name: 'User', component: User },
    { name: 'Calendar', component: Calendar },
    { name: 'Table', component: Table },
    { name: 'List', component: List }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🎯 Iconoir Direct Import Test</h2>
      <p>Testing which icons can be imported directly from iconoir-react:</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
        {iconTests.map(({ name, component: IconComponent }) => (
          <div key={name} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '12px', 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            backgroundPalette: '#f9f9f9'
          }}>
            <IconComponent style={{ marginRight: '8px', width: '20px', height: '20px' }} />
            <span>{name}</span>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '24px', padding: '16px', backgroundPalette: '#e8f5e8', borderRadius: '8px' }}>
        <h3>✅ Success!</h3>
        <p>If you can see this component with icons, then these Iconoir icons are working correctly.</p>
      </div>
    </div>
  );
};

export default IconoirImportTest;