/* ==================================================================
   MODÈLE — BIBLIOTHÈQUE DE DIALOGUES (module 11)
   Dialogues de référence organisés par thème de la vie réelle,
   consultables librement, hors de l'ordre de progression des
   niveaux. Corpus totalement séparé de Sprechen (module 10).
   ================================================================== */

MD.models.bibliothequeDialogues = (function () {
  const ID = MD.MODULE_IDS.BIBLIOTHEQUE_DIALOGUES;

  /* Les 15 thèmes fixés par le cahier des charges. */
  const THEMES = [
    "saluer", "sePresenter", "magasin", "restaurant", "gare", "hotel", "banque",
    "administration", "medecin", "hopital", "travail", "entretienEmbauche",
    "collegues", "telephone", "urgences",
  ];

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   dialoguesParTheme: {
   *     "saluer": [ { id, niveau, titre, lignes: [ {locuteur, texte} ] } ],
   *     ... (15 thèmes)
   *   },
   *   progression: { dialogueId: { pratique: boolean, derniereFois, transcription } },
   *   stats: { minutesEtudiees: number }
   * }
   */
  function createEmpty() {
    const dialoguesParTheme = {};
    THEMES.forEach((t) => (dialoguesParTheme[t] = []));
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      dialoguesParTheme,
      progression: {},
      stats: { minutesEtudiees: 0 },
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, THEMES, createEmpty, load, save };
})();
