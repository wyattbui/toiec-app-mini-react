# Authentication System - TOEIC Mini

Hệ thống xác thực đầy đủ cho ứng dụng TOEIC Mini với các tính năng đăng nhập, đăng ký và reset mật khẩu.

## 🔐 **Tính năng Authentication**

### 1. **Đăng nhập** (`/auth/login`)
- Email và mật khẩu
- Validation form đầy đủ
- Lưu token và thông tin user
- Redirect về trang chủ sau khi đăng nhập thành công

### 2. **Đăng ký** (`/auth/signup`)
- Form đăng ký với họ tên, email, mật khẩu
- Xác nhận mật khẩu
- Validation mật khẩu mạnh (chữ hoa, chữ thường, số)
- Checkbox đồng ý điều khoản
- Redirect tới trang đăng nhập sau khi đăng ký

### 3. **Reset mật khẩu** (`/auth/reset-password`)
- **Bước 1:** Nhập email để nhận mã reset
- **Bước 2:** Nhập mã xác minh và mật khẩu mới  
- **Bước 3:** Hoàn thành và redirect tới đăng nhập
- UI với Steps component

### 4. **Trang Profile** (`/profile`)
- Hiển thị thông tin user
- Thống kê học tập
- Protected route (cần đăng nhập)

## 🏗️ **Kiến trúc**

### **Components**
- `Header.tsx` - Navigation bar với auth status
- `ProtectedRoute.tsx` - Bảo vệ routes cần auth
- Các auth pages: `login/`, `signup/`, `reset-password/`

### **Context & Hooks**
- `AuthContext.tsx` - Quản lý auth state global
- `useAuth()` - Hook để sử dụng auth context

### **API Layer**
- `lib/auth.ts` - Các functions API cho authentication
- Tất cả API calls tới backend tại `http://localhost:3333`

### **Types**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
```

## 🔗 **API Endpoints**

Backend cần implement các endpoints sau:

```bash
POST /auth/login          # Đăng nhập
POST /auth/signup         # Đăng ký  
POST /auth/forgot-password # Gửi email reset
POST /auth/reset-password  # Reset mật khẩu với mã
POST /auth/logout         # Đăng xuất
GET  /auth/me            # Lấy thông tin user hiện tại
POST /auth/refresh       # Refresh token
```

## 🎨 **UI/UX Features**

- **Responsive Design** - Mobile-first approach
- **Loading States** - Spinner khi đang xử lý
- **Error Handling** - Hiển thị lỗi thân thiện
- **Success Messages** - Thông báo thành công
- **Form Validation** - Real-time validation
- **Password Strength** - Yêu cầu mật khẩu mạnh
- **Steps UI** - Wizard cho reset password

## 🚀 **Cách sử dụng**

### **Đăng nhập/Đăng ký**
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Xin chào, {user?.name}!</div>;
  }
  
  return <div>Vui lòng đăng nhập</div>;
}
```

### **Protected Routes**
```typescript
import ProtectedRoute from '@/components/ProtectedRoute';

function MyProtectedPage() {
  return (
    <ProtectedRoute>
      <div>Nội dung chỉ user đã đăng nhập mới thấy</div>
    </ProtectedRoute>
  );
}
```

### **API Calls**
```typescript
import { authAPI } from '@/lib/auth';

// Đăng nhập
const result = await authAPI.login({ email, password });

// Đăng ký
await authAPI.signup({ name, email, password });

// Reset password
await authAPI.forgotPassword(email);
await authAPI.resetPassword({ email, code, newPassword });
```

## 📱 **Navigation**

- Header hiển thị khác nhau cho user đã/chưa đăng nhập
- Dropdown menu cho user đã đăng nhập (Profile, Settings, Logout)
- Links tới Login/Signup cho user chưa đăng nhập

## 🔒 **Security**

- JWT token lưu trong localStorage
- Protected routes kiểm tra authentication
- API calls có Authorization header
- Form validation phía client
- Password requirements mạnh

## 🎯 **Testing**

Để test authentication system:

1. **Đăng ký tài khoản mới** tại `/auth/signup`
2. **Đăng nhập** tại `/auth/login`  
3. **Kiểm tra profile** tại `/profile`
4. **Test reset password** tại `/auth/reset-password`
5. **Đăng xuất** từ header dropdown

## 📋 **TODO**

- [ ] Remember me checkbox
- [ ] Social login (Google, Facebook)
- [ ] Email verification
- [ ] Two-factor authentication
- [ ] Password change trong profile
- [ ] User settings page
- [ ] Admin roles

Hệ thống authentication đã sẵn sàng sử dụng với backend API tại port 3333!
