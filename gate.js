// Pestanya Concerts: no es veu abans de dv. 27/11/2026 a les 8:00 (hora peninsular).
// Atenció: és un bloqueig al navegador; no és secret real (vegeu les notes del repositori).
(function () {
  var OPEN = Date.parse("2026-11-27T08:00:00+01:00");
  var root = document.documentElement;
  if (Date.now() >= OPEN) { root.classList.add("gate-open"); return; }
  if (/(^|\/)concerts(\.html)?$/.test(location.pathname)) location.replace("/");
  var ms = OPEN - Date.now();
  if (ms < 2147483647) setTimeout(function () { root.classList.add("gate-open"); }, ms);
})();
