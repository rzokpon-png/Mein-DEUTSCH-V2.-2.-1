/* ==================================================================
   MODULE VOCABULAIRE — LOGIQUE (ÉTAPE 3)
   Fait le pont entre le contenu (js/modules/vocabulaire/contenu.*.js)
   et le modèle de données (js/models/vocabulaire.model.js, inchangé
   depuis l'étape 1). N'écrit jamais de contenu en dur ici : ce
   fichier ne fait que charger, initialiser et calculer.
   ================================================================== */

MD.modules = MD.modules || {};

MD.modules.vocabulaire = (function () {
  /**
   * Initialise le contenu d'un niveau dans le stockage s'il est
   * encore vide, à partir de MD.contenuVocabulaire[niveau] (défini
   * par les fichiers contenu.A1.js, contenu.A2.js, etc.). Idempotent :
   * ne réinitialise jamais un niveau déjà rempli, pour ne jamais
   * écraser la progression SRS déjà acquise par l'utilisateur.
   */
  function assurerContenuCharge(niveau) {
    const data = MD.models.vocabulaire.load();
    const contenuDisponible = MD.contenuVocabulaire && MD.contenuVocabulaire[niveau];

    if (contenuDisponible) {
      const anciensThemes = data.themesParNiveau[niveau] || [];

      const idsExistants = new Set(
        anciensThemes.map((theme) => theme.id)
      );

      const nouveauxThemes = contenuDisponible.filter(
        (theme) => !idsExistants.has(theme.id)
      );

      if (nouveauxThemes.length > 0) {
        data.themesParNiveau[niveau] = [
          ...anciensThemes,
          ...nouveauxThemes
        ];

        MD.models.vocabulaire.save(data);
      }
    }

    return MD.models.vocabulaire.load();
  }

  /** Liste des thèmes d'un niveau, avec progression calculée (lecture seule). */
  function themesAvecProgression(niveau) {
    const data = assurerContenuCharge(niveau);
    const themes = data.themesParNiveau[niveau] || [];
    return themes.map((theme) => {
      const cardsMap = {};
      theme.mots.forEach((m) => {
        const cle = `${niveau}::${theme.id}::${m.id}`;
        if (data.srsCards[cle]) cardsMap[cle] = data.srsCards[cle];
      });
      const stats = MD.core.srs.stats(cardsMap);
      return {
        ...theme,
        totalMots: theme.mots.length,
        motsAppris: stats.learned,
        motsDus: stats.due,
      };
    });
  }

  /** Construit une session de révision (cartes dues + nouvelles) pour un thème donné. */
  function sessionRevision(niveau, themeId, maxCartes) {
    const data = assurerContenuCharge(niveau);
    const theme = (data.themesParNiveau[niveau] || []).find((t) => t.id === themeId);
    if (!theme) return [];
    const dues = [];
    const fraiches = [];
    theme.mots.forEach((mot) => {
      const cle = `${niveau}::${themeId}::${mot.id}`;
      const carte = data.srsCards[cle];
      if (!carte) fraiches.push({ cle, theme, mot, carte: null });
      else if (MD.core.srs.isDue(carte)) dues.push({ cle, theme, mot, carte });
    });
    return dues.concat(fraiches).slice(0, maxCartes || 12);
  }

  /** Enregistre une réponse de révision (0/1/2) pour une carte du Vocabulaire. */
  function noterCarte(cle, motId, niveau, themeLabel, quality) {
    const data = MD.models.vocabulaire.load();
    const precedente = data.srsCards[cle] || MD.core.srs.newCard();
    data.srsCards[cle] = MD.core.srs.review(precedente, quality);
    if (quality === 0) {
      data.erreurs.push({ motId, niveau, date: MD.core.today() });
    }
    data.stats.motsRevises = (data.stats.motsRevises || 0) + 1;
    data.stats.minutesEtudiees = (data.stats.minutesEtudiees || 0) + 0.5; // ~30s par carte
    MD.models.vocabulaire.save(data);
    return data;
  }

  return { assurerContenuCharge, themesAvecProgression, sessionRevision, noterCarte };
})();
