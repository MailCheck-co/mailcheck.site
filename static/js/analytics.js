(function () {
  var interactionEvents = ['pointerdown', 'keydown', 'touchstart'];
  var fallbackTimer;

  function loadAnalytics() {
    if (window.__mailcheckAnalyticsLoaded) return;
    window.__mailcheckAnalyticsLoaded = true;
    if (fallbackTimer) window.clearTimeout(fallbackTimer);
    interactionEvents.forEach(function (eventName) {
      document.removeEventListener(eventName, loadAnalytics, true);
    });
    document.querySelectorAll('script[data-defer-analytics]').forEach(function (source) {
      var script = document.createElement('script');
      script.textContent = source.textContent;
      source.replaceWith(script);
    });
  }

  interactionEvents.forEach(function (eventName) {
    document.addEventListener(eventName, loadAnalytics, true);
  });

  window.addEventListener('load', function () {
    if (window.__mailcheckAnalyticsLoaded) return;
    // Keep analytics out of the initial interaction window. User interaction
    // loads it immediately; passive visits still get tracking after startup.
    fallbackTimer = window.setTimeout(loadAnalytics, 15000);
  }, { once: true });
})();
