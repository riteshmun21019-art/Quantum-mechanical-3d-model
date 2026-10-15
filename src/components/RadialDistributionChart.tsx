import React, { useState, useMemo } from 'react';
import { Info, HelpCircle } from 'lucide-react';

interface RadialChartProps {
  initialN?: number;
  initialL?: number;
}

export const RadialDistributionChart: React.FC<RadialChartProps> = ({
  initialN = 2,
  initialL = 0,
}) => {
  const [n, setN] = useState<number>(initialN);
  const [l, setL] = useState<number>(initialL);
  const [curveType, setCurveType] = useState<'prob' | 'radial' | 'radialSq'>('prob');

  // Ensure l is always strictly < n
  const safeL = Math.min(l, n - 1);

  // Hydrogenic Radial Wavefunction R_nl(r) in units of a0^-3/2
  // r is in units of Bohr radii (r / a0)
  const calculateR = (r: number, nVal: number, lVal: number): number => {
    if (nVal === 1 && lVal === 0) {
      // 1s
      return 2 * Math.exp(-r);
    }
    if (nVal === 2 && lVal === 0) {
      // 2s: node at r = 2
      return (1 / (2 * Math.SQRT2)) * (2 - r) * Math.exp(-r / 2);
    }
    if (nVal === 2 && lVal === 1) {
      // 2p
      return (1 / (2 * Math.sqrt(6))) * r * Math.exp(-r / 2);
    }
    if (nVal === 3 && lVal === 0) {
      // 3s: nodes at r = 1.90 and 7.10
      return (2 / (81 * Math.sqrt(3))) * (27 - 18 * r + 2 * r * r) * Math.exp(-r / 3);
    }
    if (nVal === 3 && lVal === 1) {
      // 3p: node at r = 6
      return (4 / (81 * Math.sqrt(6))) * (6 * r - r * r) * Math.exp(-r / 3);
    }
    if (nVal === 3 && lVal === 2) {
      // 3d
      return (4 / (81 * Math.sqrt(30))) * (r * r) * Math.exp(-r / 3);
    }
    return Math.exp(-r);
  };

  const rMax = n === 1 ? 6 : n === 2 ? 14 : 22;
  const steps = 180;

  const { points, nodes, maxProbR, maxVal } = useMemo(() => {
    const pts: { r: number; val: number }[] = [];
    const foundNodes: number[] = [];
    let peakR = 0;
    let peakVal = 0;
    let prevRVal = 0;

    for (let i = 0; i <= steps; i++) {
      const r = (i / steps) * rMax;
      const R = calculateR(r, n, safeL);
      let val = 0;

      if (curveType === 'prob') {
        // 4 * pi * r^2 * R^2 (normalized scale)
        val = 4 * Math.PI * r * r * R * R;
      } else if (curveType === 'radial') {
        val = R;
      } else {
        val = R * R;
      }

      if (i > 0 && Math.sign(R) !== Math.sign(prevRVal) && Math.abs(R) > 0.0001) {
        // Node crossed
        foundNodes.push(Number(r.toFixed(2)));
      }
      prevRVal = R;

      if (val > peakVal) {
        peakVal = val;
        peakR = r;
      }

      pts.push({ r, val });
    }

    // Safety scale ceiling
    const highest = Math.max(...pts.map((p) => Math.abs(p.val)), 0.1);

    return {
      points: pts,
      nodes: foundNodes,
      maxProbR: peakR,
      maxVal: highest,
    };
  }, [n, safeL, curveType, rMax]);

  // SVG coordinate transformation
  const svgWidth = 640;
  const svgHeight = 280;
  const padding = { top: 24, right: 30, bottom: 42, left: 52 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const isBipolar = curveType === 'radial';
  const yZero = isBipolar ? padding.top + plotHeight / 2 : padding.top + plotHeight;
  const yRange = isBipolar ? plotHeight / 2 : plotHeight;

  const toSvgX = (r: number) => padding.left + (r / rMax) * plotWidth;
  const toSvgY = (v: number) => {
    if (isBipolar) {
      return yZero - (v / maxVal) * (yRange * 0.9);
    }
    return yZero - (v / maxVal) * (yRange * 0.92);
  };

  const pathD = points.reduce((acc, pt, idx) => {
    const x = toSvgX(pt.r);
    const y = toSvgY(pt.val);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD =
    !isBipolar
      ? `${pathD} L ${toSvgX(rMax)} ${yZero} L ${toSvgX(0)} ${yZero} Z`
      : '';

  const radialNodesCount = n - safeL - 1;
  const angularNodesCount = safeL;
  const subshellLetter = ['s', 'p', 'd'][safeL] || 's';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Radial Distribution Function</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              {n}{subshellLetter} Orbital
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Probability of finding an electron in a spherical shell of radius r and thickness dr
          </p>
        </div>

        {/* Function selector tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setCurveType('prob')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              curveType === 'prob'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4πr²R²(r) Probability
          </button>
          <button
            onClick={() => setCurveType('radial')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              curveType === 'radial'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            R(r) Wavefunction
          </button>
          <button
            onClick={() => setCurveType('radialSq')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              curveType === 'radialSq'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            R²(r) Density
          </button>
        </div>
      </div>

      {/* Sliders for n and l */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 p-3 bg-slate-950/50 rounded-xl border border-slate-800/80">
        <div>
          <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
            <span>Principal Quantum Number (n):</span>
            <span className="font-mono text-cyan-400 font-bold text-sm">{n}</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => {
                  setN(val);
                  if (l >= val) setL(val - 1);
                }}
                className={`flex-1 py-1 text-xs font-mono rounded-lg transition-colors ${
                  n === val
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                n = {val}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
            <span>Angular Momentum (l):</span>
            <span className="font-mono text-amber-400 font-bold text-sm">
              {safeL} ({subshellLetter})
            </span>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: n }).map((_, idx) => {
              const letter = ['s', 'p', 'd'][idx] || `${idx}`;
              return (
                <button
                  key={idx}
                  onClick={() => setL(idx)}
                  className={`flex-1 py-1 text-xs font-mono rounded-lg transition-colors ${
                    safeL === idx
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  l = {idx} ({letter})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800/80 p-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const rVal = (frac * rMax).toFixed(0);
            const x = toSvgX(frac * rMax);
            return (
              <g key={frac}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + plotHeight}
                  stroke="#1e293b"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={padding.top + plotHeight + 16}
                  fill="#64748b"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono"
                >
                  {rVal} a₀
                </text>
              </g>
            );
          })}

          {/* Zero baseline */}
          <line
            x1={padding.left}
            y1={yZero}
            x2={padding.left + plotWidth}
            y2={yZero}
            stroke="#475569"
            strokeWidth="1.2"
          />

          {/* Area fill under curve for probability */}
          {areaD && <path d={areaD} fill="url(#cyanGlow)" opacity="0.3" />}

          {/* Main Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Max Probability Marker */}
          {curveType === 'prob' && maxProbR > 0 && (
            <g>
              <line
                x1={toSvgX(maxProbR)}
                y1={toSvgY(maxVal)}
                x2={toSvgX(maxProbR)}
                y2={yZero}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={toSvgX(maxProbR)}
                cy={toSvgY(maxVal)}
                r="4.5"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <text
                x={toSvgX(maxProbR)}
                y={toSvgY(maxVal) - 8}
                fill="#38bdf8"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="JetBrains Mono"
              >
                r_max = {maxProbR.toFixed(1)} a₀
              </text>
            </g>
          )}

          {/* Node Markers */}
          {nodes.map((nodeR, idx) => (
            <g key={idx}>
              <line
                x1={toSvgX(nodeR)}
                y1={padding.top}
                x2={toSvgX(nodeR)}
                y2={padding.top + plotHeight}
                stroke="#f43f5e"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <circle
                cx={toSvgX(nodeR)}
                cy={yZero}
                r="4"
                fill="#f43f5e"
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              <text
                x={toSvgX(nodeR)}
                y={padding.top + 14}
                fill="#f43f5e"
                fontSize="10"
                fontFamily="JetBrains Mono"
                textAnchor="middle"
              >
                Radial Node #{idx + 1} ({nodeR} a₀)
              </text>
            </g>
          ))}

          {/* Y Axis Label */}
          <text
            x={-svgHeight / 2}
            y="18"
            transform="rotate(-90)"
            fill="#94a3b8"
            fontSize="11"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans"
          >
            {curveType === 'prob'
              ? 'Radial Probability Density 4πr²R²'
              : curveType === 'radial'
              ? 'Radial Wavefunction R(r)'
              : 'Probability Density R²(r)'}
          </text>

          {/* X Axis Label */}
          <text
            x={padding.left + plotWidth / 2}
            y={svgHeight - 6}
            fill="#94a3b8"
            fontSize="11"
            textAnchor="middle"
            fontFamily="Plus Jakarta Sans"
          >
            Radial Distance from Nucleus (r in units of Bohr radius a₀ = 0.529 Å)
          </text>
        </svg>
      </div>

      {/* Explanatory summary bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Radial Nodes:</strong> n - l - 1 = {n} - {safeL} - 1 ={' '}
            <span className="font-mono text-cyan-400 font-bold">{radialNodesCount}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            <strong>Angular Nodes:</strong> l ={' '}
            <span className="font-mono text-amber-400 font-bold">{angularNodesCount}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span>
            <strong>Total Nodes:</strong> n - 1 ={' '}
            <span className="font-mono text-white font-bold">{n - 1}</span>
          </span>
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          Peak distance: <strong className="text-cyan-300">{maxProbR.toFixed(2)} a₀</strong> (~
          {(maxProbR * 0.0529).toFixed(3)} nm)
        </div>
      </div>
    </div>
  );
};
