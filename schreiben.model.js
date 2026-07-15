/* ==================================================================
   MODÈLE — SCHREIBEN (module 9)
   Exercices d'écriture typés par niveau. Les productions de
   l'utilisateur sont conservées pour permettre de revoir sa
   progression rédactionnelle dans le temps.
   ================================================================== */

MD.models.schreiben = (function () {
  const ID = MD.MODULE_IDS.SCHREIBEN;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   exercicesParNiveau: {
   *     A1: [ { id, type: "formulaire"|"message"|"email"|"invitation"|"excuse"|
   *            "lettreFormelle"|"opinion"|"argumentation"|"lettrePro",
   *            consigne, exemple, vocabulaireUtile: [] } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   productions: {
   *     "<niveau>::<exerciceId>": [ { date, texteUtilisateur, pointsCorrection: [], activiteOraleFaite: boolean } ]
   *   },
   *   stats: { minutesEtudiees: number },
   *   erreurs: [ { exerciceId, niveau, pointCorrection, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      exercicesParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      productions: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
