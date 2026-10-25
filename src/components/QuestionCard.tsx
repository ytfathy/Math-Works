import React, { useState, useEffect } from 'react';
import { Question } from '../types/math';
import { sounds } from '../services/soundEffects';
import { InteractiveNumberLine } from './InteractiveNumberLine';
import { FractionDivisionVisualizer } from './FractionDivisionVisualizer';

interface QuestionCardProps {
  question: Question;
  onAnswerSubmit: (isCorrect: boolean, points: number) => void;
  onNextQuestion: () => void;
  hasAnswered: boolean;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSubmit,
  onNextQuestion,
  hasAnswered,
  isLastQuestion,
}) => {
  // State for single choice
  const [selectedSingle, setSelectedSingle] = useState<string>('');
  // State for multi select
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);
  // Shuffled options for complete randomization across A, B, C, D
  const [shuffledOptions, setShuffledOptions] = useState<{ id: string; text: string }[]>([]);
  // State for ordering
  const [orderedItems, setOrderedItems] = useState<{ id: string; text: string }[]>([]);
  // State for matching
  const [matchedPairs, setMatchedPairs] = useState<{ [left: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  // Tools toggle
  const [showNumberLine, setShowNumberLine] = useState<boolean>(false);
  const [showFractionLab, setShowFractionLab] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Initialize or reset question states
  useEffect(() => {
    setSelectedSingle('');
    setSelectedMulti([]);
    setShowHint(false);
    setIsAnswerCorrect(null);
    setSelectedLeft(null);
    setMatchedPairs({});

    // Thoroughly randomize options so the answer is NEVER always 'A' or the same position
    if (question.options) {
      const randomized = [...question.options].sort(() => Math.random() - 0.5);
      setShuffledOptions(randomized);
    } else {
      setShuffledOptions([]);
    }

    if (question.type === 'ordering' && question.options) {
      // Shuffle initially so it's a real puzzle
      const shuffled = [...question.options].sort(() => Math.random() - 0.5);
      setOrderedItems(shuffled);
    } else {
      setOrderedItems([]);
    }

    // Auto show number line if question has number line or mentions integers/rationals
    if (question.moduleId === 'module-1' || question.prompt.toLowerCase().includes('number line')) {
      setShowNumberLine(true);
    } else {
      setShowNumberLine(false);
    }

    // Auto show fraction lab for module 3
    if (question.moduleId === 'module-3') {
      setShowFractionLab(true);
    } else {
      setShowFractionLab(false);
    }
  }, [question]);

  // Handle single choice selection
  const handleSelectSingle = (id: string) => {
    if (hasAnswered) return;
    sounds.playPop();
    setSelectedSingle(id);
  };

  // Handle multi-select toggle
  const handleToggleMulti = (id: string) => {
    if (hasAnswered) return;
    sounds.playPop();
    if (selectedMulti.includes(id)) {
      setSelectedMulti(selectedMulti.filter(item => item !== id));
    } else {
      setSelectedMulti([...selectedMulti, id]);
    }
  };

  // Handle re-ordering items
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (hasAnswered) return;
    sounds.playPop();
    const newItems = [...orderedItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setOrderedItems(newItems);
  };

  // Handle matching tap
  const handleLeftTap = (left: string) => {
    if (hasAnswered) return;
    sounds.playPop();
    setSelectedLeft(left);
  };

  const handleRightTap = (right: string) => {
    if (hasAnswered || !selectedLeft) return;
    sounds.playPop();
    setMatchedPairs(prev => ({
      ...prev,
      [selectedLeft]: right
    }));
    setSelectedLeft(null);
  };

  // Check answer correctness
  const handleSubmit = () => {
    if (hasAnswered) return;

    let correct = false;

    if (question.type === 'multiple_choice') {
      correct = selectedSingle === question.correctAnswer;
    } else if (question.type === 'multi_select') {
      const correctArr = question.correctAnswer as string[];
      correct =
        selectedMulti.length === correctArr.length &&
        selectedMulti.every(val => correctArr.includes(val));
    } else if (question.type === 'ordering') {
      const correctOrder = question.correctAnswer as string[];
      correct = orderedItems.every((item, idx) => item.id === correctOrder[idx]);
    } else if (question.type === 'matching' && question.matchingPairs) {
      // Check if all pairs match
      correct = question.matchingPairs.every(
        pair => matchedPairs[pair.left] === pair.right
      );
    }

    setIsAnswerCorrect(correct);
    if (correct) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    onAnswerSubmit(correct, question.points);
  };

  const isSubmitDisabled = () => {
    if (hasAnswered) return true;
    if (question.type === 'multiple_choice') return !selectedSingle;
    if (question.type === 'multi_select') return selectedMulti.length === 0;
    if (question.type === 'ordering') return orderedItems.length === 0;
    if (question.type === 'matching') {
      return Object.keys(matchedPairs).length < (question.matchingPairs?.length || 0);
    }
    return false;
  };

  return (
    <div className="w-full bg-white rounded-3xl p-5 md:p-7 border-2 border-slate-200 shadow-xl transition-all">
      {/* Question Header Meta */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800">
            {question.lessonTitle}
          </span>
          {question.sourcePage && (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              {question.sourcePage}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-extrabold px-2 py-0.5 rounded-md uppercase ${
              question.difficulty === 'easy'
                ? 'bg-emerald-100 text-emerald-800'
                : question.difficulty === 'medium'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-purple-100 text-purple-800'
            }`}
          >
            {question.difficulty}
          </span>
          <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            +{question.points} XP
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">
          {question.prompt}
        </h2>
        {question.type === 'multi_select' && (
          <p className="text-xs font-semibold text-blue-600 mt-1">
            (Select all that apply)
          </p>
        )}
        {question.type === 'ordering' && (
          <p className="text-xs font-semibold text-purple-600 mt-1">
            (Use the arrows to arrange in the correct order)
          </p>
        )}
        {question.type === 'matching' && (
          <p className="text-xs font-semibold text-emerald-600 mt-1">
            (Tap a left card, then tap its matching pair on the right)
          </p>
        )}
      </div>

      {/* Auxiliary Visual Tools Toggle Bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setShowNumberLine(!showNumberLine)}
          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
            showNumberLine
              ? 'bg-slate-800 text-amber-300 border-slate-900'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          📏 {showNumberLine ? 'Hide Number Line' : 'Show Number Line'}
        </button>

        {question.moduleId === 'module-3' && (
          <button
            onClick={() => setShowFractionLab(!showFractionLab)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              showFractionLab
                ? 'bg-amber-600 text-white border-amber-700'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            🍰 {showFractionLab ? 'Hide Fraction Lab' : 'Fraction Lab (Keep-Change-Flip)'}
          </button>
        )}

        <button
          onClick={() => {
            sounds.playPop();
            setShowHint(!showHint);
          }}
          className={`ml-auto px-3 py-1.5 text-xs font-bold rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
            showHint
              ? 'bg-yellow-400 text-yellow-950 border-yellow-500'
              : 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border-yellow-300'
          }`}
        >
          💡 {showHint ? 'Hide Hint' : 'Need a Hint?'}
        </button>
      </div>

      {/* Auxiliary Tool: Interactive Number Line */}
      {showNumberLine && (
        <div className="mb-6 animate-fade-in">
          <InteractiveNumberLine
            min={question.moduleId === 'module-2' ? -3 : -10}
            max={question.moduleId === 'module-2' ? 3 : 10}
            step={question.moduleId === 'module-2' ? 0.5 : 1}
          />
        </div>
      )}

      {/* Auxiliary Tool: Fraction Lab */}
      {showFractionLab && (
        <div className="mb-6 animate-fade-in">
          <FractionDivisionVisualizer />
        </div>
      )}

      {/* Teacher Guide Hint */}
      {showHint && (
        <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl text-yellow-900 text-sm font-medium flex items-start gap-3 shadow-xs">
          <span className="text-xl">💡</span>
          <div>
            <div className="font-bold text-xs uppercase text-yellow-800 mb-0.5">Teacher Hint:</div>
            <div>{question.hint}</div>
          </div>
        </div>
      )}

      {/* Question Type: Multiple Choice */}
      {question.type === 'multiple_choice' && (
        <div className="grid grid-cols-1 gap-3 mb-6">
          {(shuffledOptions.length > 0 ? shuffledOptions : (question.options || [])).map((option, idx) => {
            const isSelected = selectedSingle === option.id;
            const isCorrect = option.id === question.correctAnswer;
            const displayLetter = String.fromCharCode(65 + idx);
            let btnStyle = 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 text-slate-800';

            if (hasAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-400';
              } else {
                btnStyle = 'opacity-50 border-slate-200 text-slate-500';
              }
            } else if (isSelected) {
              btnStyle = 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-400';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectSingle(option.id)}
                disabled={hasAnswered}
                className={`p-4 rounded-2xl border-2 font-bold text-left text-sm md:text-base transition flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-white border border-slate-300 shadow-2xs flex items-center justify-center font-mono font-bold text-xs uppercase flex-shrink-0">
                    {displayLetter}
                  </span>
                  <span>{option.text}</span>
                </div>

                {hasAnswered && isCorrect && (
                  <span className="text-emerald-600 text-lg font-black ml-2">✓</span>
                )}
                {hasAnswered && isSelected && !isCorrect && (
                  <span className="text-red-500 text-lg font-black ml-2">✕</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Question Type: Multi Select */}
      {question.type === 'multi_select' && (
        <div className="grid grid-cols-1 gap-3 mb-6">
          {(shuffledOptions.length > 0 ? shuffledOptions : (question.options || [])).map((option, idx) => {
            const isSelected = selectedMulti.includes(option.id);
            const isExpected = (question.correctAnswer as string[]).includes(option.id);
            const displayLetter = String.fromCharCode(65 + idx);
            let boxStyle = 'bg-slate-50 hover:bg-blue-50/50 border-slate-200 text-slate-800';

            if (hasAnswered) {
              if (isExpected) {
                boxStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400';
              } else if (isSelected && !isExpected) {
                boxStyle = 'bg-red-50 border-red-500 text-red-900 ring-2 ring-red-400';
              } else {
                boxStyle = 'opacity-50 border-slate-200 text-slate-500';
              }
            } else if (isSelected) {
              boxStyle = 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-400';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleToggleMulti(option.id)}
                disabled={hasAnswered}
                className={`p-4 rounded-2xl border-2 font-bold text-left text-sm md:text-base transition flex items-center justify-between cursor-pointer ${boxStyle}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="text-xs font-black">✓</span>}
                  </div>
                  <span className="w-7 h-7 rounded-lg bg-white border border-slate-300 shadow-2xs flex items-center justify-center font-mono font-bold text-xs uppercase flex-shrink-0">
                    {displayLetter}
                  </span>
                  <span>{option.text}</span>
                </div>

                {hasAnswered && isExpected && (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Correct Option
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Question Type: Ordering */}
      {question.type === 'ordering' && (
        <div className="flex flex-col gap-2.5 mb-6">
          {orderedItems.map((item, index) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-mono font-bold text-xs flex items-center justify-center">
                  #{index + 1}
                </span>
                <span className="font-bold text-sm text-slate-800">{item.text}</span>
              </div>

              {!hasAnswered && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === orderedItems.length - 1}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    ▼
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Question Type: Matching */}
      {question.type === 'matching' && question.matchingPairs && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Left Column */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">Values:</span>
            {question.matchingPairs.map(pair => {
              const isSelected = selectedLeft === pair.left;
              const hasMatch = !!matchedPairs[pair.left];

              return (
                <button
                  key={pair.left}
                  onClick={() => handleLeftTap(pair.left)}
                  disabled={hasAnswered}
                  className={`p-3 rounded-xl border-2 font-bold text-sm text-left transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-purple-100 border-purple-500 text-purple-900 ring-2 ring-purple-400'
                      : hasMatch
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{pair.left}</span>
                  {hasMatch && (
                    <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-mono">
                      ➔ {matchedPairs[pair.left]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase text-slate-400">Opposites / Reciprocals:</span>
            {question.matchingPairs.map(pair => (
              <button
                key={pair.right}
                onClick={() => handleRightTap(pair.right)}
                disabled={hasAnswered || !selectedLeft}
                className={`p-3 rounded-xl border-2 font-bold text-sm text-left transition cursor-pointer ${
                  selectedLeft
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <span>{pair.right}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Answer Feedback & Explanation */}
      {hasAnswered && (
        <div
          className={`p-5 rounded-2xl border-2 mb-6 animate-fade-in ${
            isAnswerCorrect
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-base md:text-lg mb-2">
            <span>{isAnswerCorrect ? '🎉 Correct!' : '💡 Good Try!'}</span>
            <span className="text-sm font-semibold">
              {isAnswerCorrect ? question.funnySuccessLine : question.funnyFailLine}
            </span>
          </div>

          <div className="text-sm leading-relaxed border-t border-emerald-200/50 pt-2 text-slate-700">
            <strong className="text-slate-900">Explanation: </strong>
            {question.explanation}
          </div>
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {!hasAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Check Answer ✨
          </button>
        ) : (
          <button
            onClick={onNextQuestion}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-base rounded-2xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isLastQuestion ? 'Complete Module Review! 🏆' : 'Next Question ➔'}
          </button>
        )}
      </div>
    </div>
  );
};
