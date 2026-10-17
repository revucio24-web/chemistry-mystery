import React, { useRef, useEffect, useState, useMemo } from 'react';
import { ChemicalElement } from '../../types/chemistry';
import { getElectronShells, getElectronConfiguration } from '../../data/elements';
import { soundEngine } from '../../engine/audio';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Search, 
  Compass,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';

interface AtomVisualizer3DProps {
  element: ChemicalElement;
  size?: number;
  showControls?: boolean;
  interactive?: boolean;
  className?: string;
  onOpenNucleusInspector?: () => void;
}

interface Nucleon3D {
  id: number;
  type: 'proton' | 'neutron';
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  parity: number;
}

interface OrbitRing3D {
  label: string;
  subshellName: string;
  radius: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  color: string;
  lType: 's' | 'p' | 'd' | 'f';
  axisX: number;
  axisY: number;
  axisZ: number;
  speed: number;
  isValence: boolean;
}

interface Electron3D {
  id: number;
  orbitIdx: number;
  initialAngle: number;
  speed: number;
  isValence: boolean;
  spin: 'up' | 'down';
}

interface SubshellOccupancy {
  n: number;
  l: 's' | 'p' | 'd' | 'f';
  name: string;
  electrons: number;
}

const NOBLE_GAS_SUBSHELLS: Record<string, SubshellOccupancy[]> = {
  '[He]': [
    { n: 1, l: 's', name: '1s', electrons: 2 }
  ],
  '[Ne]': [
    { n: 1, l: 's', name: '1s', electrons: 2 },
    { n: 2, l: 's', name: '2s', electrons: 2 },
    { n: 2, l: 'p', name: '2p', electrons: 6 }
  ],
  '[Ar]': [
    { n: 1, l: 's', name: '1s', electrons: 2 },
    { n: 2, l: 's', name: '2s', electrons: 2 },
    { n: 2, l: 'p', name: '2p', electrons: 6 },
    { n: 3, l: 's', name: '3s', electrons: 2 },
    { n: 3, l: 'p', name: '3p', electrons: 6 }
  ],
  '[Kr]': [
    { n: 1, l: 's', name: '1s', electrons: 2 },
    { n: 2, l: 's', name: '2s', electrons: 2 },
    { n: 2, l: 'p', name: '2p', electrons: 6 },
    { n: 3, l: 's', name: '3s', electrons: 2 },
    { n: 3, l: 'p', name: '3p', electrons: 6 },
    { n: 3, l: 'd', name: '3d', electrons: 10 },
    { n: 4, l: 's', name: '4s', electrons: 2 },
    { n: 4, l: 'p', name: '4p', electrons: 6 }
  ],
  '[Xe]': [
    { n: 1, l: 's', name: '1s', electrons: 2 },
    { n: 2, l: 's', name: '2s', electrons: 2 },
    { n: 2, l: 'p', name: '2p', electrons: 6 },
    { n: 3, l: 's', name: '3s', electrons: 2 },
    { n: 3, l: 'p', name: '3p', electrons: 6 },
    { n: 3, l: 'd', name: '3d', electrons: 10 },
    { n: 4, l: 's', name: '4s', electrons: 2 },
    { n: 4, l: 'p', name: '4p', electrons: 6 },
    { n: 4, l: 'd', name: '4d', electrons: 10 },
    { n: 5, l: 's', name: '5s', electrons: 2 },
    { n: 5, l: 'p', name: '5p', electrons: 6 }
  ],
  '[Rn]': [
    { n: 1, l: 's', name: '1s', electrons: 2 },
    { n: 2, l: 's', name: '2s', electrons: 2 },
    { n: 2, l: 'p', name: '2p', electrons: 6 },
    { n: 3, l: 's', name: '3s', electrons: 2 },
    { n: 3, l: 'p', name: '3p', electrons: 6 },
    { n: 3, l: 'd', name: '3d', electrons: 10 },
    { n: 4, l: 's', name: '4s', electrons: 2 },
    { n: 4, l: 'p', name: '4p', electrons: 6 },
    { n: 4, l: 'd', name: '4d', electrons: 10 },
    { n: 4, l: 'f', name: '4f', electrons: 14 },
    { n: 5, l: 's', name: '5s', electrons: 2 },
    { n: 5, l: 'p', name: '5p', electrons: 6 },
    { n: 5, l: 'd', name: '5d', electrons: 10 },
    { n: 6, l: 's', name: '6s', electrons: 2 },
    { n: 6, l: 'p', name: '6p', electrons: 6 }
  ]
};

const AUFBAU_ORDER: Array<{ n: number; l: 's' | 'p' | 'd' | 'f'; max: number }> = [
  { n: 1, l: 's', max: 2 },
  { n: 2, l: 's', max: 2 },
  { n: 2, l: 'p', max: 6 },
  { n: 3, l: 's', max: 2 },
  { n: 3, l: 'p', max: 6 },
  { n: 4, l: 's', max: 2 },
  { n: 3, l: 'd', max: 10 },
  { n: 4, l: 'p', max: 6 },
  { n: 5, l: 's', max: 2 },
  { n: 4, l: 'd', max: 10 },
  { n: 5, l: 'p', max: 6 },
  { n: 6, l: 's', max: 2 },
  { n: 4, l: 'f', max: 14 },
  { n: 5, l: 'd', max: 10 },
  { n: 6, l: 'p', max: 6 },
  { n: 7, l: 's', max: 2 },
  { n: 5, l: 'f', max: 14 },
  { n: 6, l: 'd', max: 10 },
  { n: 7, l: 'p', max: 6 }
];

function parseElementSubshells(configStr: string, atomicNumber: number): SubshellOccupancy[] {
  if (configStr) {
    const norm = configStr
      .replace(/¹/g, '1')
      .replace(/²/g, '2')
      .replace(/³/g, '3')
      .replace(/⁴/g, '4')
      .replace(/⁵/g, '5')
      .replace(/⁶/g, '6')
      .replace(/⁷/g, '7')
      .replace(/⁸/g, '8')
      .replace(/⁹/g, '9')
      .replace(/⁰/g, '0');

    const tokens = norm.trim().split(/\s+/);
    const result: SubshellOccupancy[] = [];

    for (const token of tokens) {
      if (NOBLE_GAS_SUBSHELLS[token]) {
        result.push(...NOBLE_GAS_SUBSHELLS[token].map(s => ({ ...s })));
      } else {
        const match = token.match(/^([1-7])([spdf])(\d+)$/);
        if (match) {
          const n = parseInt(match[1], 10);
          const l = match[2] as 's' | 'p' | 'd' | 'f';
          const count = parseInt(match[3], 10);
          result.push({ n, l, name: `${n}${l}`, electrons: count });
        }
      }
    }

    if (result.length > 0) {
      return result;
    }
  }

  // Fallback: Aufbau-Prinzip
  let left = atomicNumber;
  const list: SubshellOccupancy[] = [];
  for (const sub of AUFBAU_ORDER) {
    if (left <= 0) break;
    const count = Math.min(left, sub.max);
    list.push({ n: sub.n, l: sub.l, name: `${sub.n}${sub.l}`, electrons: count });
    left -= count;
  }
  return list;
}

export const AtomVisualizer3D: React.FC<AtomVisualizer3DProps> = ({
  element,
  size = 360,
  showControls = true,
  interactive = true,
  className = '',
  onOpenNucleusInspector
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 3D Rotations- und Kamera-Zustand (als Refs für unterbrechungsfreie, permanente 60 FPS Animation)
  const rotXRef = useRef(-0.35); // Leichte Neigung von oben
  const rotYRef = useRef(0.5);  // Isometrischer Blickwinkel
  const zoomRef = useRef(1.0);
  const timeRef = useRef(0);

  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1.0);

  // Modell-Modus: 'orbitals' (Quanten-Orbitale s, p, d, f) vs 'shells' (Bohr-Schalenmodell)
  const [modelMode, setModelMode] = useState<'orbitals' | 'shells'>('orbitals');
  // 3D Quanten-Orbitallappen (Dumbbell- und Sphären-Wolken)
  const [showLobes, setShowLobes] = useState(true);

  // Quantum Event (3D Photonen-Sprung)
  const [quantumEvent, setQuantumEvent] = useState<{
    active: boolean;
    progress: number;
    fromRadius: number;
    toRadius: number;
    message: string;
  } | null>(null);

  // Synchronisierte Refs für den Render-Loop (verhindert Re-Render-Abbruch der Animation)
  const isAutoRotatingRef = useRef(isAutoRotating);
  const isPausedRef = useRef(isPaused);
  const speedMultiplierRef = useRef(speedMultiplier);
  const modelModeRef = useRef(modelMode);
  const showLobesRef = useRef(showLobes);
  const quantumEventRef = useRef(quantumEvent);

  useEffect(() => { isAutoRotatingRef.current = isAutoRotating; }, [isAutoRotating]);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
  useEffect(() => { speedMultiplierRef.current = speedMultiplier; }, [speedMultiplier]);
  useEffect(() => { modelModeRef.current = modelMode; }, [modelMode]);
  useEffect(() => { showLobesRef.current = showLobes; }, [showLobes]);
  useEffect(() => { quantumEventRef.current = quantumEvent; }, [quantumEvent]);

  // Maus- & Touch-Steuerung
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Historische Elektronen-Trajektorie für leuchtende 3D-Kometenschweife
  const electronTrailsRef = useRef<Map<number, Array<{ px: number; py: number; pz: number }>>>(new Map());

  const shells = useMemo(() => getElectronShells(element.atomicNumber), [element.atomicNumber]);
  const electronConfigStr = useMemo(() => element.electronConfiguration || getElectronConfiguration(element.atomicNumber), [element]);
  const totalElectrons = shells.reduce((s, c) => s + c, 0);

  // ===========================================================================
  // 1. ECHTER ATOMKERN: Dichteste Kugelpackung (FCC / HCP) mit Ladungs-Gleichgewicht
  // ===========================================================================
  const nucleons3D = useMemo<Nucleon3D[]>(() => {
    const protons = element.protons;
    const neutrons = element.neutrons;
    const total = protons + neutrons;
    if (total <= 0) return [];

    if (total === 1) {
      return [{
        id: 0,
        type: 'proton',
        x: 0,
        y: 0,
        z: 0,
        baseRadius: 6.8,
        parity: 0
      }];
    }

    // Bei kleinen Kernen (A <= 64): genau A Nukleonen anzeigen
    // Bei schweren Kernen (A > 64): Bis zu 84 Nukleonen proportional für flüssige 60 FPS
    const displayCount = Math.min(84, total);
    const pCount = Math.max(1, Math.round((protons / total) * displayCount));
    const nCount = Math.max(0, displayCount - pCount);

    // Physikalische Skalierung: R ~ A^(1/3)
    const particleRadius = Math.max(3.0, Math.min(6.5, 30 / Math.cbrt(displayCount + 1)));
    const s = Math.SQRT2 * particleRadius;

    // Erzeuge FCC-Gitterpunkte (i, j, k mit i+j+k mod 2 == 0)
    const points: Array<{ x: number; y: number; z: number; distSq: number; parity: number }> = [];
    const range = Math.ceil(Math.cbrt(displayCount)) + 2;

    for (let i = -range; i <= range; i++) {
      for (let j = -range; j <= range; j++) {
        for (let k = -range; k <= range; k++) {
          if ((i + j + k) % 2 === 0) {
            const distSq = i * i + j * j + k * k;
            const parity = Math.abs(Math.floor((i + j + k) / 2)) % 2;
            points.push({
              x: i * s,
              y: j * s,
              z: k * s,
              distSq,
              parity
            });
          }
        }
      }
    }

    // Von innen nach außen sortieren (sphärisches Tröpfchenmodell)
    points.sort((a, b) => a.distSq - b.distSq);
    const selectedSites = points.slice(0, displayCount);

    let pLeft = pCount;
    let nLeft = nCount;
    const list: Nucleon3D[] = [];

    for (let idx = 0; idx < selectedSites.length; idx++) {
      const site = selectedSites[idx];
      let type: 'proton' | 'neutron';

      // Abwechselnde Zuweisung nach Gitterparität zur Coulomb-Minimierung
      const wantsProton = site.parity === 0;
      if (wantsProton && pLeft > 0) {
        type = 'proton';
        pLeft--;
      } else if (!wantsProton && nLeft > 0) {
        type = 'neutron';
        nLeft--;
      } else if (pLeft > 0) {
        type = 'proton';
        pLeft--;
      } else {
        type = 'neutron';
        nLeft--;
      }

      list.push({
        id: idx,
        type,
        x: site.x,
        y: site.y,
        z: site.z,
        baseRadius: particleRadius,
        parity: site.parity
      });
    }

    return list;
  }, [element.protons, element.neutrons]);

  // ===========================================================================
  // 2. ECHTE ELEKTRONEN-ANORDNUNG: Quanten-Orbitale (s, p, d, f) oder Schalen
  // ===========================================================================
  const { orbitRings, electrons } = useMemo(() => {
    const rings: OrbitRing3D[] = [];
    const elecs: Electron3D[] = [];
    let electronCounter = 0;

    if (modelMode === 'orbitals') {
      // -------------------------------------------------------------
      // QUANTEN-ORBITAL-MODELL: Exakte räumliche Subschalen s, p, d, f
      // -------------------------------------------------------------
      const subshells = parseElementSubshells(electronConfigStr, element.atomicNumber);
      const maxN = Math.max(...subshells.map(s => s.n), 1);
      
      // Radius skaliert so, dass selbst schwere Atome (7. Periode) perfekt ins Sichtfeld passen
      const radiusScale = Math.min(1.0, 150 / (maxN * 26 + 30));
      const baseR = 32 * radiusScale;
      const stepN = 24 * radiusScale;

      subshells.forEach((sub, subIdx) => {
        const isValence = subIdx === subshells.length - 1;
        const subshellR = baseR + (sub.n - 1) * stepN + (sub.l === 's' ? 0 : sub.l === 'p' ? 10 * radiusScale : sub.l === 'd' ? 20 * radiusScale : 28 * radiusScale);
        const speed = (1.7 / Math.sqrt(sub.n)) * 0.02;

        if (sub.l === 's') {
          // s-Orbital: 1 sphärische Ringbahn mit natürlicher Neigung
          const ringIdx = rings.length;
          rings.push({
            label: `${sub.name}`,
            subshellName: sub.name,
            radius: subshellR,
            tiltX: 0.25 + (sub.n * 0.1),
            tiltY: -0.35 + (sub.n * 0.08),
            tiltZ: 0.1,
            color: 'rgba(6, 182, 212, 0.45)', // Cyan
            lType: 's',
            axisX: 0,
            axisY: 1,
            axisZ: 0,
            speed,
            isValence
          });

          // Bis zu 2 Elektronen (Pauli-Prinzip: gegenpolige Phase theta und theta + PI)
          for (let e = 0; e < sub.electrons; e++) {
            elecs.push({
              id: electronCounter++,
              orbitIdx: ringIdx,
              initialAngle: e * Math.PI, // 180 Grad gegenüberliegend
              speed,
              isValence,
              spin: e === 0 ? 'up' : 'down'
            });
          }
        } 
        else if (sub.l === 'p') {
          // p-Orbitale: 3 orthogonale räumliche Achsen (px, py, pz) bei 90 Grad zueinander!
          const pAxes: Array<{ name: string; tiltX: number; tiltY: number; tiltZ: number; ax: number; ay: number; az: number }> = [
            { name: `${sub.name}x`, tiltX: 0, tiltY: Math.PI / 2, tiltZ: 0, ax: 1, ay: 0, az: 0 },       // px: entlang X-Achse
            { name: `${sub.name}y`, tiltX: Math.PI / 2, tiltY: 0, tiltZ: 0, ax: 0, ay: 1, az: 0 },       // py: entlang Y-Achse
            { name: `${sub.name}z`, tiltX: 0, tiltY: 0, tiltZ: 0, ax: 0, ay: 0, az: 1 }                  // pz: entlang Z-Achse
          ];

          const pRingIndices: number[] = [];
          pAxes.forEach(pAx => {
            const rIdx = rings.length;
            pRingIndices.push(rIdx);
            rings.push({
              label: pAx.name,
              subshellName: sub.name,
              radius: subshellR,
              tiltX: pAx.tiltX,
              tiltY: pAx.tiltY,
              tiltZ: pAx.tiltZ,
              color: 'rgba(168, 85, 247, 0.45)', // Violett / Purpur
              lType: 'p',
              axisX: pAx.ax,
              axisY: pAx.ay,
              axisZ: pAx.az,
              speed,
              isValence
            });
          });

          // Hundsche Regel: Zuerst einfach besetzen (px, py, pz), dann paaren mit theta + PI
          for (let e = 0; e < sub.electrons; e++) {
            const axisIdx = e % 3;
            const isPaired = e >= 3;
            elecs.push({
              id: electronCounter++,
              orbitIdx: pRingIndices[axisIdx],
              initialAngle: (axisIdx * (Math.PI / 3)) + (isPaired ? Math.PI : 0),
              speed,
              isValence,
              spin: isPaired ? 'down' : 'up'
            });
          }
        } 
        else if (sub.l === 'd') {
          // d-Orbitale: 5 Raumorientierungen (dxy, dyz, dxz, dx2-y2, dz2) unter 45 Grad
          const dAngles = [
            { tiltX: 0.78, tiltY: 0.78, tiltZ: 0 },
            { tiltX: -0.78, tiltY: 0.78, tiltZ: 0.5 },
            { tiltX: 0.78, tiltY: -0.78, tiltZ: -0.5 },
            { tiltX: 0, tiltY: 0.78, tiltZ: 0.78 },
            { tiltX: -0.5, tiltY: -0.5, tiltZ: 0 }
          ];

          const dRingIndices: number[] = [];
          dAngles.forEach((dAng, dIdx) => {
            const rIdx = rings.length;
            dRingIndices.push(rIdx);
            rings.push({
              label: `${sub.name}_${dIdx + 1}`,
              subshellName: sub.name,
              radius: subshellR,
              tiltX: dAng.tiltX,
              tiltY: dAng.tiltY,
              tiltZ: dAng.tiltZ,
              color: 'rgba(245, 158, 11, 0.45)', // Bernstein / Gold
              lType: 'd',
              axisX: Math.cos(dAng.tiltY),
              axisY: Math.sin(dAng.tiltX),
              axisZ: Math.sin(dAng.tiltZ),
              speed,
              isValence
            });
          });

          for (let e = 0; e < sub.electrons; e++) {
            const oIdx = e % 5;
            const isPaired = e >= 5;
            elecs.push({
              id: electronCounter++,
              orbitIdx: dRingIndices[oIdx],
              initialAngle: (oIdx * (Math.PI / 2.5)) + (isPaired ? Math.PI : 0),
              speed,
              isValence,
              spin: isPaired ? 'down' : 'up'
            });
          }
        } 
        else if (sub.l === 'f') {
          // f-Orbitale: 7 Raumorientierungen
          const fRingIndices: number[] = [];
          for (let f = 0; f < 7; f++) {
            const rIdx = rings.length;
            fRingIndices.push(rIdx);
            const ang = (f / 7) * Math.PI;
            rings.push({
              label: `${sub.name}_${f + 1}`,
              subshellName: sub.name,
              radius: subshellR,
              tiltX: Math.sin(ang) * 0.9,
              tiltY: Math.cos(ang) * 0.9,
              tiltZ: (f % 2 === 0 ? 0.35 : -0.35),
              color: 'rgba(16, 185, 129, 0.45)', // Smaragd
              lType: 'f',
              axisX: Math.cos(ang),
              axisY: Math.sin(ang),
              axisZ: 0.5,
              speed,
              isValence
            });
          }

          for (let e = 0; e < sub.electrons; e++) {
            const oIdx = e % 7;
            const isPaired = e >= 7;
            elecs.push({
              id: electronCounter++,
              orbitIdx: fRingIndices[oIdx],
              initialAngle: (oIdx * (Math.PI / 3.5)) + (isPaired ? Math.PI : 0),
              speed,
              isValence,
              spin: isPaired ? 'down' : 'up'
            });
          }
        }
      });
    } else {
      // -------------------------------------------------------------
      // KLASSISCHES SCHALENMODELL (K, L, M, N...) MIT 3D-RAUMVERTEILUNG
      // -------------------------------------------------------------
      const shellTilts = [
        { tiltX: 0.25, tiltY: -0.35, tiltZ: 0.1 },
        { tiltX: -0.45, tiltY: 0.5, tiltZ: -0.2 },
        { tiltX: 0.6, tiltY: -0.3, tiltZ: 0.4 },
        { tiltX: -0.3, tiltY: -0.6, tiltZ: -0.15 },
        { tiltX: 0.4, tiltY: 0.45, tiltZ: 0.3 },
        { tiltX: -0.5, tiltY: 0.2, tiltZ: -0.4 },
        { tiltX: 0.15, tiltY: -0.55, tiltZ: 0.25 }
      ];

      const maxShell = shells.length;
      const radiusStep = Math.min(26, Math.floor(130 / Math.max(maxShell, 1)));
      const baseRadius = 48;

      shells.forEach((eCount, sIdx) => {
        const radius = baseRadius + (sIdx + 1) * radiusStep;
        const tilt = shellTilts[sIdx % shellTilts.length];
        const speed = (1.8 / Math.sqrt(sIdx + 1)) * 0.02;
        const isValence = sIdx === shells.length - 1;

        // VSEPR / Thomson-Mindestenergie: Teile Elektronen auf 3D-versetzte Ringe auf
        const ringsNeeded = Math.min(4, Math.ceil(eCount / 4));
        const electronsPerRing = Math.ceil(eCount / ringsNeeded);

        for (let r = 0; r < ringsNeeded; r++) {
          const ringIdx = rings.length;
          const subTiltOffset = (r / ringsNeeded) * Math.PI * 0.5;
          rings.push({
            label: `Schale ${sIdx + 1}`,
            subshellName: `Schale ${sIdx + 1}`,
            radius,
            tiltX: tilt.tiltX + (r > 0 ? Math.cos(subTiltOffset) * 0.35 : 0),
            tiltY: tilt.tiltY + (r > 0 ? Math.sin(subTiltOffset) * 0.35 : 0),
            tiltZ: tilt.tiltZ,
            color: isValence ? 'rgba(234, 179, 8, 0.55)' : 'rgba(56, 189, 248, 0.32)',
            lType: 's',
            axisX: 0,
            axisY: 1,
            axisZ: 0,
            speed,
            isValence
          });

          const currentRingElectrons = Math.min(electronsPerRing, eCount - r * electronsPerRing);
          const angleStep = (Math.PI * 2) / Math.max(1, currentRingElectrons);

          for (let e = 0; e < currentRingElectrons; e++) {
            elecs.push({
              id: electronCounter++,
              orbitIdx: ringIdx,
              initialAngle: e * angleStep + (r * 0.4),
              speed,
              isValence,
              spin: e % 2 === 0 ? 'up' : 'down'
            });
          }
        }
      });
    }

    return { orbitRings: rings, electrons: elecs };
  }, [modelMode, electronConfigStr, element.atomicNumber, shells]);

  // Quantensprung auslösen
  const triggerQuantumJump = () => {
    soundEngine.playClick();
    soundEngine.playQuantumJump();

    const minR = orbitRings.length > 0 ? orbitRings[0].radius : 40;
    const maxR = orbitRings.length > 0 ? orbitRings[orbitRings.length - 1].radius : 120;

    setQuantumEvent({
      active: true,
      progress: 0,
      fromRadius: minR,
      toRadius: maxR,
      message: `Quantensprung: Elektron absorbiert Photon h·ν (ΔE = h·f) und wechselt das Energieniveau!`
    });
  };

  // Reset 3D-Kamera
  const resetOrientation = () => {
    soundEngine.playClick();
    rotXRef.current = -0.35;
    rotYRef.current = 0.5;
    zoomRef.current = 1.0;
    velocityRef.current = { x: 0, y: 0 };
  };

  // ===========================================================================
  // 3. 3D-RENDERING LOOP: Z-Sorting, Phong-Shading, Trails & Quanten-Lappen
  // ===========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Automatische kontinuierliche Zeitfortschreitung (ohne Gedrückthalten!)
      if (!isPausedRef.current) {
        timeRef.current += 1.0 * speedMultiplierRef.current;
      }
      const time = timeRef.current;

      // Automatische 3D-Raumdrehung (bewegt sich permanent von selbst!)
      if (isAutoRotatingRef.current && !isDraggingRef.current) {
        rotYRef.current += 0.0055 * speedMultiplierRef.current;
      } else if (!isDraggingRef.current) {
        // Trägheit / sanfter Nachschwung nach dem Loslassen
        if (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001) {
          rotYRef.current += velocityRef.current.x;
          rotXRef.current = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotXRef.current + velocityRef.current.y));
          velocityRef.current.x *= 0.92;
          velocityRef.current.y *= 0.92;
        }
      }

      // Quantensprung Fortschritt
      const qEv = quantumEventRef.current;
      if (qEv && qEv.active) {
        qEv.progress += 0.02 * speedMultiplierRef.current;
        if (qEv.progress >= 1) {
          setQuantumEvent(null);
        }
      }

      // High-DPI Maße
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const cameraDist = 500 / zoomRef.current;

      // 3D Rotationsmatrizen aus den kontinuierlichen Refs
      const cosX = Math.cos(rotXRef.current);
      const sinX = Math.sin(rotXRef.current);
      const cosY = Math.cos(rotYRef.current);
      const sinY = Math.sin(rotYRef.current);

      const project3D = (x: number, y: number, z: number) => {
        // Rotation um Y
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        // Rotation um X
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // Perspektive
        const perspective = cameraDist / (cameraDist + z2);
        return {
          px: cx + x2 * perspective,
          py: cy + y2 * perspective,
          pz: z2,
          scale: perspective
        };
      };

      // -------------------------------------------------------------
      // Z-SORTIERUNG (PAINTER'S ALGORITHM)
      // -------------------------------------------------------------
      type RenderableItem = 
        | { kind: 'strongForceHalo'; z: number }
        | { kind: 'orbitalLobe'; sub: OrbitRing3D; lobeType: 'px' | 'py' | 'pz' | 's' | 'd'; z: number; proj: ReturnType<typeof project3D>; radius: number }
        | { kind: 'orbitRing'; ring: OrbitRing3D; z: number }
        | { kind: 'nucleon'; nucleon: Nucleon3D; z: number; proj: ReturnType<typeof project3D> }
        | { kind: 'electron'; electron: Electron3D; z: number; proj: ReturnType<typeof project3D>; trail: Array<{ px: number; py: number }> }
        | { kind: 'photon'; z: number; proj: ReturnType<typeof project3D>; progress: number };

      const items: RenderableItem[] = [];

      // 1. Starke Kernkraft / Gluonen-Feld Aura
      items.push({ kind: 'strongForceHalo', z: 0 });

      // 2. 3D-Quanten-Orbitallappen (wenn aktiv)
      if (showLobesRef.current && modelModeRef.current === 'orbitals') {
        orbitRings.forEach(ring => {
          if (ring.lType === 'p') {
            // p-Lappen entlang der Achse: Positive und negative Keule
            const dist = ring.radius * 0.52;
            const rLobe = ring.radius * 0.36;

            const pos1 = project3D(ring.axisX * dist, ring.axisY * dist, ring.axisZ * dist);
            const pos2 = project3D(-ring.axisX * dist, -ring.axisY * dist, -ring.axisZ * dist);

            items.push({ kind: 'orbitalLobe', sub: ring, lobeType: 'px', z: pos1.pz, proj: pos1, radius: rLobe });
            items.push({ kind: 'orbitalLobe', sub: ring, lobeType: 'px', z: pos2.pz, proj: pos2, radius: rLobe });
          } else if (ring.lType === 's' && ring.radius > 40) {
            const centerProj = project3D(0, 0, 0);
            items.push({ kind: 'orbitalLobe', sub: ring, lobeType: 's', z: 0, proj: centerProj, radius: ring.radius * 0.7 });
          }
        });
      }

      // 3. Orbitalringe
      orbitRings.forEach(ring => {
        items.push({ kind: 'orbitRing', ring, z: 0 });
      });

      // 4. Atomkern-Nukleonen mit Quantenfluktuation (Zitterbewegung)
      nucleons3D.forEach(n => {
        const dx = Math.sin(time * 0.05 + n.id * 1.8) * (n.baseRadius * 0.035);
        const dy = Math.cos(time * 0.06 + n.id * 2.2) * (n.baseRadius * 0.035);
        const dz = Math.sin(time * 0.04 + n.id * 2.7) * (n.baseRadius * 0.035);

        const proj = project3D(n.x + dx, n.y + dy, n.z + dz);
        items.push({ kind: 'nucleon', nucleon: n, z: proj.pz, proj });
      });

      // 5. Elektronen mit 3D-Kometenschweifen
      electrons.forEach(e => {
        const ring = orbitRings[e.orbitIdx];
        if (!ring) return;

        const currentAngle = e.initialAngle + time * e.speed;
        const rx = ring.radius * Math.cos(currentAngle);
        const ry = ring.radius * Math.sin(currentAngle);
        const rz = 0;

        // Intrinsische Neigung
        const cTX = Math.cos(ring.tiltX);
        const sTX = Math.sin(ring.tiltX);
        const cTY = Math.cos(ring.tiltY);
        const sTY = Math.sin(ring.tiltY);

        const x1 = rx * cTY + rz * sTY;
        const y1 = ry;
        const z1 = -rx * sTY + rz * cTY;

        const x2 = x1;
        const y2 = y1 * cTX - z1 * sTX;
        const z2 = y1 * sTX + z1 * cTX;

        const proj = project3D(x2, y2, z2);

        // Trail Historie
        let trailArr = electronTrailsRef.current.get(e.id);
        if (!trailArr) {
          trailArr = [];
          electronTrailsRef.current.set(e.id, trailArr);
        }
        trailArr.unshift({ px: proj.px, py: proj.py, pz: proj.pz });
        if (trailArr.length > 5) trailArr.pop();

        items.push({ 
          kind: 'electron', 
          electron: e, 
          z: proj.pz, 
          proj,
          trail: trailArr.map(t => ({ px: t.px, py: t.py }))
        });
      });

      // 6. Quantensprung-Photon falls aktiv
      const qe = quantumEventRef.current;
      if (qe && qe.active) {
        const currentR = qe.fromRadius + (qe.toRadius - qe.fromRadius) * qe.progress;
        const photonAngle = time * 0.06;
        const px3D = currentR * Math.cos(photonAngle);
        const py3D = currentR * Math.sin(photonAngle);
        const pz3D = Math.sin(qe.progress * Math.PI * 4) * 22;

        const proj = project3D(px3D, py3D, pz3D);
        items.push({ kind: 'photon', z: proj.pz, proj, progress: qe.progress });
      }

      // Sortiere von HINTEN (großes Z) nach VORNE (kleines Z)
      items.sort((a, b) => b.z - a.z);

      // -------------------------------------------------------------
      // RENDERN DER SORTIERTEN OBJEKTE
      // -------------------------------------------------------------
      items.forEach(item => {
        if (item.kind === 'strongForceHalo') {
          // Gluonen / Mesonen-Feld der starken Kernkraft
          const coreProj = project3D(0, 0, 0);
          const haloR = Math.max(16, Math.cbrt(nucleons3D.length) * 14 * coreProj.scale);
          const grad = ctx.createRadialGradient(coreProj.px, coreProj.py, 2, coreProj.px, coreProj.py, haloR);
          grad.addColorStop(0, 'rgba(239, 68, 68, 0.16)');
          grad.addColorStop(0.45, 'rgba(34, 197, 94, 0.10)');
          grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

          ctx.beginPath();
          ctx.arc(coreProj.px, coreProj.py, haloR, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();
        }
        else if (item.kind === 'orbitalLobe') {
          // 3D Quanten-Orbitallappen (Halbtransparente Aufenthaltswahrscheinlichkeit)
          const { px, py, scale } = item.proj;
          const r = Math.max(4, item.radius * scale);

          const lobeGrad = ctx.createRadialGradient(px, py, r * 0.1, px, py, r);
          if (item.lobeType === 's') {
            lobeGrad.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
            lobeGrad.addColorStop(0.8, 'rgba(6, 182, 212, 0.04)');
            lobeGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
          } else {
            lobeGrad.addColorStop(0, 'rgba(168, 85, 247, 0.22)');
            lobeGrad.addColorStop(0.75, 'rgba(147, 51, 234, 0.08)');
            lobeGrad.addColorStop(1, 'rgba(147, 51, 234, 0)');
          }

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = lobeGrad;
          ctx.fill();
        }
        else if (item.kind === 'orbitRing') {
          const ring = item.ring;
          const isValence = ring.isValence;

          ctx.beginPath();
          const segments = 44;
          for (let s = 0; s <= segments; s++) {
            const angle = (s / segments) * Math.PI * 2;
            const rx = ring.radius * Math.cos(angle);
            const ry = ring.radius * Math.sin(angle);
            const rz = 0;

            const cTX = Math.cos(ring.tiltX);
            const sTX = Math.sin(ring.tiltX);
            const cTY = Math.cos(ring.tiltY);
            const sTY = Math.sin(ring.tiltY);

            const x1 = rx * cTY + rz * sTY;
            const y1 = ry;
            const z1 = -rx * sTY + rz * cTY;

            const x2 = x1;
            const y2 = y1 * cTX - z1 * sTX;
            const z2 = y1 * sTX + z1 * cTX;

            const pt = project3D(x2, y2, z2);
            if (s === 0) ctx.moveTo(pt.px, pt.py);
            else ctx.lineTo(pt.px, pt.py);
          }

          ctx.lineWidth = isValence ? 1.6 : 1.1;
          ctx.strokeStyle = ring.color;
          if (isValence) {
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 6;
          }
          ctx.stroke();
          ctx.shadowBlur = 0;
        } 
        else if (item.kind === 'nucleon') {
          // 3D NUKLEON: Dichteste Kugelpackung mit plastischem Shading
          const { px, py, scale } = item.proj;
          const r = Math.max(2.2, item.nucleon.baseRadius * scale);
          const isProton = item.nucleon.type === 'proton';

          // Plastisches 3D-Kugel-Shading mit Lichtquelle oben links
          const grad = ctx.createRadialGradient(
            px - r * 0.38,
            py - r * 0.38,
            r * 0.08,
            px,
            py,
            r
          );

          if (isProton) {
            // Proton: Tiefrot mit weiß-rosa Glanzpunkt
            grad.addColorStop(0, '#fee2e2');
            grad.addColorStop(0.25, '#f87171');
            grad.addColorStop(0.7, '#dc2626');
            grad.addColorStop(1, '#7f1d1d');
          } else {
            // Neutron: Smaragdgrün mit Minze-Glanzpunkt
            grad.addColorStop(0, '#dcfce7');
            grad.addColorStop(0.25, '#4ade80');
            grad.addColorStop(0.7, '#16a34a');
            grad.addColorStop(1, '#14532d');
          }

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.shadowColor = isProton ? '#ef4444' : '#22c55e';
          ctx.shadowBlur = r * 0.4;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Authentische Ladungsgravur (+ für Proton, 0 für Neutron)
          if (r >= 3.8) {
            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${Math.round(r * 1.05)}px monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(isProton ? '+' : '0', px, py + 0.3);
          }
        } 
        else if (item.kind === 'electron') {
          // 3D ELEKTRON: Strahlend blaues Teilchen mit Ionenschweif
          const { px, py, scale } = item.proj;
          const r = Math.max(3, 5.5 * scale);
          const isValence = item.electron.isValence;

          // Kometenschweif
          if (item.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(item.trail[0].px, item.trail[0].py);
            for (let t = 1; t < item.trail.length; t++) {
              ctx.lineTo(item.trail[t].px, item.trail[t].py);
            }
            ctx.strokeStyle = isValence ? 'rgba(234, 179, 8, 0.45)' : 'rgba(96, 165, 250, 0.4)';
            ctx.lineWidth = r * 0.6;
            ctx.stroke();
          }

          // 3D-Kugel mit Glanz
          const grad = ctx.createRadialGradient(
            px - r * 0.36,
            py - r * 0.36,
            r * 0.08,
            px,
            py,
            r
          );

          grad.addColorStop(0, '#eff6ff');
          grad.addColorStop(0.3, '#60a5fa');
          grad.addColorStop(0.75, '#2563eb');
          grad.addColorStop(1, '#1e3a8a');

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.shadowColor = isValence ? '#facc15' : '#3b82f6';
          ctx.shadowBlur = isValence ? r * 2.2 : r * 1.3;
          ctx.fill();
          ctx.shadowBlur = 0;

          if (isValence) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          // Minus-Zeichen (-)
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.round(r * 1.3)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('-', px, py - 0.4);
        }
        else if (item.kind === 'photon') {
          // Quantensprung-Photon h*nu
          const { px, py, scale } = item.proj;
          const r = 9 * scale;

          ctx.beginPath();
          ctx.arc(px, py, r, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.shadowColor = '#facc15';
          ctx.shadowBlur = 24;
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('hν', px, py);
        }
      });

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    element,
    nucleons3D,
    orbitRings,
    electrons
  ]);

  // Touch & Maus Event-Handler (direkt auf Kamera-Refs für blitzschnelle Reaktionszeit)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    velocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;

    const rotSensitivity = 0.007;
    rotYRef.current += dx * rotSensitivity;
    rotXRef.current = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, rotXRef.current + dy * rotSensitivity));

    velocityRef.current = {
      x: dx * rotSensitivity * 0.8,
      y: dy * rotSensitivity * 0.8
    };

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignoriere
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoomRef.current = Math.min(2.5, Math.max(0.55, zoomRef.current - e.deltaY * 0.001));
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* 3D Canvas Bühne */}
      <div 
        className="relative flex items-center justify-center rounded-3xl bg-radial from-slate-900/95 via-slate-950 to-slate-950 border-2 border-cyan-500/40 shadow-2xl overflow-hidden group touch-none cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        title="3D-Atommodell: Echte räumliche Anordnung von Protonen, Neutronen und Elektronen-Orbitalen • Mit Maus oder Finger im Raum frei drehen • Scrollen für 3D-Zoom"
      >
        {/* Canvas für hardwarebeschleunigte 3D Vektorgrafik */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* 3D Steuerungsleiste oben: Modus-Umschalter links, Kamera-Tools rechts */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10 pointer-events-none">
          {/* Modus-Umschalter (Orbitale vs Schalen) */}
          <div className="flex items-center bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-xl p-0.5 text-[9.5px] font-mono pointer-events-auto shadow-md">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                setModelMode('orbitals');
              }}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 ${
                modelMode === 'orbitals'
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Echte räumliche s, p, d, f Quanten-Orbitale nach Pauli & Hund"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Orbitale</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                setModelMode('shells');
              }}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 ${
                modelMode === 'shells'
                  ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Klassisches 3D-Schalenmodell"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Schalen</span>
            </button>
          </div>

          {/* Schnell-Reset & Auto-Rotation Toggle rechts */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                setIsAutoRotating(prev => !prev);
              }}
              className={`p-1.5 rounded-xl border text-xs cursor-pointer transition-all ${
                isAutoRotating
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={isAutoRotating ? 'Auto-Drehung anhalten' : 'Automatische 3D-Drehung starten'}
            >
              <Compass className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetOrientation();
              }}
              className="p-1.5 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition-all"
              title="3D-Ansicht zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interaktions-Hinweis unten links */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[9px] font-mono text-slate-400 pointer-events-none hidden sm:block">
          👆 Ziehen zum Drehen • 🔍 Scrollen = Zoom
        </div>

        {/* Lappen Toggle unten rechts */}
        {modelMode === 'orbitals' && (
          <div className="absolute bottom-3 right-3 flex items-center z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClick();
                setShowLobes(prev => !prev);
              }}
              className={`px-2 py-0.5 rounded-lg border text-[9.5px] font-mono cursor-pointer transition-all flex items-center gap-1 ${
                showLobes
                  ? 'bg-purple-950/70 border-purple-500/50 text-purple-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
              title="3D-Orbitallappen (Aufenthaltswahrscheinlichkeit) ein- oder ausblenden"
            >
              <Eye className="w-3 h-3" />
              <span>{showLobes ? 'Lappen: An' : 'Lappen: Aus'}</span>
            </button>
          </div>
        )}

        {/* Mitteilung bei Quantensprung */}
        {quantumEvent && (
          <div className="absolute top-12 inset-x-3 text-center pointer-events-none animate-in fade-in zoom-in duration-300 z-20">
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-200 border border-cyan-400 text-[10px] font-bold shadow-lg">
              ⚡ {quantumEvent.message}
            </span>
          </div>
        )}
      </div>

      {/* Farbcodierte 3D-Teilchen Legende nach Nutzer-Vorgabe */}
      <div className="mt-2.5 flex items-center justify-center gap-2.5 sm:gap-4 text-[10px] sm:text-[11px] font-mono">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px] font-bold leading-none shadow-sm shadow-red-500/50">+</span>
          <span className="font-bold">{`Protonen: ${element.protons}`}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] font-bold leading-none shadow-sm shadow-emerald-500/50">0</span>
          <span className="font-bold">{`Neutronen: ${element.neutrons}`}</span>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-blue-950/40 border border-blue-500/40 text-blue-300">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold leading-none shadow-sm shadow-blue-500/50">-</span>
          <span className="font-bold">{`Elektronen: ${totalElectrons}`}</span>
        </div>
      </div>

      {/* Hinweis zur Modell-Darstellung */}
      <p className="mt-1 text-[11px] text-slate-400 italic font-mono text-center">
        Atom sieht vielleicht nicht echt aus (didaktisches Modell)
      </p>

      {/* Steuerungsleiste: Pause, Speed, Quantensprung & Kernschau */}
      {showControls && (
        <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setIsPaused(prev => !prev);
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              isPaused
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isPaused ? 'Fortsetzen' : 'Pausieren'}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Start' : 'Pause'}</span>
          </button>

          <button
            type="button"
            onClick={triggerQuantumJump}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
            title="Elektronensprung mit Photon-Emission in 3D auslösen"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Quantensprung ⚡</span>
          </button>

          {onOpenNucleusInspector && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                soundEngine.playAtomOrbit();
                onOpenNucleusInspector();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-105 active:scale-95"
              title="Große 3D-Kernschau mit Protonen- und Neutronen-Inspektor öffnen"
            >
              <Search className="w-3.5 h-3.5" />
              <span>3D-Kernschau 🔬</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setSpeedMultiplier(prev => prev === 1.0 ? 2.0 : prev === 2.0 ? 0.5 : 1.0);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs font-bold hover:bg-slate-800 cursor-pointer"
            title="Geschwindigkeit anpassen"
          >
            {speedMultiplier}x
          </button>
        </div>
      )}
    </div>
  );
};
