import React, { useState, useEffect, useRef } from 'react';
import { PRESENTATION_SLIDES } from '../data/presentationData';
import { SlideData } from '../types/quantum';
import { OrbitalCanvas3D } from './OrbitalCanvas3D';
import { RadialDistributionChart } from './RadialDistributionChart';
import { ElectronConfigBuilder } from './ElectronConfigBuilder';
import { BohrVsQuantumComparison } from './BohrVsQuantumComparison';
import { QuantumNumbersExplorer } from './QuantumNumbersExplorer';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  Grid,
  Clock,
  Play,
  Pause,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

interface PresentationDeckProps {
  onSelectSlide?: (slideId: number) => void;
  externalSlideIndex?: number;
}

export const PresentationDeck: React.FC<PresentationDeckProps> = ({
  onSelectSlide,
  externalSlideIndex,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(
    externalSlideIndex ?? 0
  );
  const [showPresenterNotes, setShowPresenterNotes] = useState<boolean>(false);
  const [showOverview, setShowOverview] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  const deckContainerRef = useRef<HTMLDivElement>(null);

  // Sync external index if provided
  useEffect(() => {
    if (externalSlideIndex !== undefined && externalSlideIndex !== currentSlideIndex) {
      setCurrentSlideIndex(externalSlideIndex);
    }
  }, [externalSlideIndex]);

  // Timer loop for presenter notes
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        goToPrevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === 'p' || e.key === 'P') {
        setShowPresenterNotes((prev) => !prev);
      } else if (e.key === 'o' || e.key === 'O') {
        setShowOverview((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const goToNextSlide = () => {
    if (currentSlideIndex < PRESENTATION_SLIDES.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      onSelectSlide?.(nextIdx + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      const prevIdx = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIdx);
      onSelectSlide?.(prevIdx + 1);
    }
  };

  const jumpToSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setShowOverview(false);
    onSelectSlide?.(idx + 1);
  };

  const toggleFullscreen = () => {
    if (!deckContainerRef.current) return;
    if (!document.fullscreenElement) {
      deckContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSlide = PRESENTATION_SLIDES[currentSlideIndex];
  const nextSlide =
    currentSlideIndex < PRESENTATION_SLIDES.length - 1
      ? PRESENTATION_SLIDES[currentSlideIndex + 1]
      : null;

  return (
    <div
      ref={deckContainerRef}
      className={`relative w-full flex flex-col bg-slate-950 text-slate-100 ${
        isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : 'rounded-3xl border border-slate-800/80 shadow-2xl overflow-hidden'
      }`}
      style={{ minHeight: isFullscreen ? '100vh' : '760px' }}
    >
      {/* Top Deck Navigation & Utility Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 font-bold">
            SLIDE {currentSlideIndex + 1} / {PRESENTATION_SLIDES.length}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">·</span>
          <span className="text-xs text-slate-300 font-medium hidden sm:inline">
            {currentSlide.category}
          </span>
        </div>

        {/* Presenter timer & view switches */}
        <div className="flex items-center gap-2">
          {showPresenterNotes && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(elapsedSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-slate-400 hover:text-white"
                title={isTimerRunning ? 'Pause timer' : 'Resume timer'}
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>
          )}

          <button
            onClick={() => setShowOverview(!showOverview)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showOverview
                ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
            }`}
            title="Overview grid (Key: O)"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Overview</span>
          </button>

          <button
            onClick={() => setShowPresenterNotes(!showPresenterNotes)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showPresenterNotes
                ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
            }`}
            title="Presenter speaker notes (Key: P)"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Speaker Notes</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors"
            title="Toggle fullscreen (Key: F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1 bg-slate-900">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-300"
          style={{
            width: `${((currentSlideIndex + 1) / PRESENTATION_SLIDES.length) * 100}%`,
          }}
        />
      </div>

      {/* Slide Overview Grid Modal */}
      {showOverview && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Presentation Slides Overview</h3>
              <p className="text-xs text-slate-400">Click any slide to jump directly</p>
            </div>
            <button
              onClick={() => setShowOverview(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white"
            >
              Close (ESC)
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESENTATION_SLIDES.map((slide, sIdx) => (
              <button
                key={slide.id}
                onClick={() => jumpToSlide(sIdx)}
                className={`p-4 rounded-2xl border text-left transition-all group cursor-pointer ${
                  sIdx === currentSlideIndex
                    ? 'border-cyan-500 bg-cyan-950/20 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-cyan-400 font-bold">SLIDE {sIdx + 1}</span>
                  <span className="text-slate-500">{slide.category}</span>
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {slide.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{slide.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Slide Content Area with optional Presenter Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Stage */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* Slide Header */}
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
              {currentSlide.category}
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {currentSlide.title}
            </h2>
            <p className="text-sm md:text-base text-slate-400 mt-1 font-normal">
              {currentSlide.subtitle}
            </p>
          </div>

          {/* Interactive Widget Embedding per Slide */}
          {currentSlide.interactiveType === 'orbital3d' ? (
            <div className="space-y-4">
              <OrbitalCanvas3D initialOrbital="2pz" height="460px" />
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <div className="font-semibold text-white">Nodal Properties & Wave Phases:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-400">
                  <p>
                    • <strong>Radial Nodes (n - l - 1):</strong> Concentric spherical surfaces where the radial wavefunction R(r) crosses zero and electron density is zero.
                  </p>
                  <p>
                    • <strong>Angular Nodes (l):</strong> Nodal planes or cones passing through the nucleus where spherical harmonic Y(θ, φ) = 0.
                  </p>
                </div>
              </div>
            </div>
          ) : currentSlide.interactiveType === 'radialGraph' ? (
            <div className="space-y-4">
              <RadialDistributionChart initialN={2} initialL={0} />
            </div>
          ) : currentSlide.interactiveType === 'electronConfig' ? (
            <div className="space-y-4">
              <ElectronConfigBuilder />
            </div>
          ) : currentSlide.interactiveType === 'quantumNumbers' ? (
            <div className="space-y-4">
              <QuantumNumbersExplorer />
            </div>
          ) : currentSlide.interactiveType === 'bohrComparison' ? (
            <div className="space-y-4">
              <BohrVsQuantumComparison />
            </div>
          ) : (
            /* Default Text / Image Slide Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Key Scientific Points */}
              <div className={currentSlide.heroImage ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
                {currentSlide.keyPoints.map((point, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <h3 className="text-sm font-bold text-cyan-300 mb-1 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-cyan-950 border border-cyan-800/60 flex items-center justify-center text-[11px] font-mono text-cyan-400">
                        {pIdx + 1}
                      </span>
                      <span>{point.heading}</span>
                    </h3>
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed pl-7">
                      {point.detail}
                    </p>
                    {point.formula && (
                      <div className="mt-2.5 ml-7 p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300">
                        {point.formula}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mathematical Equations Card */}
                {currentSlide.equations && currentSlide.equations.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-3">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Formal Mathematical Relations
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSlide.equations.map((eq, eIdx) => (
                        <div key={eIdx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/70">
                          <span className="text-[11px] text-cyan-400 font-medium block">{eq.label}</span>
                          <div className="text-xs font-mono text-white py-1 font-bold">{eq.math}</div>
                          <p className="text-[10px] text-slate-400">{eq.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: High-Res Diagram if present */}
              {currentSlide.heroImage && (
                <div className="lg:col-span-5 space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-xl">
                    <img
                      src={currentSlide.heroImage}
                      alt={currentSlide.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover max-h-[380px]"
                    />
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      High-fidelity visualization illustrating atomic wavefunctions and empirical quantum state transitions.
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key Takeaway Pill Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-800/40 flex items-start gap-3 text-xs text-cyan-200">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Core Principle:</strong> {currentSlide.keyTakeaway}
            </div>
          </div>
        </div>

        {/* Presenter Mode Right Panel (Speaker Notes) */}
        {showPresenterNotes && (
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800/80 bg-slate-900/70 p-5 flex flex-col justify-between shrink-0 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Speaker Notes & Pedagogy
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Slide {currentSlideIndex + 1}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <p>{currentSlide.speakerNotes}</p>
              </div>

              {/* Next Slide Preview */}
              {nextSlide && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-500">
                    Up Next: Slide {currentSlideIndex + 2}
                  </span>
                  <div className="text-xs font-bold text-white line-clamp-1">{nextSlide.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{nextSlide.subtitle}</div>
                </div>
              )}
            </div>

            <div className="pt-4 text-[10px] text-slate-500 font-mono text-center">
              Keys: [→] Next · [←] Prev · [F] Fullscreen · [P] Notes
            </div>
          </div>
        )}
      </div>

      {/* Bottom Floating Navigation Toolbar */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/95 flex items-center justify-between shrink-0">
        <button
          onClick={goToPrevSlide}
          disabled={currentSlideIndex === 0}
          className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-850 flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Quick jump slide dots / numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {PRESENTATION_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => jumpToSlide(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-mono transition-colors ${
                idx === currentSlideIndex
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={goToNextSlide}
          disabled={currentSlideIndex === PRESENTATION_SLIDES.length - 1}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <span>Next Slide</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
