import { NextResponse } from 'next/server';
import config from '@/lib/config';

const API_BASE_URL = config.BE_SERVER;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { partId, title, description, questionCount, timeLimit, difficulty } = body;
    
    // Get token from Authorization header
    const authorization = request.headers.get('authorization');
    const token = authorization?.replace('Bearer ', '');

    if (!partId) {
      return NextResponse.json(
        { error: 'partId is required' },
        { status: 400 }
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication token is required' },
        { status: 401 }
      );
    }

    // API endpoint theo documentation: /questions/test-sets/generate
    const response = await fetch(`${API_BASE_URL}/questions/test-sets/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify({
        partId,
        title: title || `Practice Test Part ${partId}`,
        description: description || `Practice test for Part ${partId}`,
        questionCount: questionCount || 10,
        timeLimit: timeLimit || 300,
        difficulty: difficulty || 'easy'
      }),
    });

    console.log('Generating test set with body:', {
      partId,
      title,
      description,
      questionCount,
      timeLimit,
      difficulty
    });
    console.log('API URL:', `${API_BASE_URL}/questions/test-sets/generate`);
    console.log('Authorization header:', authorization);
    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error: ${response.status} ${response.statusText}`);
      console.error('Error response body:', errorText);
      
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        // Keep the default error message if response is not JSON
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating test set:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate test set',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
