(function () {
  if (window.__BUY_NOW_WIDGET_INSTALLED) return;
  window.__BUY_NOW_WIDGET_INSTALLED = true;

  // create button immediately
  var btn = document.createElement("button");
  btn.innerText = "BUY NOW";
  btn.style.position = "fixed";
  btn.style.bottom = "24px";
  btn.style.right = "24px";
  btn.style.padding = "14px 22px";
  btn.style.background = "#ff6a00";
  btn.style.color = "#fff";
  btn.style.fontSize = "18px";
  btn.style.fontWeight = "bold";
  btn.style.border = "none";
  btn.style.borderRadius = "12px";
  btn.style.cursor = "pointer";
  btn.style.zIndex = "999999";

  btn.onclick = function () {
    // scroll to top as a test
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  document.body.appendChild(btn);
})();
