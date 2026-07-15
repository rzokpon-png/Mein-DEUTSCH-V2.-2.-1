/* ==================================================================
   MODÈLE — GRAMMAIRE (module 4)
   Règles curatées par niveau. Pas de SRS ici (contrairement au
   Vocabulaire) : la maîtrise d'une règle se valide par un mini-test,
   pas par des cartes mémoire répétées — cohérent avec la nature des
   règles grammaticales (compréhension d'un mécanisme, pas simple
   mémorisation).
   ================================================================== */

MD.models.grammaire = (function () {
  const ID = MD.MODULE_IDS.GRAMMAIRE;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   reglesParNiveau: {
   *     A1: [ { id, titre, explication, exemples: [], erreursFrequentes: [],
   *             comparaisonFrancais, exercices: [ {enonce, reponse, options} ] } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   progression: { "<niveau>::<regleId>": { statut: "nonCommence"|"enCours"|"maitrise", tauxReussite } },
   *   stats: { minutesEtudiees: number },
   *   erreurs: [ { regleId, niveau, date } ]
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      reglesParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      progression: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, createEmpty, load, save };
})();
