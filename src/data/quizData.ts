import { QuizQuestion } from '../types/quantum';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'How many total nodes, radial nodes, and angular nodes does a 3p orbital possess?',
    options: [
      'Total: 2 nodes (1 radial node, 1 angular node)',
      'Total: 3 nodes (2 radial nodes, 1 angular node)',
      'Total: 1 node (0 radial nodes, 1 angular node)',
      'Total: 2 nodes (2 radial nodes, 0 angular nodes)',
    ],
    correctIndex: 0,
    conceptBadge: 'Nodal Calculations',
    explanation: 'For any atomic orbital: Total nodes = n - 1 = 3 - 1 = 2. Angular nodes = l = 1 (since p means l = 1). Radial nodes = n - l - 1 = 3 - 1 - 1 = 1. Therefore, a 3p orbital has 1 spherical radial node and 1 planar angular node, summing to 2 total nodes.',
  },
  {
    id: 2,
    question: 'Which principle forbids two electrons in the same atom from having the same four quantum numbers?',
    options: [
      'Aufbau Principle',
      'Pauli Exclusion Principle',
      'Hund’s Rule of Maximum Multiplicity',
      'Heisenberg Uncertainty Principle',
    ],
    correctIndex: 1,
    conceptBadge: 'Quantum Principles',
    explanation: 'Formulated by Wolfgang Pauli in 1925, the Pauli Exclusion Principle states that no two fermions (such as electrons) can occupy the same quantum state simultaneously. If n, l, and m_l are identical, their spin quantum numbers m_s must be opposite (+½ and -½).',
  },
  {
    id: 3,
    question: 'Why does the electron configuration of Chromium (Z = 24) adopt [Ar] 3d⁵ 4s¹ instead of [Ar] 3d⁴ 4s²?',
    options: [
      '4s electrons are heavier and collapse into the nucleus',
      'Extra exchange energy and symmetrical charge distribution of a exactly half-filled d-subshell lower total system energy',
      'The 4s orbital has a higher principal quantum number so it fills last',
      'Chromium violates Pauli exclusion to become magnetic',
    ],
    correctIndex: 1,
    conceptBadge: 'Anomalous Configuration',
    explanation: 'Subshells that are exactly half-filled (d⁵) or completely filled (d¹⁰) gain significant quantum exchange stabilization energy. The energy advantage of achieving five parallel-spin electrons in the degenerate 3d subshell outweighs the slight cost of promoting an electron from 4s to 3d.',
  },
  {
    id: 4,
    question: 'What is the physical interpretation of |ψ|² (the square of the absolute wavefunction)?',
    options: [
      'The exact mechanical trajectory and velocity of the electron',
      'The electrostatic charge density in Coulombs per meter',
      'The probability density of locating the electron at a given volume element in space',
      'The total relativistic energy of the atomic nucleus',
    ],
    correctIndex: 2,
    conceptBadge: 'Born Interpretation',
    explanation: 'Max Born proposed that while ψ is a complex probability amplitude that can interfere constructively or destructively, its modulus squared |ψ|² = ψ*ψ represents the real probability per unit volume of finding the electron at point (x, y, z).',
  },
  {
    id: 5,
    question: 'For an electron in a 3d subshell, what are the allowed values of the magnetic quantum number (m_l)?',
    options: [
      '0, 1, 2, 3',
      '-2, -1, 0, +1, +2',
      '-1, 0, +1',
      '-3, -2, -1, 0, +1, +2, +3',
    ],
    correctIndex: 1,
    conceptBadge: 'Quantum Numbers',
    explanation: 'For a d subshell, the azimuthal quantum number is l = 2. The magnetic quantum number m_l can take integer values from -l to +l, giving 2(2) + 1 = 5 allowed orientations: m_l ∈ {-2, -1, 0, +1, +2}.',
  },
  {
    id: 6,
    question: 'Why does the radial probability density 4πr²R²(r) of a 1s electron peak at r = a₀ even though the wavefunction R(r) is maximum at r = 0?',
    options: [
      'The nucleus repels the electron via strong nuclear force',
      'The volume of a thin spherical shell (4πr²dr) is zero at r = 0, so the product peaks at r = a₀',
      'Heisenberg uncertainty forbids electrons from entering the nucleus',
      'The 1s electron has a non-zero angular momentum node',
    ],
    correctIndex: 1,
    conceptBadge: 'Radial Probability',
    explanation: 'The radial probability density represents the probability of finding the electron anywhere inside a spherical shell of radius r and thickness dr. Since volume dV = 4πr²dr vanishes at r = 0, finding the electron in an infinitesimally small volume shell at the nucleus is zero, reaching maximum at r = a₀.',
  },
];
