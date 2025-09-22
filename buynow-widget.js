/*!
  BuyNow Floating Button widget - v1.0
  Drop into pages that accept <script src="..."> embeds.
*/
(function () {
  if (window.__BUY_NOW_WIDGET_INSTALLED) return;
  window.__BUY_NOW_WIDGET_INSTALLED = true;

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
      } catch (e) {
        /* ignore and fallback */
      }
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
    var placeholders = document.querySelectorAll('.buynow-widget');
    if (!placeholders || placeholders.length === 0) {
      // If Payhip strips the div, still create a default floating button
      var fallbackDiv = document.createElement('div');
      fallbackDiv.className = 'buynow-widget';
      document.body.appendChild(fallbackDiv);
      placeholders = [fallbackDiv];
    }

    placeholders.forEach(function (el) {
      var cfg = {
        target: el.getAttribute('data-target') || null,
        label: el.getAttribute('data-label') || 'BUY NOW',
        offset: parseInt(el.getAttribute('data-offset') || '0', 10) || 0,
        showAfter: parseInt(el.getAttribute('data-show-after') || '120', 10) || 120,
        fallback: (el.getAttribute('data-fallback') || 'scroll').toLowerCase()
      };
      createButton(cfg);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
