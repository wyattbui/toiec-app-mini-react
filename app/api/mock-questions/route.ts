import { NextResponse } from 'next/server';

export async function GET() {
  const questions = [
    {
      id: 'q1',
      text: 'What does the man probably do?',
      options: ['He is a teacher', 'He is a waiter', 'He is a mechanic', 'He is a doctor'],
    },
    {
      id: 'q2',
      text: 'Where is the woman going?',
      options: ['To the office', 'To the bank', 'To the station', 'To the market'],
    },
    {
      id: 'q3',
      text: 'What time is the meeting?',
      options: ['8 AM', '9 AM', '10 AM', '11 AM'],
    },
  ];

  return NextResponse.json(questions);
}

