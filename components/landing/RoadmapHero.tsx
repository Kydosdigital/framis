"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { PHASES } from "@/lib/data";

/**
 * The 3D "build graph" roadmap — ported from the original Claude Design
 * prototype (project/Framis.dc.html, roadmapCanvasRef) and rewired to the
 * live 7-phase / 64-week curriculum. A helix of wireframe icosahedron phase
 * nodes threaded by a Catmull-Rom path; the active node scales up, recolours,
 * gains orbiting satellites, and the whole rig rotates to face it while the
 * camera eases vertically. Auto-advances every 4.5s, pauses on hover, pauses
 * off-screen. Degrades to the overlay UI on a static gradient for mobile /
 * reduced-motion (the 3D is decorative; the roadmap reads fine without it).
 */

const ACCENT_HI = "#7FD6C4";
const N = PHASES.length; // 7
const TOTAL_WEEKS = 64;

// Module chips + capstone-deploy slug per phase — the real modules from
// lib/data (ROADMAP_MODULES) and capstones, shown as compact tokens.
const PHASE_EXTRA: { chips: string[]; deploy: string }[] = [
  { chips: ["terminal", "git", "python", "data_structures", "debugging"], deploy: "cli_expense_tracker" },
  { chips: ["html_css_js", "react", "http_apis", "fastapi", "postgres"], deploy: "notes_app_with_login" },
  { chips: ["pandas", "feature_engineering", "classical_ml", "model_evaluation"], deploy: "classical_ml_comparison" },
  { chips: ["pytest", "logging", "security", "ci_cd", "docker"], deploy: "tested_app_with_ci" },
  { chips: ["llm_apis", "embeddings_rag", "tool_calling", "evals", "guardrails"], deploy: "ai_qa_with_citations" },
  { chips: ["statistics", "linear_algebra", "transformers", "fine_tuning"], deploy: "train_deploy_classifier" },
  { chips: ["agents", "human_in_the_loop", "observability", "cost_control"], deploy: "production_ai_system" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const PHASE_VM = PHASES.map((p, i) => {
  const m = p.weeks.match(/(\d+)\D+(\d+)/);
  const start = m ? Number(m[1]) : 1;
  const end = m ? Number(m[2]) : TOTAL_WEEKS;
  return { num: p.num, title: p.title, desc: p.desc, start, end, ...PHASE_EXTRA[i] };
});

export default function RoadmapHero() {
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const pausedRef = useRef(false);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  const go = (i: number) => {
    activeRef.current = i;
    setActive(i);
  };

  // auto-advance (disabled under reduced motion)
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!pausedRef.current) go((activeRef.current + 1) % N);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  // the 3D scene
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a1428, 9, 22);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);

    const group = new THREE.Group();
    group.position.x = 2.1;
    scene.add(group);

    const grid = new THREE.GridHelper(30, 34, 0x1a2a44, 0x121f36);
    grid.position.set(2.1, -3.9, 0);
    scene.add(grid);

    // phase nodes along an ascending helix
    const angleStep = 0.98;
    const yStep = 1.0;
    const angles: number[] = [];
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      const a = i * angleStep - ((N - 1) / 2) * angleStep;
      angles.push(a);
      pts.push(new THREE.Vector3(Math.cos(a) * 2.2, i * yStep - ((N - 1) / 2) * yStep, Math.sin(a) * 2.2));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const pathLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(180)),
      new THREE.LineBasicMaterial({ color: 0x4b9e8f, transparent: true, opacity: 0.4 }),
    );
    group.add(pathLine);

    const cA = new THREE.Color(0x0066cc);
    const cB = new THREE.Color(0x4b9e8f);
    const hi = new THREE.Color(ACCENT_HI);

    const ringGeo = (() => {
      const rp: THREE.Vector3[] = [];
      for (let k = 0; k <= 64; k++) {
        const ra = (k / 64) * Math.PI * 2;
        rp.push(new THREE.Vector3(Math.cos(ra) * 0.68, 0, Math.sin(ra) * 0.68));
      }
      return new THREE.BufferGeometry().setFromPoints(rp);
    })();

    const disposables: { dispose: () => void }[] = [ringGeo, pathLine.geometry, pathLine.material as THREE.Material, grid.geometry, grid.material as THREE.Material];

    const nodes = pts.map((p, i) => {
      const col = cA.clone().lerp(cB, i / (N - 1));
      const wireGeo = new THREE.IcosahedronGeometry(0.42, 1);
      const coreGeo = new THREE.IcosahedronGeometry(0.14, 0);
      const wireMat = new THREE.MeshBasicMaterial({ color: col.clone(), wireframe: true, transparent: true, opacity: 0.5 });
      const coreMat = new THREE.MeshBasicMaterial({ color: col.clone(), transparent: true, opacity: 0.9 });
      const ringMat = new THREE.LineBasicMaterial({ color: col.clone(), transparent: true, opacity: 0.2 });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      const core = new THREE.Mesh(coreGeo, coreMat);
      const ring = new THREE.Line(ringGeo, ringMat);
      wire.position.copy(p);
      core.position.copy(p);
      ring.position.copy(p);
      ring.rotation.x = 0.5 + i * 0.12;
      ring.rotation.z = i * 0.4;
      const stemGeo = new THREE.BufferGeometry().setFromPoints([p, new THREE.Vector3(p.x, -3.9, p.z)]);
      const stemMat = new THREE.LineBasicMaterial({ color: 0x33455f, transparent: true, opacity: 0.28 });
      const stem = new THREE.Line(stemGeo, stemMat);
      group.add(wire, core, ring, stem);
      disposables.push(wireGeo, coreGeo, wireMat, coreMat, ringMat, stemGeo, stemMat);
      return { wire, core, ring, base: col };
    });

    // orbiting satellites on the active node
    const satGroup = new THREE.Group();
    const satGeo = new THREE.OctahedronGeometry(0.075, 0);
    const satMat = new THREE.MeshBasicMaterial({ color: 0x7fd6c4, transparent: true, opacity: 0.95 });
    const sats = [0, 1, 2].map(() => {
      const s = new THREE.Mesh(satGeo, satMat);
      satGroup.add(s);
      return s;
    });
    group.add(satGroup);
    disposables.push(satGeo, satMat);

    // ambient dust
    const dGeo = new THREE.BufferGeometry();
    const dArr = new Float32Array(220 * 3);
    for (let i = 0; i < dArr.length; i++) dArr[i] = (Math.random() - 0.5) * 13;
    dGeo.setAttribute("position", new THREE.BufferAttribute(dArr, 3));
    const dMat = new THREE.PointsMaterial({ color: 0x33455f, size: 0.045, transparent: true, opacity: 0.8 });
    group.add(new THREE.Points(dGeo, dMat));
    disposables.push(dGeo, dMat);

    // data pulses travelling the path
    const pulseGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x9fe8da, transparent: true, opacity: 0.9 });
    const pulses = [0, 1, 2].map((k) => {
      const m = new THREE.Mesh(pulseGeo, pulseMat);
      group.add(m);
      return { m, off: k / 3 };
    });
    disposables.push(pulseGeo, pulseMat);

    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      const b = mount.getBoundingClientRect();
      mx = (e.clientX - b.left) / b.width - 0.5;
      my = (e.clientY - b.top) / b.height - 0.5;
    };
    const onLeave = () => {
      mx = 0;
      my = 0;
    };
    mount.addEventListener("mousemove", onMove);
    mount.addEventListener("mouseleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver((entries) => entries.forEach((en) => (visible = en.isIntersecting)), { threshold: 0.01 });
    if (sectionRef.current) io.observe(sectionRef.current);

    const clock = new THREE.Clock();
    let camY = 1.0;
    let lookY = -0.4;
    let satScale = 0;
    let lastActive = -1;
    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      const w = mount.offsetWidth;
      const h = mount.offsetHeight;
      if (w === 0 || h === 0) return;
      if (renderer.domElement.width !== Math.floor(w * renderer.getPixelRatio())) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      const t = clock.getElapsedTime();
      const a = activeRef.current;

      const targetRot = Math.PI / 2 - angles[a];
      let dr = targetRot - group.rotation.y;
      dr = Math.atan2(Math.sin(dr), Math.cos(dr));
      group.rotation.y += dr * 0.045 + Math.sin(t * 0.35) * 0.0012;
      camY += (pts[a].y * 0.45 + 1.35 - camY) * 0.04;
      lookY += (pts[a].y * 0.55 - lookY) * 0.04;

      nodes.forEach((n, i) => {
        const on = i === a;
        const s = n.wire.scale.x + ((on ? 1.6 : 1) - n.wire.scale.x) * 0.1;
        n.wire.scale.setScalar(s);
        n.core.scale.setScalar(s);
        n.ring.scale.setScalar(s);
        n.wire.rotation.y = t * (0.3 + i * 0.07);
        n.wire.rotation.x = t * 0.18;
        n.ring.rotation.y = t * (on ? 0.9 : 0.25);
        (n.wire.material as THREE.MeshBasicMaterial).opacity = on ? 0.95 : 0.4;
        (n.ring.material as THREE.LineBasicMaterial).opacity = on ? 0.75 : 0.16;
        (n.wire.material as THREE.MeshBasicMaterial).color.copy(on ? hi : n.base);
        (n.core.material as THREE.MeshBasicMaterial).color.copy(on ? hi : n.base);
        (n.ring.material as THREE.LineBasicMaterial).color.copy(on ? hi : n.base);
      });

      if (a !== lastActive) {
        satScale = 0;
        lastActive = a;
      }
      satScale += (1 - satScale) * 0.06;
      satGroup.position.copy(pts[a]);
      sats.forEach((s, k) => {
        const oa = t * 1.4 + k * ((Math.PI * 2) / 3);
        s.position.set(Math.cos(oa) * 0.95, Math.sin(oa * 0.7) * 0.34, Math.sin(oa) * 0.95);
        s.scale.setScalar(satScale);
        s.rotation.y = t * 2;
      });

      pulses.forEach((p) => p.m.position.copy(curve.getPoint((t * 0.055 + p.off) % 1)));

      camera.position.set(mx * 1.3, camY - my * 0.9, 8.8);
      camera.lookAt(1.1, lookY, 0);
      renderer.render(scene, camera);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mount.removeEventListener("mousemove", onMove);
      mount.removeEventListener("mouseleave", onLeave);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  const vm = PHASE_VM[active];

  return (
    <section
      ref={sectionRef}
      id="curriculum"
      className="relative overflow-hidden border-y border-navy-600 bg-navy"
    >
      <div ref={mountRef} className="pointer-events-none absolute inset-0" aria-hidden />
      {/* legibility scrims over the 3D */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(90deg,rgba(10,20,40,.92) 0%,rgba(10,20,40,.62) 40%,rgba(10,20,40,0) 70%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg,rgba(10,20,40,.6) 0%,rgba(10,20,40,0) 18%,rgba(10,20,40,0) 78%,rgba(10,20,40,.75) 100%)" }}
      />

      <div className="relative mx-auto max-w-[1120px] px-6 py-[68px] sm:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-inter text-[30px] font-bold tracking-[-0.02em] text-white">The 64-week roadmap</h2>
          <span className="font-mono text-[11.5px] font-medium tracking-[0.08em] text-teal">
            64 WEEKS · 7 PHASES · 7 SHIPPED SYSTEMS
          </span>
        </div>

        {/* active phase panel */}
        <div
          className="my-11 min-h-[300px] max-w-[480px]"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          <div className="flex items-start gap-3 sm:gap-[18px]">
            <span
              className="font-mono text-[52px] font-bold leading-[0.9] tracking-[-0.05em] text-teal sm:text-[82px]"
              style={{ textShadow: "0 0 34px rgba(75,158,143,.45)" }}
            >
              {pad(active + 1)}
            </span>
            <div className="pt-1.5">
              <div className="mb-1.5 font-mono text-[11px] font-medium tracking-[0.16em] text-slateink-400">
                PHASE // WK {pad(vm.start)}–{pad(vm.end)}
              </div>
              <div className="font-inter text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-white">
                {vm.title}
              </div>
            </div>
          </div>

          <p className="mb-3.5 mt-[18px] max-w-[430px] text-[15px]/[1.6] text-slateink-200">{vm.desc}</p>
          <div className="mb-4 font-mono text-[13px] font-medium text-teal">▸ deploy: {vm.deploy}</div>

          <div className="flex flex-wrap gap-[7px]">
            {vm.chips.map((c) => (
              <span
                key={c}
                className="rounded-[5px] border border-navy-400 bg-navy-800/70 px-2.5 py-[5px] font-mono text-[11.5px] font-medium text-slateink-300"
              >
                {c}
              </span>
            ))}
          </div>

          {/* 64-week tick bar */}
          <div className="mt-[22px] flex max-w-[430px] gap-[1px] sm:gap-[2px]">
            {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
              const wk = i + 1;
              const inPhase = wk >= vm.start && wk <= vm.end;
              const done = wk < vm.start;
              return (
                <span
                  key={wk}
                  className="h-[13px] flex-1 rounded-[1px] transition-colors duration-300"
                  style={{ background: inPhase ? "#4FB3A0" : done ? "#213652" : "#16233A" }}
                />
              );
            })}
          </div>
          <div className="mt-[7px] flex max-w-[430px] justify-between font-mono text-[10.5px] text-slateink-400">
            <span>WK 01</span>
            <span>WK 64</span>
          </div>
        </div>

        {/* phase selector */}
        <div
          className="grid grid-cols-2 gap-3 min-[520px]:grid-cols-4 lg:grid-cols-7"
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
        >
          {PHASE_VM.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.num}
                onClick={() => go(i)}
                onMouseEnter={() => go(i)}
                className="border-t-2 px-1 pb-1.5 pt-[13px] text-left transition-colors duration-300"
                style={{ borderTopColor: on ? "#4B9E8F" : "#1E2E4A" }}
              >
                <div className="font-mono text-[12px] font-semibold transition-colors duration-300" style={{ color: on ? ACCENT_HI : "#6B7B93" }}>
                  {pad(Number(p.num))} <span className="font-normal text-slateink-400">/ WK {pad(p.start)}–{pad(p.end)}</span>
                </div>
                <div
                  className="mt-1.5 font-inter text-[13px] font-semibold leading-[1.3] transition-colors duration-300"
                  style={{ color: on ? "#fff" : "#7C8CA3" }}
                >
                  {p.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
