"use client";
import { useEffect, useState } from "react";

// Small page number in the corner, like a printed booklet.
export default function Folio() {
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const pages = document.querySelectorAll<HTMLElement>("[data-track]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const t = Number(e.target.getAttribute("data-track"));
          setN(t > 0 ? t : null);
        }
      }),
      { threshold: 0.55 }
    );
    pages.forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, []);
  return (
    <div
      aria-hidden
      className="fixed right-5 font-display text-xs tabular-nums text-lilac/60 transition-opacity duration-300 pointer-events-none"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))", opacity: n ? 1 : 0 }}
    >
      {n ? `${String(n).padStart(2, "0")} of 18` : ""}
    </div>
  );
}
