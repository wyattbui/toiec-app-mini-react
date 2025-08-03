import { NextResponse } from 'next/server';
import config from '@/lib/config';

const API_BASE_URL = config.BE_SERVER;

export async function GET() {
  try {
    // API endpoint để lấy danh sách tất cả parts TOEIC
    const apiUrl = `${API_BASE_URL}/questions/parts`;
    
    console.log('Fetching parts from:', apiUrl);

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
    const parts = Array.isArray(data) ? data : (data.parts || data.data || []);
    
    // Transform to match expected ToiecPart interface
    const formattedParts = parts.map((part: any) => ({
      id: part.id || part.partId,
      partNumber: part.partNumber || part.number,
      name: part.name || part.title,
      description: part.description || '',
      skillType: part.skillType || (part.partNumber <= 4 ? 'LISTENING' : 'READING'),
      totalQuestions: part.totalQuestions || 0
    }));

    return NextResponse.json(formattedParts);
  } catch (error) {
    console.error('Error fetching parts:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch parts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
