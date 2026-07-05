"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
};

/**
 * Drifting particle network that reacts to the cursor. Ported from the Framis
 * prototype's hero canvas — self-heals its size each frame so it renders on
 * first paint rather than only after a resize.
 */
export default function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement!;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let w = 0;
    let h = 0;
    const size = () => {
      w = parent.offsetWidth;
      h = parent.offsetHeight;
      el.width = w * dpr;
      el.height = h * dpr;
    };
    size();
    window.addEventListener("resize", size);

    const nodes: Node[] = [];
    for (let i = 0; i < 44; i++)
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.8,
        c: Math.random() > 0.5 ? "0,102,204" : "75,158,143",
      });

    const mouse = { x: -999, y: -999 };
    const onMove = (e: MouseEvent) => {
      const b = el.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    const onLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    const ctx = el.getContext("2d")!;
    let raf = 0;

    const draw = () => {
      if (!el.isConnected) return;
      if (w !== parent.offsetWidth || h !== parent.offsetHeight) {
        size();
        if (w > 0)
          for (const n of nodes) {
            if (n.x > w || n.x < 0) n.x = Math.random() * w;
            if (n.y > h || n.y < 0) n.y = Math.random() * h;
          }
      }
      if (w === 0) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const n of nodes) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        if (dx * dx + dy * dy < 24000) {
          n.vx += dx * 0.00005;
          n.vy += dy * 0.00005;
        }
        n.vx *= 0.996;
        n.vy *= 0.996;
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const ddx = a.x - b.x;
          const ddy = a.y - b.y;
          const d = Math.sqrt(ddx * ddx + ddy * ddy);
          if (d < 120) {
            ctx.strokeStyle =
              "rgba(75,158,143," + (0.22 * (1 - d / 120)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      for (const n of nodes) {
        ctx.fillStyle = "rgba(" + n.c + ",0.75)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 6.284);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
