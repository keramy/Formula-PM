import React from 'react';
import { GlobalSearchResults } from '../lazy';

/**
 * GlobalSearchDialog component for global search results
 * Uses the existing GlobalSearchResults component
 */
const GlobalSearchDialog = ({
  open,
  searchTerm,
  onSearchChange,
  onClose,
  onSelectResult,
  results,
  isSearching,
  suggestions,
  quickFilters
}) => {
  return (
    <GlobalSearchResults
      open={open}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      onClose={onClose}
      onSelectResult={onSelectResult}
      results={results}
      isSearching={isSearching}
      suggestions={suggestions}
      quickFilters={quickFilters}
    />
  );
};

export default GlobalSearchDialog;