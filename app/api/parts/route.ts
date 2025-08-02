import { NextResponse } from 'next/server';
import config from '@/lib/config';

const API_BASE_URL = config.BE_SERVER;

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/partca`, {
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
    console.error('Error fetching parts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parts' },
      { status: 500 }
    );
  }
}
