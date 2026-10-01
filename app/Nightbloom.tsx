"use client";
import { useEffect, useRef } from "react";

// Nightbloom (Background Vault H-05), retuned for Addie 18.
// Plum stays the ground. Four soft light fields drift slowly:
// violet, dusk lavender, a faint rose-gold ember, and a deep shadow
// that adds depth. Scrolling nudges the lights so the page feels alive.
// No touch handling, so it never interferes with scrolling.
const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision mediump float;
uniform vec2 res;uniform float t;uniform vec3 L[4];
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 uv=gl_FragCoord.xy/res; float a=res.x/res.y; uv.x*=a;
  vec3 col=vec3(.239,.090,.220);           // plum #3D1738
  vec3 cols[4];
  cols[0]=vec3(.07,.025,.12);              // violet lift
  cols[1]=vec3(.07,.055,.10);              // dusk lavender
  cols[2]=vec3(.075,.035,.02);             // rose-gold ember, faint
  cols[3]=vec3(-.11,-.05,-.10);            // deep shadow for depth
  for(int i=0;i<4;i++){
    vec2 q=L[i].xy; q.x*=a;
    float d=distance(uv,q);
    col+=cols[i]*exp(-d*d/(2.*L[i].z*L[i].z));
  }
  col=clamp(col,0.,1.);
  col+=(hash(gl_FragCoord.xy+fract(t)*100.)-.5)*.022;   // fine grain
  gl_FragColor=vec4(col,1.);
}`;

export default function Nightbloom() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const gl = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: false });
    if (!gl) { c.style.display = "none"; return; }
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.style.display = "none"; return; }
    gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, "res"), uT = gl.getUniformLocation(pr, "t"), uL = gl.getUniformLocation(pr, "L");

    const resize = () => {
      const s = 0.6; // soft field, so a lower render size looks the same and saves battery
      c.width = Math.max(1, Math.round(innerWidth * s));
      c.height = Math.max(1, Math.round(innerHeight * s));
      gl.viewport(0, 0, c.width, c.height);
    };
    addEventListener("resize", resize); resize();

    const seeds = [
      { x: .25, y: .25, r: .34, ph: 0.0, sp: .11 },
      { x: .75, y: .55, r: .30, ph: 2.1, sp: .09 },
      { x: .60, y: .20, r: .24, ph: 4.0, sp: .13 },
      { x: .30, y: .80, r: .36, ph: 5.2, sp: .08 },
    ];
    const F = seeds.map((s) => ({ ...s }));
    const flat = new Float32Array(12);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let checked = false;
    let raf = 0, t0 = performance.now(), last = t0, scrollPull = 0;

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const t = ((now - t0) / 1000) * (reduced ? 0.15 : 1);
      const sc = reduced ? 0 : scrollY / Math.max(1, innerHeight);
      scrollPull += (sc - scrollPull) * (1 - Math.exp(-dt * 3));
      F.forEach((f, i) => {
        const tx = .5 + Math.cos(t * f.sp + f.ph + scrollPull * .55) * .36;
        const ty = .5 + Math.sin(t * f.sp * 1.3 + f.ph * 1.7 + scrollPull * (.4 + i * .1)) * .32;
        f.x += (tx - f.x) * (1 - Math.exp(-dt * .6));
        f.y += (ty - f.y) * (1 - Math.exp(-dt * .6));
        flat[i * 3] = f.x; flat[i * 3 + 1] = 1 - f.y; flat[i * 3 + 2] = f.r;
      });
      gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, t); gl.uniform3fv(uL, flat);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!checked) {
        checked = true;
        // Safety check: sample five points. If any came back black, this
        // device isn't drawing WebGL properly, so fall back to solid plum.
        const px = new Uint8Array(4);
        const pts = [[.5, .5], [.05, .05], [.95, .05], [.05, .95], [.95, .95]];
        const bad = pts.some(([u, v]) => {
          gl.readPixels(Math.floor(u * c.width), Math.floor(v * c.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
          return px[0] + px[1] + px[2] < 20;
        });
        if (bad) { c.style.display = "none"; return; }
        c.style.opacity = "1";
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);
  return (
    <canvas ref={ref} aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-0 transition-opacity duration-1000" />
  );
}
