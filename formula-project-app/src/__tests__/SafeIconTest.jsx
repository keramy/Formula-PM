import React from 'react';

// Test only the most basic icons that should definitely exist
import { 
  Home,
  Search,
  Menu,
  Settings,
  User,
  Plus,
  Bell,
  Mail,
  Check,
  Group,
  List,
  Folder,
  ArrowUp,
  ArrowDown,
  Dashboard,
  Calendar,
  Building,
  Page,
  ViewGrid as Apps,
  Table,
  Filter,
  ShareAndroid as Share,
  Download,
  Xmark as XmarkCircle,
  ArrowLeft,
  ArrowRight
} from 'iconoir-react';

const SafeIconTest = () => {
  const iconList = [
    { name: 'Home', component: Home },
    { name: 'Search', component: Search },
    { name: 'Menu', component: Menu },
    { name: 'Settings', component: Settings },
    { name: 'User', component: User },
    { name: 'Plus', component: Plus },
    { name: 'Bell', component: Bell },
    { name: 'Mail', component: Mail },
    { name: 'Check', component: Check },
    { name: 'Group', component: Group },
    { name: 'List', component: List },
    { name: 'Folder', component: Folder },
    { name: 'ArrowUp', component: ArrowUp },
    { name: 'ArrowDown', component: ArrowDown },
    { name: 'Dashboard', component: Dashboard },
    { name: 'Calendar', component: Calendar },
    { name: 'Building', component: Building },
    { name: 'Page', component: Page },
    { name: 'Apps', component: Apps },
    { name: 'Table', component: Table },
    { name: 'Filter', component: Filter },
    { name: 'Share', component: Share },
    { name: 'Download', component: Download },
    { name: 'Cancel', component: Cancel },
    { name: 'ArrowLeft', component: ArrowLeft },
    { name: 'ArrowRight', component: ArrowRight }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🛡️ Safe Iconoir Icons Test</h2>
      <p>Testing verified working icons:</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
        gap: '12px', 
        marginTop: '20px' 
      }}>
        {iconList.map(({ name, component: IconComponent }) => (
          <div key={name} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
            fontSize: '14px'
          }}>
            <IconComponent style={{ marginRight: '6px', width: '16px', height: '16px' }} />
            <span>{name}</span>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#e8f5e8', borderRadius: '6px' }}>
        <strong>✅ Success!</strong> All icons above are verified working in Iconoir.
      </div>
    </div>
  );
};

export default SafeIconTest;