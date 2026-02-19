'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, RotateCw } from 'lucide-react';

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardComponentProps {
  cards: Flashcard[];
  onRestart: () => void;
}

export default function FlashcardComponent({ cards, onRestart }: FlashcardComponentProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No flashcards available</p>
      </div>
    );
  }

  const card = cards[currentCard];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Card {currentCard + 1} of {cards.length}
        </div>
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 ml-4">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCard + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative">
        <div
          className="bg-white border-2 border-gray-200 rounded-xl p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={handleFlip}
        >
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-4">
              {isFlipped ? card.back : card.front}
            </div>
            <div className="text-sm text-gray-500">
              {isFlipped ? 'Answer' : 'Question'} • Click to flip
            </div>
          </div>
        </div>
        
        <button
          onClick={handleFlip}
          className="absolute top-4 right-4 p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition-colors"
        >
          <RotateCw size={16} />
        </button>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentCard === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <RotateCw size={18} />
          Flip Card
        </button>

        <button
          onClick={handleNext}
          disabled={currentCard === cards.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>

      {currentCard === cards.length - 1 && (
        <div className="text-center pt-4 border-t">
          <p className="text-gray-600 mb-4">You've reached the last card!</p>
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <RotateCcw size={18} />
            Create New Flashcards
          </button>
        </div>
      )}
    </div>
  );
}