/* ==================================================================
   MEIN DEUTSCH — REGISTRE DES MODULES (POUR L'INTERFACE)
   Centralise les métadonnées d'affichage des 18 modules du cahier
   des charges + Dictionnaire personnel + Carnet de verbes. Ne
   contient aucune logique métier ni contenu pédagogique — uniquement
   ce qu'il faut pour construire les menus et les cartes de
   navigation. Le numéro d'étape correspond au plan de développement
   validé par l'utilisateur (18 étapes).
   ================================================================== */

MD.ui = MD.ui || {};

MD.ui.REGISTRE_MODULES = [
  { id: MD.MODULE_IDS.VOCABULAIRE, icone: "📖", label: "Vocabulaire", parNiveau: true, etape: 3 },
  { id: MD.MODULE_IDS.EXPRESSIONS, icone: "💬", label: "Expressions (Redemittel)", parNiveau: true, etape: 4 },
  { id: MD.MODULE_IDS.PHRASES_MODELES, icone: "🗨️", label: "Phrases modèles", parNiveau: true, etape: 5 },
  { id: MD.MODULE_IDS.GRAMMAIRE, icone: "✏️", label: "Grammaire", parNiveau: true, etape: 6 },
  { id: MD.MODULE_IDS.CONJUGAISON, icone: "🔤", label: "Conjugaison", parNiveau: true, etape: 7 },
  { id: MD.MODULE_IDS.PHONETIQUE, icone: "🗣️", label: "Phonétique", parNiveau: true, etape: 8 },
  { id: MD.MODULE_IDS.HOEREN, icone: "🎧", label: "Hören", parNiveau: true, etape: 9 },
  { id: MD.MODULE_IDS.LESEN, icone: "📰", label: "Lesen", parNiveau: true, etape: 10 },
  { id: MD.MODULE_IDS.SCHREIBEN, icone: "🖊️", label: "Schreiben", parNiveau: true, etape: 11 },
  { id: MD.MODULE_IDS.SPRECHEN, icone: "🎙️", label: "Sprechen", parNiveau: true, etape: 12 },
  { id: MD.MODULE_IDS.EXAMENS, icone: "🏁", label: "Examens blancs", parNiveau: true, etape: 14 },
];

/* Modules transversaux, hors progression par niveau (menu "Plus"). */
MD.ui.REGISTRE_TRANSVERSAL = [
  { id: MD.MODULE_IDS.BIBLIOTHEQUE_DIALOGUES, icone: "📚", label: "Bibliothèque de dialogues", etape: 13 },
  { id: MD.MODULE_IDS.PFLEGE, icone: "🩺", label: "Allemand professionnel & Pflege", etape: 15, condition: "isPflegeUnlocked" },
  { id: MD.MODULE_IDS.VIVRE_EN_ALLEMAGNE, icone: "🇩🇪", label: "Vivre en Allemagne", etape: 16, condition: "isVivreEnAllemagneUnlocked" },
  { id: MD.MODULE_IDS.DICTIONNAIRE_PERSONNEL, icone: "📓", label: "Dictionnaire personnel", etape: "17 (logique déjà prête)" },
  { id: MD.MODULE_IDS.CARNET_VERBES, icone: "📒", label: "Carnet de verbes", etape: "17 (logique déjà prête)" },
];

/** Trouve la fiche de registre d'un module par son identifiant. */
MD.ui.trouverModule = function (moduleId) {
  return MD.ui.REGISTRE_MODULES.find((m) => m.id === moduleId) ||
         MD.ui.REGISTRE_TRANSVERSAL.find((m) => m.id === moduleId) || null;
};
