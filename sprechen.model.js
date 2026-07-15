/* ==================================================================
   MODÈLE — SPRECHEN (module 10)
   Situations et dialogues pédagogiques, séquencés dans la
   progression du niveau. Distinct de la Bibliothèque de dialogues
   (module 11, consultation libre hors progression). Module central :
   c'est ici que vit l'objectif quotidien de pratique orale.
   ================================================================== */

MD.models.sprechen = (function () {
  const ID = MD.MODULE_IDS.SPRECHEN;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   situationsParNiveau: {
   *     A1: [ { id, situation, objectif, lignes: [
   *         { locuteur: "app"|"utilisateur", texte, motsClesAttendus: [] }
   *     ], verbesUtilises: string[] } ],   // infinitifs, pour synchronisation avec le Carnet de verbes
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   progression: { "<niveau>::<situationId>": { statut, transcriptions: [] } },
   *   objectifQuotidien: { minutesMinimum: 10 },
   *   stats: { minutesEtudiees: number, minutesParlees: number }
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      situationsParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      progression: {},
      objectifQuotidien: { minutesMinimum: 10 },
      stats: { minutesEtudiees: 0, minutesParlees: 0 },
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
