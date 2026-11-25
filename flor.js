(function () {
  // Cursor de flor (només a ordinador) i pètals en clicar
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.matchMedia("(pointer: fine)").matches) return;
  var flor = document.getElementById("flor");
  var mx = -100, my = -100, x = -100, y = -100, vx = 0, vy = 0, rot = 0, scale = 1, targetScale = 1, started = false;
  document.addEventListener("pointermove", function (e) {
    mx = e.clientX; my = e.clientY;
    if (!started) { started = true; x = mx; y = my; document.documentElement.classList.add("flor-on"); }
  });
  document.addEventListener("pointerleave", function () { flor.style.opacity = 0; });
  document.addEventListener("pointerenter", function () { flor.style.opacity = 1; });
  document.addEventListener("pointerover", function (e) { targetScale = e.target.closest("a, button") ? 1.6 : 1; });
  function frame(time) {
    if (reduce) { x = mx; y = my; }
    else { vx = (vx + (mx - x) * 0.18) * 0.62; vy = (vy + (my - y) * 0.18) * 0.62; x += vx; y += vy; }
    var spin = reduce ? 0 : Math.sin(time / 380) * 10;
    rot += ((vx * 2.2) - rot) * 0.15;
    scale += (targetScale - scale) * 0.2;
    flor.style.transform = "translate(" + (x - 17) + "px," + (y - 17) + "px) rotate(" + (rot + spin) + "deg) scale(" + scale + ")";
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  if (reduce) return;
  var kinds = ["🌸", "🌷", "🌸", "🌼"];
  document.addEventListener("pointerdown", function (e) { for (var i = 0; i < 7; i++) spawn(e.clientX, e.clientY); });
  function spawn(px, py) {
    var p = document.createElement("div");
    p.className = "petal"; p.textContent = kinds[Math.floor(Math.random() * kinds.length)];
    document.body.appendChild(p);
    var a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 5;
    var dx = Math.cos(a) * sp, dy = Math.sin(a) * sp - 4, r = 0, dr = (Math.random() - .5) * 20, life = 0;
    (function step() {
      life++; dy += 0.35; px += dx; py += dy; r += dr;
      p.style.transform = "translate(" + (px - 11) + "px," + (py - 11) + "px) rotate(" + r + "deg)";
      p.style.opacity = Math.max(0, 1 - life / 60);
      if (life < 60) requestAnimationFrame(step); else p.remove();
    })();
  }
})();
