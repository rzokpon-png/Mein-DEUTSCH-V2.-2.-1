/* ==================================================================
   MEIN DEUTSCH — CONSTANTES GLOBALES
   Fichier chargé en premier. Définit le namespace applicatif MD et
   toutes les constantes partagées par les autres fichiers du cœur
   technique et par les modèles de données.
   ================================================================== */

window.MD = window.MD || {};
MD.core = MD.core || {};
MD.models = MD.models || {};

/* Préfixe de toutes les clés localStorage de l'application, versionné
   pour permettre une migration propre si le schéma change un jour. */
MD.STORAGE_PREFIX = "meinDeutsch:v2:";
MD.SCHEMA_VERSION = 1;

/* Les 4 niveaux, dans l'ordre de progression. */
MD.LEVELS = ["A1", "A2", "B1", "B2"];

MD.LEVEL_LABELS = {
  A1: "Erste Schritte",
  A2: "Alltag meistern",
  B1: "Sich ausdrücken",
  B2: "Beruflich ankommen",
};

/* Identifiants des 18 modules pédagogiques/fonctionnels du cahier des
   charges v2.0, + le namespace technique "profil" qui n'est pas un
   module pédagogique mais porte l'identité et les réglages globaux
   de l'utilisateur (nom, dates, objectif). 19 namespaces de stockage
   au total — chacun physiquement séparé dans localStorage, ce qui
   garantit au niveau du stockage lui-même qu'aucun module ne peut
   accidentellement lire ou écrire les données d'un autre. */
MD.MODULE_IDS = {
  PROFIL: "profil",                                 // technique, hors cahier des charges
  VOCABULAIRE: "vocabulaire",
  EXPRESSIONS: "expressions",
  PHRASES_MODELES: "phrasesModeles",
  GRAMMAIRE: "grammaire",
  CONJUGAISON: "conjugaison",
  PHONETIQUE: "phonetique",
  HOEREN: "hoeren",
  LESEN: "lesen",
  SCHREIBEN: "schreiben",
  SPRECHEN: "sprechen",
  BIBLIOTHEQUE_DIALOGUES: "bibliothequeDialogues",
  EXAMENS: "examens",
  PFLEGE: "pflege",
  VIVRE_EN_ALLEMAGNE: "vivreEnAllemagne",
  REVISION: "revision",
  DICTIONNAIRE_PERSONNEL: "dictionnairePersonnel",
  CARNET_VERBES: "carnetVerbes",
  TABLEAU_DE_BORD: "tableauDeBord",
};

/* Liste ordonnée pratique pour les boucles (export/import, reset...). */
MD.ALL_MODULE_IDS = Object.values(MD.MODULE_IDS);

/* Les 11 modules structurés par niveau A1→B2 (contenu organisé en
   4 blocs de niveau). Les 7 autres modules ont une organisation
   différente (transversale, libre, ou agrégée). */
MD.LEVEL_STRUCTURED_MODULES = [
  MD.MODULE_IDS.VOCABULAIRE,
  MD.MODULE_IDS.EXPRESSIONS,
  MD.MODULE_IDS.PHRASES_MODELES,
  MD.MODULE_IDS.GRAMMAIRE,
  MD.MODULE_IDS.CONJUGAISON,
  MD.MODULE_IDS.PHONETIQUE,
  MD.MODULE_IDS.HOEREN,
  MD.MODULE_IDS.LESEN,
  MD.MODULE_IDS.SCHREIBEN,
  MD.MODULE_IDS.SPRECHEN,
  MD.MODULE_IDS.EXAMENS,
];

/* Modules qui utilisent le moteur de répétition espacée (SRS). */
MD.SRS_ENABLED_MODULES = [
  MD.MODULE_IDS.VOCABULAIRE,
  MD.MODULE_IDS.EXPRESSIONS,
  MD.MODULE_IDS.PHRASES_MODELES,
  MD.MODULE_IDS.CONJUGAISON,
  MD.MODULE_IDS.DICTIONNAIRE_PERSONNEL,
  MD.MODULE_IDS.PFLEGE,
];

/* Utilitaires de date partagés par tout le cœur technique. */
MD.core.today = function () {
  return new Date().toISOString().slice(0, 10);
};
MD.core.daysBetween = function (a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
};
