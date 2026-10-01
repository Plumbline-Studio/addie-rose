"use client";
import { useEffect } from "react";

// Drives the rose-gold metal with eased, inertial motion:
//  --p       per number: its place on screen, eased toward the target
//            so the shine glides instead of stepping with scroll events
//  --s       sparkle drift, eased
//  --energy  0..1 on <html>: rises quickly when scrolling starts,
//            then settles back over about a second. Fades the sparkle
//            in and out and brightens the button gleam.
// The loop only runs while something is still moving.
export default function Sheen() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-sheen]"));
    const cur = new Map<HTMLElement, number>();
    let energy = 0, s = window.scrollY * 0.35, lastScroll = -1e9;
    let raf = 0, last = performance.now();

    const targetP = (el: HTMLElement, h: number) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -h || r.top > 2 * h) return null;
      return Math.min(1, Math.max(0, (r.top + h * 0.3) / (h * 1.3)));
    };
    const ease = (from: number, to: number, dt: number, tau: number) =>
      from + (to - from) * (1 - Math.exp(-dt / tau));

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const h = window.innerHeight;
      const scrolling = now - lastScroll < 160;
      energy = ease(energy, scrolling ? 1 : 0, dt, scrolling ? 0.18 : 0.9);
      s = ease(s, window.scrollY * 0.35, dt, 0.35);
      root.style.setProperty("--energy", energy.toFixed(3));
      root.style.setProperty("--s", s.toFixed(1));

      let moving = energy > 0.004 || scrolling;
      for (const el of els) {
        const t = targetP(el, h);
        if (t === null) continue;
        const prev = cur.get(el) ?? t;
        const next = ease(prev, t, dt, 0.28);
        cur.set(el, next);
        el.style.setProperty("--p", next.toFixed(4));
        if (Math.abs(next - t) > 0.0008) moving = true;
      }
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      lastScroll = performance.now();
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);
    return () => {
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
