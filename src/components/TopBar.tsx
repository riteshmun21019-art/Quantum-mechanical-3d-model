import React from 'react';
import { Play } from 'lucide-react';

export type ActiveTab = 'presentation' | 'orbitals3d' | 'radial' | 'aufbau' | 'comparison' | 'quiz';

interface TopBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onLaunchPresentation: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onLaunchPresentation,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('presentation');
        }}
        className="text-base md:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
      >
        Quantum Mechanical Model
      </a>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectTab('presentation')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'presentation' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Presentation
        </button>
        <button
          onClick={() => onSelectTab('orbitals3d')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'orbitals3d' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          3D Orbitals
        </button>
        <button
          onClick={() => onSelectTab('radial')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'radial' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Wavefunctions
        </button>
        <button
          onClick={() => onSelectTab('aufbau')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'aufbau' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Aufbau Lab
        </button>
        <button
          onClick={() => onSelectTab('comparison')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'comparison' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Bohr vs QM
        </button>
        <button
          onClick={() => onSelectTab('quiz')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'quiz' ? 'text-cyan-400 font-semibold' : 'text-slate-400'
          }`}
        >
          Assessment
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onLaunchPresentation}
          className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm shadow-cyan-400/20 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Present Slides</span>
        </button>
      </div>
    </header>
  );
};
