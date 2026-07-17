/* ==================================================================
   MODÈLE — VOCABULAIRE (module 1)
   Mots curatés par thème et par niveau. Le contenu réel (thèmes et
   mots) sera rempli à l'étape 3 du développement ; ce fichier ne fixe
   que la forme des données.
   ================================================================== */

MD.models.vocabulaire = (function () {
  const ID = MD.MODULE_IDS.VOCABULAIRE;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   themesParNiveau: {
   *     A1: [ { id, label, icone, mots: [
   *         { id, mot, article, pluriel, traduction, prononciation, exemple,
   *           image: string|undefined }   // URL d'une photo réelle (libre de droits) ;
   *                                       // absent tant qu'aucune photo n'a été
   *                                       // curatée pour ce mot — l'interface
   *                                       // affiche alors un visuel de remplacement
   *     ] } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   srsCards: { "<niveau>::<themeId>::<motId>": carteSRS },
   *   stats: { minutesEtudiees: number, motsRevises: number },
   *   erreurs: [ { motId, niveau, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      themesParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      srsCards: {},
      stats: { minutesEtudiees: 0, motsRevises: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  /* Normalise un mot pour comparaison : minuscules, sans article, sans espaces superflus. */
  function normaliser(motBrut) {
    return String(motBrut || "")
      .trim()
      .toLowerCase()
      .replace(/^(der|die|das)\s+/i, "");
  }

  /**
   * Recherche un mot dans le Vocabulaire curaté, tous niveaux et thèmes
   * confondus. Utilisée par Dictionnaire personnel pour la détection
   * de doublon — Vocabulaire garde ainsi la seule responsabilité
   * d'interpréter sa propre structure interne (themesParNiveau).
   * Renvoie { niveau, themeId, motId, mot } ou null.
   */
  function rechercherMot(data, motRecherche) {
    const cible = normaliser(motRecherche);
    if (!cible) return null;
    for (const niveau of MD.LEVELS) {
      const themes = data.themesParNiveau[niveau] || [];
      for (const theme of themes) {
        for (const item of theme.mots || []) {
          if (normaliser(item.mot) === cible) {
            return { niveau, themeId: theme.id, motId: item.id, mot: item.mot };
          }
        }
      }
    }
    return null;
  }

  return { ID, createEmpty, load, save, rechercherMot, normaliser };
})();
