/* ==================================================================
   MEIN DEUTSCH — MOTEUR DE STATISTIQUES
   Calcule les agrégats globaux à partir d'un instantané de toutes
   les données (MD.core.storage.getAll()). Ce moteur est PUREMENT EN
   LECTURE : il ne réécrit jamais dans les namespaces des modules
   qu'il lit. Le Tableau de bord (module 18) appellera ces fonctions
   à chaque affichage plutôt que de dupliquer des compteurs.
   ================================================================== */

MD.core.stats = (function () {
  /**
   * Calcule les statistiques globales à partir d'un instantané complet.
   * snapshot = MD.core.storage.getAll()
   */
  function computeGlobalStats(snapshot) {
    const profil = snapshot[MD.MODULE_IDS.PROFIL] || {};
    const modulesAvecTemps = [
      MD.MODULE_IDS.VOCABULAIRE, MD.MODULE_IDS.EXPRESSIONS, MD.MODULE_IDS.PHRASES_MODELES,
      MD.MODULE_IDS.GRAMMAIRE, MD.MODULE_IDS.CONJUGAISON, MD.MODULE_IDS.PHONETIQUE,
      MD.MODULE_IDS.HOEREN, MD.MODULE_IDS.LESEN, MD.MODULE_IDS.SCHREIBEN, MD.MODULE_IDS.SPRECHEN,
      MD.MODULE_IDS.BIBLIOTHEQUE_DIALOGUES, MD.MODULE_IDS.EXAMENS, MD.MODULE_IDS.PFLEGE,
      MD.MODULE_IDS.VIVRE_EN_ALLEMAGNE,
    ];

    let totalMinutes = 0;
    const parCompetence = {};
    modulesAvecTemps.forEach((id) => {
      const mod = snapshot[id];
      const minutes = (mod && mod.stats && mod.stats.minutesEtudiees) || 0;
      totalMinutes += minutes;
      parCompetence[id] = minutes;
    });

    const vocab = snapshot[MD.MODULE_IDS.VOCABULAIRE];
    const dico = snapshot[MD.MODULE_IDS.DICTIONNAIRE_PERSONNEL];
    const motsAppris =
      (vocab ? MD.core.srs.stats(vocab.srsCards || {}).learned : 0) +
      (dico ? MD.core.srs.stats(dico.srsCards || {}).learned : 0);

    const carnetVerbes = snapshot[MD.MODULE_IDS.CARNET_VERBES];
    const verbesTotal = carnetVerbes ? Object.keys(carnetVerbes.verbes || {}).length : 0;
    const verbesMaitrises = carnetVerbes
      ? Object.values(carnetVerbes.verbes || {}).filter((v) => v.maitrise === "maitrise").length
      : 0;

    const examens = snapshot[MD.MODULE_IDS.EXAMENS];
    const examensReussis = examens
      ? Object.values(examens.resultats || {}).filter((r) => r.passed).length
      : 0;

    return {
      streak: profil.streak || 0,
      totalMinutes,
      parCompetence,
      motsAppris,
      verbesTotal,
      verbesMaitrises,
      examensReussis,
      niveauActuel: MD.core.progression.currentLevel(profil),
    };
  }

  /**
   * Prévision de réussite vers la date objectif, à partir du nombre
   * de niveaux validés et de la vitesse réelle observée depuis le
   * début (startDate dans le profil).
   */
  function computeForecast(snapshot) {
    const profil = snapshot[MD.MODULE_IDS.PROFIL] || {};
    const today = MD.core.today();
    const niveauxValides = MD.LEVELS.indexOf(MD.core.progression.currentLevel(profil));
    const totalNiveaux = MD.LEVELS.length;
    const joursEcoules = Math.max(1, MD.core.daysBetween(profil.startDate || today, today));
    const rythmeActuel = niveauxValides > 0 ? (niveauxValides / joursEcoules) * 7 : 0; // niveaux/semaine
    const joursRestants = MD.core.daysBetween(today, profil.targetDate || "2027-04-01");
    const semainesRestantes = Math.max(1, joursRestants / 7);
    const niveauxRestants = totalNiveaux - niveauxValides;
    const rythmeRequis = niveauxRestants / semainesRestantes;

    let statut = "debut";
    if (niveauxValides === 0) statut = "debut";
    else if (rythmeActuel >= rythmeRequis) statut = "dansLesTemps";
    else statut = "enRetard";

    return { niveauxValides, totalNiveaux, rythmeActuel, rythmeRequis, joursRestants, statut };
  }

  return { computeGlobalStats, computeForecast };
})();
