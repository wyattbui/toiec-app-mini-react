// lib/config.ts

// Function to get dynamic config from localStorage
const getDynamicConfig = () => {
  if (typeof window !== 'undefined') {
    try {
      const savedConfig = localStorage.getItem('app_config');
      return savedConfig ? JSON.parse(savedConfig) : {};
    } catch (error) {
      console.error('Error parsing saved config:', error);
      return {};
    }
  }
  return {};
};

export const config = {
  // Backend server configuration with dynamic override
  get BE_SERVER() {
    const dynamicConfig = getDynamicConfig();
    return dynamicConfig.BE_SERVER || process.env.NEXT_PUBLIC_BE_SERVER || 'http://localhost:3333';
  },
  
  // Other app configurations
  APP_NAME: 'TOEIC Mini',
  APP_VERSION: '1.0.0',
  
  // API endpoints
  API_ENDPOINTS: {
    PARTS: '/parts',
    QUESTIONS: '/questions',
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup', 
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    }
  }
};

export default config;
