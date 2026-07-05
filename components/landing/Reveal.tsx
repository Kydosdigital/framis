"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal. Mirrors the prototype's [data-reveal] mechanism:
 * off → on when the element crosses 12% into the viewport, which fades/slides
 * the block in and staggers any [data-stagger] children via CSS.
 */
export default function Reveal({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            setOn(true);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} id={id} data-reveal={on ? "on" : "off"} className={className}>
      {children}
    </div>
  );
}
