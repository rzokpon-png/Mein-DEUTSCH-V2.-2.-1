/* ==================================================================
   MODÈLE — PHONÉTIQUE / PRONONCIATION (module 6)
   Leçons de sons et de rythme. Pas de SRS classique : la progression
   se mesure par un score de prononciation (moyenne mobile), pas par
   un statut mémorisé/oublié.
   ================================================================== */

MD.models.phonetique = (function () {
  const ID = MD.MODULE_IDS.PHONETIQUE;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   leconsParNiveau: {
   *     A1: [ { id, son, description, motsExemples: [], phrasesExemples: [] } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   scores: {
   *     "<niveau>::<leconId>": {
   *       prononciation: number, rythme: number, intonation: number, clarte: number,
   *       historique: [ { date, prononciation, rythme, intonation, clarte } ]
   *     }
   *   },
   *   stats: { minutesEtudiees: number }
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      leconsParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      scores: {},
      stats: { minutesEtudiees: 0 },
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
