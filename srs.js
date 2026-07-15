/* ==================================================================
   MEIN DEUTSCH — MOTEUR DE RÉPÉTITION ESPACÉE (SRS)
   Algorithme SM-2 simplifié, générique et sans état. Utilisé par
   Vocabulaire, Expressions, Phrases modèles, Conjugaison et
   Dictionnaire personnel — chacun garde ses propres cartes dans son
   propre namespace de stockage. Ce fichier ne connaît et ne stocke
   aucun contenu : il ne manipule que des objets "carte" génériques.
   ================================================================== */

MD.core.srs = (function () {
  /** Nouvelle carte SRS vierge. */
  function newCard() {
    return { interval: 0, ease: 2.3, reps: 0, lapses: 0, due: MD.core.today() };
  }

  /**
   * Fait progresser une carte selon la qualité de la réponse.
   * quality : 0 = raté, 1 = difficile mais correct, 2 = facile
   */
  function review(card, quality) {
    const next = { ...card };
    if (quality === 0) {
      next.lapses += 1;
      next.reps = 0;
      next.interval = 1;
      next.ease = Math.max(1.3, next.ease - 0.2);
    } else {
      next.reps += 1;
      if (next.reps === 1) next.interval = 1;
      else if (next.reps === 2) next.interval = 3;
      else next.interval = Math.round(next.interval * next.ease);
      next.ease = quality === 1 ? Math.max(1.3, next.ease - 0.05) : next.ease + 0.1;
    }
    const due = new Date();
    due.setDate(due.getDate() + next.interval);
    next.due = due.toISOString().slice(0, 10);
    return next;
  }

  function isDue(card, todayISO) {
    return card.due <= (todayISO || MD.core.today());
  }

  function isLearned(card) {
    return card.reps >= 2;
  }

  /**
   * À partir d'une map { itemKey: card }, renvoie la liste des clés
   * dues aujourd'hui, triées par ancienneté de retard (les plus en
   * retard d'abord). N'accède à aucun contenu — seulement aux cartes.
   */
  function dueKeys(cardsMap, limit) {
    const todayISO = MD.core.today();
    const due = Object.keys(cardsMap)
      .filter((k) => isDue(cardsMap[k], todayISO))
      .sort((a, b) => (cardsMap[a].due < cardsMap[b].due ? -1 : 1));
    return limit ? due.slice(0, limit) : due;
  }

  function stats(cardsMap) {
    const keys = Object.keys(cardsMap);
    const learned = keys.filter((k) => isLearned(cardsMap[k])).length;
    const due = dueKeys(cardsMap).length;
    return { total: keys.length, learned, due };
  }

  return { newCard, review, isDue, isLearned, dueKeys, stats };
})();
