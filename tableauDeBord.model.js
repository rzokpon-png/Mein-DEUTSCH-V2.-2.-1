/* ==================================================================
   MODÈLE — TABLEAU DE BORD (module 18)
   Aucun contenu pédagogique propre : agrège en lecture les 17 autres
   modules via MD.core.stats. La seule donnée réellement possédée ici
   est le réglage des objectifs personnels (hebdomadaire/mensuel),
   qui est une préférence d'affichage, pas un contenu d'apprentissage.
   ================================================================== */

MD.models.tableauDeBord = (function () {
  const ID = MD.MODULE_IDS.TABLEAU_DE_BORD;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   objectifHebdomadaireMinutes: number,
   *   objectifMensuelMinutes: number
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      objectifHebdomadaireMinutes: 70,   // ≈10 min/jour, cohérent avec Sprechen
      objectifMensuelMinutes: 300,
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
