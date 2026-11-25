(function () {
  // Animació d'entrada (només en obrir o recarregar la web; ho decideix l'script del <head> de index.html).
  // 1) Pop-up -> 2) vídeo del cartell sobre verd -> 3) en encongir-se, el fons es dissol i apareix la pàgina
  // -> 4) l'alter ego entra en un bucle (es mou, queda quiet 4 s i torna a començar).
  var root = document.documentElement;
  var bg = document.getElementById("intro-bg"), video = document.getElementById("intro-video");
  var ego = document.getElementById("ego");
  var done = false, started = false, revealed = false, timers = [];

  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function cleanup() {
    root.classList.remove("intro", "anim", "ego-wait");
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
    cleanup(); startLoop();
  }

  // Alter ego en bucle (fotogrames 7,0-8,0 s del vídeo): es mou, queda quiet a la pose final 4 s i torna a començar
  var N = 36, COLS = 6, ROWS = 6, MS = 1000 / 30, HOLD = 4000, looping = false;
  var pre = new Image(); pre.src = "assets/ego-loop.webp";   // precarrega l'sprite
  function setFrame(i) {
    ego.style.backgroundPosition = ((i % COLS) * 100 / (COLS - 1)) + "% " + (Math.floor(i / COLS) * 100 / (ROWS - 1)) + "%";
  }
  function startLoop() {
    if (looping || !ego) return; looping = true;
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { root.classList.remove("ego-wait"); return; }
    var i = 0, go = false;
    function begin() {
      if (go) return; go = true;
      root.classList.add("ego-on"); root.classList.remove("ego-wait");
      ego.style.display = "block";
      (function step() {
        setFrame(i);
        if (i < N - 1) { i++; setTimeout(step, MS); }
        else { i = 0; setTimeout(step, HOLD); }
      })();
    }
    if (pre.complete && pre.naturalWidth) begin();
    else { pre.onload = begin; setTimeout(begin, 2500); }
  }

  if (!root.classList.contains("anim") || !video) { cleanup(); startLoop(); return; }

  function playEgo() {          // després del vídeo: l'alter ego entra al bucle i la pàgina queda neta
    if (done) return;
    done = true; startLoop(); cleanup();
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
  if (document.getElementById("pop") && root.classList.contains("first")) document.addEventListener("popclosed", function () { later(whenReady, 250); });
  else whenReady();
})();
