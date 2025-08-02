// app/api/admin/questions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import config from '@/lib/config';

// GET /api/admin/questions - Get all questions or by part
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partId = searchParams.get('partId');
    
    let apiUrl = `${config.BE_SERVER}/questions`;
    if (partId) {
      apiUrl = `${config.BE_SERVER}/questions/part/${partId}`;
    }

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch questions' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Questions GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/questions - Create new question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get authorization header from frontend
    const authorization = request.headers.get('Authorization');
    
    const response = await fetch(`${config.BE_SERVER}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to create question' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Question POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
