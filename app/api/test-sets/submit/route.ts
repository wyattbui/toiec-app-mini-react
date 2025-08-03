import { NextResponse } from 'next/server';
import config from '@/lib/config';

const API_BASE_URL = config.BE_SERVER;

// Submit test set
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testSetId, answers } = body;
    
    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    const token = authorization?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    if (!testSetId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'testSetId and answers array are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/questions/test-sets/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        testSetId,
        answers
      }),
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error submitting test set:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit test set',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
