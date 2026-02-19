import { NextRequest, NextResponse } from 'next/server';
import { explainConcept } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { concept } = await req.json();

    if (!concept) {
      return NextResponse.json({ error: 'Concept is required' }, { status: 400 });
    }

    const explanation = await explainConcept(concept);
    return NextResponse.json({ explanation });
  } catch (error: any) {
    console.error('AI Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to explain concept' }, { status: 500 });
  }
}
