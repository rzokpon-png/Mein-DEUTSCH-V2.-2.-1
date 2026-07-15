/* ==================================================================
   MEIN DEUTSCH — MOTEUR DE NAVIGATION (TECHNIQUE, SANS INTERFACE)
   Gère l'état de route et la pile d'historique. Ne dessine RIEN à
   l'écran : c'est un pur gestionnaire d'état, sur lequel l'étape 2
   (interface utilisateur) viendra brancher son rendu via onChange().
   Ce découplage permet de tester toute la navigation logique dès
   maintenant, avant qu'un seul écran n'existe.
   ================================================================== */

MD.core.router = (function () {
  let route = { screen: "demarrage", params: {} };
  let navStack = [];
  const listeners = [];

  function current() {
    return route;
  }

  function onChange(callback) {
    listeners.push(callback);
    return () => {
      const i = listeners.indexOf(callback);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  function notify() {
    listeners.forEach((cb) => cb(route));
  }

  /**
   * Navigue vers un écran. Empile automatiquement l'écran courant
   * dans l'historique, sauf si isBack est vrai (retour arrière).
   */
  function goto(screen, params = {}, opts = {}) {
    if (!opts.isBack && route.screen !== "demarrage") {
      navStack.push({ screen: route.screen, params: route.params });
    }
    route = { screen, params };
    notify();
  }

  /** Retour à l'écran précédent de la pile, ou à l'accueil si vide. */
  function back(fallbackScreen = "tableauDeBord") {
    const prev = navStack.pop();
    if (prev) goto(prev.screen, prev.params, { isBack: true });
    else goto(fallbackScreen, {}, { isBack: true });
  }

  /** Vide complètement l'historique (utilisé après une réinitialisation). */
  function resetStack() {
    navStack = [];
  }

  return { current, goto, back, onChange, resetStack };
})();
