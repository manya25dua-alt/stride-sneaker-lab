const FRAME_COUNT = 120;
const FRAME_W = 1280;
const FRAME_H = 720;
const BASE = "https://prompts.picsmob.com/frames/nova/";
const frameSrc = (i) => BASE + "frame_" + String(i + 1).padStart(4, "0") + ".jpg";
 
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const band = (p, a, b, c, d) =>
  p <= a || p >= d ? 0 : p < b ? (p - a) / (b - a) : p <= c ? 1 : (d - p) / (d - c);
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
 
const nav = document.querySelector(".nav");
const section = document.querySelector(".scroll");
const stage = document.querySelector(".stage");
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
const loadbar = document.querySelector(".loadbar");
const fill = loadbar.querySelector("i");
const counterNum = document.querySelector(".counter span");
const callouts = [...document.querySelectorAll(".callout")];
 
function frameLayout(w, h) {
  if (w >= h) {
    const scale = Math.max(w / FRAME_W, h / FRAME_H);
    return { scale, ox: (w - FRAME_W * scale) / 2, oy: (h - FRAME_H * scale) / 2, tall: false };
  }
  const scale = (w * 1.35) / FRAME_W;
  return { scale, ox: (w - FRAME_W * scale) / 2, oy: h * 0.46 - (FRAME_H * scale) / 2, tall: true };
}
 
const frames = [];
const need = REDUCED ? 1 : FRAME_COUNT;
let cur = REDUCED ? FRAME_COUNT - 1 : 0;
let drawn = -1, w = 0, h = 0, dpr = 1, count = 0, lastStep = 1;
 
function paint(i) {
  if (!w || !h) return;
  const { scale, ox, oy, tall } = frameLayout(w, h);
  const dw = FRAME_W * scale, dh = FRAME_H * scale;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = "#010101";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(frames[i], ox, oy, dw, dh);
  if (tall) {
    let g = ctx.createLinearGradient(0, oy + dh * 0.82, 0, oy + dh);
    g.addColorStop(0, "rgba(1,1,1,0)");
    g.addColorStop(1, "#010101");
    ctx.fillStyle = g;
    ctx.fillRect(ox, oy + dh * 0.82, dw, dh * 0.18);
    g = ctx.createLinearGradient(0, oy, 0, oy + dh * 0.12);
    g.addColorStop(0, "#010101");
    g.addColorStop(1, "rgba(1,1,1,0)");
    ctx.fillStyle = g;
    ctx.fillRect(ox, oy, dw, dh * 0.12);
  }
}
 
function placeCallouts() {
  const { scale, ox, oy } = frameLayout(w, h);
  for (const el of callouts) {
    const d = el.dataset;
    const dx = +d.dx, dy = +d.dy;
    el.style.setProperty("--ax", ox + +d.x * FRAME_W * scale + "px");
    el.style.setProperty("--ay", oy + +d.y * FRAME_H * scale + "px");
    el.style.setProperty("--dx", dx + "px");
    el.style.setProperty("--dy", dy + "px");
    el.style.setProperty("--len", Math.hypot(dx, dy) + "px");
    const line = el.querySelector("line");
    line.setAttribute("x2", dx);
    line.setAttribute("y2", dy);
  }
}
 
function resize() {
  w = stage.clientWidth;
  h = stage.clientHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  drawn = -1;
  placeCallouts();
}
 
function done() {
  count++;
  fill.style.transform = `scaleX(${count / need})`;
  if (count >= need) loadbar.remove();
}
 
function load(i) {
  return new Promise((res) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => { frames[i] = img; done(); res(); };
    img.onerror = () => { done(); res(); };
    img.src = frameSrc(i);
  });
}
 
(async () => {
  if (REDUCED) return load(FRAME_COUNT - 1);
  await load(0);
  let next = 1;
  const worker = async () => {
    while (next < FRAME_COUNT) await load(next++);
  };
  await Promise.all(Array.from({ length: 6 }, worker));
})();
 
const best = (i) => {
  while (i >= 0 && !frames[i]) i--;
  return i;
};
const set = (k, v) => stage.style.setProperty(k, v);
 
function tick() {
  const rect = section.getBoundingClientRect();
  const span = section.offsetHeight - window.innerHeight;
  const p = REDUCED ? 1 : span > 0 ? clamp(-rect.top / span) : 0;
  const target = p * (FRAME_COUNT - 1);
  cur += (target - cur) * 0.2;
  if (Math.abs(target - cur) < 0.001) cur = target;
  const i = best(Math.round(cur));
  if (i >= 0 && i !== drawn) { paint(i); drawn = i; }
 
  set("--p", p);
  set("--b1", band(p, -1, 0, 0.16, 0.28));
  set("--b2", band(p, 0.3, 0.38, 0.54, 0.62));
  set("--b3", band(p, 0.66, 0.76, 2, 3));
  const t = clamp((p - 0.7) / 0.18);
  for (let n = 0; n < 3; n++) set(`--c${n}`, clamp(t * 1.6 - n * 0.3));
 
  const s = p >= 0.64 ? 3 : p >= 0.3 ? 2 : 1;
  if (s !== lastStep) {
    lastStep = s;
    counterNum.textContent = String(s).padStart(2, "0");
  }
  requestAnimationFrame(tick);
}
 
resize();
window.addEventListener("resize", resize);
requestAnimationFrame(tick);
 
/* nav background after 4 screen heights */
const onScroll = () => nav.classList.toggle("solid", window.scrollY > window.innerHeight * 4);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
 
/* reveal once on scroll into view */
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
 
/* pre-order */
const sizes = [...document.querySelectorAll(".size")];
const reserve = document.getElementById("reserve");
let size = 9, reserved = false;
const renderReserve = () => {
  reserve.textContent = reserved ? `Reserved: UK ${size} ✓` : "Pre-order now";
};
sizes.forEach((btn) =>
  btn.addEventListener("click", () => {
    size = +btn.textContent;
    reserved = false;
    sizes.forEach((b) => {
      const on = b === btn;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on);
    });
    renderReserve();
  })
);
reserve.addEventListener("click", () => {
  reserved = true;
  renderReserve();
});