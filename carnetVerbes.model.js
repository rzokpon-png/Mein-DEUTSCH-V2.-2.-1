/* ==================================================================
   MODÈLE — CARNET DE VERBES (module 17)
   Vue consolidée et automatique de tous les verbes rencontrés dans
   l'application (Conjugaison, Lesen, Hören, Sprechen, Dictionnaire
   personnel). Ne crée jamais de nouvelle leçon : c'est une synthèse
   en lecture, régénérée à partir des autres modules, avec un cache
   local pour l'affichage rapide.
   ================================================================== */

MD.models.carnetVerbes = (function () {
  const ID = MD.MODULE_IDS.CARNET_VERBES;

  /**
   * Schéma :
   * {
   *   schemaVersion: number,
   *   verbes: {
   *     "<infinitif>": {
   *       sources: [ "conjugaison:A1", "lesen:B1:texteId", "dictionnairePersonnel" ],
   *       statutMaitrise: "nonVu"|"enCours"|"maitrise",
   *       derniereRevision: "AAAA-MM-JJ"|null
   *     }
   *   },
   *   derniereSynchronisation: "AAAA-MM-JJ"|null
   * }
   */
  function createEmpty() {
    return {
      schemaVersion: MD.SCHEMA_VERSION,
      verbes: {},
      derniereSynchronisation: null,
    };
  }

  function load() { return MD.core.storage.ensure(ID, createEmpty); }
  function save(data) { return MD.core.storage.set(ID, data); }

  /**
   * Reconstruit le carnet à partir d'un instantané complet. Fonction
   * pure en lecture seule sur 5 sources — ne modifie jamais aucun
   * des modules qu'elle observe :
   *   1. Conjugaison  — source de vérité du statut de maîtrise (SRS)
   *   2. Lesen        — verbes rencontrés en lecture (item.verbesUtilises)
   *   3. Hören        — verbes rencontrés à l'écoute (item.verbesUtilises)
   *   4. Sprechen     — verbes rencontrés en dialogue (item.verbesUtilises)
   *   5. Dictionnaire personnel — mots ajoutés avec typeMot === "verbe"
   *
   * Priorité de statut en cas de verbe vu dans plusieurs sources :
   * "maitrise" > "enCours" > "vu". Un verbe simplement croisé en
   * Lesen/Hören/Sprechen (sans suivi SRS propre à ces modules) est
   * classé "vu" tant qu'aucune source à SRS (Conjugaison ou
   * Dictionnaire personnel) ne le fait progresser.
   */
  function resynchroniser(snapshot) {
    const verbes = {};

    function ajouterSource(infinitif, source, statut, derniereRevision) {
      const cle = infinitif.trim().toLowerCase();
      if (!cle) return;
      const rang = { maitrise: 3, enCours: 2, vu: 1 };
      if (!verbes[cle]) {
        verbes[cle] = { sources: [source], statutMaitrise: statut, derniereRevision: derniereRevision || null };
      } else {
        if (!verbes[cle].sources.includes(source)) verbes[cle].sources.push(source);
        if (rang[statut] > rang[verbes[cle].statutMaitrise]) verbes[cle].statutMaitrise = statut;
        if (derniereRevision && (!verbes[cle].derniereRevision || derniereRevision > verbes[cle].derniereRevision)) {
          verbes[cle].derniereRevision = derniereRevision;
        }
      }
    }

    /* 1. Conjugaison — source de vérité du SRS de conjugaison */
    const conj = snapshot[MD.MODULE_IDS.CONJUGAISON];
    if (conj) {
      MD.LEVELS.forEach((niveau) => {
        (conj.verbesParNiveau[niveau] || []).forEach((v) => {
          const card = conj.srsCards[`${niveau}::${v.id}`];
          const statut = card && MD.core.srs.isLearned(card) ? "maitrise" : "enCours";
          ajouterSource(v.infinitif, `conjugaison:${niveau}`, statut, card ? card.due : null);
        });
      });
    }

    /* 2. Lesen — simple repérage, statut "vu" */
    const lesen = snapshot[MD.MODULE_IDS.LESEN];
    if (lesen) {
      MD.LEVELS.forEach((niveau) => {
        (lesen.textesParNiveau[niveau] || []).forEach((texte) => {
          (texte.verbesUtilises || []).forEach((inf) => ajouterSource(inf, `lesen:${niveau}:${texte.id}`, "vu"));
        });
      });
    }

    /* 3. Hören — simple repérage, statut "vu" */
    const hoeren = snapshot[MD.MODULE_IDS.HOEREN];
    if (hoeren) {
      MD.LEVELS.forEach((niveau) => {
        (hoeren.ecoutesParNiveau[niveau] || []).forEach((ecoute) => {
          (ecoute.verbesUtilises || []).forEach((inf) => ajouterSource(inf, `hoeren:${niveau}:${ecoute.id}`, "vu"));
        });
      });
    }

    /* 4. Sprechen — simple repérage, statut "vu" */
    const sprechen = snapshot[MD.MODULE_IDS.SPRECHEN];
    if (sprechen) {
      MD.LEVELS.forEach((niveau) => {
        (sprechen.situationsParNiveau[niveau] || []).forEach((situation) => {
          (situation.verbesUtilises || []).forEach((inf) => ajouterSource(inf, `sprechen:${niveau}:${situation.id}`, "vu"));
        });
      });
    }

    /* 5. Dictionnaire personnel — verbes ajoutés librement, avec leur propre SRS */
    const dico = snapshot[MD.MODULE_IDS.DICTIONNAIRE_PERSONNEL];
    if (dico) {
      (dico.mots || []).forEach((m) => {
        if (m.typeMot !== "verbe") return;
        const card = dico.srsCards[m.id];
        const statut = card && MD.core.srs.isLearned(card) ? "maitrise" : "enCours";
        ajouterSource(m.motAllemand, "dictionnairePersonnel", statut, card ? card.due : null);
      });
    }

    return { schemaVersion: MD.SCHEMA_VERSION, verbes, derniereSynchronisation: MD.core.today() };
  }

  return { ID, createEmpty, load, save, resynchroniser };
})();
