/* ==================================================================
   MODÈLE — PHRASES MODÈLES (module 3)
   Phrases complètes et autonomes, prêtes à l'emploi, distinctes des
   Expressions (fragments réutilisables) et de la Bibliothèque de
   dialogues (échanges à plusieurs répliques).
   ================================================================== */

MD.models.phrasesModeles = (function () {
  const ID = MD.MODULE_IDS.PHRASES_MODELES;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   phrasesParNiveau: {
   *     A1: [ { id, texte, traductionFr, theme, audio } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   srsCards: { "<niveau>::<phraseId>": carteSRS },
   *   stats: { minutesEtudiees: number },
   *   erreurs: [ { phraseId, niveau, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      phrasesParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      srsCards: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
