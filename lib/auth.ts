// lib/auth.ts
import config from './config';

const API_BASE_URL = config.BE_SERVER;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
  message?: string;
}

export const authAPI = {
  // Đăng nhập
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng nhập thất bại');
    }

    return response.json();
  },

  // Đăng ký
  signup: async (data: SignupData): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng ký thất bại');
    }

    return response.json();
  },

  // Quên mật khẩu - gửi email
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Không thể gửi email reset');
    }

    return response.json();
  },

  // Reset mật khẩu
  resetPassword: async (data: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Reset mật khẩu thất bại');
    }

    return response.json();
  },

  // Đăng xuất
  logout: async (token: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Đăng xuất thất bại');
    }

    return response.json();
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (token: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Không thể lấy thông tin user');
    }

    return response.json();
  },

  // Refresh token
  refreshToken: async (token: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Không thể refresh token');
    }

    return response.json();
  },
};
