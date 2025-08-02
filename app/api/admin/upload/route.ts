// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import config from '@/lib/config';

// POST /api/admin/upload - Upload files (image/audio)
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Get authorization header from frontend
    const authorization = request.headers.get('Authorization');
    
    const response = await fetch(`${config.BE_SERVER}/questions/upload`, {
      method: 'POST',
      headers: {
        ...(authorization && { 'Authorization': authorization }),
        // Don't set Content-Type for FormData, let fetch set it automatically
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to upload files' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
