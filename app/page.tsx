'use client';

import { useState } from 'react';
import { BookOpen, FileText, Brain, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import QuizComponent from '@/components/QuizComponent';
import FlashcardComponent from '@/components/FlashcardComponent';

interface Question {
  question: string;
  options: string[];
  correct: number;
}

interface Flashcard {
  front: string;
  back: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('explain');
  const [input, setInput] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [result, setResult] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult('');
    setQuizQuestions([]);
    setFlashcards([]);

    try {
      let endpoint = '';
      let body: any = {};

      switch (activeTab) {
        case 'explain':
          endpoint = '/api/ai/explain';
          body = { concept: input };
          break;
        case 'summarize':
          endpoint = '/api/ai/summarize';
          body = { notes: input };
          break;
        case 'quiz':
          endpoint = '/api/ai/quiz';
          body = { topic: input, numQuestions };
          break;
        case 'flashcards':
          endpoint = '/api/ai/flashcards';
          body = { topic: input, numCards: numQuestions };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (activeTab === 'quiz') {
        setQuizQuestions(data.questions || []);
      } else if (activeTab === 'flashcards') {
        setFlashcards(data.cards || []);
      } else {
        const resultText = data.explanation || data.summary;
        setResult(resultText);
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizRestart = () => {
    setQuizQuestions([]);
    setInput('');
  };

  const handleFlashcardRestart = () => {
    setFlashcards([]);
    setInput('');
  };

  const tabs = [
    { id: 'explain', label: 'Explain Concept', icon: Brain },
    { id: 'summarize', label: 'Summarize Notes', icon: FileText },
    { id: 'quiz', label: 'Generate Quiz', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">AI Study Buddy</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setResult('');
                    setQuizQuestions([]);
                    setFlashcards([]);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === 'quiz' && quizQuestions.length > 0 ? (
            <QuizComponent questions={quizQuestions} onRestart={handleQuizRestart} />
          ) : activeTab === 'flashcards' && flashcards.length > 0 ? (
            <FlashcardComponent cards={flashcards} onRestart={handleFlashcardRestart} />
          ) : (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'explain' && 'Enter a concept to explain'}
                    {activeTab === 'summarize' && 'Paste your notes'}
                    {activeTab === 'quiz' && 'Enter a topic for quiz'}
                    {activeTab === 'flashcards' && 'Enter a topic for flashcards'}
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    rows={6}
                    placeholder={
                      activeTab === 'explain'
                        ? 'e.g., Photosynthesis'
                        : activeTab === 'summarize'
                        ? 'Paste your study notes here...'
                        : 'e.g., World War II'
                    }

                  />
                </div>

                {(activeTab === 'quiz' || activeTab === 'flashcards') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of {activeTab === 'quiz' ? 'Questions' : 'Cards'}
                    </label>
                    <input
                      type="number"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                      min="1"
                      max="10"
                      className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading || !input.trim()}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? 'Processing...' : 'Generate'}
                </button>
              </div>

              {result && (
                <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Result:</h3>
                  <div className="prose max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
