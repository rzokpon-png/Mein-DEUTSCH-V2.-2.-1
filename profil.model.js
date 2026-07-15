/* ==================================================================
   MODÈLE — PROFIL (namespace technique)
   Identité et réglages globaux de l'utilisateur. Ne contient aucun
   contenu pédagogique. Porte le niveau global courant utilisé par
   MD.core.progression.
   ================================================================== */

MD.models.profil = (function () {
  const ID = MD.MODULE_IDS.PROFIL;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   onboarded: boolean,
   *   name: string,
   *   startDate: "AAAA-MM-JJ",
   *   targetDate: "AAAA-MM-JJ",     // objectif, ex. "2027-04-01"
   *   currentLevel: "A1"|"A2"|"B1"|"B2",
   *   streak: number,               // jours consécutifs avec activité orale validée
   *   lastStudyDate: "AAAA-MM-JJ"|null,
   *   joursActifs: string[],        // dates ISO où une activité orale obligatoire a été validée
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      onboarded: false,
      name: "",
      startDate: MD.core.today(),
      targetDate: "2027-04-01",
      currentLevel: "A1",
      streak: 0,
      lastStudyDate: null,
      joursActifs: [],
    };
  }

  function load() {
    return MD.core.storage.ensure(ID, createEmpty);
  }

  function save(data) {
    return MD.core.storage.set(ID, data);
  }

  return { ID, createEmpty, load, save };
})();
