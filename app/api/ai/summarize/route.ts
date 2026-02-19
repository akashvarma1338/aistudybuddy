import { NextRequest, NextResponse } from 'next/server';
import { summarizeNotes } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { notes } = body;

    if (!notes) {
      return NextResponse.json({ error: 'Notes required' }, { status: 400 });
    }

    const summary = await summarizeNotes(notes);
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to summarize notes' }, { status: 500 });
  }
}
