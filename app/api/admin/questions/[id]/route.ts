// app/api/admin/questions/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import config from '@/lib/config';

// PATCH /api/admin/questions/[id] - Update question
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const questionId = params.id;
    
    // Get authorization header from frontend
    const authorization = request.headers.get('Authorization');
    
    const response = await fetch(`${config.BE_SERVER}/questions/${questionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to update question' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Question PATCH error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/questions/[id] - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    
    // Get authorization header from frontend
    const authorization = request.headers.get('Authorization');
    
    const response = await fetch(`${config.BE_SERVER}/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization && { 'Authorization': authorization }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete question' },
        { status: response.status }
      );
    }

    // Return success response
    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Question DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/admin/questions/[id] - Get single question
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionId = params.id;
    
    const response = await fetch(`${config.BE_SERVER}/questions/${questionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch question' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Question GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
