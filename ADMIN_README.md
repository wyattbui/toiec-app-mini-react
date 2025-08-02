# TOEIC Mini - Hệ thống quản trị Admin

## 🎯 Tổng quan

Hệ thống admin của TOEIC Mini cung cấp các tính năng quản lý toàn diện cho việc vận hành website luyện thi TOEIC.

## 🔐 Truy cập Admin

### Đăng nhập
1. Truy cập trang chủ: `http://localhost:3000`
2. Đăng nhập với tài khoản có quyền admin
3. Sau khi đăng nhập, click vào menu user và chọn **"Quản trị hệ thống"**

### Đường dẫn trực tiếp
- Admin Dashboard: `/admin`
- Quản lý câu hỏi: `/admin/questions`
- Thống kê: `/admin/statistics`
- Quản lý người dùng: `/admin/users`
- Cấu hình hệ thống: `/env`

## 📊 Chức năng Admin

### 1. Dashboard (`/admin`)
- Tổng quan hệ thống
- Thao tác nhanh
- Navigation đến các tính năng chính
- Hiển thị thông tin admin đang đăng nhập

### 2. Quản lý câu hỏi (`/admin/questions`)
✅ **Đã hoàn thành:**
- **Xem danh sách câu hỏi** theo Part
- **Tạo câu hỏi mới** với đầy đủ thông tin:
  - Nội dung câu hỏi
  - Loại câu hỏi (Multiple Choice, Fill in the blank, v.v.)
  - Độ khó (Easy, Medium, Hard)
  - 4 lựa chọn (A, B, C, D)
  - Đáp án đúng
  - Giải thích
  - Audio URL (tùy chọn)
  - Image URL (tùy chọn)
  - Passage Text & Title (tùy chọn)
- **Chỉnh sửa câu hỏi** có sẵn
- **Xóa câu hỏi** với xác nhận
- **Tìm kiếm câu hỏi** theo nội dung, loại, độ khó
- **Lọc theo Part**

### 3. Thống kê & Báo cáo (`/admin/statistics`)
🔄 **Đang phát triển:**
- Thống kê tổng quan (số câu hỏi, Parts, users, lượt thi)
- Biểu đồ chi tiết (sẽ phát triển)
- Phân tích xu hướng (sẽ phát triển)

*Lưu ý: TOEIC có 7 Parts cố định (Part 1-7) nên không cần tính năng quản lý Parts*

### 4. Quản lý người dùng (`/admin/users`)
🔄 **Mock data:**
- Danh sách người dùng
- Thông tin vai trò (Admin/User)
- Trạng thái hoạt động
- Tìm kiếm người dùng
- Quản lý chi tiết (sẽ phát triển)

### 5. Cấu hình hệ thống (`/env`)
✅ **Hoàn thành:**
- Thay đổi Backend Server URL
- Cấu hình API Timeout
- Bật/tắt Debug Mode
- Test kết nối server
- Reset về cấu hình mặc định
- Lưu cấu hình trong localStorage

## 🛠️ API Admin

### Endpoints đã triển khai:

#### Questions API
- `GET /api/admin/questions?partId={id}` - Lấy danh sách câu hỏi
- `POST /api/admin/questions` - Tạo câu hỏi mới
- `GET /api/admin/questions/{id}` - Lấy chi tiết câu hỏi
- `PUT /api/admin/questions/{id}` - Cập nhật câu hỏi
- `DELETE /api/admin/questions/{id}` - Xóa câu hỏi

#### Parts API
- `GET /api/parts` - Lấy danh sách 7 Parts TOEIC (chỉ đọc)

## 💾 Cấu trúc dữ liệu

### Question Object
```typescript
{
  id: number;
  partId: number;
  questionText: string;
  questionType: string; // "Multiple Choice", "Fill in the blank"
  difficulty: string;   // "Easy", "Medium", "Hard"
  explanation: string;
  audioUrl?: string;
  imageUrl?: string;
  passageText?: string;
  passageTitle?: string;
  options: Option[];    // 4 lựa chọn A, B, C, D
}
```

### Option Object
```typescript
{
  id: number;
  questionId: number;
  optionLetter: string; // "A", "B", "C", "D"
  optionText: string;
  isCorrect: boolean;
}
```

## 🔧 Cài đặt và Chạy

### Development
```bash
npm run dev
# Truy cập: http://localhost:3000
```

### Cấu hình Backend
1. Truy cập `/env` để cấu hình Backend Server URL
2. Test kết nối trước khi sử dụng
3. Mặc định: `http://localhost:8000` (có thể thay đổi trong `.env.local`)

## 🎨 Giao diện

### Theme & Design
- **Responsive**: Hoạt động tốt trên mobile/tablet/desktop
- **Modern UI**: Sử dụng Ant Design + Tailwind CSS
- **Color Scheme**: Gradient với màu sắc đa dạng cho từng trang
- **Icons**: Ant Design Icons với emoji cho friendly UX

### Layout
- **Fixed Header**: Navigation luôn hiển thị
- **Proper Spacing**: `page-content` class để tránh bị che header
- **Card Design**: Mỗi section được wrap trong Card với shadow
- **Button Actions**: Đầy đủ icons và loading states

## 🛡️ Bảo mật

### Authentication
- Kiểm tra trạng thái đăng nhập qua AuthContext
- JWT token được lưu trong localStorage
- Auto logout khi token hết hạn
- Redirect về login nếu chưa đăng nhập

### Authorization (Cần phát triển)
- Hiện tại: Tất cả user đăng nhập đều có thể truy cập admin
- Tương lai: Kiểm tra role admin trong JWT token

## 📋 TODO List

### Ưu tiên cao
- [ ] Xác thực quyền admin (role-based access)
- [ ] API thực tế cho Parts CRUD
- [ ] API thực tế cho Users management
- [ ] Biểu đồ thống kê chi tiết

### Ưu tiên trung bình
- [ ] Upload file audio/image cho câu hỏi
- [ ] Bulk import/export câu hỏi
- [ ] Quản lý tags/categories cho câu hỏi
- [ ] Log audit cho các thao tác admin

### Ưu tiên thấp
- [ ] Dark mode theme
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Real-time notifications

## 🐛 Debugging

### Environment Settings
- Truy cập `/env` để bật Debug Mode
- Check browser console cho logs chi tiết
- Sử dụng Network tab để debug API calls

### Common Issues
1. **API Connection**: Test connection tại `/env`
2. **Auth Issues**: Check localStorage có token không
3. **CORS Issues**: Đảm bảo backend cho phép origin từ frontend

## 📞 Hỗ trợ

Nếu gặp vấn đề với hệ thống admin, vui lòng:
1. Check console log
2. Test API connection
3. Verify authentication status
4. Check backend server status

---

**Phiên bản:** 1.0.0  
**Cập nhật:** Tháng 8, 2025
