import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { topic, numQuestions } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const questions = await generateQuiz(topic, numQuestions || 5);
    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate quiz' }, { status: 500 });
  }
}
