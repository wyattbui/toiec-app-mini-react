import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const part = searchParams.get('part') || '1';

  // Fake data theo từng part
  const data = {
    '1': [{ id: 'p1-q1', text: 'Hình gì đây?', imageUrl: '/img.jpg', options: ['A', 'B', 'C', 'D'] }],
    '2': [{ id: 'p2-q1', text: 'Nghe và chọn đúng', audioUrl: '/audio.mp3', options: ['Yes', 'No', 'Maybe', 'What?'] }],
  };

  return NextResponse.json(data[part as keyof typeof data] || []);
}

