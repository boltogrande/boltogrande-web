(function () {
  // Animació d'entrada (només en obrir o recarregar la web; ho decideix l'script del <head> de index.html).
  // 1) Pop-up -> 2) vídeo del cartell sobre verd -> 3) en encongir-se, el fons es dissol i apareix la pàgina
  // -> 4) l'alter ego fa el cor de mans i queda a la pose final de la pàgina.
  var root = document.documentElement;
  var bg = document.getElementById("intro-bg"), video = document.getElementById("intro-video");
  var ego = document.getElementById("ego");
  var done = false, started = false, revealed = false, timers = [];

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function cleanup() {
    root.classList.remove("intro", "anim", "ego-wait");
    if (ego) ego.style.display = "none";
    [bg, video].forEach(function (n) { if (n && n.parentNode) n.parentNode.removeChild(n); });
  }
  function reveal() {
    if (revealed) return; revealed = true;
    root.classList.remove("intro"); root.classList.add("reveal", "ego-wait");
    if (bg) bg.classList.add("fade");
    later(function () { root.classList.remove("reveal"); }, 1400);
  }
  function finish() {            // salta-ho tot i deixa la pàgina com a l'estat final
    if (done) return; done = true;
    timers.forEach(clearTimeout);
    try { video.pause(); } catch (e) {}
    root.classList.remove("intro"); root.classList.add("reveal");
    later(function () { root.classList.remove("reveal"); }, 1400);
    cleanup();
  }

  if (!root.classList.contains("anim") || !video) { cleanup(); return; }

  // Alter ego: fotogrames de l'sprite (4 columnes x 1 fila) amb la durada de cadascun en ms
  var COLS = 4;
  var SEQ = [[0, 200], [1, 400], [2, 200], [3, 450]];   // cor de mans, picada d'ull i pose final
  function frame(i) { ego.style.backgroundPosition = (i * 100 / (COLS - 1)) + "% 0"; }
  function playEgo() {
    if (done || !ego) return finish();
    ego.style.display = "block";
    var n = 0;
    (function step() {
      if (done) return;
      if (n >= SEQ.length) { done = true; cleanup(); return; }
      frame(SEQ[n][0]); var d = SEQ[n][1]; n++; later(step, d);
    })();
  }

  var T_REVEAL = 6.10, T_END = 6.66;
  function watch() {
    if (done) return;
    var t = video.currentTime;
    if (t >= T_REVEAL) reveal();
    if (video.ended || t >= T_END) {
      reveal();
      video.classList.add("off");
      later(playEgo, 170);
      return;
    }
    requestAnimationFrame(watch);
  }
  function go() {
    if (started) return; started = true;
    var p = video.play();
    video.classList.add("on");
    if (p && p.then) p.then(function () { requestAnimationFrame(watch); }, finish); else requestAnimationFrame(watch);
    later(function () { if (!revealed) finish(); }, 12000);   // seguretat
    // tocar o prémer una tecla salta l'animació
    document.addEventListener("click", skip, { once: true });
    document.addEventListener("keydown", skip, { once: true });
  }
  function skip() { if (!done) finish(); }
  function whenReady() {
    if (video.readyState >= 3) return go();
    var t = later(function () { finish(); }, 4000);
    video.addEventListener("canplay", function () { clearTimeout(t); go(); }, { once: true });
    video.addEventListener("error", finish, { once: true });
  }
  if (document.getElementById("pop")) document.addEventListener("popclosed", function () { later(whenReady, 250); });
  else whenReady();
})();
