// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { parseJWT, isTokenExpired, extractUserFromToken } from '@/lib/jwt';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  isHydrated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  
  // Sử dụng custom hook để quản lý localStorage
  const [storedToken, setStoredToken, removeStoredToken, tokenLoaded] = useLocalStorage<string | null>('token', null);
  const [storedUser, setStoredUser, removeStoredUser, userLoaded] = useLocalStorage<User | null>('user', null);
  
  // Local state
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Function để clear auth và redirect về login
  const clearAuthAndRedirect = () => {
    console.log('AuthContext: Clearing auth and redirecting to login');
    setToken(null);
    setUser(null);
    removeStoredToken();
    removeStoredUser();
    router.push('/auth/login');
  };

  // Function để validate và restore token
  const validateAndRestoreToken = (tokenToCheck: string) => {
    console.log('AuthContext: Validating token...');
    
    // Kiểm tra token có hết hạn không
    if (isTokenExpired(tokenToCheck)) {
      console.log('AuthContext: Token expired, clearing auth');
      clearAuthAndRedirect();
      return false;
    }

    // Extract user từ token nếu không có stored user
    let userToSet = storedUser;
    if (!userToSet) {
      console.log('AuthContext: No stored user, extracting from token');
      userToSet = extractUserFromToken(tokenToCheck);
      if (userToSet) {
        setStoredUser(userToSet); // Lưu user vào localStorage
      }
    }

    // Set state
    setToken(tokenToCheck);
    setUser(userToSet);
    
    console.log('AuthContext: Token validated and restored', {
      hasUser: !!userToSet,
      userName: userToSet?.name
    });
    
    return true;
  };

  // Khi localStorage data loaded, cập nhật local state
  useEffect(() => {
    if (tokenLoaded && userLoaded) {
      console.log('AuthContext: LocalStorage loaded', { 
        storedToken: storedToken ? storedToken.substring(0, 30) + '...' : null, 
        storedUser,
        tokenLoaded,
        userLoaded
      });
      
      setIsHydrated(true);
      
      if (storedToken) {
        // Validate token và restore state
        validateAndRestoreToken(storedToken);
      } else {
        console.log('AuthContext: No stored token found');
      }
    }
  }, [tokenLoaded, userLoaded, storedToken, storedUser]);

  // Effect để check token expiry periodically
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiry = () => {
      if (isTokenExpired(token)) {
        console.log('AuthContext: Token expired during session, logging out');
        clearAuthAndRedirect();
      }
    };

    // Check mỗi 60 giây
    const interval = setInterval(checkTokenExpiry, 60000);
    
    // Check ngay lập tức
    checkTokenExpiry();

    return () => clearInterval(interval);
  }, [token]);

  const login = (newToken: string, newUser?: User) => {
    console.log('AuthContext: Logging in user', newUser);
    
    // Kiểm tra token có hết hạn không
    if (isTokenExpired(newToken)) {
      console.error('AuthContext: Cannot login with expired token');
      clearAuthAndRedirect();
      return;
    }

    // Nếu không có user, extract từ token
    let userToSet = newUser;
    if (!userToSet) {
      console.log('AuthContext: No user provided, extracting from token');
      const extractedUser = extractUserFromToken(newToken);
      if (extractedUser) {
        userToSet = extractedUser;
      }
    }

    if (!userToSet) {
      console.error('AuthContext: Cannot extract user from token');
      return;
    }
    
    // Cập nhật local state
    setToken(newToken);
    setUser(userToSet);
    
    // Lưu vào localStorage qua custom hook
    setStoredToken(newToken);
    setStoredUser(userToSet);
    
    console.log('AuthContext: Login complete', userToSet);
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    
    // Clear local state
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    removeStoredToken();
    removeStoredUser();
    
    console.log('AuthContext: Logout complete');
  };

  // Chỉ cần token để authenticated
  const isAuthenticated = !!token;
  
  const loading = !tokenLoaded || !userLoaded;

  // Debug log để theo dõi trạng thái
  console.log('AuthContext: Current state', {
    token: token ? token.substring(0, 20) + '...' : null,
    user: user?.name || null,
    isAuthenticated,
    loading,
    isHydrated,
    tokenLoaded,
    userLoaded
  });

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
    isHydrated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
