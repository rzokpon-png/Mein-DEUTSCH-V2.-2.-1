/* ==================================================================
   MODÈLE — EXPRESSIONS / REDEMITTEL (module 2)
   Formules et connecteurs figés, distincts des mots isolés
   (Vocabulaire) et des phrases complètes (Phrases modèles).
   ================================================================== */

MD.models.expressions = (function () {
  const ID = MD.MODULE_IDS.EXPRESSIONS;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   expressionsParNiveau: {
   *     A1: [ { id, texte, traductionFr, contexteUsage, exempleEnPhrase } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   srsCards: { "<niveau>::<expressionId>": carteSRS },
   *   stats: { minutesEtudiees: number },
   *   erreurs: [ { expressionId, niveau, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      expressionsParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      srsCards: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
