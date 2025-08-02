// lib/jwt.ts
export interface JWTPayload {
  id?: string;
  sub?: string;
  name?: string;
  username?: string;
  email?: string;
  exp?: number;
  iat?: number;
  [key: string]: any;
}

export function parseJWT(token: string): JWTPayload | null {
  try {
    // JWT có format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid JWT format');
      return null;
    }

    // Decode payload (part thứ 2)
    const payload = parts[1];
    
    // Thêm padding nếu cần
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode base64
    const decodedPayload = atob(paddedPayload);
    
    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload);
    
    console.log('JWT parsed:', parsedPayload);
    return parsedPayload;
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = parseJWT(token);
    if (!payload || !payload.exp) {
      // Nếu không có exp, coi như token không hết hạn
      return false;
    }

    // exp là timestamp (giây), Date.now() là milliseconds
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    console.log('Token expiry check:', {
      exp: payload.exp,
      current: currentTime,
      isExpired,
      timeLeft: payload.exp - currentTime
    });
    
    return isExpired;
  } catch (error) {
    console.error('Error checking token expiry:', error);
    return true; // Nếu có lỗi, coi như token đã hết hạn
  }
}

export function extractUserFromToken(token: string): { id: string; name: string; email: string } | null {
  try {
    const payload = parseJWT(token);
    if (!payload) return null;

    // Tạo user object từ token payload
    const user = {
      id: payload.id || payload.sub || payload.user_id || 'unknown',
      name: payload.name || payload.username || payload.display_name || extractNameFromEmail(payload.email) || 'User',
      email: payload.email || payload.username || 'unknown@example.com'
    };

    console.log('User extracted from token:', user);
    return user;
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
}

// Helper function để extract name từ email
function extractNameFromEmail(email?: string): string | null {
  if (!email) return null;
  const localPart = email.split('@')[0];
  return localPart.charAt(0).toUpperCase() + localPart.slice(1);
}
