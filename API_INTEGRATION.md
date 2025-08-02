# TOEIC API Integration

Tích hợp API với backend server tại port 3333 để lấy danh sách parts và câu hỏi TOEIC.

## Cấu trúc API mới

### 1. API Routes

#### `/api/parts` (GET)
- Lấy danh sách tất cả các parts TOEIC
- Kết nối với: `http://localhost:3333/api/parts`

#### `/api/questions` (GET)
- Lấy danh sách câu hỏi theo part
- Query parameters:
  - `partId` (required): ID của part
  - `limit` (optional, default: 10): Số câu hỏi trên trang
  - `offset` (optional, default: 0): Vị trí bắt đầu
- Kết nối với: `http://localhost:3333/api/questions`

### 2. Hooks

#### `useParts()`
```typescript
const { parts, loading, error, refetch } = useParts();
```

#### `useQuestions(partId, limit, offset)`
```typescript
const { questions, total, loading, error, refetch } = useQuestions('part1', 10, 0);
```

### 3. Components

#### `PartsList`
- Hiển thị danh sách các parts
- Props:
  - `onSelectPart`: Callback khi chọn part
  - `selectedPartId`: ID của part được chọn

#### `QuestionsList`
- Hiển thị danh sách câu hỏi của một part
- Props:
  - `partId`: ID của part
  - `onSelectQuestion`: Callback khi chọn câu hỏi
  - `selectedQuestionId`: ID của câu hỏi được chọn

### 4. Trang Demo

Truy cập `/admin` để xem demo tích hợp API với giao diện quản lý parts và câu hỏi.

## Cách sử dụng

1. Đảm bảo backend server đang chạy tại port 3333
2. Chạy Next.js app: `npm run dev`
3. Truy cập `http://localhost:3000/admin` để xem demo

## Types định nghĩa

### ToiecPart
```typescript
interface ToiecPart {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
}
```

### ToiecQuestion
```typescript
interface ToiecQuestion {
  id: string;
  partId: string;
  type: string;
  content: string;
  options?: string[];
  audioUrl?: string;
  imageUrl?: string;
  correctAnswer: string;
}
```

### QuestionsResponse
```typescript
interface QuestionsResponse {
  questions: ToiecQuestion[];
  total: number;
  limit: number;
  offset: number;
}
```

## API Client

Sử dụng `apiClient` từ `@/lib/fetcher`:

```typescript
import { apiClient } from '@/lib/fetcher';

// Lấy parts
const parts = await apiClient.getParts();

// Lấy câu hỏi
const questionsData = await apiClient.getQuestions('part1', 10, 0);
```
