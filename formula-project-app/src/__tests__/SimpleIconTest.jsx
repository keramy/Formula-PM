import React from 'react';

// Test basic import from iconoir-react
console.log('Testing Iconoir imports...');

// Try to import some common icons to test availability
let testResults = {};

// Test Navigation Icons
try {
  const { Home } = require('iconoir-react');
  testResults.Home = '✅ Available';
} catch (e) {
  testResults.Home = '❌ Missing';
}

try {
  const { Search } = require('iconoir-react');  
  testResults.Search = '✅ Available';
} catch (e) {
  testResults.Search = '❌ Missing';
}

try {
  const { Plus } = require('iconoir-react');
  testResults.Plus = '✅ Available';
} catch (e) {
  testResults.Plus = '❌ Missing';
}

try {
  const { Edit } = require('iconoir-react');
  testResults.Edit = '✅ Available';
} catch (e) {
  testResults.Edit = '❌ Missing';
}

try {
  const { Menu } = require('iconoir-react');
  testResults.Menu = '✅ Available';
} catch (e) {
  testResults.Menu = '❌ Missing';
}

console.log('Icon Test Results:', testResults);

const SimpleIconTest = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🎯 Iconoir Icon Test Results</h2>
      <pre>{JSON.stringify(testResults, null, 2)}</pre>
    </div>
  );
};

export default SimpleIconTest;