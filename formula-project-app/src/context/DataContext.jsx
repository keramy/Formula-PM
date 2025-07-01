import React, { createContext, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children, data }) => (
  <DataContext.Provider value={data}>{children}</DataContext.Provider>
);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;