/* ==================================================================
   MODÈLE — HÖREN (module 7)
   Écoutes structurées par niveau (curriculum). Distinct des écoutes
   dédiées aux examens blancs (module 12), jamais réutilisées ici.
   ================================================================== */

MD.models.hoeren = (function () {
  const ID = MD.MODULE_IDS.HOEREN;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   ecoutesParNiveau: {
   *     A1: [ { id, titre, type: "annonce"|"dialogue"|"recit"|"meteo"|"podcast"|"reportage"|"interview"|"jt",
   *             texteAudio, vitesse: "lente"|"normale", transcriptionVisible: false,
   *             questions: [ {enonce, options, correct} ],
   *             verbesUtilises: string[] } ],   // infinitifs, pour synchronisation avec le Carnet de verbes
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   progression: { "<niveau>::<ecouteId>": { statut, score, dateDerniereEcoute } },
   *   stats: { minutesEtudiees: number },
   *   erreurs: [ { ecouteId, niveau, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      ecoutesParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      progression: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
