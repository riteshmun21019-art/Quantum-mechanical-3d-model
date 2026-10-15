import React, { useState } from 'react';
import { Check, X, ArrowRight, Layers, Eye } from 'lucide-react';

interface ComparisonFeature {
  dimension: string;
  bohrModel: {
    description: string;
    isLimitation: boolean;
  };
  quantumModel: {
    description: string;
    isAdvantage: boolean;
  };
}

const COMPARISON_FEATURES: ComparisonFeature[] = [
  {
    dimension: 'Electron Nature',
    bohrModel: {
      description: 'Treated purely as a classical charged mass particle moving in circular orbits.',
      isLimitation: true,
    },
    quantumModel: {
      description: 'Dual wave-particle nature. Treated as a 3D standing matter wave with wavelength λ = h/p.',
      isAdvantage: true,
    },
  },
  {
    dimension: 'Trajectory & Localization',
    bohrModel: {
      description: 'Deterministic 1D circular orbits of definite, fixed radius and velocity.',
      isLimitation: true,
    },
    quantumModel: {
      description: 'Probabilistic 3D spatial electron density clouds (|ψ|²). No definite trajectory exists.',
      isAdvantage: true,
    },
  },
  {
    dimension: 'Heisenberg Uncertainty',
    bohrModel: {
      description: 'Directly violates Heisenberg’s principle by postulating simultaneous exact position and momentum.',
      isLimitation: true,
    },
    quantumModel: {
      description: 'Fully complies with Δx · Δp ≥ ℏ/2. Built organically into Fourier wave mechanics.',
      isAdvantage: true,
    },
  },
  {
    dimension: 'Multi-Electron Atoms',
    bohrModel: {
      description: 'Completely failed to predict spectra or energy states for helium (Z = 2) or any multi-electron atom.',
      isLimitation: true,
    },
    quantumModel: {
      description: 'Accurately predicts multi-electron electronic structures, shielding, and periodic trends.',
      isAdvantage: true,
    },
  },
  {
    dimension: 'Orbital Geometry & Bonding',
    bohrModel: {
      description: 'Flat planar concentric rings. Could not explain 3D molecular shapes (e.g. tetrahedral methane CH₄).',
      isLimitation: true,
    },
    quantumModel: {
      description: 'Directional 3D orbitals (s, p, d, f) that hybridize (sp³, sp²) to explain molecular geometry.',
      isAdvantage: true,
    },
  },
  {
    dimension: 'Zeeman & Stark Effects',
    bohrModel: {
      description: 'Incapable of explaining spectral line splitting in magnetic fields or electric fields.',
      isLimitation: true,
    },
    quantumModel: {
      description: 'Naturally accounts for Zeeman and Stark splitting via magnetic quantum number m_l and electron spin m_s.',
      isAdvantage: true,
    },
  },
  {
    dimension: 'Quantization Origin',
    bohrModel: {
      description: 'Ad-hoc assumption imposed by hand: angular momentum L = n·ℏ.',
      isLimitation: true,
    },
    quantumModel: {
      description: 'Natural mathematical outcome of wave boundary conditions in Coulomb potential Ĥψ = Eψ.',
      isAdvantage: true,
    },
  },
];

export const BohrVsQuantumComparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'diagram'>('matrix');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Bohr Model vs. Quantum Mechanical Model</h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-cyan-400">Paradigm Comparison</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            How wave mechanics resolved the fundamental deadlocks of early 20th-century atomic physics
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Comparison Matrix
          </button>
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'diagram'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scientific Infographic
          </button>
        </div>
      </div>

      {activeTab === 'diagram' ? (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <img
              src="/src/assets/images/bohr_vs_schrodinger_diagram_1792085680808.jpg"
              alt="Bohr model planetary orbits compared with Schrödinger quantum mechanical electron clouds"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-[520px]"
            />
          </div>
          <p className="text-xs text-slate-400 italic text-center">
            Visual comparison showing the historical progression from localized circular orbits (left) to 3D spherical harmonic probability densities (right).
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                <th className="py-3 px-4 font-semibold text-slate-400 w-1/4">Criteria</th>
                <th className="py-3 px-4 font-semibold text-amber-300 w-[37.5%]">
                  Bohr Planetary Model (1913)
                </th>
                <th className="py-3 px-4 font-semibold text-cyan-300 w-[37.5%]">
                  Quantum Mechanical Model (1926)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {COMPARISON_FEATURES.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-medium text-white flex items-center gap-1.5">
                    <span>{item.dimension}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-amber-950/50 text-amber-400 border border-amber-600/40 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        ✕
                      </span>
                      <span>{item.bohrModel.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-200 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-cyan-950/50 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                        ✓
                      </span>
                      <span>{item.quantumModel.description}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Epistemic Summary Callout */}
      <div className="mt-5 p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-start gap-3 text-xs">
        <Layers className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 leading-relaxed">
          <strong className="text-white">Scientific Conclusion:</strong> The Bohr model was an ingenious transitional
          hypothesis that unlocked energy quantization. However, the Quantum Mechanical Model is the mathematically
          consistent, experimentally validated physical reality of matter.
        </div>
      </div>
    </div>
  );
};
