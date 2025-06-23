/**
 * useMentionAutocomplete Hook - Manages @ mention autocomplete logic
 * Handles search, keyboard navigation, and entity selection
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import mentionService from '../services/mentionService';

export const useMentionAutocomplete = (projectId = null) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [query, setQuery] = useState('');
  const [mentionType, setMentionType] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  const searchTimeoutRef = useRef(null);
  const currentProjectIdRef = useRef(projectId);

  // Update project ID reference
  useEffect(() => {
    currentProjectIdRef.current = projectId;
  }, [projectId]);

  // Search entities with debouncing
  const searchEntities = useCallback(async (searchQuery, type = '') => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const categories = type ? [type] : ['all'];
        const results = await mentionService.getEntitiesForAutocomplete(
          searchQuery,
          currentProjectIdRef.current,
          categories
        );
        setEntities(results);
        setSelectedIndex(0);
      } catch (error) {
        console.error('Error searching entities:', error);
        setEntities([]);
      } finally {
        setIsLoading(false);
      }
    }, 150); // 150ms debounce
  }, []);

  // Open autocomplete with query
  const openAutocomplete = useCallback((searchQuery = '', type = '', pos = { top: 0, left: 0 }) => {
    setQuery(searchQuery);
    setMentionType(type);
    setPosition(pos);
    setIsOpen(true);
    setSelectedIndex(0);
    searchEntities(searchQuery, type);
  }, [searchEntities]);

  // Close autocomplete
  const closeAutocomplete = useCallback(() => {
    setIsOpen(false);
    setEntities([]);
    setQuery('');
    setMentionType('');
    setSelectedIndex(0);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  }, []);

  // Update search query
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
    searchEntities(newQuery, mentionType);
  }, [searchEntities, mentionType]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (!isOpen || entities.length === 0) return false;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % entities.length);
        return true;
        
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev === 0 ? entities.length - 1 : prev - 1);
        return true;
        
      case 'Enter':
        event.preventDefault();
        if (entities[selectedIndex]) {
          return selectEntity(entities[selectedIndex]);
        }
        return true;
        
      case 'Escape':
        event.preventDefault();
        closeAutocomplete();
        return true;
        
      default:
        return false;
    }
  }, [isOpen, entities, selectedIndex]);

  // Select an entity
  const selectEntity = useCallback((entity) => {
    // Add to search history
    mentionService.addToSearchHistory(entity);
    
    // Close autocomplete
    closeAutocomplete();
    
    // Return entity for insertion
    return {
      entity,
      mentionString: mentionService.createMention(entity.type, entity.name),
      navigationInfo: mentionService.getNavigationInfo(entity.type, entity.id, entity.projectId || currentProjectIdRef.current)
    };
  }, [closeAutocomplete]);

  // Parse text for mention triggers
  const parseMentionTrigger = useCallback((text, cursorPosition) => {
    const beforeCursor = text.slice(0, cursorPosition);
    const mentionMatch = beforeCursor.match(/@(\w*):?([^@\s]*)$/);
    
    if (mentionMatch) {
      const [fullMatch, type = '', name = ''] = mentionMatch;
      const startIndex = cursorPosition - fullMatch.length;
      
      return {
        isMatch: true,
        type: type.toLowerCase(),
        query: name,
        startIndex,
        endIndex: cursorPosition,
        fullMatch
      };
    }
    
    return { isMatch: false };
  }, []);

  // Get recent searches
  const getRecentSearches = useCallback(() => {
    return mentionService.getRecentSearches();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    isOpen,
    entities,
    isLoading,
    selectedIndex,
    query,
    mentionType,
    position,
    
    // Actions
    openAutocomplete,
    closeAutocomplete,
    updateQuery,
    handleKeyDown,
    selectEntity,
    parseMentionTrigger,
    getRecentSearches
  };
};

export default useMentionAutocomplete;