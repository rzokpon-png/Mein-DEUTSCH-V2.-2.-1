/* ==================================================================
   MEIN DEUTSCH — MOTEUR DE PROGRESSION
   Gère UN niveau global courant pour l'utilisateur (A1 → A2 → B1 →
   B2), stocké dans le namespace "profil". Les 11 modules structurés
   par niveau (voir MD.LEVEL_STRUCTURED_MODULES) s'y réfèrent tous,
   mais chacun garde sa PROPRE progression interne (leçons/items
   maîtrisés) dans son propre namespace — seul le niveau déverrouillé
   est une notion partagée.

   Décision d'architecture à valider avec l'utilisateur : plutôt que
   18 compteurs de niveau indépendants (un par module, ce qui rendrait
   le suivi illisible : "B1 en Grammaire mais A2 en Hören"), le
   parcours reste un niveau global unique — chaque module garde en
   revanche des statistiques et une file de révision 100% séparées à
   l'intérieur de ce niveau, ce qui satisfait "chaque rubrique a sa
   propre progression" sans fragmenter le sens de "mon niveau".

   Un niveau, une fois atteint, reste accessible pour toujours pour
   la révision (aucun reverrouillage).
   ================================================================== */

MD.core.progression = (function () {
  const SEUIL_EXAMENS_POUR_NIVEAU_SUIVANT = 4; // sur 5 examens blancs du niveau

  function levelIndex(level) {
    return MD.LEVELS.indexOf(level);
  }

  /** Le niveau le plus élevé actuellement déverrouillé. */
  function currentLevel(profil) {
    return profil.currentLevel || "A1";
  }

  /**
   * Tous les niveaux sont accessibles en permanence (changement demandé
   * explicitement : l'utilisateur veut pouvoir consulter et tester le
   * développement en cours de n'importe quel niveau, même non terminé).
   * "currentLevel" reste néanmoins suivi dans le profil pour les
   * statistiques et la prévision de réussite (niveaux réellement
   * validés vs simplement consultés).
   */
  function isLevelUnlocked(level, profil) {
    return true;
  }

  /** Vérifie si un niveau est validé (donc réviser uniquement, plus en apprentissage actif). */
  function isLevelCompleted(level, profil) {
    return levelIndex(level) < levelIndex(currentLevel(profil));
  }

  /**
   * Détermine si le niveau est prêt à être validé, à partir des scores
   * des 5 examens blancs de ce niveau (module Examens — lecture seule
   * ici, ce moteur ne modifie jamais les données du module Examens).
   * examScores : tableau de {passed: boolean} pour le niveau, longueur 5.
   */
  function canAdvance(examScores) {
    const passed = examScores.filter((e) => e.passed).length;
    return passed >= SEUIL_EXAMENS_POUR_NIVEAU_SUIVANT;
  }

  /** Fait progresser le profil vers le niveau suivant si possible. */
  function advance(profil) {
    const idx = levelIndex(currentLevel(profil));
    if (idx < MD.LEVELS.length - 1) {
      return { ...profil, currentLevel: MD.LEVELS[idx + 1] };
    }
    return profil; // déjà au niveau maximum (B2)
  }

  /* ---- Règles de déverrouillage des modules transversaux ---- */

  /** Vivre en Allemagne : accessible dès A2 (repères administratifs précoces). */
  function isVivreEnAllemagneUnlocked(profil) {
    return levelIndex(currentLevel(profil)) >= levelIndex("A2");
  }

  /** Allemand professionnel & Pflege : accessible dès B1 (grammaire nécessaire acquise). */
  function isPflegeUnlocked(profil) {
    return levelIndex(currentLevel(profil)) >= levelIndex("B1");
  }

  return {
    currentLevel,
    isLevelUnlocked,
    isLevelCompleted,
    canAdvance,
    advance,
    isVivreEnAllemagneUnlocked,
    isPflegeUnlocked,
    SEUIL_EXAMENS_POUR_NIVEAU_SUIVANT,
  };
})();
