// lib/useConfig.ts
'use client';

import { useState, useEffect } from 'react';

interface AppConfig {
  BE_SERVER: string;
  API_TIMEOUT: number;
  DEBUG_MODE: boolean;
}

const defaultConfig: AppConfig = {
  BE_SERVER: process.env.NEXT_PUBLIC_BE_SERVER || 'http://localhost:3333',
  API_TIMEOUT: 10000,
  DEBUG_MODE: false
};

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig>(defaultConfig);

  useEffect(() => {
    // Load config from localStorage
    try {
      const savedConfig = localStorage.getItem('app_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }

    // Listen for storage changes (when config updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setConfig(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Error parsing updated config:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('app_config', JSON.stringify(updatedConfig));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem('app_config');
  };

  return {
    config,
    updateConfig,
    resetConfig
  };
};
