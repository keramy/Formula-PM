import React from 'react';

// Test minimal imports that should work
import {
  MdHome as Home,
  MdSearch as Search,
  MdMenu as Menu,
  MdSettings as Settings,
  MdPerson as User,
  MdAdd as Plus
} from 'react-icons/md';

const MinimalIconTest = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Minimal Iconoir Test</h2>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Home />
        <Search />
        <Menu />
        <Settings />
        <User />
        <Plus />
      </div>
      <p>If you see 6 icons above, Iconoir is working!</p>
    </div>
  );
};

export default MinimalIconTest;