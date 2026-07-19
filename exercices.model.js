/* ==========================================================
   MEIN DEUTSCH — MOTEUR D'EXERCICES TRANSVERSAL
   Utilisé par Vocabulaire, Hören, Lesen, Schreiben,
   Sprechen et Pflege.
========================================================== */

MD.models = MD.models || {};
MD.models.exercices = {

 types: {
    QCM: "qcm",
    TRADUCTION: "traduction",
    PHRASE: "phrase",
    EXPRESSION: "expression",
    DIALOGUE: "dialogue",
    ORAL: "oral",
    ECOUTE: "ecoute",
    TEXTE: "texte",
    ECRIT: "ecrit",
    IMAGE: "image",
    OPINION: "opinion",
    COMPARAISON: "comparaison",
    ARGUMENTATION: "argumentation"
},

  creerSession(module, niveau, questions) {
    return {
      module,
      niveau,
      questions,
      index: 0,
      score: 0,
      erreurs: [],
      termine: false
    };
  },

  obtenirQuestion(session) {
    return session.questions[session.index] || null;
  },

  validerReponse(session, reponseCorrecte) {

    const question = this.obtenirQuestion(session);

    if (!question) {
      session.termine = true;
      return session;
    }

    if (reponseCorrecte) {
      session.score++;
    } else {
      session.erreurs.push(question);
    }

    session.index++;

    if (session.index >= session.questions.length) {
      session.termine = true;
    }

    return session;
  },

  progression(session) {
    if (!session.questions.length) return 0;

    return Math.round(
      (session.index / session.questions.length) * 100
    );
  }

};
