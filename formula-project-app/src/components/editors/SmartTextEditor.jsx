/**
 * SmartTextEditor Component - Rich text editor with @ mention support
 * Provides intelligent autocomplete for project entities
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  TextField,
  Box,
  Portal
} from '@mui/material';
import MentionAutocomplete from './MentionAutocomplete';
import useMentionAutocomplete from '../../hooks/useMentionAutocomplete';

const SmartTextEditor = ({
  value = '',
  onChange,
  placeholder = 'Enter description...',
  projectId = null,
  multiline = true,
  rows = 4,
  disabled = false,
  error = false,
  helperText = '',
  label = '',
  variant = 'outlined',
  fullWidth = true,
  size = 'medium',
  sx = {}
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textFieldRef = useRef(null);
  const mentionDataRef = useRef(new Map()); // Store mention metadata

  const {
    isOpen,
    entities,
    isLoading,
    selectedIndex,
    query,
    position,
    openAutocomplete,
    closeAutocomplete,
    updateQuery,
    handleKeyDown,
    selectEntity,
    parseMentionTrigger
  } = useMentionAutocomplete(projectId);

  // Sync internal value with prop value
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Handle text change
  const handleTextChange = useCallback((event) => {
    const newValue = event.target.value;
    const cursor = event.target.selectionStart;
    
    setInternalValue(newValue);
    setCursorPosition(cursor);
    
    // Call parent onChange
    if (onChange) {
      onChange(event);
    }
    
    // Check for mention trigger
    const mentionInfo = parseMentionTrigger(newValue, cursor);
    
    if (mentionInfo.isMatch) {
      // Calculate autocomplete position
      const textField = textFieldRef.current;
      if (textField) {
        const textArea = textField.querySelector('textarea') || textField.querySelector('input');
        if (textArea) {
          // Get caret position coordinates
          const rect = textArea.getBoundingClientRect();
          const styles = window.getComputedStyle(textArea);
          const lineHeight = parseInt(styles.lineHeight, 10) || 20;
          
          // Estimate position (simplified - could be enhanced with more precise calculation)
          const lines = newValue.slice(0, cursor).split('\n').length;
          const top = rect.bottom + (lines - 1) * lineHeight;
          const left = rect.left;
          
          openAutocomplete(mentionInfo.query, mentionInfo.type, { top, left });
        }
      }
    } else {
      closeAutocomplete();
    }
  }, [onChange, parseMentionTrigger, openAutocomplete, closeAutocomplete]);

  // Handle cursor position changes
  const handleSelectionChange = useCallback((event) => {
    setCursorPosition(event.target.selectionStart);
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((event) => {
    const handled = handleKeyDown(event);
    if (handled) {
      return; // Autocomplete handled the event
    }
    
    // Handle other keyboard shortcuts here if needed
  }, [handleKeyDown]);

  // Handle entity selection from autocomplete
  const handleEntitySelect = useCallback((entity) => {
    const result = selectEntity(entity);
    if (result) {
      const { mentionString, navigationInfo } = result;
      
      // Find the current mention trigger in the text
      const mentionInfo = parseMentionTrigger(internalValue, cursorPosition);
      
      if (mentionInfo.isMatch) {
        // Replace the trigger with the mention
        const beforeMention = internalValue.slice(0, mentionInfo.startIndex);
        const afterMention = internalValue.slice(mentionInfo.endIndex);
        const newValue = beforeMention + mentionString + ' ' + afterMention;
        
        // Store mention metadata
        mentionDataRef.current.set(mentionString, {
          entity: result.entity,
          navigationInfo
        });
        
        setInternalValue(newValue);
        
        // Create synthetic event for parent component
        const syntheticEvent = {
          target: {
            value: newValue,
            name: textFieldRef.current?.querySelector('input, textarea')?.name || ''
          }
        };
        
        if (onChange) {
          onChange(syntheticEvent);
        }
        
        // Set cursor position after the mention
        setTimeout(() => {
          const newCursorPos = mentionInfo.startIndex + mentionString.length + 1;
          const textElement = textFieldRef.current?.querySelector('textarea') || textFieldRef.current?.querySelector('input');
          if (textElement) {
            textElement.setSelectionRange(newCursorPos, newCursorPos);
            setCursorPosition(newCursorPos);
          }
        }, 0);
      }
    }
  }, [selectEntity, internalValue, cursorPosition, onChange]);

  // Update query when user types in autocomplete
  const handleQueryUpdate = useCallback((newQuery) => {
    updateQuery(newQuery);
  }, [updateQuery]);

  // Get mention metadata for external use
  const getMentionMetadata = useCallback(() => {
    return Array.from(mentionDataRef.current.entries()).map(([mention, data]) => ({
      mention,
      ...data
    }));
  }, []);

  // Expose mention metadata through ref (for parent components)
  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.getMentionMetadata = getMentionMetadata;
    }
  }, [getMentionMetadata]);

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TextField
        ref={textFieldRef}
        value={internalValue}
        onChange={handleTextChange}
        onSelect={handleSelectionChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        disabled={disabled}
        error={error}
        helperText={helperText}
        label={label}
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        InputProps={{
          sx: {
            fontFamily: 'inherit',
            fontSize: 'inherit'
          }
        }}
      />
      
      {/* Mention Autocomplete Portal */}
      {isOpen && (
        <Portal>
          <MentionAutocomplete
            entities={entities}
            isLoading={isLoading}
            selectedIndex={selectedIndex}
            onSelect={handleEntitySelect}
            onClose={closeAutocomplete}
            position={position}
            query={query}
          />
        </Portal>
      )}
    </Box>
  );
};

export default SmartTextEditor;