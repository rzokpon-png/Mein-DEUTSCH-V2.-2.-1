/* ==================================================================
   MODÈLE — EXAMENS BLANCS GOETHE (module 12)
   5 examens complets par niveau, contenu entièrement dédié et
   distinct du contenu d'entraînement courant de Lesen/Hören/
   Schreiben/Sprechen. C'est ce module que MD.core.progression lit
   (en lecture seule) pour décider du déverrouillage du niveau
   suivant.
   ================================================================== */

MD.models.examens = (function () {
  const ID = MD.MODULE_IDS.EXAMENS;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   examensParNiveau: {
   *     A1: [ { id, numero: 1..5,
   *             lesen: { textes: [], questions: [] },
   *             hoeren: { ecoutes: [], questions: [] },
   *             schreiben: { sujets: [] },
   *             sprechen: { partie1, partie2, partie3 } } ],
   *     A2: [...], B1: [...], B2: [...]
   *   },
   *   resultats: {
   *     "<niveau>::<examenId>": {
   *       date, passed: boolean,
   *       scoreParCompetence: { lesen, hoeren, schreiben, sprechen }
   *     }
   *   },
   *   stats: { minutesEtudiees: number }
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      examensParNiveau: { A1: [], A2: [], B1: [], B2: [] },
      resultats: {},
      stats: { minutesEtudiees: 0 },
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  /** Lecture seule, utilisée par MD.core.progression.canAdvance(). */
  function examScoresForLevel(data, level) {
    const examens = data.examensParNiveau[level] || [];
    return examens.map((ex) => {
      const r = data.resultats[`${level}::${ex.id}`];
      return { id: ex.id, passed: !!(r && r.passed) };
    });
  }

  return { ID, createEmpty, load, save, examScoresForLevel };
})();
