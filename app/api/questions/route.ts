import { NextResponse } from 'next/server';
import config from '@/lib/config';

const API_BASE_URL = config.BE_SERVER;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partId = searchParams.get('partId');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    if (!partId) {
      return NextResponse.json(
        { error: 'partId is required' },
        { status: 400 }
      );
    }

    // API endpoint cho việc lấy câu hỏi theo part với pagination
    const apiUrl = `${API_BASE_URL}/questions/part/${partId}?limit=${limit}&offset=${offset}`;
    
    console.log('Fetching questions from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure consistent response format
    const formattedResponse = {
      questions: Array.isArray(data) ? data : (data.questions || data.data || []),
      total: data.total || (Array.isArray(data) ? data.length : 0),
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch questions',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
