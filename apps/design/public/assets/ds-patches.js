/* COSX design-system runtime patches. Load after _ds_bundle.js; runs by itself.
   Remove each patch once the design system ships the fix (see ui-spec/proposals/).
   1. Select / menus open upward when there isn't room below.
   2. Anything filled with the yellow keeps ink text, even under ink-mode. */
(function () {
  if (window.__cosxDsPatches) return;
  window.__cosxDsPatches = true;
  var GAP = 'calc(100% + 6px)';
  function isMenu(el) { return el.style && el.style.position === 'absolute' && (el.style.top === GAP || el.dataset.cosxPlacement); }
  function place(menu) {
    var trig = menu.parentElement; if (!trig) return;
    var r = trig.getBoundingClientRect(), mh = menu.offsetHeight;
    var below = window.innerHeight - r.bottom, above = r.top;
    var up = below < mh + 12 && above > below;
    menu.style.top = up ? 'auto' : GAP;
    menu.style.bottom = up ? GAP : 'auto';
    menu.dataset.cosxPlacement = up ? 'top' : 'bottom';
  }
  var YELLOW = /var\(--(yellow|yellow-accent|yellow-hover|brand-field|brand-mark)\)|#FFE3A0|#FFD166|rgb\(255, 227, 160\)|rgb\(255, 209, 102\)/i;
  function inkOnYellow(el) {
    var bg = el.style.background || el.style.backgroundColor;
    if (bg && YELLOW.test(bg) && /var\(--text-primary\)/.test(el.style.color)) el.style.color = 'var(--ink)';
  }
  function visit(el) {
    if (el.nodeType !== 1) return;
    if (isMenu(el)) requestAnimationFrame(function () { place(el); });
    inkOnYellow(el);
  }
  function scan(n) {
    if (n.nodeType !== 1) return;
    visit(n);
    if (n.querySelectorAll) n.querySelectorAll('[style]').forEach(visit);
  }
  function start() {
    scan(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === 'attributes') visit(m.target); else m.addedNodes.forEach(scan);
      });
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'aria-selected'] });
  }
  window.cosxSelectAutoFlip = function () {};
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
