/* ==================================================================
   MODÈLE — RÉVISION : INTELLIGENTE + LIBRE (module 15)
   PUR AGRÉGATEUR : ne stocke jamais de contenu original. La seule
   donnée propre à ce module est l'historique des sessions de
   révision libre choisies par l'utilisateur (pour ses statistiques
   personnelles) — pas le contenu révisé lui-même, qui reste dans son
   module d'origine.
   ================================================================== */

MD.models.revision = (function () {
  const ID = MD.MODULE_IDS.REVISION;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   historiqueSessionsLibres: [
   *     { date, moduleChoisi, niveauChoisi, dureeMinutes, elementsRevises }
   *   ],
   *   stats: { minutesEtudiees: number }
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      historiqueSessionsLibres: [],
      stats: { minutesEtudiees: 0 },
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  /**
   * RÉVISION INTELLIGENTE — lecture seule à travers tous les modules
   * SRS-activés (MD.SRS_ENABLED_MODULES). Ne modifie jamais leurs
   * données ; renvoie uniquement des références (moduleId + clé de
   * carte) pour que l'écran de révision aille chercher le contenu
   * réel dans le module d'origine.
   */
  function elementsEnAttente(snapshot) {
    const refs = [];
    MD.SRS_ENABLED_MODULES.forEach((moduleId) => {
      const data = snapshot[moduleId];
      if (!data || !data.srsCards) return;
      MD.core.srs.dueKeys(data.srsCards).forEach((cardKey) => {
        refs.push({ moduleId, cardKey });
      });
    });
    return refs;
  }

  return { ID, createEmpty, load, save, elementsEnAttente };
})();
