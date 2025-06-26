import React from 'react';

// Test minimal imports that should work
import { Home, Search, Menu, Settings, User, Plus } from 'iconoir-react';

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