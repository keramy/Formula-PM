import { useState, useEffect } from 'react';

/**
 * useDebounce - Debounces a value by the specified delay
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds (default: 300ms)
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before the delay
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;