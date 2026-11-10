(() => {
  document.documentElement.classList.add("js");
  document.getElementById("yr").textContent = new Date().getFullYear();

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const secs = document.querySelectorAll(".sec");
  const links = document.querySelectorAll(".bar nav a");

  if ("IntersectionObserver" in window && !reduce) {
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); reveal.unobserve(e.target); } });
    }, { threshold: 0.12 });
    secs.forEach((s) => reveal.observe(s));
  } else {
    secs.forEach((s) => s.classList.add("in"));
  }

  // highlight the nav item for the section in view
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  secs.forEach((s) => s.id && spy.observe(s));

  // copy email
  document.querySelectorAll(".copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "copied ✓";
      } catch { btn.textContent = "copy failed"; }
      setTimeout(() => (btn.textContent = "copy"), 1600);
    });
  });
})();
