import { NextRequest, NextResponse } from 'next/server';
import { generateFlashcards } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { topic, numCards } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const cards = await generateFlashcards(topic, numCards || 5);
    return NextResponse.json({ cards });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate flashcards' }, { status: 500 });
  }
}
