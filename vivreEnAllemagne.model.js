/* ==================================================================
   MODÈLE — VIVRE EN ALLEMAGNE (module 14)
   Fiches culturelles et administratives + quiz de compréhension.
   Accessible dès A2 (MD.core.progression.isVivreEnAllemagneUnlocked).
   N'enseigne pas la langue à proprement parler : pas de SRS, la
   révision se fait par relecture des fiches liées aux quiz ratés.
   ================================================================== */

MD.models.vivreEnAllemagne = (function () {
  const ID = MD.MODULE_IDS.VIVRE_EN_ALLEMAGNE;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   fiches: [
   *     { id, categorie: "reglesSociales"|"ponctualite"|"administration"|"logement"|
   *       "travail"|"transport"|"assurance"|"banque"|"sante"|"vieQuotidienne",
   *       titre, contenu,
   *       quiz: [ { question, options, correct } ] }
   *   ],
   *   progression: { ficheId: { lue: boolean, quizScore: number, dateDerniereLecture } },
   *   stats: { minutesEtudiees: number }
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      fiches: [],
      progression: {},
      stats: { minutesEtudiees: 0 },
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
