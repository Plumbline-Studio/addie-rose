import { songs, APPLE_MUSIC_URL, SPOTIFY_URL } from "./songs";
import Folio from "./Folio";
import Sheen from "./Sheen";
import Nightbloom from "./Nightbloom";

function Listen({ large = false }: { large?: boolean }) {
  const base =
    "inline-flex items-center justify-center rounded-full font-display font-semibold tracking-tight";
  const size = large ? "px-7 py-4 text-lg" : "px-6 py-3.5 text-base";
  return (
    <div className="flex flex-wrap gap-4">
      <a href={APPLE_MUSIC_URL} target="_blank" rel="noopener noreferrer"
         className={`${base} ${size} btn-metal`}>
        <span className="btn-sheen" aria-hidden><i /></span>
        <span className="btn-label">Listen on Apple Music</span>
      </a>
      {SPOTIFY_URL && (
        <a href={SPOTIFY_URL} target="_blank" rel="noopener noreferrer"
           className={`${base} ${size} btn-outline-metal`}>
          Listen on Spotify
        </a>
      )}
    </div>
  );
}

export default function Home() {
  const last = songs.length - 1;
  return (
    <main className="mx-auto max-w-xl">
      <Nightbloom />
      <Folio />
      <Sheen />

      <section className="page" data-track="0">
        <h1 className="rise text-ivory">
          <span className="block text-[clamp(4.25rem,19vw,7rem)]">
            <span data-sheen data-n="Addison" className="metal name-script">Addison</span>
          </span>
          <span className="block text-[clamp(4.25rem,19vw,7rem)]" style={{ paddingLeft: "0.9em", marginTop: "-0.18em" }}>
            <span data-sheen data-n="Rose" className="metal name-script">Rose</span>
          </span>
          <span className="mt-[0.2em] block text-[clamp(5.5rem,30vw,10rem)] leading-none"><span data-sheen data-n="18" className="metal font-serif italic font-normal tracking-[-0.03em]">18</span></span>
        </h1>
        <p className="rise rise-2 mt-8 font-serif italic text-2xl leading-snug text-ivory max-w-[18ch]">
          18 songs I think you should meet.
        </p>
        <div className="rise rise-3 mt-10"><Listen /></div>
        <p className="rise rise-3 mt-16 font-display text-sm text-lilac/60">Scroll to start</p>
      </section>

      {songs.map((s, i) => {
        const isLast = i === last;
        return (
          <section key={s.title} className="page" data-track={i + 1}
                   aria-label={`${i + 1}. ${s.title} by ${s.artist}`}>
            <div className="text-[clamp(7rem,42vw,13rem)] leading-none">
              <span data-sheen data-n={String(i + 1).padStart(2, "0")}
                    className="metal font-serif italic font-normal tracking-[-0.02em]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="mt-6 font-display font-bold leading-[1.02] tracking-[-0.025em] text-ivory text-[clamp(2rem,9vw,3.25rem)] text-balance">
              {s.title}
            </h2>
            <p className="mt-2 font-display text-lg text-lilac">{s.artist}</p>
            <p className={`note mt-8 font-serif italic text-ivory max-w-[34ch] ${isLast ? "text-[1.6rem] leading-[1.4]" : "text-[1.3rem] leading-[1.55]"}`}>
              {s.note}
            </p>
            {isLast && (
              <div className="mt-14"><Listen large /></div>
            )}
          </section>
        );
      })}
    </main>
  );
}
