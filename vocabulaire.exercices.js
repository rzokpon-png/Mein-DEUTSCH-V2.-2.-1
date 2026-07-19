/* ================================================================
   MODULE VOCABULAIRE — EXERCICES
   Générateur d'exercices à partir du vocabulaire chargé
   ================================================================ */

MD.modules = MD.modules || {};

MD.modules.vocabulaireExercices = (function () {

  function melanger(tableau) {
    return [...tableau].sort(() => Math.random() - 0.5);
  }

  function tousLesMots(niveau, themeId) {
  const data = MD.modules.vocabulaire.assurerContenuCharge(niveau);

  const themes = data.themesParNiveau[niveau] || [];

  const theme = themes.find(t => t.id === themeId);

  if (!theme) return [];

  return theme.mots || [];
  }


  function exerciceArticle(niveau, themeId) {
    const mots = tousLesMots(niveau, themeId)
      .filter(m => m.article);

    if (!mots.length) return null;

    const mot = mots[Math.floor(Math.random() * mots.length)];

    return {
      type: "article",
      question: `Quel est l'article de "${mot.mot}" ?`,
      reponses: melanger([
        mot.article,
        "der",
        "die",
        "das"
      ].filter((v,i,a)=>a.indexOf(v)===i)),
      solution: mot.article
    };
  }


  function exerciceTraduction(niveau, themeId) {
    const mots = tousLesMots(niveau, themeId);

    if (!mots.length) return null;

    const mot = mots[Math.floor(Math.random() * mots.length)];

    return {
      type: "traduction",
      question: `Que signifie "${mot.mot}" ?`,
      reponses: [mot.fr],
      solution: mot.fr
    };
  }


  function creerSessionTraduction(niveau, themeId) {

    const questions = [];

    for (let i = 0; i < 10; i++) {
      const exercice = exerciceTraduction(niveau, themeId);

      if (exercice) {
        questions.push(exercice);
      }
    }
console.log("TEST exercices :", MD.models.exercices);
    return MD.models.exercices.creerSession(
      "vocabulaire",
      niveau,
      questions
    );
  }


  return {
    exerciceArticle,
    exerciceTraduction,
    creerSessionTraduction
  };

})();
