(function () {
  // Menú desplegable (només es veu a mòbil)
  var header = document.getElementById("site-header"), btn = document.getElementById("menu-toggle");
  if (!header || !btn) return;
  function set(open) {
    header.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Tanca el menú" : "Obre el menú");
  }
  btn.addEventListener("click", function () { set(!header.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && header.classList.contains("open")) { set(false); btn.focus(); } });
  document.addEventListener("click", function (e) { if (!header.contains(e.target)) set(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 600) set(false); });
})();
