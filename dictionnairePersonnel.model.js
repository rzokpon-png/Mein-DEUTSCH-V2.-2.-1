/* ==================================================================
   MODÈLE — DICTIONNAIRE PERSONNEL (module 16)
   Mots ajoutés librement par l'utilisateur (lus, entendus, notés),
   avec sa propre file de révision espacée, indépendante de celle du
   Vocabulaire curaté. Règle de non-duplication : si le mot existe
   déjà dans MD.models.vocabulaire, l'application doit proposer un
   lien vers la fiche existante plutôt qu'une recréation ici.
   ================================================================== */

MD.models.dictionnairePersonnel = (function () {
  const ID = MD.MODULE_IDS.DICTIONNAIRE_PERSONNEL;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   mots: [
   *     { id, motAllemand, article, traductionFr, origine: "lecture"|"ecoute"|"noteLibre"|"conversation",
   *       typeMot: "nom"|"verbe"|"adjectif"|"expression"|"autre",
   *       dateAjout, noteLibre,
   *       lienVocabulaireExistant: { niveau, themeId, motId }|null,
   *       revisionDeleguee: boolean }   // true si le mot existe déjà dans Vocabulaire : pas de carte SRS ici
   *   ],
   *   srsCards: { motId: carteSRS },    // uniquement pour les mots SANS doublon (revisionDeleguee = false)
   *   stats: { minutesEtudiees: number }
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      mots: [],
      srsCards: {},
      stats: { minutesEtudiees: 0 },
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  /**
   * Ajoute un mot au Dictionnaire personnel, avec détection de doublon
   * contre le Vocabulaire curaté (module 1). Règle de non-duplication
   * du cahier des charges : si le mot existe déjà, on crée quand même
   * une entrée ici (pour garder l'origine et la note personnelle de
   * l'utilisateur), mais SANS carte SRS propre — la révision de ce
   * mot reste entièrement déléguée à la file SRS du Vocabulaire, pour
   * ne jamais faire réviser le même mot deux fois séparément.
   *
   * vocabData : l'état chargé de MD.models.vocabulaire (lecture seule ici).
   */
  function ajouterMot(dictData, { motAllemand, article, traductionFr, origine, typeMot, noteLibre }, vocabData) {
    const doublon = MD.models.vocabulaire.rechercherMot(vocabData, motAllemand);
    const id = "perso_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    const entree = {
      id,
      motAllemand,
      article: article || "",
      traductionFr: traductionFr || "",
      origine: origine || "noteLibre",
      typeMot: typeMot || "autre",
      dateAjout: MD.core.today(),
      noteLibre: noteLibre || "",
      lienVocabulaireExistant: doublon
        ? { niveau: doublon.niveau, themeId: doublon.themeId, motId: doublon.motId }
        : null,
      revisionDeleguee: !!doublon,
    };

    const next = { ...dictData, mots: [...dictData.mots, entree] };
    if (!doublon) {
      next.srsCards = { ...dictData.srsCards, [id]: MD.core.srs.newCard() };
    }
    return { data: next, entree, doublon };
  }

  return { ID, createEmpty, load, save, ajouterMot };
})();
