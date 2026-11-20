export function registerSW() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) return;

  window.addEventListener("load", () => {
    const scriptUrl = new URL("sw.js", document.baseURI);
    const scopeUrl = new URL("./", document.baseURI);

    navigator.serviceWorker.register(scriptUrl.href, {
      scope: scopeUrl.pathname,
      updateViaCache: "none"
    }).then(registration => {
      // Check for a fresh app shell when the app is opened.
      registration.update().catch(() => undefined);
    }).catch(error => {
      // The app remains fully usable online if service-worker setup is unavailable.
      console.warn("Study Tracker offline support could not be enabled.", error);
    });
  }, { once: true });
}
