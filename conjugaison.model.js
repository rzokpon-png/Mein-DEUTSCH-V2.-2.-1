/* ==================================================================
   MODÈLE — CONJUGAISON (module 5)
   Verbes clés enseignés par niveau, avec SRS dédié sur les formes
   conjuguées. Distinct du Carnet de verbes (module 17), qui ne fait
   qu'observer automatiquement tous les verbes rencontrés partout
   dans l'application sans posséder de contenu pédagogique propre.
   ================================================================== */

MD.models.conjugaison = (function () {
  const ID = MD.MODULE_IDS.CONJUGAISON;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   verbesParNiveau: {
   *     A1: [ { id, infinitif, traduction, groupe: "regulier"|"irregulier"|"modal"|"separable",
   *             conjugaisonPresent: { ich, du, er_sie_es, wir, ihr, sie_Sie },
   *             conjugaisonPerfekt, conjugaisonPreteritum, exemples: [] } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   srsCards: { "<niveau>::<verbeId>": carteSRS },
   *   stats: { minutesEtudiees: number },
   *   erreurs: [ { verbeId, niveau, formeAttendue, formeDonnee, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      verbesParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      srsCards: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
