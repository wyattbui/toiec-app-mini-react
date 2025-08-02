// components/SimpleHeader.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SimpleHeader() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header 
      style={{
        background: 'linear-gradient(to right, #14b8a6, #0d9488)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          🏠 TOEIC Mini
        </Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isAuthenticated ? (
          <>
            <span>Xin chào {user?.name}</span>
            <Link href="/admin" style={{ color: '#a7f3d0', textDecoration: 'none' }}>
              Admin
            </Link>
            <button 
              onClick={logout}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link href="/auth" style={{ color: '#a7f3d0', textDecoration: 'none' }}>
              Đăng nhập
            </Link>
            <Link href="/auth" style={{ color: '#a7f3d0', textDecoration: 'none' }}>
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
