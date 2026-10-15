export type OrbitalType =
  // s-orbitals
  | '1s' | '2s' | '3s' | '4s'
  // p-orbitals
  | '2px' | '2py' | '2pz' | '3px' | '3py' | '3pz' | '4pz'
  // d-orbitals
  | '3dz2' | '3dx2y2' | '3dxy' | '3dxz' | '3dyz' | '4dz2'
  // 7 f-orbitals
  | '4fz3' | '4fxz2' | '4fyz2' | '4fxyz' | '4fz_x2y2' | '4fx_x2_3y2' | '4fy_3x2_y2'
  // Hybrid orbitals
  | 'hybrid_sp' | 'hybrid_sp2' | 'hybrid_sp3' | 'hybrid_dsp3' | 'hybrid_d2sp3'
  // Molecular orbitals
  | 'mo_sigma_1s' | 'mo_sigma_star_1s' | 'mo_pi_2p' | 'mo_pi_star_2p'
  // Multi-orbital atomic superposition
  | 'atom_H' | 'atom_C' | 'atom_Ne';

export interface OrbitalInfo {
  id: OrbitalType;
  name: string;
  n: number;
  l: number;
  ml: number | string;
  subshell: 's' | 'p' | 'd' | 'f' | 'hybrid' | 'molecular' | 'atom';
  categoryGroup: 's-Orbitals' | 'p-Orbitals' | 'd-Orbitals' | 'f-Orbitals' | 'Hybrid Orbitals' | 'Molecular Orbitals' | 'Full Atom Overlays';
  shapeDescription: string;
  radialNodes: number;
  angularNodes: number;
  totalNodes: number;
  nodalSurfaces: string;
  wavefunctionFormula: string;
  colorPositive: string;
  colorNegative: string;
}

export interface QuantumNumbers {
  n: number;      // Principal quantum number (1, 2, 3...)
  l: number;      // Azimuthal / Angular momentum quantum number (0 to n-1)
  ml: number;     // Magnetic quantum number (-l to +l)
  ms: number;     // Spin quantum number (+1/2 or -1/2)
}

export interface ElementData {
  atomicNumber: number;
  symbol: string;
  name: string;
  period: number;
  group: number;
  configuration: string;
  shortConfig: string;
  electrons: number;
  valenceElectrons: number;
  category: string;
  subshells: {
    name: string;
    capacity: number;
    filled: number;
    boxes: { spins: ('up' | 'down')[] }[];
  }[];
}

export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  keyPoints: {
    heading: string;
    detail: string;
    formula?: string;
  }[];
  heroImage?: string;
  interactiveType?: 'orbital3d' | 'radialGraph' | 'electronConfig' | 'bohrComparison' | 'quantumNumbers' | 'none';
  speakerNotes: string;
  keyTakeaway: string;
  equations?: {
    label: string;
    math: string;
    description: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptBadge: string;
}
