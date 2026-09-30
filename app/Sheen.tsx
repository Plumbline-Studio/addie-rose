"use client";
import { useEffect } from "react";

// Moves the rose-gold highlight across each number as it travels up the screen.
export default function Sheen() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-sheen]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = window.innerHeight;
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        if (top < -h || top > 2 * h) continue;
        const p = Math.min(1, Math.max(0, (top + h * 0.3) / (h * 1.3)));
        el.style.setProperty("--p", p.toFixed(3));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return null;
}
