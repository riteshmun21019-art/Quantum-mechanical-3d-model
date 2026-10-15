import { SlideData } from '../types/quantum';

export const PRESENTATION_SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'The Quantum Paradigm Shift',
    subtitle: 'From Deterministic Planetary Orbits to Probabilistic Wave Mechanics',
    category: 'Historical Foundations',
    heroImage: '/src/assets/images/hero_quantum_atom_1792085680251.jpg',
    keyPoints: [
      {
        heading: 'The Failure of Classical Electrodynamics',
        detail: 'Rutherford’s planetary model predicted that accelerating charged electrons would continuously emit electromagnetic radiation, spiraling inward and collapsing the atom in under 10⁻¹¹ seconds.',
      },
      {
        heading: 'Bohr’s Ad-Hoc Quantization (1913)',
        detail: 'Niels Bohr resolved stability by postulating discrete non-radiating orbits where angular momentum L = n · (h / 2π). While accurate for hydrogen, it failed for multi-electron atoms and could not explain chemical bonding or the Zeeman effect.',
        formula: 'L = m_e · v · r = n · (h / 2π)',
      },
      {
        heading: 'The Revolutionary Synthesis (1924–1926)',
        detail: 'Louis de Broglie, Werner Heisenberg, and Erwin Schrödinger dismantled the billiard-ball view of matter, establishing that electrons behave fundamentally as three-dimensional standing matter waves.',
      },
    ],
    interactiveType: 'none',
    speakerNotes: 'Welcome everyone. Today we explore the Quantum Mechanical Model of the atom—the bedrock of modern chemistry, solid-state physics, and nanotechnology. Begin by highlighting the paradox of Rutherford’s atom: classical physics simply could not explain why matter existed stably. Bohr gave us the first quantum bridge, but Schrödinger gave us the true wave mechanics.',
    keyTakeaway: 'The atom is not a miniature solar system; it is a standing three-dimensional quantum probability field.',
    equations: [
      {
        label: 'Bohr Quantization',
        math: 'L = n · ℏ = n · h / (2π)',
        description: 'Discrete angular momentum constraint for hydrogen orbits.',
      },
      {
        label: 'Rydberg Energy',
        math: 'E_n = -13.6 eV / n²',
        description: 'Quantized energy levels of the hydrogen atom.',
      },
    ],
  },
  {
    id: 2,
    title: 'Foundational Pillars of Quantum Mechanics',
    subtitle: 'Wave-Particle Duality and the Heisenberg Uncertainty Principle',
    category: 'Theoretical Principles',
    heroImage: '/src/assets/images/bohr_vs_schrodinger_diagram_1792085680808.jpg',
    keyPoints: [
      {
        heading: 'De Broglie Matter Waves (1924)',
        detail: 'Every moving mass possesses an associated de Broglie wavelength. For an electron with momentum p, λ = h/p. Verified experimentally by Davisson & Germer through electron diffraction in nickel crystals.',
        formula: 'λ = h / p = h / (m_e · v)',
      },
      {
        heading: 'Heisenberg Uncertainty Principle (1927)',
        detail: 'It is fundamentally impossible to simultaneously determine both the exact position (x) and conjugate momentum (p) of a subatomic particle. Precision in one entails inherent fuzziness in the other.',
        formula: 'Δx · Δp ≥ ℏ / 2 = h / (4π)',
      },
      {
        heading: 'Why Bohr Orbits Are Physically Impossible',
        detail: 'A definite circular orbit requires knowing both the electron’s exact radius (x) and tangential velocity (v) at every instant. Heisenberg’s inequality forbids such trajectories, forcing us to abandon orbits for probability clouds.',
      },
    ],
    interactiveType: 'bohrComparison',
    speakerNotes: 'Make sure students grasp that the Uncertainty Principle is NOT a limitation of measurement instruments. It is an intrinsic mathematical property of Fourier conjugate wave variables. You cannot know where an electron is and where it is going with arbitrary precision because an electron is not a localized marble.',
    keyTakeaway: 'Precision in position disperses momentum; quantum mechanics describes probabilities, not deterministic tracks.',
    equations: [
      {
        label: 'de Broglie Relation',
        math: 'λ = h / p',
        description: 'Relates particle momentum to quantum wavelength.',
      },
      {
        label: 'Heisenberg Inequality',
        math: 'Δx · Δp ≥ ℏ / 2',
        description: 'Lower bound on simultaneous quantum indeterminacy.',
      },
    ],
  },
  {
    id: 3,
    title: 'The Schrödinger Wave Equation',
    subtitle: 'The Master Differential Equation Governing Atomic States',
    category: 'Mathematical Formalism',
    keyPoints: [
      {
        heading: 'Time-Independent Schrödinger Equation',
        detail: 'Describes the stationary states of a quantum particle. The Hamiltonian operator Ĥ acts on the wavefunction ψ, yielding the total quantized energy eigenvalue E multiplied by ψ.',
        formula: 'Ĥψ = Eψ  ⟺  [ -(ℏ² / 2m) ∇² + V(r) ] ψ = Eψ',
      },
      {
        heading: 'Max Born’s Probability Interpretation',
        detail: 'The wavefunction ψ itself has no direct physical reality and can be complex or negative. However, the square of its absolute value |ψ|² (or ψ*ψ) represents the probability density of finding the electron at volume dV.',
        formula: 'P(r) dV = |ψ(r)|² dV = ψ*ψ dx dy dz',
      },
      {
        heading: 'Physical Boundary Conditions',
        detail: 'For ψ to be physically meaningful, it must be single-valued, continuous, and normalizable over all space (total probability of finding the electron somewhere in the universe equals 1).',
        formula: '∫ |ψ|² dτ = 1 (Integrated over all space)',
      },
    ],
    interactiveType: 'radialGraph',
    speakerNotes: 'Point out that Erwin Schrödinger solved this for the Coulomb potential V(r) = -e²/(4πε₀r). The boundary conditions naturally gave rise to integer quantum numbers! We didn’t have to force quantization by hand like Bohr did—it emerged organically from wave harmonics, exactly like vibrational modes on a guitar string.',
    keyTakeaway: 'Quantization is the natural boundary condition of standing 3D matter waves in a Coulomb potential.',
    equations: [
      {
        label: 'Eigenvalue Form',
        math: 'Ĥψ = Eψ',
        description: 'Stationary state Schrödinger differential equation.',
      },
      {
        label: 'Normalization',
        math: '∭ |ψ|² dV = 1',
        description: 'Conservation of total electron probability across space.',
      },
    ],
  },
  {
    id: 4,
    title: 'The Four Quantum Numbers',
    subtitle: 'The Unique Quantum Address of Every Electron in an Atom',
    category: 'Quantum Coordinates',
    keyPoints: [
      {
        heading: 'Principal Quantum Number (n)',
        detail: 'Specifies the main electron shell, average distance from the nucleus, and primary energy level. Values: n = 1, 2, 3, ... (K, L, M, N shells). Maximum electron capacity per shell is 2n².',
        formula: 'E_n \\approx -\\frac{13.6\\text{ eV}}{n^2} \\cdot Z_{\\text{eff}}^2',
      },
      {
        heading: 'Azimuthal / Orbital Angular Momentum (l)',
        detail: 'Defines the geometric shape of the subshell and the magnitude of orbital angular momentum. Values range from 0 to (n - 1). l = 0 (s), 1 (p), 2 (d), 3 (f).',
        formula: 'L = \\sqrt{l(l+1)} \\, \\hbar',
      },
      {
        heading: 'Magnetic Quantum Number (m_l)',
        detail: 'Specifies the 3D spatial orientation of the orbital in an external magnetic field. Values range from -l to +l (total of 2l + 1 orientations per subshell).',
        formula: 'm_l \\in \\{-l, -l+1, \\dots, 0, \\dots, l\\}',
      },
      {
        heading: 'Electron Spin Quantum Number (m_s)',
        detail: 'Discovered by Uhlenbeck & Goudsmit. Represents the intrinsic quantum angular momentum of the electron: spin-up (+½) or spin-down (-½).',
        formula: 'S_z = m_s \\hbar = \\pm \\frac{1}{2}\\hbar',
      },
    ],
    interactiveType: 'quantumNumbers',
    speakerNotes: 'Review the hierarchical nested structure: shell (n) contains subshells (l), which contain individual spatial orbitals (m_l), each capable of accommodating up to two electrons of opposite spin (m_s). This directly gives the periodic table its blocks (s, p, d, f) and row lengths (2, 8, 18, 32).',
    keyTakeaway: 'Four quantum numbers uniquely specify the quantum state, energy, spatial shape, orientation, and spin of any electron.',
    equations: [
      {
        label: 'Angular Momentum',
        math: 'L = \\sqrt{l(l+1)}\\hbar',
        description: 'Quantized orbital angular momentum magnitude.',
      },
      {
        label: 'Allowed Orientations',
        math: 'N_m = 2l + 1',
        description: 'Number of degenerate spatial orbitals for subshell l.',
      },
    ],
  },
  {
    id: 5,
    title: 'Anatomy of Atomic Orbitals',
    subtitle: 'Interactive 3D Spatial Geometry, Nodal Surfaces & Electron Clouds',
    category: '3D Spatial Visualizer',
    keyPoints: [
      {
        heading: 'Orbital Definition',
        detail: 'An atomic orbital is a 3D region of space surrounding the nucleus where there is a high probability (typically 90% or 95% contour surface) of locating the electron.',
      },
      {
        heading: 's-Orbitals (l = 0)',
        detail: 'Spherically symmetric. Probability depends purely on radius r, not on angles θ or φ. 1s has 0 nodes; 2s has 1 spherical radial node where probability drops to zero.',
      },
      {
        heading: 'p-Orbitals (l = 1)',
        detail: 'Three mutually perpendicular dumbbell lobes: 2pₓ, 2p_y, 2p_z. Each has one angular nodal plane passing right through the nucleus where electron density is strictly zero.',
      },
      {
        heading: 'd-Orbitals (l = 2)',
        detail: 'Five spatial orientations: four cloverleaf patterns (d_xy, d_xz, d_yz, d_x²-y²) having two nodal planes, and the unique d_z² orbital with two lobes and an equatorial torus.',
      },
    ],
    interactiveType: 'orbital3d',
    speakerNotes: 'Invite the audience to look closely at the 3D visualizer below. Note that opposite lobes of p and d orbitals have opposite signs (+ and -) of the mathematical wavefunction ψ, shown in contrasting colors. Crucially, remind students that an electron does not "cross" the node like a car on a road; rather, the wave has a standing zero amplitude at the node.',
    keyTakeaway: 'Total nodes = n - 1 (Radial nodes = n - l - 1; Angular nodes = l).',
    equations: [
      {
        label: 'Radial Nodes',
        math: 'N_{\\text{radial}} = n - l - 1',
        description: 'Spherical shells where radial wavefunction R(r) = 0.',
      },
      {
        label: 'Angular Nodes',
        math: 'N_{\\text{angular}} = l',
        description: 'Nodal planes or cones passing through the nucleus.',
      },
    ],
  },
  {
    id: 6,
    title: 'Radial Probability Distributions',
    subtitle: 'Mathematical Separation of R(r) and Spherical Harmonics Y(θ, φ)',
    category: 'Wavefunction Analysis',
    keyPoints: [
      {
        heading: 'Separation of Variables in Spherical Coordinates',
        detail: 'The hydrogenic wavefunction separates into radial and angular components: ψ(r, θ, φ) = R_nl(r) · Y_lm(θ, φ). R_nl governs size and energy; Y_lm dictates spatial geometry.',
        formula: '\\psi_{nlm}(r, \\theta, \\phi) = R_{nl}(r) \\cdot Y_{l}^{m_l}(\\theta, \\phi)',
      },
      {
        heading: 'Radial Probability Density 4πr²R²(r)',
        detail: 'While R²(r) is maximum directly at the nucleus for s-orbitals, the volume of a thin spherical shell is 4πr²dr. Thus the probability of finding the electron at distance r peaks at the Bohr radius a₀ for 1s!',
        formula: 'P(r)dr = 4\\pi r^2 \\cdot [R_{nl}(r)]^2 dr',
      },
      {
        heading: 'Orbital Penetration & Shielding',
        detail: 's-electrons have significant probability density very close to the nucleus (penetration), shielding outer p and d electrons and causing the subshell energy split 4s < 3d.',
      },
    ],
    interactiveType: 'radialGraph',
    speakerNotes: 'Address a common student confusion: "Why does the 1s electron have highest radial probability at a₀ when the wavefunction ψ is greatest at r = 0?" The answer lies in geometry: at r = 0, the volume element 4πr²dr vanishes to zero! The product 4πr²R² strikes a peak balance at r = a₀.',
    keyTakeaway: 'Peak probability is the product of wavefunction intensity R²(r) and the expanding spherical shell volume 4πr².',
    equations: [
      {
        label: 'Shell Volume',
        math: 'dV = 4\\pi r^2 dr',
        description: 'Differential volume of a spherical shell at radius r.',
      },
      {
        label: '1s Peak Radius',
        math: 'r_{\\text{max}}(1s) = a_0 = 0.529\\text{ \\AA}',
        description: 'Most probable radial distance matches the classical Bohr radius.',
      },
    ],
  },
  {
    id: 7,
    title: 'Electron Configuration & Orbital Filling Rules',
    subtitle: 'Aufbau, Pauli Exclusion, and Hund’s Rule of Maximum Multiplicity',
    category: 'Electronic Structure',
    keyPoints: [
      {
        heading: 'Aufbau Principle ("Building Up")',
        detail: 'Electrons occupy the lowest available energy orbital first. The filling order follows the (n + l) rule (Madelung rule): 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p → 5s...',
      },
      {
        heading: 'Pauli Exclusion Principle (1925)',
        detail: 'No two electrons in an atom can possess the exact same set of four quantum numbers (n, l, m_l, m_s). Consequently, an orbital can hold a maximum of 2 electrons with paired opposite spins.',
      },
      {
        heading: 'Hund’s Rule of Maximum Multiplicity',
        detail: 'When degenerate orbitals of equal energy (like 2p_x, 2p_y, 2p_z) are filled, electrons singly occupy each orbital with parallel spins before any pairing occurs, minimizing inter-electron repulsion.',
      },
      {
        heading: 'Anomalous Half-Filled & Fully-Filled Stability',
        detail: 'Chromium ([Ar] 4s¹ 3d⁵) and Copper ([Ar] 4s¹ 3d¹⁰) adopt special configurations due to exchange energy stabilization and symmetrical spatial charge distribution.',
      },
    ],
    interactiveType: 'electronConfig',
    speakerNotes: 'Demonstrate Hund’s rule using the bus seating analogy: strangers prefer to sit in empty double seats with parallel orientation before sharing a seat. Point out that exchange energy is a purely quantum-mechanical phenomenon arising from wavefunction antisymmetry under fermion exchange.',
    keyTakeaway: 'Electronic architecture determines chemical valency, reactivity, magnetic susceptibility, and periodic periodicity.',
    equations: [
      {
        label: '(n + l) Rule',
        math: 'E(4s) < E(3d) \\implies (4+0=4) < (3+2=5)',
        description: 'Predicts subshell energy ordering in multi-electron atoms.',
      },
      {
        label: 'Degeneracy Capacity',
        math: 'C = 2(2l + 1)',
        description: 'Maximum electrons in subshell l (s: 2, p: 6, d: 10, f: 14).',
      },
    ],
  },
  {
    id: 8,
    title: 'Comparative Analysis: Bohr vs. Schrödinger',
    subtitle: 'Side-by-Side Deconstruction of the Classical-to-Quantum Leap',
    category: 'Theoretical Rigor',
    heroImage: '/src/assets/images/bohr_vs_schrodinger_diagram_1792085680808.jpg',
    keyPoints: [
      {
        heading: 'Trajectory vs. Probability Cloud',
        detail: 'Bohr: Electron is a localized particle travelling in planar circular 1D orbits. Quantum: Electron is a delocalized standing wave characterized by a 3D probability density |ψ|².',
      },
      {
        heading: 'Scope & Multi-Electron Applicability',
        detail: 'Bohr: Accurately calculated Rydberg spectral lines for single-electron species (H, He⁺, Li²⁺), but failed completely for helium (Z = 2) and beyond. Quantum: Rigorously solves multi-electron systems using Hartree-Fock & Density Functional Theory (DFT).',
      },
      {
        heading: 'Spectral Fine Structure & External Fields',
        detail: 'Bohr could not explain spectral line splitting in magnetic fields (Zeeman effect) or electric fields (Stark effect). Quantum mechanics naturally accounts for these through angular momentum coupling and spin-orbit interaction.',
      },
    ],
    interactiveType: 'bohrComparison',
    speakerNotes: 'Bohr was a courageous provisional stepping stone that introduced energy quantization. But the Quantum Mechanical Model is the complete, self-consistent theory. Emphasize how the Quantum Model explains why the periodic table has blocks and why carbon forms tetrahedral sp³ hybrid bonds in diamond and organic chemistry.',
    keyTakeaway: 'The transition from Bohr to Schrödinger replaced classical certainty with mathematical quantum probability.',
    equations: [
      {
        label: 'Zeeman Splitting',
        math: '\\Delta E = m_l \\cdot \\mu_B \\cdot B',
        description: 'Orbital energy level splitting under external magnetic field B.',
      },
    ],
  },
  {
    id: 9,
    title: 'Quantum Applications Shaping Modern Technology',
    subtitle: 'From Magnetic Resonance to Quantum Computing and Nanotechnology',
    category: 'Technological Impact',
    heroImage: '/src/assets/images/quantum_spectroscopy_mri_1792085681380.jpg',
    keyPoints: [
      {
        heading: 'Nuclear Magnetic Resonance (NMR & MRI)',
        detail: 'Relies directly on the quantum spin states of hydrogen nuclei and electrons in strong magnetic fields. RF pulses excite spin flips, yielding high-resolution cross-sectional tissue imaging with zero ionizing radiation.',
      },
      {
        heading: 'Semiconductors, Transistors & Band Theory',
        detail: 'Modern silicon microchips and smartphones operate because quantum mechanical overlap of atomic orbitals forms conduction and valence energy bands, governing electron mobility and p-n junctions.',
      },
      {
        heading: 'Scanning Tunneling Microscopy (STM)',
        detail: 'Exploits quantum wave tunneling of electrons through a potential barrier to image individual atoms and manipulate single atomic orbitals on metal surfaces.',
      },
      {
        heading: 'Quantum Computing & Qubits',
        detail: 'Harnesses quantum superposition (linear combinations of |0⟩ and |1⟩ wavefunctions) and quantum entanglement to solve polynomial and exponential computational challenges.',
      },
    ],
    interactiveType: 'none',
    speakerNotes: 'Conclude the presentation by reminding the audience: Quantum mechanics is not abstract philosophy locked in an ivory tower. Over 30% of the modern global GDP traces its origins to technologies rooted in quantum mechanics: microprocessors, lasers, MRI scanners, LED displays, and solar cells.',
    keyTakeaway: 'Every silicon transistor, laser diode, and medical MRI scan is a direct embodiment of the quantum mechanical model.',
    equations: [
      {
        label: 'Larmor Frequency',
        math: '\\omega_0 = \\gamma B_0',
        description: 'Nuclear spin precession frequency fundamental to clinical MRI.',
      },
      {
        label: 'Quantum Tunneling',
        math: 'T \\propto e^{-2 \\kappa d}, \\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}',
        description: 'Exponential barrier transmission rate in Scanning Tunneling Microscopy.',
      },
    ],
  },
];
