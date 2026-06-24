'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for API calls with loading, error, and data states
 * @param apiFunc - The API function to call
 * @param immediate - Whether to call the API immediately on mount
 */
export function useApiCall<T>(
  apiFunc: () => Promise<T>,
  immediate: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('API call failed');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return { data, loading, error, execute, setData };
}

/**
 * Custom hook for managing a list of items with API calls
 */
export function useApiList<T>(
  apiFunc: () => Promise<{ items?: T[] }>,
  immediate: boolean = true
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunc();
      setItems(response.items || []);
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load items');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunc]);

  useEffect(() => {
    if (immediate) {
      load();
    }
  }, [immediate, load]);

  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item]);
  }, []);

  const updateItem = useCallback((index: number, item: T) => {
    setItems(prev => {
      const newItems = [...prev];
      newItems[index] = item;
      return newItems;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  return {
    items,
    setItems,
    loading,
    error,
    load,
    addItem,
    updateItem,
    removeItem,
  };
}

/**
 * Custom hook for toggle states
 */
export function useToggle(initialValue: boolean = false) {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return { value, setValue, toggle, setTrue, setFalse };
}

/**
 * Custom hook for managing selected items
 */
export function useSelection<T>(items: T[], key: keyof T) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSelection = useCallback((item: T) => {
    const itemKey = String(item[key]);
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      return newSet;
    });
  }, [key]);

  const selectAll = useCallback(() => {
    setSelected(new Set(items.map(item => String(item[key]))));
  }, [items, key]);

  const clearSelection = useCallback(() => {
    setSelected(new Set());
  }, []);

  const isSelected = useCallback((item: T) => {
    return selected.has(String(item[key]));
  }, [selected, key]);

  const selectedCount = selected.size;
  const allSelected = items.length > 0 && selectedCount === items.length;
  const someSelected = selectedCount > 0 && selectedCount < items.length;

  return {
    selected,
    selectedCount,
    allSelected,
    someSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    isSelected,
  };
}

/**
 * Custom hook for local storage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

/**
 * Custom hook for debounced values
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for interval timers
 */
export function useInterval(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;

    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
}
