'use client';

import { useState, useEffect } from 'react';
import { BookOpen, FileText, Brain, Sparkles, History, LogIn, LogOut } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { saveToHistory, getHistory } from '@/lib/history';
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
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const data = await getHistory();
        setHistory(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  const handleSignOut = () => signOut(auth);



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
        await saveToHistory('quiz', input, data.questions);
      } else if (activeTab === 'flashcards') {
        setFlashcards(data.cards || []);
        await saveToHistory('flashcards', input, data.cards);
      } else {
        const resultText = data.explanation || data.summary;
        setResult(resultText);
        await saveToHistory(activeTab, input, resultText);
      }
      const updated = await getHistory();
      setHistory(updated);
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

  const loadHistoryItem = (item: any) => {
    setActiveTab(item.type);
    setInput(item.input);
    if (item.type === 'quiz') {
      setQuizQuestions(item.output);
    } else if (item.type === 'flashcards') {
      setFlashcards(item.output);
    } else {
      setResult(item.output);
    }
  };

  const tabs = [
    { id: 'explain', label: 'Explain Concept', icon: Brain },
    { id: 'summarize', label: 'Summarize Notes', icon: FileText },
    { id: 'quiz', label: 'Generate Quiz', icon: BookOpen },
    { id: 'flashcards', label: 'Flashcards', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">AI Study Buddy</h1>
          {user ? (
            <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              <LogOut size={18} /> Sign Out
            </button>
          ) : (
            <button onClick={handleSignIn} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              <LogIn size={18} /> Sign In
            </button>
          )}
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
                    setInput('');
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

          {activeTab === 'history' ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Your History</h2>
              {!user ? (
                <p className="text-gray-600">Please sign in to view history</p>
              ) : history.length === 0 ? (
                <p className="text-gray-600">No history yet</p>
              ) : (
                <div className="space-y-4">
                  {history.map((item: any) => (
                    <div key={item.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => loadHistoryItem(item)}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-indigo-600 capitalize">{item.type}</span>
                        <span className="text-sm text-gray-500">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2"><strong>Input:</strong> {item.input}</p>
                      <p className="text-sm text-gray-600"><strong>Output:</strong> {typeof item.output === 'string' ? item.output.substring(0, 150) + '...' : JSON.stringify(item.output).substring(0, 150) + '...'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'quiz' && quizQuestions.length > 0 ? (
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
