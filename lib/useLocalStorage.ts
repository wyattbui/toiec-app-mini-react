// lib/useLocalStorage.ts
'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State để lưu trữ giá trị
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Lấy từ localStorage khi component mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
        setIsLoaded(true);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      setIsLoaded(true);
    }
  }, [key]);

  // Return wrapped version của setter function để persist vào localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Cho phép value là function để có API giống useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Lưu vào state
      setStoredValue(valueToStore);
      
      // Lưu vào localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        console.log(`localStorage: Saved ${key}`, valueToStore);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        console.log(`localStorage: Removed ${key}`);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue, isLoaded] as const;
}
