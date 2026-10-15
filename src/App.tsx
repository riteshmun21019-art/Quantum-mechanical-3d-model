import React, { useState } from 'react';
import { TopBar, ActiveTab } from './components/TopBar';
import { PresentationDeck } from './components/PresentationDeck';
import { OrbitalCanvas3D } from './components/OrbitalCanvas3D';
import { RadialDistributionChart } from './components/RadialDistributionChart';
import { ElectronConfigBuilder } from './components/ElectronConfigBuilder';
import { BohrVsQuantumComparison } from './components/BohrVsQuantumComparison';
import { QuantumQuiz } from './components/QuantumQuiz';
import { QuantumNumbersExplorer } from './components/QuantumNumbersExplorer';
import {
  Sparkles,
  Layers,
  Atom,
  Binary,
  Compass,
  CheckCircle,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('presentation');
  const [selectedSlideId, setSelectedSlideId] = useState<number>(1);

  const launchPresentation = () => {
    setActiveTab('presentation');
    setSelectedSlideId(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar adhering to the Top Bar Contract */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLaunchPresentation={launchPresentation}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
        {/* Navigation Tabs (Mobile & Quick Filter Bar) */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin text-xs">
          <button
            onClick={() => setActiveTab('presentation')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'presentation'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300'
            }`}
          >
            Presentation
          </button>
          <button
            onClick={() => setActiveTab('orbitals3d')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'orbitals3d'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300'
            }`}
          >
            3D Orbitals
          </button>
          <button
            onClick={() => setActiveTab('radial')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'radial'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300'
            }`}
          >
            Wavefunctions
          </button>
          <button
            onClick={() => setActiveTab('aufbau')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'aufbau'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300'
            }`}
          >
            Aufbau Lab
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'comparison'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300'
            }`}
          >
            Bohr vs QM
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === 'quiz'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-300'
            }`}
          >
            Assessment
          </button>
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'presentation' && (
          <div className="space-y-8 animate-fadeIn">
            {/* The Slide Presentation Engine */}
            <PresentationDeck
              externalSlideIndex={selectedSlideId - 1}
              onSelectSlide={(id) => setSelectedSlideId(id)}
            />

            {/* Presentation Navigation Quick Cards */}
            <div className="p-6 bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Presentation Chapter Index</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click any module to inspect dedicated interactive laboratories
                  </p>
                </div>
                <div className="text-xs font-mono text-cyan-400">9 Key Topics</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedSlideId(1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">01. Foundations</div>
                  <div className="text-sm font-semibold text-white">The Quantum Paradigm Shift</div>
                  <div className="text-xs text-slate-400 mt-0.5">Rutherford collapse & Bohr quantization</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">02. Duality & Uncertainty</div>
                  <div className="text-sm font-semibold text-white">Matter Waves & Heisenberg</div>
                  <div className="text-xs text-slate-400 mt-0.5">λ = h/p and Δx · Δp ≥ ℏ/2</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(3);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">03. Master Equation</div>
                  <div className="text-sm font-semibold text-white">Schrödinger Wave Equation</div>
                  <div className="text-xs text-slate-400 mt-0.5">Ĥψ = Eψ & Born probability |ψ|²</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(4);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">04. Coordinates</div>
                  <div className="text-sm font-semibold text-white">Four Quantum Numbers</div>
                  <div className="text-xs text-slate-400 mt-0.5">Principal, Azimuthal, Magnetic & Spin</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(5);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">05. Spatial Geometries</div>
                  <div className="text-sm font-semibold text-white">Anatomy of Atomic Orbitals</div>
                  <div className="text-xs text-slate-400 mt-0.5">3D s, p, d lobes, radial & angular nodes</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(6);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">06. Distributions</div>
                  <div className="text-sm font-semibold text-white">Radial Probability Curves</div>
                  <div className="text-xs text-slate-400 mt-0.5">4πr²R²(r) vs R(r) & penetration</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(7);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">07. Electronic Order</div>
                  <div className="text-sm font-semibold text-white">Aufbau, Pauli & Hund's Rules</div>
                  <div className="text-xs text-slate-400 mt-0.5">Madelung rule & anomalous Cr/Cu stability</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(8);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">08. Rigorous Compare</div>
                  <div className="text-sm font-semibold text-white">Bohr vs. Quantum Mechanics</div>
                  <div className="text-xs text-slate-400 mt-0.5">Deterministic orbits vs standing 3D waves</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedSlideId(9);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800/70 rounded-2xl text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-mono text-cyan-400 mb-1">09. Applied Physics</div>
                  <div className="text-sm font-semibold text-white">Modern Quantum Technologies</div>
                  <div className="text-xs text-slate-400 mt-0.5">MRI spin resonance, semiconductors & qubits</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3D Orbitals Deep-Dive Lab Tab */}
        {activeTab === 'orbitals3d' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                Interactive Three.js Laboratory
              </div>
              <h2 className="text-2xl font-bold text-white">High-Fidelity Quantum Orbital 3D Models</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-3xl">
                Inspect 3D electron probability clouds (|ψ|²) and wave phase lobe isosurfaces for all s, p, d, and f orbitals, hybridized states (sp, sp², sp³, dsp³, d²sp³), molecular bonding/antibonding orbitals (σ, σ*, π, π*), and multi-electron atom closures with real-time wave pulsation and cutaway slicing.
              </p>
            </div>

            <OrbitalCanvas3D height="680px" showSelector={true} />

            {/* Educational notes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="font-semibold text-cyan-300">s & p Orbitals (l = 0, 1)</div>
                <p className="text-slate-400 leading-relaxed">
                  Spherical shells with concentric radial nodes (s) and mutually orthogonal dumbbells with planar nodes (px, py, pz).
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="font-semibold text-blue-400">d-Orbitals (l = 2)</div>
                <p className="text-slate-400 leading-relaxed">
                  Four cloverleaf geometries (dxy, dxz, dyz, dx²-y²) with 2 nodal planes, plus dz² featuring two conical nodal surfaces and an equatorial torus.
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="font-semibold text-purple-400">All 7 f-Orbitals (l = 3)</div>
                <p className="text-slate-400 leading-relaxed">
                  Complex 3D harmonics: 8-octant lobes (fxyz), dual-donut axial (fz³), and 6-lobe planar arrangements with 3 angular nodal surfaces.
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="font-semibold text-amber-300">Hybrid & Molecular</div>
                <p className="text-slate-400 leading-relaxed">
                  Directed bonding orbitals: sp (linear), sp² (trigonal), sp³ (tetrahedral), plus LCAO bonding (σ, π) and antibonding (σ*, π*) states.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wavefunctions & Radial Distribution Tab */}
        {activeTab === 'radial' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                Hydrogenic Solutions
              </div>
              <h2 className="text-2xl font-bold text-white">Radial Wavefunctions & Probabilities</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
                Calculate and visualize the radial wavefunction R(r), probability density R²(r), and radial probability distribution 4πr²R²(r).
              </p>
            </div>

            <RadialDistributionChart />

            <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-3">
              <h4 className="font-bold text-white text-sm">Key Physics Insights:</h4>
              <ul className="space-y-2 list-disc list-inside text-slate-400 leading-relaxed">
                <li>
                  <strong className="text-slate-200">The 1s Paradox:</strong> Wavefunction intensity R(r) is maximum at r = 0, but radial probability 4πr²R² peaks at the Bohr radius (a₀ ≈ 0.529 Å) because the spherical shell volume element dV = 4πr²dr collapses to zero at the origin.
                </li>
                <li>
                  <strong className="text-slate-200">Orbital Penetration:</strong> 2s electrons have a small probability peak close to the nucleus inside the radial node. This penetrates inner electron shielding, stabilizing 2s below 2p in multi-electron atoms.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Aufbau Lab Tab */}
        {activeTab === 'aufbau' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                Subshell Filling Dynamics
              </div>
              <h2 className="text-2xl font-bold text-white">Aufbau Principle & Electron Configurations</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
                Explore electronic structure from Hydrogen (Z = 1) to Zinc (Z = 30). Learn the Madelung (n + l) energy hierarchy, Pauli exclusion, and Hund's rule of maximum multiplicity.
              </p>
            </div>

            <ElectronConfigBuilder />
          </div>
        )}

        {/* Bohr vs QM Comparison Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                Theoretical Deconstruction
              </div>
              <h2 className="text-2xl font-bold text-white">Bohr Model vs. Quantum Mechanical Model</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
                Comprehensive side-by-side comparative analysis of historical and modern atomic theories.
              </p>
            </div>

            <BohrVsQuantumComparison />
          </div>
        )}

        {/* Assessment / Quiz Tab */}
        {activeTab === 'quiz' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                Interactive Checkpoint
              </div>
              <h2 className="text-2xl font-bold text-white">Quantum Mechanical Mastery Assessment</h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
                Test your conceptual grasp of wave-particle duality, nodal formulas, quantum numbers, and electronic configurations.
              </p>
            </div>

            <QuantumQuiz />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950 px-6 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Quantum Mechanical Atomic Model</span>
            <span>·</span>
            <span>Interactive Scientific Presentation & 3D Simulation</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>Ĥψ = Eψ</span>
            <span>·</span>
            <span>λ = h / p</span>
            <span>·</span>
            <span>Δx · Δp ≥ h / (4π)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
