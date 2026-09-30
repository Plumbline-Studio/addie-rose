"use client";
import { useEffect } from "react";

// Drives the rose-gold metal:
//  --p   per element, where it sits on screen (moves the gradient and glint)
//  --s   global, scroll distance (drifts the sparkle texture)
//  .is-scrolling on <html> while the page is moving (turns the sparkle on)
export default function Sheen() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-sheen]"));
    let frame = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      frame = 0;
      const h = window.innerHeight;
      root.style.setProperty("--s", (window.scrollY * 0.35).toFixed(1));
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -h || r.top > 2 * h) continue;
        const p = Math.min(1, Math.max(0, (r.top + h * 0.3) / (h * 1.3)));
        el.style.setProperty("--p", p.toFixed(3));
      }
    };
    const onScroll = () => {
      root.classList.add("is-scrolling");
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => root.classList.remove("is-scrolling"), 220);
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      if (idle) clearTimeout(idle);
    };
  }, []);
  return null;
}
