(function () {
  function loadAnalytics() {
    if (window.__mailcheckAnalyticsLoaded) return;
    window.__mailcheckAnalyticsLoaded = true;
    document.querySelectorAll('script[data-defer-analytics]').forEach(function (source) {
      var script = document.createElement('script');
      script.textContent = source.textContent;
      source.replaceWith(script);
    });
  }

  window.addEventListener('load', function () {
    if ('requestIdleCallback' in window) requestIdleCallback(loadAnalytics, { timeout: 3000 });
    else setTimeout(loadAnalytics, 1);
  }, { once: true });
})();
