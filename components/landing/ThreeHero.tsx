"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Subtle WebGL particle field for the hero background — reacts gently to the
 * cursor, drifts on its own otherwise. Deliberately minimal Three.js surface
 * (Scene/PerspectiveCamera/WebGLRenderer/BufferGeometry/Points only, no
 * postprocessing, no loaders) to keep the bundle cost of "real Three.js" as
 * low as it can be. Skips entirely on narrow viewports — a static CSS
 * gradient (in Landing.tsx) stands in for it there instead, per the
 * "degrade gracefully on mobile" brief.
 */
export default function ThreeHero() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(max-width: 768px)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const width = mount.offsetWidth;
    const height = mount.offsetHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const COUNT = 260;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const blue = new THREE.Color("#0066CC");
    const teal = new THREE.Color("#4B9E8F");
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      const c = Math.random() > 0.5 ? blue : teal;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      const b = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - b.left) / b.width) * 2 - 1;
      mouse.y = -((e.clientY - b.top) / b.height) * 2 + 1;
    };
    mount.addEventListener("mousemove", onMove);

    let raf = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.03 + mouse.x * 0.15;
      points.rotation.x = mouse.y * 0.08;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      const w = mount.offsetWidth;
      const h = mount.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
