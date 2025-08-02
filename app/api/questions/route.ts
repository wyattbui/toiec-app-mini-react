import { NextResponse } from 'next/server';
import config from '@/lib/config';

const API_BASE_URL = config.BE_SERVER;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const partId = searchParams.get('partId');

    if (!partId) {
      return NextResponse.json(
        { error: 'partId is required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/questions/part/${partId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
