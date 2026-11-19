const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let targetY = window.scrollY;
let frame = 0;

function stopWheelAnimation() {
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  targetY = window.scrollY;
  document.documentElement.classList.remove("wheel-scrolling");
}

function animateWheel() {
  const currentY = window.scrollY;
  const distance = targetY - currentY;

  if (Math.abs(distance) < 1) {
    window.scrollTo(0, targetY);
    frame = 0;
    document.documentElement.classList.remove("wheel-scrolling");
    return;
  }

  window.scrollTo(0, currentY + distance * 0.18);
  frame = requestAnimationFrame(animateWheel);
}

window.addEventListener("wheel", (event) => {
  if (prefersReducedMotion.matches || event.ctrlKey || event.deltaY === 0) {
    stopWheelAnimation();
    return;
  }

  const scale = event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? 16
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? window.innerHeight
      : 1;
  const delta = event.deltaY * scale;

  // shortcut: large integer deltas approximate mouse wheels; adjust if a trackpad is misclassified.
  if (event.deltaMode === WheelEvent.DOM_DELTA_PIXEL && (!Number.isInteger(delta) || Math.abs(delta) < 80)) {
    stopWheelAnimation();
    return;
  }

  event.preventDefault();
  document.documentElement.classList.add("wheel-scrolling");
  const maxY = document.documentElement.scrollHeight - window.innerHeight;
  targetY = Math.max(0, Math.min(maxY, (frame ? targetY : window.scrollY) + delta));
  if (!frame) frame = requestAnimationFrame(animateWheel);
}, { passive: false });

prefersReducedMotion.addEventListener("change", (event) => {
  if (event.matches) stopWheelAnimation();
});
