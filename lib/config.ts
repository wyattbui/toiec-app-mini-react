// lib/config.ts
export const config = {
  // Backend server configuration
  BE_SERVER: process.env.NEXT_PUBLIC_BE_SERVER || 'http://localhost:3333',
  
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
