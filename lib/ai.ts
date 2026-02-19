import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY environment variable is required');
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function explainConcept(concept: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `Explain this concept in simple terms for a student: ${concept}` }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    max_tokens: 500,
  });
  return completion.choices[0]?.message?.content || 'Unable to generate response';
}

export async function summarizeNotes(notes: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: `Summarize these study notes into key points: ${notes}` }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.5,
    max_tokens: 400,
  });
  return completion.choices[0]?.message?.content || 'Unable to generate response';
}

interface Question {
  question: string;
  options: string[];
  correct: number;
}

export async function generateQuiz(topic: string, numQuestions: number = 5): Promise<Question[]> {
  const completion = await groq.chat.completions.create({
    messages: [{ 
      role: 'user', 
      content: `Generate ${numQuestions} multiple-choice quiz questions about ${topic}. Return ONLY a JSON array with this exact format:
[{"question": "question text", "options": ["option1", "option2", "option3", "option4"], "correct": 0}]
The "correct" field should be the index (0-3) of the correct answer. Do not include any other text.` 
    }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.8,
    max_tokens: 800,
  });
  
  const content = completion.choices[0]?.message?.content || '[]';
  try {
    return JSON.parse(content);
  } catch {
    // Fallback if JSON parsing fails
    return [{
      question: "Unable to generate quiz questions",
      options: ["Please try again", "Check your topic", "Ensure good connection", "Contact support"],
      correct: 0
    }];
  }
}

interface Flashcard {
  front: string;
  back: string;
}

export async function generateFlashcards(topic: string, numCards: number = 5): Promise<Flashcard[]> {
  const completion = await groq.chat.completions.create({
    messages: [{ 
      role: 'user', 
      content: `Create ${numCards} flashcards about ${topic}. Return ONLY a JSON array with this exact format:
[{"front": "question or term", "back": "answer or definition"}]
Do not include any other text.` 
    }],
    model: 'llama-3.1-8b-instant',
    temperature: 0.7,
    max_tokens: 600,
  });
  
  const content = completion.choices[0]?.message?.content || '[]';
  try {
    return JSON.parse(content);
  } catch {
    return [{
      front: "Unable to generate flashcards",
      back: "Please try again with a different topic"
    }];
  }
}
