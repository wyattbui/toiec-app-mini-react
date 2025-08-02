This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔄 API Integration Status

### ✅ Completed API Routes

#### Parts Management
- **GET /api/parts** → Backend: `GET /questions/parts`
  - Fallback to mock 7 TOEIC parts if backend fails
  - Always ensures dropdown has data

#### Questions Management (Admin)
- **GET /api/admin/questions?partId=X** → Backend: `GET /questions/part/:partId`
- **POST /api/admin/questions** → Backend: `POST /questions` (Auth Required)
- **PATCH /api/admin/questions/:id** → Backend: `PATCH /questions/:id` (Auth Required)  
- **DELETE /api/admin/questions/:id** → Backend: `DELETE /questions/:id` (Auth Required)

#### File Upload (Admin)
- **POST /api/admin/upload** → Backend: `POST /questions/upload` (Auth Required)
  - Supports image and audio files
  - FormData with Bearer token

### 🔐 Authentication Integration
- JWT token passed via `Authorization: Bearer <token>` header
- Token stored in localStorage via AuthContext
- Automatic token validation and expiry handling

### 🧪 Testing
- Admin test page: `http://localhost:3000/admin/test-api`
- Live API testing with token authentication
- Real-time response monitoring
