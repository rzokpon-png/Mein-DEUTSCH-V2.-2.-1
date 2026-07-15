/* ==================================================================
   MODÈLE — ALLEMAND PROFESSIONNEL & PFLEGE (module 13)
   Contenu spécialisé transversal, débloqué à partir de B1
   (MD.core.progression.isPflegeUnlocked). N'appartient à aucun
   niveau A1-B2 du curriculum général. SRS dédié, indépendant de
   celui du Vocabulaire.
   ================================================================== */

MD.models.pflege = (function () {
  const ID = MD.MODULE_IDS.PFLEGE;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   vocabulaireParSousTheme: {
   *     "corpsHumain": [ { id, mot, article, pluriel, traduction, exemple } ],
   *     "pathologies": [...], "materielEtGestes": [...], "signesVitauxHygiene": [...],
   *     "documentsProfessionnels": [...], "communicationUrgence": [...],
   *     "communicationProfessionnelle": [...]
   *   },
   *   dialogues: [
   *     { id, type: "infirmierPatient"|"collegueCollegue"|"medecinInfirmier"|"famillePatient",
   *       titre, lignes: [] }
   *   ],
   *   documentsProfessionnels: [ { id, titre, texte, vocabulaireCle: [], questions: [] } ],
   *   srsCards: { "<sousTheme>::<motId>": carteSRS },
   *   stats: { minutesEtudiees: number },
   *   erreurs: []
   * }
   */
  const SOUS_THEMES = [
    "corpsHumain", "pathologies", "materielEtGestes", "signesVitauxHygiene",
    "documentsProfessionnels", "communicationUrgence", "communicationProfessionnelle",
  ];

  function createEmpty() {
    const vocabulaireParSousTheme = {};
    SOUS_THEMES.forEach((t) => (vocabulaireParSousTheme[t] = []));
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      vocabulaireParSousTheme,
      dialogues: [],
      documentsProfessionnels: [],
      srsCards: {},
      stats: { minutesEtudiees: 0 },
      erreurs: [],
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  return { ID, SOUS_THEMES, createEmpty, load, save };
})();
