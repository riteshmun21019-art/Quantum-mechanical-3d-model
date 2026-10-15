import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { ORBITALS_DATA } from '../data/orbitalsData';
import { OrbitalType, OrbitalInfo } from '../types/quantum';
import {
  Eye,
  RotateCcw,
  Play,
  Pause,
  Scissors,
  Layers,
  Sparkles,
  Sliders,
  Maximize2,
  ChevronDown,
  Info,
  Compass,
  Grid
} from 'lucide-react';

interface OrbitalCanvas3DProps {
  initialOrbital?: OrbitalType;
  height?: string;
  showSelector?: boolean;
}

const CATEGORY_TABS = [
  'All',
  's-Orbitals',
  'p-Orbitals',
  'd-Orbitals',
  'f-Orbitals',
  'Hybrid Orbitals',
  'Molecular Orbitals',
  'Full Atom Overlays',
] as const;

export const OrbitalCanvas3D: React.FC<OrbitalCanvas3DProps> = ({
  initialOrbital = '2pz',
  height = '600px',
  showSelector = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedOrbital, setSelectedOrbital] = useState<OrbitalType>(initialOrbital);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [renderMode, setRenderMode] = useState<'both' | 'cloud' | 'surface'>('both');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [isPhasePulsing, setIsPhasePulsing] = useState<boolean>(false);
  const [showSlice, setShowSlice] = useState<boolean>(false);
  const [sliceAxis, setSliceAxis] = useState<'y' | 'z' | 'x'>('y');
  const [sliceOffset, setSliceOffset] = useState<number>(0);
  const [showAxes, setShowAxes] = useState<boolean>(true);
  const [showNodalWireframe, setShowNodalWireframe] = useState<boolean>(false);
  const [pointDensity, setPointDensity] = useState<number>(12000);
  const [surfaceOpacity, setSurfaceOpacity] = useState<number>(0.75);
  const [isDockOpen, setIsDockOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mutable state reference for requestAnimationFrame loop
  const stateRef = useRef({
    selectedOrbital,
    renderMode,
    isRotating,
    isPhasePulsing,
    showSlice,
    sliceAxis,
    sliceOffset,
    showAxes,
    showNodalWireframe,
    pointDensity,
    surfaceOpacity,
  });

  stateRef.current = {
    selectedOrbital,
    renderMode,
    isRotating,
    isPhasePulsing,
    showSlice,
    sliceAxis,
    sliceOffset,
    showAxes,
    showNodalWireframe,
    pointDensity,
    surfaceOpacity,
  };

  const sceneGroupRef = useRef<THREE.Group | null>(null);
  const nodalGroupRef = useRef<THREE.Group | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040711); // Midnight quantum void
    scene.fog = new THREE.FogExp2(0x040711, 0.025);

    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    camera.position.set(5.2, 3.6, 6.2);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);

    // Dynamic clipping plane for cutaway slicing
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    clipPlaneRef.current = clipPlane;

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8); // Cyan key
    keyLight.position.set(6, 10, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf43f5e, 2.0); // Coral rim
    rimLight.position.set(-8, -5, -6);
    scene.add(rimLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 0.6);
    scene.add(hemiLight);

    // Axes
    const axesHelper = new THREE.AxesHelper(3.5);
    (axesHelper.material as THREE.Material).depthWrite = false;
    scene.add(axesHelper);

    // Master orbital container
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);
    sceneGroupRef.current = orbitalGroup;

    // Nodal surfaces container
    const nodalGroup = new THREE.Group();
    scene.add(nodalGroup);
    nodalGroupRef.current = nodalGroup;

    // Central Nucleus Cluster
    const nucleusGroup = new THREE.Group();
    const sphereGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const protonMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.2,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.4,
    });
    const neutronMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.2,
      emissive: 0x1e3a8a,
      emissiveIntensity: 0.4,
    });

    const nuclealOffsets = [
      [0, 0, 0, protonMat],
      [0.08, 0.05, 0, neutronMat],
      [-0.07, -0.05, 0.04, protonMat],
      [0.02, -0.08, -0.06, neutronMat],
      [-0.05, 0.07, -0.04, protonMat],
      [0.06, -0.04, 0.07, neutronMat],
    ] as const;

    nuclealOffsets.forEach(([x, y, z, mat]) => {
      const mesh = new THREE.Mesh(sphereGeo, mat);
      mesh.position.set(x, y, z);
      nucleusGroup.add(mesh);
    });
    scene.add(nucleusGroup);

    // Orbit Controls logic
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
      targetRotationX = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, targetRotationX));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = 1 + e.deltaY * 0.001;
      camera.position.multiplyScalar(Math.max(0.6, Math.min(1.8, zoomFactor)));
      camera.position.clampLength(2.2, 16);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onPointerDown);
    domElement.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    domElement.addEventListener('touchstart', onPointerDown, { passive: true });
    domElement.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Update clipping plane dynamically
      if (clipPlaneRef.current) {
        const { sliceAxis, sliceOffset, showSlice } = stateRef.current;
        if (showSlice) {
          if (sliceAxis === 'y') clipPlaneRef.current.normal.set(0, 1, 0);
          else if (sliceAxis === 'z') clipPlaneRef.current.normal.set(0, 0, 1);
          else clipPlaneRef.current.normal.set(1, 0, 0);
          clipPlaneRef.current.constant = -sliceOffset;
        }
      }

      // Smooth camera damping & rotation
      if (stateRef.current.isRotating && !isDragging) {
        targetRotationY += 0.22 * dt;
      }

      currentRotationX = THREE.MathUtils.damp(currentRotationX, targetRotationX, 10, dt);
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 10, dt);

      if (orbitalGroup) {
        orbitalGroup.rotation.x = currentRotationX;
        orbitalGroup.rotation.y = currentRotationY;
      }
      if (nodalGroup) {
        nodalGroup.rotation.x = currentRotationX;
        nodalGroup.rotation.y = currentRotationY;
        nodalGroup.visible = stateRef.current.showNodalWireframe;
      }
      if (axesHelper) {
        axesHelper.visible = stateRef.current.showAxes;
        axesHelper.rotation.x = currentRotationX;
        axesHelper.rotation.y = currentRotationY;
      }

      // Time-dependent wave phase pulsation ψ(t)
      if (stateRef.current.isPhasePulsing && orbitalGroup) {
        const pulse = 1 + 0.05 * Math.sin(time * 0.004);
        orbitalGroup.scale.set(pulse, pulse, pulse);
      } else if (orbitalGroup.scale.x !== 1) {
        orbitalGroup.scale.set(1, 1, 1);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('mousemove', onPointerMove);
      domElement.removeEventListener('touchstart', onPointerDown);
      domElement.removeEventListener('touchmove', onPointerMove);
      domElement.removeEventListener('wheel', onWheel);

      renderer.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // Procedural 3D Orbital Mesh & Probability Cloud Generation
  useEffect(() => {
    const orbitalGroup = sceneGroupRef.current;
    const nodalGroup = nodalGroupRef.current;
    if (!orbitalGroup || !nodalGroup) return;

    // Clear previous orbital meshes
    while (orbitalGroup.children.length > 0) {
      const child = orbitalGroup.children[0];
      orbitalGroup.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    // Clear nodal wireframes
    while (nodalGroup.children.length > 0) {
      const child = nodalGroup.children[0];
      nodalGroup.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.LineSegments) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
    }

    const info = ORBITALS_DATA[selectedOrbital];
    const clippingPlanes = showSlice && clipPlaneRef.current ? [clipPlaneRef.current] : [];

    const cyanColor = 0x06b6d4;
    const roseColor = 0xf43f5e;
    const amberColor = 0xf59e0b;
    const purpleColor = 0x8b5cf6;
    const emeraldColor = 0x10b981;

    // Advanced PBR material factory
    const createLobeMat = (colorHex: number, opacity = surfaceOpacity) =>
      new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness: 0.18,
        metalness: 0.12,
        transmission: 0.3,
        opacity: opacity,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        clippingPlanes,
        clipShadows: true,
        clearcoat: 0.8,
        clearcoatRoughness: 0.15,
      });

    // Teardrop / dumbbell lobe parametric builder
    const createTeardropMesh = (
      length: number,
      radius: number,
      isPositive: boolean,
      colorHex?: number
    ) => {
      const geo = new THREE.SphereGeometry(radius, 32, 32);
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const z = pos.getZ(i);
        const taper = 0.35 + (z + radius) * 0.75;
        pos.setX(i, pos.getX(i) * taper);
        pos.setY(i, pos.getY(i) * taper);
      }
      geo.computeVertexNormals();

      const mat = createLobeMat(colorHex || (isPositive ? cyanColor : roseColor));
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.z = isPositive ? length : -length;
      if (!isPositive) mesh.rotation.y = Math.PI;
      return mesh;
    };

    // 1. ISOSURFACE / MESH GENERATION
    if (renderMode === 'both' || renderMode === 'surface') {
      const surfaceGroup = new THREE.Group();

      // ==================== s-ORBITALS ====================
      if (selectedOrbital === '1s') {
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 48), createLobeMat(cyanColor));
        surfaceGroup.add(mesh);
      } else if (selectedOrbital === '2s') {
        const outer = new THREE.Mesh(new THREE.SphereGeometry(2.35, 48, 48), createLobeMat(cyanColor, 0.42));
        const inner = new THREE.Mesh(new THREE.SphereGeometry(0.85, 36, 36), createLobeMat(amberColor, 0.78));
        surfaceGroup.add(outer, inner);
      } else if (selectedOrbital === '3s') {
        const s3 = new THREE.Mesh(new THREE.SphereGeometry(2.8, 48, 48), createLobeMat(cyanColor, 0.35));
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(1.65, 36, 36), createLobeMat(amberColor, 0.5));
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 28, 28), createLobeMat(cyanColor, 0.78));
        surfaceGroup.add(s3, s2, s1);
      } else if (selectedOrbital === '4s') {
        const s4 = new THREE.Mesh(new THREE.SphereGeometry(3.2, 48, 48), createLobeMat(cyanColor, 0.28));
        const s3 = new THREE.Mesh(new THREE.SphereGeometry(2.2, 36, 36), createLobeMat(amberColor, 0.42));
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(1.3, 32, 32), createLobeMat(cyanColor, 0.58));
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 24), createLobeMat(amberColor, 0.8));
        surfaceGroup.add(s4, s3, s2, s1);
      }

      // ==================== p-ORBITALS ====================
      else if (selectedOrbital.includes('p') && !selectedOrbital.includes('hybrid') && !selectedOrbital.includes('mo')) {
        const pGroup = new THREE.Group();
        pGroup.add(createTeardropMesh(1.1, 0.82, true));
        pGroup.add(createTeardropMesh(1.1, 0.82, false));

        // Radial nodes for 3p or 4p
        if (selectedOrbital.startsWith('3p')) {
          const innerShell = new THREE.Mesh(new THREE.SphereGeometry(0.75, 28, 28), createLobeMat(amberColor, 0.5));
          pGroup.add(innerShell);
        } else if (selectedOrbital.startsWith('4p')) {
          const shell2 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 32), createLobeMat(amberColor, 0.4));
          const shell1 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), createLobeMat(cyanColor, 0.65));
          pGroup.add(shell2, shell1);
        }

        if (selectedOrbital.includes('px')) {
          pGroup.rotation.y = Math.PI / 2;
        } else if (selectedOrbital.includes('py')) {
          pGroup.rotation.x = -Math.PI / 2;
        }

        surfaceGroup.add(pGroup);
      }

      // ==================== d-ORBITALS ====================
      else if (selectedOrbital === '3dz2' || selectedOrbital === '4dz2') {
        const dzGroup = new THREE.Group();
        dzGroup.add(createTeardropMesh(1.15, 0.75, true, cyanColor));
        dzGroup.add(createTeardropMesh(1.15, 0.75, false, cyanColor));

        const torusGeo = new THREE.TorusGeometry(0.92, 0.28, 24, 48);
        const torusMesh = new THREE.Mesh(torusGeo, createLobeMat(roseColor));
        torusMesh.rotation.x = Math.PI / 2;
        dzGroup.add(torusMesh);

        if (selectedOrbital === '4dz2') {
          const innerRing = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.15, 20, 36), createLobeMat(amberColor, 0.5));
          innerRing.rotation.x = Math.PI / 2;
          dzGroup.add(innerRing);
        }

        surfaceGroup.add(dzGroup);
      } else if (
        selectedOrbital === '3dx2y2' ||
        selectedOrbital === '3dxy' ||
        selectedOrbital === '3dxz' ||
        selectedOrbital === '3dyz'
      ) {
        const cloverGroup = new THREE.Group();
        const createCloverLobe = (isPositive: boolean) => {
          const geo = new THREE.SphereGeometry(0.65, 28, 28);
          const pos = geo.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const z = pos.getZ(i);
            const scale = 0.45 + (z + 0.65) * 0.7;
            pos.setX(i, pos.getX(i) * scale);
            pos.setY(i, pos.getY(i) * scale);
          }
          geo.computeVertexNormals();
          const mesh = new THREE.Mesh(geo, createLobeMat(isPositive ? cyanColor : roseColor));
          mesh.position.z = 0.95;
          return mesh;
        };

        const l1 = createCloverLobe(true);
        const l2 = createCloverLobe(true);
        l2.rotation.y = Math.PI;
        const l3 = createCloverLobe(false);
        l3.rotation.y = Math.PI / 2;
        const l4 = createCloverLobe(false);
        l4.rotation.y = -Math.PI / 2;

        cloverGroup.add(l1, l2, l3, l4);

        if (selectedOrbital === '3dx2y2') {
          cloverGroup.rotation.x = Math.PI / 2;
        } else if (selectedOrbital === '3dxy') {
          cloverGroup.rotation.x = Math.PI / 2;
          cloverGroup.rotation.z = Math.PI / 4;
        } else if (selectedOrbital === '3dxz') {
          cloverGroup.rotation.y = Math.PI / 4;
        } else if (selectedOrbital === '3dyz') {
          cloverGroup.rotation.x = Math.PI / 4;
        }

        surfaceGroup.add(cloverGroup);
      }

      // ==================== ALL 7 f-ORBITALS ====================
      else if (selectedOrbital === '4fz3') {
        // Two long z-lobes (+ and -) + TWO stacked donut rings!
        const fzGroup = new THREE.Group();
        fzGroup.add(createTeardropMesh(1.3, 0.68, true, purpleColor));
        fzGroup.add(createTeardropMesh(1.3, 0.68, false, emeraldColor));

        const r1 = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.22, 20, 36), createLobeMat(emeraldColor));
        r1.rotation.x = Math.PI / 2;
        r1.position.z = 0.55;

        const r2 = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.22, 20, 36), createLobeMat(purpleColor));
        r2.rotation.x = Math.PI / 2;
        r2.position.z = -0.55;

        fzGroup.add(r1, r2);
        surfaceGroup.add(fzGroup);
      } else if (selectedOrbital === '4fxyz') {
        // Eight lobes pointing into the 8 octants with alternating sign!
        const octGroup = new THREE.Group();
        const signs = [
          [1, 1, 1],
          [-1, 1, 1],
          [1, -1, 1],
          [1, 1, -1],
          [-1, -1, 1],
          [-1, 1, -1],
          [1, -1, -1],
          [-1, -1, -1],
        ];

        signs.forEach(([sx, sy, sz]) => {
          const isPositive = sx * sy * sz > 0;
          const geo = new THREE.SphereGeometry(0.5, 24, 24);
          const mesh = new THREE.Mesh(geo, createLobeMat(isPositive ? purpleColor : emeraldColor));
          const dir = new THREE.Vector3(sx, sy, sz).normalize().multiplyScalar(1.15);
          mesh.position.copy(dir);
          octGroup.add(mesh);
        });

        surfaceGroup.add(octGroup);
      } else if (selectedOrbital === '4fx_x2_3y2' || selectedOrbital === '4fy_3x2_y2') {
        // Six lobes in xy-plane
        const sixGroup = new THREE.Group();
        const baseAngleOffset = selectedOrbital === '4fy_3x2_y2' ? Math.PI / 6 : 0;

        for (let i = 0; i < 6; i++) {
          const angle = baseAngleOffset + (i * Math.PI) / 3;
          const isPositive = i % 2 === 0;
          const geo = new THREE.SphereGeometry(0.55, 24, 24);
          const mesh = new THREE.Mesh(geo, createLobeMat(isPositive ? purpleColor : emeraldColor));
          mesh.position.set(Math.cos(angle) * 1.15, Math.sin(angle) * 1.15, 0);
          sixGroup.add(mesh);
        }

        surfaceGroup.add(sixGroup);
      } else if (selectedOrbital === '4fz_x2y2') {
        // Eight lobes: 4 above xy-plane, 4 below
        const f8Group = new THREE.Group();
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const isPosTop = i % 2 === 0;
          const geoTop = new THREE.SphereGeometry(0.48, 24, 24);
          const meshTop = new THREE.Mesh(geoTop, createLobeMat(isPosTop ? purpleColor : emeraldColor));
          meshTop.position.set(Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, 0.7);

          const isPosBot = !isPosTop;
          const geoBot = new THREE.SphereGeometry(0.48, 24, 24);
          const meshBot = new THREE.Mesh(geoBot, createLobeMat(isPosBot ? purpleColor : emeraldColor));
          meshBot.position.set(Math.cos(angle) * 0.95, Math.sin(angle) * 0.95, -0.7);

          f8Group.add(meshTop, meshBot);
        }
        surfaceGroup.add(f8Group);
      } else if (selectedOrbital === '4fxz2' || selectedOrbital === '4fyz2') {
        // Six lobes with primary orientation along X or Y
        const f6Group = new THREE.Group();
        f6Group.add(createTeardropMesh(1.2, 0.65, true, purpleColor));
        f6Group.add(createTeardropMesh(1.2, 0.65, false, emeraldColor));

        const sideLobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), createLobeMat(emeraldColor));
        sideLobe1.position.set(0.65, 0, 0.65);
        const sideLobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.52, 24, 24), createLobeMat(purpleColor));
        sideLobe2.position.set(-0.65, 0, -0.65);

        f6Group.add(sideLobe1, sideLobe2);

        if (selectedOrbital === '4fxz2') {
          f6Group.rotation.y = Math.PI / 2;
        } else {
          f6Group.rotation.x = -Math.PI / 2;
        }

        surfaceGroup.add(f6Group);
      }

      // ==================== HYBRID ORBITALS ====================
      else if (selectedOrbital === 'hybrid_sp') {
        // Linear: 2 lobes at 180 degrees with major lobe and minor tail
        const spGroup = new THREE.Group();
        const createSpLobe = (dirZ: number) => {
          const lGroup = new THREE.Group();
          const headGeo = new THREE.SphereGeometry(0.72, 28, 28);
          const head = new THREE.Mesh(headGeo, createLobeMat(amberColor));
          head.position.z = dirZ * 1.05;

          const tailGeo = new THREE.SphereGeometry(0.28, 20, 20);
          const tail = new THREE.Mesh(tailGeo, createLobeMat(cyanColor));
          tail.position.z = -dirZ * 0.38;

          lGroup.add(head, tail);
          return lGroup;
        };
        spGroup.add(createSpLobe(1));
        spGroup.add(createSpLobe(-1));
        surfaceGroup.add(spGroup);
      } else if (selectedOrbital === 'hybrid_sp2') {
        // Trigonal planar: 3 lobes at 120 degrees in xy plane
        const sp2Group = new THREE.Group();
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3;
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.68, 26, 26), createLobeMat(amberColor));
          head.position.set(Math.cos(angle) * 1.05, Math.sin(angle) * 1.05, 0);

          const tail = new THREE.Mesh(new THREE.SphereGeometry(0.25, 18, 18), createLobeMat(cyanColor));
          tail.position.set(-Math.cos(angle) * 0.35, -Math.sin(angle) * 0.35, 0);

          sp2Group.add(head, tail);
        }
        surfaceGroup.add(sp2Group);
      } else if (selectedOrbital === 'hybrid_sp3') {
        // Tetrahedral: 4 lobes at 109.5 degrees
        const sp3Group = new THREE.Group();
        const tetDirs = [
          new THREE.Vector3(1, 1, 1).normalize(),
          new THREE.Vector3(1, -1, -1).normalize(),
          new THREE.Vector3(-1, 1, -1).normalize(),
          new THREE.Vector3(-1, -1, 1).normalize(),
        ];

        tetDirs.forEach((dir) => {
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 26, 26), createLobeMat(amberColor));
          head.position.copy(dir.clone().multiplyScalar(1.1));

          const tail = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 18), createLobeMat(cyanColor));
          tail.position.copy(dir.clone().multiplyScalar(-0.35));

          sp3Group.add(head, tail);
        });

        surfaceGroup.add(sp3Group);
      } else if (selectedOrbital === 'hybrid_dsp3') {
        // Trigonal bipyramidal: 3 equatorial + 2 axial
        const dsp3Group = new THREE.Group();
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3;
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), createLobeMat(amberColor));
          head.position.set(Math.cos(angle) * 1.05, Math.sin(angle) * 1.05, 0);
          dsp3Group.add(head);
        }
        const topAxial = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 24), createLobeMat(amberColor));
        topAxial.position.set(0, 0, 1.15);
        const botAxial = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 24), createLobeMat(amberColor));
        botAxial.position.set(0, 0, -1.15);
        dsp3Group.add(topAxial, botAxial);
        surfaceGroup.add(dsp3Group);
      } else if (selectedOrbital === 'hybrid_d2sp3') {
        // Octahedral: 6 lobes along +/- x, y, z
        const d2sp3Group = new THREE.Group();
        const dirs = [
          [1, 0, 0],
          [-1, 0, 0],
          [0, 1, 0],
          [0, -1, 0],
          [0, 0, 1],
          [0, 0, -1],
        ];
        dirs.forEach(([dx, dy, dz]) => {
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), createLobeMat(amberColor));
          head.position.set(dx * 1.05, dy * 1.05, dz * 1.05);
          d2sp3Group.add(head);
        });
        surfaceGroup.add(d2sp3Group);
      }

      // ==================== MOLECULAR ORBITALS ====================
      else if (selectedOrbital === 'mo_sigma_1s') {
        // Bonding: single continuous ellipsoidal envelope surrounding both nuclei
        const bondMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 36, 36), createLobeMat(emeraldColor, 0.75));
        bondMesh.scale.set(1.5, 1.0, 1.0);
        surfaceGroup.add(bondMesh);
      } else if (selectedOrbital === 'mo_sigma_star_1s') {
        // Antibonding: 2 separated lobes with a nodal plane in between
        const lLeft = new THREE.Mesh(new THREE.SphereGeometry(0.85, 28, 28), createLobeMat(emeraldColor));
        lLeft.position.x = -1.0;
        const lRight = new THREE.Mesh(new THREE.SphereGeometry(0.85, 28, 28), createLobeMat(roseColor));
        lRight.position.x = 1.0;
        surfaceGroup.add(lLeft, lRight);
      } else if (selectedOrbital === 'mo_pi_2p') {
        // Pi bonding: 2 sausage lobes above and below bond axis
        const topSausage = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.8, 24), createLobeMat(emeraldColor));
        topSausage.rotation.z = Math.PI / 2;
        topSausage.position.y = 0.7;

        const botSausage = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.8, 24), createLobeMat(roseColor));
        botSausage.rotation.z = Math.PI / 2;
        botSausage.position.y = -0.7;

        surfaceGroup.add(topSausage, botSausage);
      } else if (selectedOrbital === 'mo_pi_star_2p') {
        // Pi antibonding: 4 lobes
        const p1 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), createLobeMat(emeraldColor));
        p1.position.set(-0.7, 0.65, 0);
        const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), createLobeMat(roseColor));
        p2.position.set(0.7, 0.65, 0);
        const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), createLobeMat(roseColor));
        p3.position.set(-0.7, -0.65, 0);
        const p4 = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 20), createLobeMat(emeraldColor));
        p4.position.set(0.7, -0.65, 0);

        surfaceGroup.add(p1, p2, p3, p4);
      }

      // ==================== FULL ATOM OVERLAYS ====================
      else if (selectedOrbital === 'atom_H') {
        const hMesh = new THREE.Mesh(new THREE.SphereGeometry(1.6, 40, 40), createLobeMat(cyanColor, 0.65));
        surfaceGroup.add(hMesh);
      } else if (selectedOrbital === 'atom_C') {
        // 1s + 2s + 2px + 2py
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 24), createLobeMat(cyanColor, 0.7));
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(1.8, 36, 36), createLobeMat(amberColor, 0.35));
        const px = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), createLobeMat(cyanColor, 0.5));
        px.scale.set(2.2, 0.8, 0.8);
        const py = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), createLobeMat(roseColor, 0.5));
        py.scale.set(0.8, 2.2, 0.8);

        surfaceGroup.add(s1, s2, px, py);
      } else if (selectedOrbital === 'atom_Ne') {
        // 1s + 2s + 2px + 2py + 2pz = Perfectly spherical electronic mantle
        const s1 = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), createLobeMat(cyanColor, 0.8));
        const s2 = new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), createLobeMat(amberColor, 0.45));
        const px = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), createLobeMat(cyanColor, 0.35));
        px.scale.set(2.4, 0.75, 0.75);
        const py = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), createLobeMat(roseColor, 0.35));
        py.scale.set(0.75, 2.4, 0.75);
        const pz = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), createLobeMat(purpleColor, 0.35));
        pz.scale.set(0.75, 0.75, 2.4);

        surfaceGroup.add(s1, s2, px, py, pz);
      }

      orbitalGroup.add(surfaceGroup);
    }

    // 2. QUANTUM PROBABILITY CLOUD (|ψ|² REJECTION SAMPLING)
    if (renderMode === 'both' || renderMode === 'cloud') {
      const count = pointDensity;
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);

      let accepted = 0;
      let attempts = 0;
      const maxAttempts = count * 35;

      const cCyan = new THREE.Color(cyanColor);
      const cRose = new THREE.Color(roseColor);
      const cAmber = new THREE.Color(amberColor);
      const cPurple = new THREE.Color(purpleColor);
      const cEmerald = new THREE.Color(emeraldColor);

      while (accepted < count && attempts < maxAttempts) {
        attempts++;

        const rMax = selectedOrbital.startsWith('1')
          ? 3.2
          : selectedOrbital.startsWith('2')
          ? 5.0
          : selectedOrbital.startsWith('3')
          ? 6.8
          : 8.5;

        const r = Math.random() * rMax;
        const theta = Math.acos(2 * Math.random() - 1);
        const phi = Math.random() * 2 * Math.PI;

        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        // Check clipping slice plane
        if (showSlice) {
          if (sliceAxis === 'y' && y < sliceOffset) continue;
          if (sliceAxis === 'z' && z < sliceOffset) continue;
          if (sliceAxis === 'x' && x < sliceOffset) continue;
        }

        const a0 = 1.0;
        const rho = r / a0;
        let psi = 0;

        // Wavefunction amplitude evaluation
        if (selectedOrbital === '1s' || selectedOrbital === 'atom_H') {
          psi = Math.exp(-rho);
        } else if (selectedOrbital === '2s') {
          psi = (2 - rho) * Math.exp(-rho / 2);
        } else if (selectedOrbital === '3s') {
          psi = (27 - 18 * (rho / 3) + 2 * (rho / 3) ** 2) * Math.exp(-rho / 3);
        } else if (selectedOrbital === '4s') {
          psi = (192 - 144 * (rho / 4) + 24 * (rho / 4) ** 2 - (rho / 4) ** 3) * Math.exp(-rho / 4);
        } else if (selectedOrbital === '2px') {
          psi = x * Math.exp(-rho / 2);
        } else if (selectedOrbital === '2py') {
          psi = y * Math.exp(-rho / 2);
        } else if (selectedOrbital === '2pz') {
          psi = z * Math.exp(-rho / 2);
        } else if (selectedOrbital === '3px') {
          psi = x * (6 - rho) * Math.exp(-rho / 3);
        } else if (selectedOrbital === '3py') {
          psi = y * (6 - rho) * Math.exp(-rho / 3);
        } else if (selectedOrbital === '3pz') {
          psi = z * (6 - rho) * Math.exp(-rho / 3);
        } else if (selectedOrbital === '4pz') {
          psi = z * (80 - 20 * (rho / 4) + (rho / 4) ** 2) * Math.exp(-rho / 4);
        } else if (selectedOrbital === '3dz2' || selectedOrbital === '4dz2') {
          psi = (2 * z * z - x * x - y * y) * Math.exp(-rho / 3);
        } else if (selectedOrbital === '3dx2y2') {
          psi = (x * x - y * y) * Math.exp(-rho / 3);
        } else if (selectedOrbital === '3dxy') {
          psi = x * y * Math.exp(-rho / 3);
        } else if (selectedOrbital === '3dxz') {
          psi = x * z * Math.exp(-rho / 3);
        } else if (selectedOrbital === '3dyz') {
          psi = y * z * Math.exp(-rho / 3);
        } else if (selectedOrbital === '4fz3') {
          psi = z * (5 * z * z - 3 * r * r) * Math.exp(-rho / 4);
        } else if (selectedOrbital === '4fxyz') {
          psi = x * y * z * Math.exp(-rho / 4);
        } else if (selectedOrbital === '4fx_x2_3y2') {
          psi = x * (x * x - 3 * y * y) * Math.exp(-rho / 4);
        } else if (selectedOrbital === '4fy_3x2_y2') {
          psi = y * (3 * x * x - y * y) * Math.exp(-rho / 4);
        } else if (selectedOrbital === '4fz_x2y2') {
          psi = z * (x * x - y * y) * Math.exp(-rho / 4);
        } else if (selectedOrbital === '4fxz2') {
          psi = x * (5 * z * z - r * r) * Math.exp(-rho / 4);
        } else if (selectedOrbital === '4fyz2') {
          psi = y * (5 * z * z - r * r) * Math.exp(-rho / 4);
        } else if (selectedOrbital === 'hybrid_sp') {
          psi = (2 - rho) * Math.exp(-rho / 2) + 1.2 * z * Math.exp(-rho / 2);
        } else if (selectedOrbital === 'hybrid_sp3') {
          psi = (2 - rho) * Math.exp(-rho / 2) + 0.8 * (x + y + z) * Math.exp(-rho / 2);
        } else if (selectedOrbital === 'atom_Ne') {
          // Unsöld spherical electron gas
          psi = Math.exp(-rho) + (2 - rho) * Math.exp(-rho / 2) + (x * x + y * y + z * z) * 0.15 * Math.exp(-rho / 2);
        } else {
          psi = z * Math.exp(-rho / 2);
        }

        const probDensity = psi * psi;
        const threshold = Math.random() * (selectedOrbital.includes('f') ? 2.2 : selectedOrbital.includes('d') ? 1.6 : 1.1);

        if (probDensity > threshold) {
          const idx = accepted * 3;
          positions[idx] = x;
          positions[idx + 1] = y;
          positions[idx + 2] = z;

          let col = psi >= 0 ? cCyan : cRose;
          if (selectedOrbital.includes('f')) col = psi >= 0 ? cPurple : cEmerald;
          else if (selectedOrbital === '2s' && psi < 0) col = cAmber;
          else if (selectedOrbital.includes('hybrid')) col = psi >= 0 ? cAmber : cCyan;
          else if (selectedOrbital.includes('mo')) col = psi >= 0 ? cEmerald : cRose;

          colors[idx] = col.r;
          colors[idx + 1] = col.g;
          colors[idx + 2] = col.b;

          accepted++;
        }
      }

      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions.subarray(0, accepted * 3), 3));
      pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors.subarray(0, accepted * 3), 3));

      const pointsMat = new THREE.PointsMaterial({
        size: renderMode === 'cloud' ? 0.055 : 0.038,
        vertexColors: true,
        transparent: true,
        opacity: renderMode === 'cloud' ? 0.9 : 0.52,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const pointCloud = new THREE.Points(pointsGeo, pointsMat);
      orbitalGroup.add(pointCloud);
    }

    // 3. NODAL SURFACES WIREFRAME GUIDES
    if (showNodalWireframe) {
      const nodalWireMat = new THREE.LineBasicMaterial({
        color: 0xf43f5e,
        transparent: true,
        opacity: 0.55,
      });

      // Planar angular nodes
      if (selectedOrbital === '2pz' || selectedOrbital === '3pz' || selectedOrbital === '4pz') {
        // xy plane node (z = 0)
        const planeGeo = new THREE.PlaneGeometry(5, 5, 8, 8);
        const wireGeo = new THREE.WireframeGeometry(planeGeo);
        const wire = new THREE.LineSegments(wireGeo, nodalWireMat);
        nodalGroup.add(wire);
      } else if (selectedOrbital === '2px' || selectedOrbital === '3px') {
        // yz plane node (x = 0)
        const planeGeo = new THREE.PlaneGeometry(5, 5, 8, 8);
        const wireGeo = new THREE.WireframeGeometry(planeGeo);
        const wire = new THREE.LineSegments(wireGeo, nodalWireMat);
        wire.rotation.y = Math.PI / 2;
        nodalGroup.add(wire);
      } else if (selectedOrbital === '2py' || selectedOrbital === '3py') {
        // xz plane node (y = 0)
        const planeGeo = new THREE.PlaneGeometry(5, 5, 8, 8);
        const wireGeo = new THREE.WireframeGeometry(planeGeo);
        const wire = new THREE.LineSegments(wireGeo, nodalWireMat);
        wire.rotation.x = Math.PI / 2;
        nodalGroup.add(wire);
      } else if (selectedOrbital === '3dxy') {
        // x=0 and y=0 planes
        const p1 = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.PlaneGeometry(5, 5, 6, 6)), nodalWireMat);
        p1.rotation.y = Math.PI / 2;
        const p2 = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.PlaneGeometry(5, 5, 6, 6)), nodalWireMat);
        p2.rotation.x = Math.PI / 2;
        nodalGroup.add(p1, p2);
      } else if (selectedOrbital === '2s') {
        // 1 spherical radial node
        const sphereGeo = new THREE.SphereGeometry(1.6, 20, 20);
        const wire = new THREE.LineSegments(new THREE.WireframeGeometry(sphereGeo), nodalWireMat);
        nodalGroup.add(wire);
      }
    }
  }, [
    selectedOrbital,
    renderMode,
    pointDensity,
    showSlice,
    sliceAxis,
    sliceOffset,
    showNodalWireframe,
    surfaceOpacity,
  ]);

  const currentInfo = ORBITALS_DATA[selectedOrbital];

  // Filter orbitals for the quick selector
  const filteredOrbitals = useMemo(() => {
    return Object.values(ORBITALS_DATA).filter((orb) => {
      const matchCat =
        selectedCategory === 'All' || orb.categoryGroup === selectedCategory;
      const matchSearch =
        searchQuery === '' ||
        orb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orb.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orb.shapeDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(5.2, 3.6, 6.2);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const setViewPreset = (view: 'top' | 'front' | 'side' | 'iso') => {
    if (!cameraRef.current) return;
    if (view === 'top') cameraRef.current.position.set(0, 8.5, 0.01);
    else if (view === 'front') cameraRef.current.position.set(0, 0, 8.5);
    else if (view === 'side') cameraRef.current.position.set(8.5, 0, 0);
    else cameraRef.current.position.set(5.2, 3.6, 6.2);
    cameraRef.current.lookAt(0, 0, 0);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing select-none"
      />

      {/* Top Left: Active Orbital Identity Badge */}
      <div className="absolute top-4 left-4 pointer-events-none max-w-sm sm:max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl px-4 py-2.5 pointer-events-auto shadow-xl">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white tracking-wide">{currentInfo.name}</span>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              n={currentInfo.n}, l={currentInfo.l}, m_l={currentInfo.ml}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {currentInfo.shapeDescription}
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>
              Radial Nodes: <strong className="text-cyan-400">{currentInfo.radialNodes}</strong>
            </span>
            <span>·</span>
            <span>
              Angular: <strong className="text-amber-400">{currentInfo.angularNodes}</strong>
            </span>
            <span>·</span>
            <span>
              Total: <strong className="text-white">{currentInfo.totalNodes}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: Preset View & Phase Legend */}
      <div className="absolute top-4 right-4 pointer-events-none flex flex-col items-end gap-2">
        {/* Phase Color Legend */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-1.5 pointer-events-auto flex items-center gap-3 text-xs shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400/50" />
            <span className="text-slate-300 font-mono text-[11px]">+ Phase (ψ &gt; 0)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block shadow-sm shadow-rose-500/50" />
            <span className="text-slate-300 font-mono text-[11px]">- Phase (ψ &lt; 0)</span>
          </div>
        </div>

        {/* View Camera Presets */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 pointer-events-auto flex items-center gap-1 text-[11px] font-mono">
          <button
            onClick={() => setViewPreset('iso')}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Iso
          </button>
          <button
            onClick={() => setViewPreset('top')}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Top
          </button>
          <button
            onClick={() => setViewPreset('front')}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Front
          </button>
          <button
            onClick={() => setViewPreset('side')}
            className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Side
          </button>
        </div>
      </div>

      {/* Unified Collapsible Bottom Dock (Zero Viewport Occlusion per Three.js constitution) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[98%] max-w-4xl pointer-events-auto transition-all duration-300 z-20">
        <div className="flex justify-center mb-0.5">
          <button
            onClick={() => setIsDockOpen(!isDockOpen)}
            className="px-3.5 py-0.5 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-900/95 border border-slate-700/70 rounded-t-xl transition-colors cursor-pointer flex items-center gap-1 shadow-lg"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDockOpen ? 'rotate-0' : 'rotate-180'}`} />
            <span>{isDockOpen ? 'Hide 3D Workbench Dock' : 'Open 3D Workbench Dock'}</span>
          </button>
        </div>

        {isDockOpen && (
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 shadow-2xl space-y-2 max-h-[220px] overflow-y-auto">
            {/* Category Filter Pills */}
            {showSelector && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-thin text-xs">
                  {CATEGORY_TABS.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        // Auto-select first orbital in that category
                        if (cat !== 'All') {
                          const firstInCat = Object.values(ORBITALS_DATA).find(
                            (o) => o.categoryGroup === cat
                          );
                          if (firstInCat) setSelectedOrbital(firstInCat.id);
                        }
                      }}
                      className={`px-2.5 py-0.5 rounded-lg font-medium whitespace-nowrap transition-colors shrink-0 text-xs ${
                        selectedCategory === cat
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Subshell Specific Orbitals Scrollbar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {filteredOrbitals.map((orb) => (
                    <button
                      key={orb.id}
                      onClick={() => setSelectedOrbital(orb.id)}
                      className={`px-2 py-0.5 rounded-lg font-mono text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                        selectedOrbital === orb.id
                          ? 'bg-white text-slate-950 shadow-md scale-105'
                          : 'bg-slate-800/90 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/40'
                      }`}
                    >
                      {orb.id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Controls Bar: Render modes, slicing, density & tools */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-slate-800 text-xs">
              {/* Render Modes */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
                <button
                  onClick={() => setRenderMode('both')}
                  className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${
                    renderMode === 'both'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Hybrid
                </button>
                <button
                  onClick={() => setRenderMode('surface')}
                  className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${
                    renderMode === 'surface'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Isosurface
                </button>
                <button
                  onClick={() => setRenderMode('cloud')}
                  className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${
                    renderMode === 'cloud'
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  |ψ|² Cloud
                </button>
              </div>

              {/* Cutaway Slice Controls */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setShowSlice(!showSlice)}
                  className={`px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors ${
                    showSlice
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Cutaway interior to view internal radial nodes"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Cutaway</span>
                </button>

                {showSlice && (
                  <div className="flex items-center gap-1 font-mono text-[11px] px-1">
                    {(['x', 'y', 'z'] as const).map((ax) => (
                      <button
                        key={ax}
                        onClick={() => setSliceAxis(ax)}
                        className={`px-1.5 py-0.5 rounded uppercase ${
                          sliceAxis === ax ? 'bg-slate-800 text-cyan-300 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {ax}
                      </button>
                    ))}
                    <input
                      type="range"
                      min="-2.0"
                      max="2.0"
                      step="0.1"
                      value={sliceOffset}
                      onChange={(e) => setSliceOffset(parseFloat(e.target.value))}
                      className="w-16 h-1 accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                      title="Adjust cutaway slice depth"
                    />
                  </div>
                )}
              </div>

              {/* Toggles & Utilities */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowNodalWireframe(!showNodalWireframe)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                    showNodalWireframe
                      ? 'border-rose-500/50 bg-rose-950/30 text-rose-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle wireframe mathematical nodal surfaces"
                >
                  Nodal Guides
                </button>

                <button
                  onClick={() => setIsPhasePulsing(!isPhasePulsing)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                    isPhasePulsing
                      ? 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                  title="Animate quantum wave phase oscillation ψ·exp(-iEt/ℏ)"
                >
                  Wave Pulse
                </button>

                <button
                  onClick={() => setIsRotating(!isRotating)}
                  className={`p-1.5 rounded-lg border border-slate-800 bg-slate-950 transition-colors ${
                    isRotating ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={isRotating ? 'Pause rotation' : 'Resume auto-rotation'}
                >
                  {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={resetCamera}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-colors"
                  title="Reset view camera"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
