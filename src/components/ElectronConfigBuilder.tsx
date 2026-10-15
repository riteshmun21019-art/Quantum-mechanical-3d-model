import React, { useState } from 'react';
import { ELEMENTS_DATA } from '../data/elementsData';
import { ArrowUp, ArrowDown, Sparkles, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export const ElectronConfigBuilder: React.FC = () => {
  const [selectedAtomicNumber, setSelectedAtomicNumber] = useState<number>(6); // Default Carbon (Z=6)

  const currentElement =
    ELEMENTS_DATA.find((e) => e.atomicNumber === selectedAtomicNumber) || ELEMENTS_DATA[0];

  const handlePrev = () => {
    const currentIndex = ELEMENTS_DATA.findIndex((e) => e.atomicNumber === selectedAtomicNumber);
    if (currentIndex > 0) {
      setSelectedAtomicNumber(ELEMENTS_DATA[currentIndex - 1].atomicNumber);
    }
  };

  const handleNext = () => {
    const currentIndex = ELEMENTS_DATA.findIndex((e) => e.atomicNumber === selectedAtomicNumber);
    if (currentIndex < ELEMENTS_DATA.length - 1) {
      setSelectedAtomicNumber(ELEMENTS_DATA[currentIndex + 1].atomicNumber);
    }
  };

  const isAnomalous = currentElement.symbol === 'Cr' || currentElement.symbol === 'Cu';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header & Element Quick Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Aufbau Principle & Orbital Filling</h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-cyan-400">Madelung (n + l) Rule</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Watch electrons occupy orbitals by energy hierarchy, Pauli exclusion, and Hund's multiplicity
          </p>
        </div>

        {/* Previous / Next Element buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={handlePrev}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Previous element"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-mono text-xs font-semibold text-white">
            Z = {currentElement.atomicNumber}
          </span>
          <button
            onClick={handleNext}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Next element"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Element Selectors */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-thin">
        {ELEMENTS_DATA.map((elem) => (
          <button
            key={elem.symbol}
            onClick={() => setSelectedAtomicNumber(elem.atomicNumber)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
              elem.atomicNumber === selectedAtomicNumber
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            {elem.symbol} ({elem.atomicNumber})
          </button>
        ))}
      </div>

      {/* Current Element Summary Card */}
      <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center font-bold text-lg text-cyan-300 font-mono">
            {currentElement.symbol}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{currentElement.name}</span>
              <span className="text-xs text-slate-400">({currentElement.category})</span>
            </div>
            <div className="text-xs font-mono text-slate-300 mt-0.5">
              Config: <strong className="text-cyan-400 font-bold">{currentElement.configuration}</strong>{' '}
              <span className="text-slate-500">·</span> Short: <span className="text-amber-400">{currentElement.shortConfig}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Total Electrons</span>
            <span className="text-white font-bold text-sm">{currentElement.electrons}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Valence e-</span>
            <span className="text-cyan-400 font-bold text-sm">{currentElement.valenceElectrons}</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Period / Group</span>
            <span className="text-slate-200 text-sm">P{currentElement.period} / G{currentElement.group}</span>
          </div>
        </div>
      </div>

      {/* Orbital Box Diagram & Electron Filling Ladder */}
      <div className="space-y-4">
        <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span>Orbital Energy Level Diagram & Spin Orientations</span>
          <span className="text-[11px] font-normal text-slate-400 lowercase font-mono">
            (up spin +1/2, down spin -1/2)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentElement.subshells.map((subshell) => {
            const isFull = subshell.filled === subshell.capacity;
            const isEmpty = subshell.filled === 0;

            return (
              <div
                key={subshell.name}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-cyan-300">{subshell.name} Subshell</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {subshell.filled}/{subshell.capacity} e-
                  </span>
                </div>

                {/* Boxes for orbitals */}
                <div className="flex items-center gap-1.5 justify-center py-2">
                  {subshell.boxes.map((box, bIdx) => (
                    <div
                      key={bIdx}
                      className={`w-9 h-11 rounded-lg border flex items-center justify-center gap-0.5 transition-colors ${
                        box.spins.length > 0
                          ? 'border-cyan-500/50 bg-cyan-950/20'
                          : 'border-slate-800 bg-slate-900/50'
                      }`}
                    >
                      {box.spins.map((spin, sIdx) => (
                        <span
                          key={sIdx}
                          className={`flex items-center justify-center ${
                            spin === 'up' ? 'text-cyan-400' : 'text-rose-400'
                          }`}
                        >
                          {spin === 'up' ? (
                            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                          )}
                        </span>
                      ))}
                      {box.spins.length === 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Status indicator */}
                <div className="text-[10px] text-center text-slate-500 font-mono mt-1">
                  {isFull ? (
                    <span className="text-emerald-400">Completely filled</span>
                  ) : isEmpty ? (
                    'Empty'
                  ) : (
                    <span className="text-amber-400">Partially occupied</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Anomalous Stability Notice if Cr or Cu */}
      {isAnomalous && (
        <div className="mt-4 p-3.5 bg-amber-950/30 border border-amber-600/40 rounded-xl flex items-start gap-3 text-xs text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 font-semibold">Special Quantum Stability:</strong>{' '}
            {currentElement.symbol === 'Cr' ? (
              <span>
                Chromium transfers an electron from <strong>4s</strong> to <strong>3d</strong> to achieve a symmetrically{' '}
                <strong>half-filled 3d⁵ subshell</strong>. The exchange energy gained from five parallel unpaired spins
                surpasses the promotion energy penalty.
              </span>
            ) : (
              <span>
                Copper promotes an electron from <strong>4s</strong> to <strong>3d</strong> to achieve a completely{' '}
                <strong>filled 3d¹⁰ subshell</strong>. Symmetrical spherical charge distribution and high exchange energy
                render this state remarkably stable.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Three Governing Principles Cards */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
          <div className="font-semibold text-cyan-300 mb-1">1. Aufbau Principle</div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Electrons occupy lowest energy states first according to the (n + l) rule: 1s &lt; 2s &lt; 2p &lt; 3s &lt; 3p &lt; 4s &lt; 3d.
          </p>
        </div>
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
          <div className="font-semibold text-amber-300 mb-1">2. Pauli Exclusion</div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            No two electrons share identical 4 quantum numbers. Maximum 2 electrons per orbital with paired opposite spins (↑↓).
          </p>
        </div>
        <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
          <div className="font-semibold text-rose-300 mb-1">3. Hund’s Multiplicity</div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Degenerate orbitals are filled singly with parallel spins first before pairing, minimizing inter-electronic Coulomb repulsion.
          </p>
        </div>
      </div>
    </div>
  );
};
