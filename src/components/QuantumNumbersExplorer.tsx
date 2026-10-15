import React, { useState } from 'react';

export const QuantumNumbersExplorer: React.FC = () => {
  const [n, setN] = useState<number>(3);
  const [selectedL, setSelectedL] = useState<number>(1);

  // Safe l
  const safeL = Math.min(selectedL, n - 1);

  const subshellLabels = ['s', 'p', 'd', 'f'];
  const totalOrbitals = n * n;
  const maxElectrons = 2 * n * n;

  // Allowed m_l for safeL
  const allowedMl: number[] = [];
  for (let m = -safeL; m <= safeL; m++) {
    allowedMl.push(m);
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-white">Interactive Quantum Numbers Calculator</h4>
          <p className="text-xs text-slate-400">
            Explore allowed states, orbital degeneracies, and shell capacities
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Shell:</span>
          {['K (n=1)', 'L (n=2)', 'M (n=3)', 'N (n=4)'].map((label, idx) => {
            const shellN = idx + 1;
            return (
              <button
                key={shellN}
                onClick={() => {
                  setN(shellN);
                  if (selectedL >= shellN) setSelectedL(shellN - 1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  n === shellN
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Shell metrics row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Principal (n)</span>
          <span className="text-cyan-400 font-bold text-base">{n}</span>
          <span className="text-[10px] text-slate-500 block">Main Energy Level</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Subshells (l = 0..n-1)</span>
          <span className="text-amber-400 font-bold text-base">{n} subshells</span>
          <span className="text-[10px] text-slate-500 block">
            {Array.from({ length: n })
              .map((_, i) => subshellLabels[i] || `${i}`)
              .join(', ')}
          </span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Total Orbitals (n²)</span>
          <span className="text-emerald-400 font-bold text-base">{totalOrbitals} orbitals</span>
          <span className="text-[10px] text-slate-500 block">{n}² = {totalOrbitals}</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Max Electrons (2n²)</span>
          <span className="text-rose-400 font-bold text-base">{maxElectrons} e⁻</span>
          <span className="text-[10px] text-slate-500 block">2 × {totalOrbitals} = {maxElectrons}</span>
        </div>
      </div>

      {/* Active Subshell breakdown */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-semibold">Select Subshell (l):</span>
          <div className="flex items-center gap-1.5 font-mono">
            {Array.from({ length: n }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedL(idx)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  safeL === idx
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                l = {idx} ({subshellLabels[idx]})
              </button>
            ))}
          </div>
        </div>

        {/* Magnetic quantum number breakdown */}
        <div className="pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400">
              Allowed Magnetic Quantum Numbers (m_l = -l .. +l):
            </span>
            <span className="font-mono text-cyan-400 font-bold">
              {2 * safeL + 1} degenerate spatial orbitals
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {allowedMl.map((mVal) => (
              <div
                key={mVal}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs flex items-center gap-2"
              >
                <span className="text-cyan-400">m_l = {mVal > 0 ? `+${mVal}` : mVal}</span>
                <span className="text-[10px] text-slate-500">
                  (holds 2 e⁻: m_s = ±½)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
