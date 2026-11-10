(() => {
  const root = document.documentElement;
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // ---- theme toggle (saved per visitor; falls back to the OS setting) ----
  const btn = document.querySelector(".theme-toggle");
  const label = () => btn && btn.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  label();
  if (btn) btn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    label(); readDot();
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null; try { saved = localStorage.getItem("theme"); } catch (_) {}
    if (!saved) { root.dataset.theme = e.matches ? "dark" : "light"; label(); readDot(); }
  });

  // ---- mouse effects: only on devices with a real mouse, and not for reduced motion ----
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.querySelector(".fx-canvas");
  let dotRGB = "37,99,235", dotBase = 0.12;
  function readDot() {
    const cs = getComputedStyle(root);
    dotRGB = cs.getPropertyValue("--dot").trim() || dotRGB;
    dotBase = parseFloat(cs.getPropertyValue("--dot-base")) || dotBase;
  }
  readDot();
  if (!fine || still || !canvas) { if (canvas) canvas.remove(); return; }

  // 3D tilt on cards and the photo
  document.querySelectorAll(".fx-card").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(800px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-3px)`;
    });
    c.addEventListener("pointerleave", () => (c.style.transform = ""));
  });

  // reactive dot field behind the page
  const ctx = canvas.getContext("2d");
  let dots = [], mx = -9999, my = -9999, sx = mx, sy = my, raf = 0;
  const size = () => {
    const r = window.devicePixelRatio || 1;
    canvas.width = innerWidth * r; canvas.height = innerHeight * r;
    ctx.setTransform(r, 0, 0, r, 0, 0);
    dots = [];
    for (let y = 14; y < innerHeight; y += 28) for (let x = 14; x < innerWidth; x += 28) dots.push(x, y);
    draw();
  };
  function draw() {
    sx += (mx - sx) * 0.12; sy += (my - sy) * 0.12;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < dots.length; i += 2) {
      const x = dots[i], y = dots[i + 1], dx = x - sx, dy = y - sy, d = Math.hypot(dx, dy), t = Math.max(0, 1 - d / 170);
      const push = t * 10, ox = d ? (dx / d) * push : 0, oy = d ? (dy / d) * push : 0;
      ctx.fillStyle = `rgba(${dotRGB},${dotBase + t * 0.75})`;
      ctx.beginPath(); ctx.arc(x + ox, y + oy, 1.2 + t * 2.2, 0, 6.283); ctx.fill();
    }
    raf = Math.abs(mx - sx) + Math.abs(my - sy) > 0.5 ? requestAnimationFrame(draw) : 0;
  }
  addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
  document.addEventListener("pointerleave", () => { mx = my = -9999; if (!raf) raf = requestAnimationFrame(draw); });
  addEventListener("resize", size);
  size();
})();
