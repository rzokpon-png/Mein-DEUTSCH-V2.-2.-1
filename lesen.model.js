/* ==================================================================
   MODÈLE — LESEN (module 8)
   Textes structurés par niveau (curriculum). Distinct des textes
   dédiés aux examens blancs (module 12), jamais réutilisés ici.
   ================================================================== */

MD.models.lesen = (function () {
  const ID = MD.MODULE_IDS.LESEN;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   textesParNiveau: {
   *     A1: [ { id, titre, type: "panneau"|"ticket"|"annonce"|"formulaire"|"message"|
   *             "recit"|"article"|"blog"|"documentAdministratif", texte,
   *             vocabulaireCle: [], questions: [ {enonce, options, correct} ],
   *             resumeOralObligatoire: false,
   *             verbesUtilises: string[] } ],   // infinitifs, pour synchronisation avec le Carnet de verbes
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   progression: { "<niveau>::<texteId>": { statut, score, resumeOralFait } },
   *   stats: { minutesEtudiees: number },
   *   erreurs: [ { texteId, niveau, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      textesParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      progression: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
