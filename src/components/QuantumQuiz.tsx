import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, HelpCircle } from 'lucide-react';

export const QuantumQuiz: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentIdx];
  const hasAnsweredCurrent = selectedAnswers[currentIdx] !== undefined;

  const handleSelect = (optionIdx: number) => {
    if (hasAnsweredCurrent) return;
    const updated = { ...selectedAnswers, [currentIdx]: optionIdx };
    setSelectedAnswers(updated);

    if (Object.keys(updated).length === QUIZ_QUESTIONS.length) {
      // Trigger confetti if scored high
      setTimeout(() => {
        setIsFinished(true);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
        });
      }, 700);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsFinished(false);
  };

  const totalCorrect = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => ansIdx === QUIZ_QUESTIONS[Number(qIdx)].correctIndex
  ).length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Knowledge Assessment: Quantum Mechanics</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate your understanding of orbitals, quantum numbers, and electron physics
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Question</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40 font-bold">
            {currentIdx + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Question Text */}
          <div>
            <span className="inline-block text-[11px] font-mono text-cyan-400 font-semibold mb-1">
              Concept: {question.conceptBadge}
            </span>
            <h4 className="text-lg font-semibold text-white leading-snug">
              {question.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentIdx] === optIdx;
              const isCorrect = optIdx === question.correctIndex;
              let itemStyle = 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/70 text-slate-200';

              if (hasAnsweredCurrent) {
                if (isCorrect) {
                  itemStyle = 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200';
                } else if (isSelected) {
                  itemStyle = 'border-rose-500/60 bg-rose-950/30 text-rose-200';
                } else {
                  itemStyle = 'border-slate-800/40 opacity-40 text-slate-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelect(optIdx)}
                  disabled={hasAnsweredCurrent}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer text-xs md:text-sm ${itemStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0 font-mono text-xs mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{option}</span>
                  {hasAnsweredCurrent && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  {hasAnsweredCurrent && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {hasAnsweredCurrent && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pedagogical Analysis:</span>
              </div>
              <p className="leading-relaxed text-slate-300">{question.explanation}</p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <span>{currentIdx === QUIZ_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Finished Results Screen */
        <div className="text-center py-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-white">Assessment Complete</h4>
            <p className="text-xs text-slate-400 mt-1">
              You scored{' '}
              <strong className="text-cyan-400 text-sm font-mono">{totalCorrect}</strong> out of{' '}
              <strong className="text-white text-sm font-mono">{QUIZ_QUESTIONS.length}</strong>{' '}
              ({Math.round((totalCorrect / QUIZ_QUESTIONS.length) * 100)}%)
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 text-left space-y-2">
            <div className="font-semibold text-white">Score Review:</div>
            {totalCorrect === QUIZ_QUESTIONS.length ? (
              <p className="text-emerald-400">
                Outstanding! You have mastered the quantum mechanical model, nodal physics, quantum numbers, and electron configuration principles.
              </p>
            ) : totalCorrect >= 4 ? (
              <p className="text-cyan-300">
                Strong understanding! Review the radial distribution curves and exchange energy principles to achieve 100%.
              </p>
            ) : (
              <p className="text-amber-300">
                Good effort! Explore the 3D orbital viewer and comparative slides to reinforce key wave mechanics concepts.
              </p>
            )}
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
