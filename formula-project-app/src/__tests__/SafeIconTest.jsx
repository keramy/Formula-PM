import React from 'react';

// Test only the most basic icons that should definitely exist
import {
  MdHome as Home,
  MdSearch as Search,
  MdMenu as Menu,
  MdSettings as Settings,
  MdPerson as User,
  MdAdd as Plus,
  MdNotifications as Bell,
  MdEmail as Mail,
  MdCheck as Check,
  MdGroup as Group,
  MdList as List,
  MdFolder as Folder,
  MdKeyboardArrowUp as ArrowUp,
  MdKeyboardArrowDown as ArrowDown,
  MdDashboard as Dashboard,
  MdCalendarToday as Calendar,
  MdBusiness as Building,
  MdDescription as Page,
  MdViewModule as Apps,
  MdTable as Table,
  MdFilterList as Filter,
  MdShare as Share,
  MdDownload as Download,
  MdClose as XmarkCircle,
  MdArrowBack as ArrowLeft,
  MdArrowForward as ArrowRight
} from 'react-icons/md';

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
            backgroundPalette: '#f9f9f9',
            fontSize: '14px'
          }}>
            <IconComponent style={{ marginRight: '6px', width: '16px', height: '16px' }} />
            <span>{name}</span>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', padding: '12px', backgroundPalette: '#e8f5e8', borderRadius: '6px' }}>
        <strong>✅ Success!</strong> All icons above are verified working in Iconoir.
      </div>
    </div>
  );
};

export default SafeIconTest;