/*!
  BuyNow Floating Button widget - v1.0 (Hardcoded config)
  Drop into pages that accept <script src="..."> embeds.
*/
(function () {
  if (window.__BUY_NOW_WIDGET_INSTALLED) return;
  window.__BUY_NOW_WIDGET_INSTALLED = true;

  // 🔧 Hardcoded defaults (edit these if you want)
  var DEFAULT_CONFIG = {
    target: null,          // e.g. "#buy-buttons" if you know the ID, or null for very top
    label: "BUY NOW",      // button text
    offset: 12,            // px above target
    showAfter: 120,        // show button after this scroll px
    fallback: "scroll"     // "scroll" or "reload"
  };

  function injectCSS() {
    if (document.getElementById('buynow-widget-styles')) return;
    var css = "\
.buynow-btn{position:fixed;bottom:24px;right:24px;z-index:2147483647;padding:12px 18px;border-radius:12px;background:#ff6a00;color:#fff;font-weight:700;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,0.18);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:16px;border:none}\
.buynow-btn.hidden{opacity:0;visibility:hidden;transform:translateY(8px);transition:all .22s ease}\
.buynow-btn.visible{opacity:1;visibility:visible;transform:none;transition:all .22s ease}\
.buynow-btn:focus{outline:3px solid rgba(0,0,0,0.08)}\
";
    var s = document.createElement('style');
    s.id = 'buynow-widget-styles';
    s.appendChild(document.createTextNode(css));
    document.head && document.head.appendChild(s);
  }

  function throttle(fn, wait) {
    var timer = null;
    return function () {
      if (timer) return;
      timer = setTimeout(function () {
        timer = null;
        fn();
      }, wait || 100);
    };
  }

  function smoothScrollTo(y) {
    try {
      window.scrollTo({ top: y, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, y);
    }
  }

  function tryScroll(targetSelector, offset, fallback) {
    if (targetSelector) {
      try {
        var t = document.querySelector(targetSelector);
        if (t) {
          var top = t.getBoundingClientRect().top + window.pageYOffset - (offset || 0);
          smoothScrollTo(top);
          return;
        }
      } catch (e) { /* ignore */ }
    }
    // fallback behavior
    if ('scrollBehavior' in document.documentElement.style) {
      smoothScrollTo(0);
    } else {
      if (fallback === 'reload') location.reload();
      else window.scrollTo(0, 0);
    }
  }

  function createButton(cfg) {
    injectCSS();
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'buynow-btn hidden';
    btn.innerText = cfg.label || 'BUY NOW';
    btn.setAttribute('aria-label', btn.innerText);
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      tryScroll(cfg.target, cfg.offset, cfg.fallback);
    });
    document.body.appendChild(btn);

    var update = throttle(function () {
      if (window.pageYOffset > (cfg.showAfter || 120)) {
        btn.classList.remove('hidden'); btn.classList.add('visible');
      } else {
        btn.classList.remove('visible'); btn.classList.add('hidden');
      }
    }, 120);

    setTimeout(update, 300);
    window.addEventListener('scroll', update);
    window.addEventListener('resize', throttle(update, 200));
  }

  function init() {
    createButton(DEFAULT_CONFIG);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
