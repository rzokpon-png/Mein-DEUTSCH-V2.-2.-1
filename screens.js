/* ==================================================================
   MEIN DEUTSCH — ÉCRANS DE L'INTERFACE (ÉTAPE 2)
   Aucun contenu pédagogique ici : uniquement la navigation, les
   menus et les états vides. Les modules dont la logique et le
   contenu ne sont pas encore développés affichent un état vide
   honnête indiquant le numéro d'étape où ils seront remplis.
   ================================================================== */

MD.ui.screens = {};

function esc(s) { const d = document.createElement("div"); d.innerText = s ?? ""; return d.innerHTML; }
function stamp(text, tone = "ochre") { return `<span class="stamp stamp-${tone}">${esc(text)}</span>`; }
function bar(pct, color) {
  return `<div class="bar"><div class="bar-fill" style="width:${Math.max(0, Math.min(100, pct))}%;${color ? `background:${color}` : ""}"></div></div>`;
}
function topbar(titre, options = {}) {
  return `<div class="topbar">
    <button class="icon-btn" data-action="back">←</button>
    <span class="topbar-title">${esc(titre)}</span>
    <span style="width:30px">${options.right || ""}</span>
  </div>`;
}

/* ------------------------------------------------------------------ ONBOARDING */
let ob = { step: 0, name: "", certLevel: "A2" };

MD.ui.screens.onboarding = function () {
  const s = ob.step;
  let body = "";
  if (s === 0) {
    body = `
      <h1 class="display">Bienvenue.</h1>
      <p class="muted">Comment dois-je t'appeler ?</p>
      <input id="ob-name" class="input" placeholder="Ton prénom" value="${esc(ob.name)}" />
      <button class="btn-primary" data-action="ob-next-0">Continuer →</button>
    `;
  } else if (s === 1) {
    body = `
      <h1 class="display" style="font-size:24px">As-tu déjà un Goethe-Zertifikat ?</h1>
      <p class="muted">As-tu déjà un niveau officiellement validé ?</p>
      <button class="btn-option" data-action="ob-cert-yes">Oui, j'ai un certificat</button>
      <button class="btn-option" data-action="ob-cert-no">Non, je commence à zéro</button>
    `;
  } else if (s === 2) {
    body = `
      <h1 class="display" style="font-size:24px">Quel niveau ?</h1>
      ${MD.LEVELS.map((l) => `<button class="btn-option ${ob.certLevel === l ? "active" : ""}" data-action="ob-setlevel" data-level="${l}">${l} — ${MD.LEVEL_LABELS[l]}</button>`).join("")}
      <button class="btn-primary" data-action="ob-finish-cert">Commencer →</button>
    `;
  }
  return `<div class="onboard-wrap">
    <div class="brand"><span>🚆</span><span class="mono">MEIN DEUTSCH</span></div>
    ${body}
  </div>`;
};

/* ------------------------------------------------------------------ TABLEAU DE BORD */
MD.ui.screens.tableauDeBord = function () {
  const snapshot = MD.core.storage.getAll();
  const profil = snapshot[MD.MODULE_IDS.PROFIL];
  const g = MD.core.stats.computeGlobalStats(snapshot);
  const f = MD.core.stats.computeForecast(snapshot);
  const heures = Math.floor(g.totalMinutes / 60), min = g.totalMinutes % 60;

  const forecastMsg = {
    debut: "Commence un module pour lancer la prévision.",
    dansLesTemps: "Ton rythme actuel te mène à ton objectif d'avril 2027.",
    enRetard: `Rythme requis : ~${f.rythmeRequis.toFixed(2)} niveau/semaine (actuel : ${f.rythmeActuel.toFixed(2)}).`,
  }[f.statut];
  const forecastColor = f.statut === "dansLesTemps" ? "#4F6F53" : f.statut === "enRetard" ? "#8C4A3D" : "#5B5347";

  return `<div class="screen">
    <div class="row-between" style="margin-bottom:18px">
      <div>
        <div class="eyebrow">Mein Deutsch</div>
        <h1 class="display" style="font-size:24px;margin:2px 0 0">Hallo, ${esc(profil.name || "")}.</h1>
      </div>
    </div>

    <div class="grid-2" style="margin-bottom:14px">
      <div class="card card-petrol">
        <div class="mono" style="font-size:20px;font-weight:600">${g.streak} 🔥</div>
        <div class="small" style="color:#C9D6DC">jours consécutifs</div>
      </div>
      <div class="card">
        ${stamp(`Niveau ${g.niveauActuel}`, "ochre")}
        <div class="small muted" style="margin-top:8px">${MD.LEVEL_LABELS[g.niveauActuel]}</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="row-gap" style="margin-bottom:8px"><span>📈</span><strong class="small">Objectif avril 2027</strong></div>
      ${bar((f.niveauxValides / f.totalNiveaux) * 100, forecastColor)}
      <div class="row-between small muted" style="margin-top:8px">
        <span>${f.niveauxValides} / ${f.totalNiveaux} niveaux</span><span>${f.joursRestants} jours restants</span>
      </div>
      <p class="small" style="margin-top:10px">${forecastMsg}</p>
    </div>

    <div class="section-label">Statistiques globales</div>
    <div class="grid-2">
      <div class="stat-card"><div class="small muted">⏱ Temps total</div><div class="stat-num">${heures}h${String(min).padStart(2,"0")}</div></div>
      <div class="stat-card"><div class="small muted">📖 Mots appris</div><div class="stat-num">${g.motsAppris}</div></div>
      <div class="stat-card"><div class="small muted">🔤 Verbes maîtrisés</div><div class="stat-num">${g.verbesMaitrises}</div></div>
      <div class="stat-card"><div class="small muted">🏁 Examens réussis</div><div class="stat-num">${g.examensReussis}</div></div>
    </div>

    <div class="dashed-box" style="margin-top:20px">
      <p class="small muted" style="margin:0">Le contenu pédagogique arrive progressivement (étapes 3 à 18). Les statistiques ci-dessus sont réelles et se rempliront automatiquement au fur et à mesure.</p>
    </div>
  </div>`;
};

/* ------------------------------------------------------------------ MON NIVEAU */
let niveauTab = null;

/**
 * Statut réel d'un module pour un niveau donné. Vocabulaire compare
 * son contenu réellement chargé au nombre de thèmes cible du cahier
 * des charges v2.0, pour distinguer un niveau complet d'un niveau en
 * cours de rédaction. Les autres modules n'ont pas encore de contenu
 * (étapes 4 à 14 non commencées) donc restent "À venir".
 */
const OBJECTIF_THEMES_VOCABULAIRE = { A1: 14, A2: 14, B1: 14, B2: 12 };

function statutModulePourNiveau(moduleId, niveau) {
  if (moduleId === MD.MODULE_IDS.VOCABULAIRE) {
    const contenu = MD.contenuVocabulaire && MD.contenuVocabulaire[niveau];
    const nb = contenu ? contenu.length : 0;
    const cible = OBJECTIF_THEMES_VOCABULAIRE[niveau];
    if (nb === 0) return { label: "À venir", tone: "muted" };
    if (nb >= cible) return { label: "Terminé", tone: "sage" };
    return { label: `En développement (${nb}/${cible})`, tone: "ochre" };
  }
  return { label: "À venir", tone: "muted" };
}

MD.ui.screens.monNiveau = function () {
  const profil = MD.models.profil.load();
  if (!niveauTab) niveauTab = MD.core.progression.currentLevel(profil);

  const statuts = MD.ui.REGISTRE_MODULES.map((m) => statutModulePourNiveau(m.id, niveauTab));
  const fractions = MD.ui.REGISTRE_MODULES.map((m) => {
    if (m.id === MD.MODULE_IDS.VOCABULAIRE) {
      const contenu = MD.contenuVocabulaire && MD.contenuVocabulaire[niveauTab];
      const nb = contenu ? contenu.length : 0;
      const cible = OBJECTIF_THEMES_VOCABULAIRE[niveauTab];
      return Math.min(1, nb / cible);
    }
    return 0;
  });
  const nbTermines = statuts.filter((s) => s.label === "Terminé").length;
  const pourcentage = Math.round((fractions.reduce((a, b) => a + b, 0) / MD.ui.REGISTRE_MODULES.length) * 100);

  return `<div class="screen">
    <div class="eyebrow" style="margin-bottom:4px">Mon parcours</div>
    <h1 class="display" style="font-size:22px;margin:0 0 4px">Niveau ${niveauTab}</h1>
    <p class="small muted" style="margin:0 0 14px">Tous les niveaux sont consultables — le contenu se complète progressivement.</p>
    <div class="tabs">
      ${MD.LEVELS.map((l) => `<button class="tab ${niveauTab === l ? "tab-active" : ""}" data-action="niveau-tab" data-level="${l}">${l}</button>`).join("")}
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="row-gap" style="margin-bottom:8px"><span>📊</span><strong class="small">Avancement réel du niveau ${niveauTab}</strong></div>
      ${bar(pourcentage, pourcentage === 100 ? "#4F6F53" : "#C97D2C")}
      <div class="small muted" style="margin-top:8px">${nbTermines} / ${MD.ui.REGISTRE_MODULES.length} modules terminés (${pourcentage}%)</div>
    </div>

    ${MD.ui.REGISTRE_MODULES.map((m, i) => {
      const estVocab = m.id === MD.MODULE_IDS.VOCABULAIRE;
      const statut = statuts[i];
      const cible = estVocab ? "vocabulaireThemes" : "moduleVide";
      return `
      <div class="module-card" data-action="nav" data-screen="${cible}" data-module="${m.id}" data-niveau="${niveauTab}">
        <span class="icon">${m.icone}</span>
        <div class="info">
          <div class="titre">${esc(m.label)}</div>
          <div class="sous-titre">${stamp(statut.label, statut.tone)}</div>
        </div>
        <span class="muted">→</span>
      </div>
    `;
    }).join("")}
  </div>`;
};

/* ------------------------------------------------------------------ ÉTAT VIDE GÉNÉRIQUE D'UN MODULE */
MD.ui.screens.moduleVide = function (params) {
  const fiche = MD.ui.trouverModule(params.module);
  const titre = fiche ? fiche.label : params.module;
  const niveauTxt = params.niveau ? ` · Niveau ${params.niveau}` : "";
  return `<div class="screen">
    ${topbar(titre)}
    <div class="empty-state">
      <div class="icon">${fiche ? fiche.icone : "🧩"}</div>
      <h2>${esc(titre)}${niveauTxt}</h2>
      <p>Ce module n'est pas encore développé. Sa structure de données existe déjà et a été testée (étape 1) ; son contenu et son fonctionnement arrivent à l'étape ${fiche ? fiche.etape : "?"} du plan validé.</p>
    </div>
  </div>`;
};

/* ------------------------------------------------------------------ VOCABULAIRE — LISTE DES THÈMES (ÉTAPE 3) */
MD.ui.screens.vocabulaireThemes = function (params) {
  const niveau = params.niveau || MD.core.progression.currentLevel(MD.models.profil.load());
  const themes = MD.modules.vocabulaire.themesAvecProgression(niveau);

  if (themes.length === 0) {
    return `<div class="screen">
      ${topbar(`Vocabulaire · ${niveau}`)}
      <div class="empty-state">
        <div class="icon">📖</div>
        <h2>Contenu à venir pour ${niveau}</h2>
        <p>Les thèmes de ce niveau n'ont pas encore été rédigés.</p>
      </div>
    </div>`;
  }

  return `<div class="screen">
    ${topbar(`Vocabulaire · ${niveau}`)}
    <p class="small muted" style="margin-bottom:14px">${themes.length} thèmes · ${themes.reduce((s, t) => s + t.totalMots, 0)} mots</p> 
    
    <button class="btn-primary" data-action="vocab-exercice" data-niveau="${niveau}">
  📝 Faire un exercice
</button>
    ${themes.map((t) => {
      const pct = t.totalMots ? Math.round((t.motsAppris / t.totalMots) * 100) : 0;
      return `
      <div class="module-card" data-action="nav" data-screen="vocabulaireRevision" data-niveau="${niveau}" data-theme="${t.id}">
        <span class="icon">${t.icone}</span>
        <div class="info">
          <div class="titre">${esc(t.label)}</div>
          <div class="sous-titre">${t.motsAppris} / ${t.totalMots} mots appris ${t.motsDus > 0 ? `· ${t.motsDus} à réviser` : ""}</div>
          ${bar(pct, pct === 100 ? "#4F6F53" : "#C97D2C")}
        </div>
      </div>`;
    }).join("")}
  </div>`;
};

/* ------------------------------------------------------------------ VOCABULAIRE — SESSION DE RÉVISION (FLASHCARDS) */
let vocabSession = null;

MD.ui.screens.vocabulaireRevision = function (params) {
  const { niveau, theme: themeId } = params;
  if (!vocabSession || vocabSession._cle !== `${niveau}::${themeId}`) {
    vocabSession = {
      _cle: `${niveau}::${themeId}`,
      niveau,
      cartes: MD.modules.vocabulaire.sessionRevision(niveau, themeId, 12),
      idx: 0,
      revele: false,
    };
  }

  if (vocabSession.cartes.length === 0) {
    return `<div class="screen center-screen">
      ${topbar("Vocabulaire")}
      <div class="empty-state">
        <div class="icon">✅</div>
        <h2>Rien à réviser ici pour l'instant</h2>
        <p>Tous les mots de ce thème sont à jour. Reviens plus tard.</p>
      </div>
    </div>`;
  }

  if (vocabSession.idx >= vocabSession.cartes.length) {
    return `<div class="screen center-screen">
      ${topbar("Vocabulaire")}
      <div class="empty-state">
        <div class="icon">🎉</div>
        <h2>Session terminée</h2>
        <p>${vocabSession.cartes.length} mot(s) révisé(s) dans ce thème.</p>
      </div>
      <button class="btn-primary" data-action="back">Retour aux thèmes</button>
    </div>`;
  }

  const c = vocabSession.cartes[vocabSession.idx];
  const imageBloc = c.mot.image
    ? `<img src="${esc(c.mot.image)}" alt="${esc(c.mot.mot)}" loading="lazy"
         style="width:100%;height:160px;object-fit:cover;border-radius:12px;margin-bottom:14px;background:var(--paper-deep)"
         onerror="this.replaceWith(Object.assign(document.createElement('div'), {innerHTML:'🖼️', style:'font-size:40px;text-align:center;padding:40px 0;background:var(--paper-deep);border-radius:12px;margin-bottom:14px'}))" />`
    : `<div style="font-size:40px;text-align:center;padding:40px 0;background:var(--paper-deep);border-radius:12px;margin-bottom:14px;opacity:.5">${esc(c.theme.icone)}</div>`;
  return `<div class="screen">
    ${topbar(c.theme.label)}
    <div class="mono muted small">${vocabSession.idx + 1} / ${vocabSession.cartes.length}</div>
    ${bar((vocabSession.idx / vocabSession.cartes.length) * 100, "#C97D2C")}
    <div class="module-card" data-action="vocab-flip" style="justify-content:center;flex-direction:column;text-align:center;padding:24px 16px;margin-top:18px;cursor:pointer">
      ${imageBloc}
      <div class="display" style="font-size:26px">${esc(c.mot.mot)}</div>
      ${vocabSession.revele ? `
        <div style="margin-top:12px;color:var(--ochre-deep);font-weight:600;font-size:17px">${esc(c.mot.fr)}</div>
        ${c.mot.pl ? `<div class="small muted" style="margin-top:6px">Pluriel : ${esc(c.mot.pl)}</div>` : ""}
        <div class="mono small" style="margin-top:10px;color:var(--ink-soft)">${esc(c.mot.ex)}</div>
      ` : `<div class="small muted" style="margin-top:10px">Touche pour révéler</div>`}
    </div>
    <button class="btn-option" data-action="vocab-speak" data-text="${esc(c.mot.mot + '. ' + c.mot.ex)}" style="text-align:center">🔊 Écouter</button>
    ${vocabSession.revele ? `
      <div class="grid-2" style="margin-top:14px;grid-template-columns:1fr 1fr 1fr;gap:8px">
        <button data-action="vocab-rate" data-q="0" style="padding:12px 4px;border-radius:10px;border:none;background:var(--rust);color:var(--white);font-weight:600;font-size:13px">Raté</button>
        <button data-action="vocab-rate" data-q="1" style="padding:12px 4px;border-radius:10px;border:none;background:var(--ochre);color:var(--white);font-weight:600;font-size:13px">Difficile</button>
        <button data-action="vocab-rate" data-q="2" style="padding:12px 4px;border-radius:10px;border:none;background:var(--sage);color:var(--white);font-weight:600;font-size:13px">Facile</button>
      </div>
    ` : ""}
  </div>`;
};

/* ------------------------------------------------------------------ RÉVISER */
MD.ui.screens.reviser = function () {
  const snapshot = MD.core.storage.getAll();
  const enAttente = MD.models.revision.elementsEnAttente(snapshot);
  return `<div class="screen">
    <div class="eyebrow" style="margin-bottom:4px">Révision</div>
    <h1 class="display" style="font-size:22px;margin:0 0 16px">Que veux-tu réviser ?</h1>

    <div class="card" style="margin-bottom:14px">
      <div class="row-gap" style="margin-bottom:6px"><span>🧠</span><strong class="small">Révision intelligente</strong></div>
      <p class="small muted" style="margin:0 0 10px">${enAttente.length} élément(s) en attente, tous modules confondus.</p>
      <button class="btn-primary" data-action="nav" data-screen="revisionIntelligente" style="margin-top:0">Commencer</button>
    </div>

    <div class="card">
      <div class="row-gap" style="margin-bottom:6px"><span>🎯</span><strong class="small">Révision libre</strong></div>
      <p class="small muted" style="margin:0 0 10px">Choisis toi-même le module et le niveau à réviser.</p>
      <button class="btn-primary" data-action="nav" data-screen="reviserLibre" style="margin-top:0">Choisir</button>
    </div>
  </div>`;
};

MD.ui.screens.revisionIntelligente = function () {
  const snapshot = MD.core.storage.getAll();
  const enAttente = MD.models.revision.elementsEnAttente(snapshot);
  if (enAttente.length === 0) {
    return `<div class="screen">
      ${topbar("Révision intelligente")}
      <div class="empty-state">
        <div class="icon">✅</div>
        <h2>Rien à réviser pour l'instant</h2>
        <p>Dès que du contenu sera appris (à partir de l'étape 3), les éléments en retard apparaîtront automatiquement ici.</p>
      </div>
    </div>`;
  }
  const parModule = {};
  enAttente.forEach((r) => { parModule[r.moduleId] = (parModule[r.moduleId] || 0) + 1; });
  return `<div class="screen">
    ${topbar("Révision intelligente")}
    ${Object.keys(parModule).map((id) => {
      const fiche = MD.ui.trouverModule(id);
      return `<div class="list-item"><span>${fiche ? fiche.icone + " " + fiche.label : id}</span><span class="stamp stamp-ochre">${parModule[id]}</span></div>`;
    }).join("")}
  </div>`;
};

MD.ui.screens.reviserLibre = function () {
  const tousModules = [...MD.ui.REGISTRE_MODULES, ...MD.ui.REGISTRE_TRANSVERSAL];
  return `<div class="screen">
    ${topbar("Révision libre")}
    <p class="small muted" style="margin-bottom:14px">Choisis un module à réviser librement, indépendamment des suggestions automatiques.</p>
    ${tousModules.map((m) => `
      <div class="module-card" data-action="nav" data-screen="moduleVide" data-module="${m.id}">
        <span class="icon">${m.icone}</span>
        <div class="info"><div class="titre">${esc(m.label)}</div></div>
        <span class="muted">→</span>
      </div>
    `).join("")}
  </div>`;
};

/* ------------------------------------------------------------------ MENU (PLUS) */
MD.ui.screens.menu = function () {
  const profil = MD.models.profil.load();
  return `<div class="screen">
    <h1 class="display" style="font-size:22px;margin:0 0 16px">Menu</h1>
    ${MD.ui.REGISTRE_TRANSVERSAL.map((m) => {
      let verrouille = false;
      if (m.condition === "isPflegeUnlocked") verrouille = !MD.core.progression.isPflegeUnlocked(profil);
      if (m.condition === "isVivreEnAllemagneUnlocked") verrouille = !MD.core.progression.isVivreEnAllemagneUnlocked(profil);
      const cible = m.id === MD.MODULE_IDS.DICTIONNAIRE_PERSONNEL ? "dictionnairePersonnel"
                  : m.id === MD.MODULE_IDS.CARNET_VERBES ? "carnetVerbes" : "moduleVide";
      return `<div class="menu-card" ${verrouille ? "style='opacity:.5'" : `data-action="nav" data-screen="${cible}" data-module="${m.id}"`}>
        <span class="icon">${m.icone}</span>
        <div class="info"><div class="titre">${esc(m.label)}</div>${verrouille ? `<div class="sous-titre">Se débloque au niveau ${m.condition === "isPflegeUnlocked" ? "B1" : "A2"}</div>` : ""}</div>
      </div>`;
    }).join("")}
    <div class="menu-card" data-action="nav" data-screen="reglages">
      <span class="icon">⚙️</span>
      <div class="info"><div class="titre">Réglages</div></div>
    </div>
  </div>`;
};

/* ------------------------------------------------------------------ DICTIONNAIRE PERSONNEL (fonctionnel dès maintenant) */
MD.ui.screens.dictionnairePersonnel = function () {
  const dico = MD.models.dictionnairePersonnel.load();
  return `<div class="screen">
    ${topbar("Dictionnaire personnel")}
    <p class="small muted" style="margin-bottom:14px">Ajoute librement des mots que tu rencontres. S'ils existent déjà dans le Vocabulaire du programme, ils y seront reliés automatiquement plutôt que dupliqués.</p>

    <div class="form-row">
      <label>Mot allemand</label>
      <input id="dico-mot" class="input" placeholder="ex. die Pflegekraft" />
    </div>
    <div class="form-row">
      <label>Traduction française</label>
      <input id="dico-trad" class="input" placeholder="ex. le/la soignant(e)" />
    </div>
    <div class="form-row">
      <label>Note personnelle (optionnel)</label>
      <input id="dico-note" class="input" placeholder="ex. entendu à l'hôpital" />
    </div>
    <button class="btn-primary" data-action="dico-ajouter">Ajouter</button>

    <div class="section-label">Mes mots (${dico.mots.length})</div>
    ${dico.mots.length === 0 ? `<p class="small muted">Aucun mot ajouté pour l'instant.</p>` : dico.mots.slice().reverse().map((m) => `
      <div class="list-item">
        <div>
          <div style="font-weight:600;font-size:14px">${esc(m.motAllemand)}</div>
          <div class="small muted">${esc(m.traductionFr || "")}</div>
        </div>
        ${m.revisionDeleguee ? stamp("déjà au programme", "sage") : stamp("nouveau", "petrol")}
      </div>
    `).join("")}
  </div>`;
};

/* ------------------------------------------------------------------ CARNET DE VERBES (fonctionnel dès maintenant) */
MD.ui.screens.carnetVerbes = function () {
  const snapshot = MD.core.storage.getAll();
  const carnet = MD.models.carnetVerbes.resynchroniser(snapshot);
  MD.models.carnetVerbes.save(carnet);
  const verbes = Object.entries(carnet.verbes);
  return `<div class="screen">
    ${topbar("Carnet de verbes")}
    <p class="small muted" style="margin-bottom:14px">Synthèse automatique de tous les verbes rencontrés dans l'application (Conjugaison, Lesen, Hören, Sprechen, Dictionnaire personnel).</p>
    ${verbes.length === 0 ? `
      <div class="empty-state">
        <div class="icon">📒</div>
        <h2>Aucun verbe rencontré pour l'instant</h2>
        <p>Ce carnet se remplira automatiquement dès que du contenu sera disponible (à partir de l'étape 7 — Conjugaison).</p>
      </div>
    ` : verbes.map(([inf, v]) => `
      <div class="list-item">
        <span>${esc(inf)}</span>
        ${stamp(v.statutMaitrise, v.statutMaitrise === "maitrise" ? "sage" : v.statutMaitrise === "enCours" ? "ochre" : "muted")}
      </div>
    `).join("")}
  </div>`;
};

/* ------------------------------------------------------------------ RÉGLAGES */
MD.ui.screens.reglages = function () {
  const profil = MD.models.profil.load();
  const tdb = MD.models.tableauDeBord.load();
  return `<div class="screen">
    ${topbar("Réglages")}

    <div class="form-row">
      <label>Objectif (date)</label>
      <input id="set-target" type="date" class="input" value="${profil.targetDate}" />
    </div>
    <div class="form-row">
      <label>Objectif hebdomadaire (minutes)</label>
      <input id="set-hebdo" type="number" class="input" value="${tdb.objectifHebdomadaireMinutes}" />
    </div>
    <button class="btn-primary" data-action="settings-save">Enregistrer</button>

    <div class="section-label">Sauvegarde</div>
    <button class="btn-option" data-action="settings-export">⬇️ Exporter mes données (.json)</button>
    <label class="btn-option" style="display:block;text-align:center;cursor:pointer">
      ⬆️ Importer une sauvegarde
      <input id="import-file" type="file" accept="application/json" style="display:none" />
    </label>

    <div class="section-label">Zone sensible</div>
    <button class="btn-option" style="border-color:var(--rust);color:var(--rust);text-align:center" data-action="settings-reset">🗑️ Réinitialiser toutes les données</button>
  </div>`;
};

/* ------------------------------------------------------------------ NAVIGATION BASSE (BOTTOM NAV) */
MD.ui.bottomNav = function (screenActif) {
  const items = [
    { screen: "tableauDeBord", icone: "🏠", label: "Accueil" },
    { screen: "monNiveau", icone: "🚆", label: "Mon niveau" },
    { screen: "reviser", icone: "🧠", label: "Réviser" },
    { screen: "menu", icone: "☰", label: "Menu" },
  ];
  return `<div class="bottom-nav">
    ${items.map((it) => `
      <button class="nav-item ${screenActif === it.screen ? "active" : ""}" data-action="nav" data-screen="${it.screen}">
        <span class="nav-icon">${it.icone}</span><span>${it.label}</span>
      </button>
    `).join("")}
  </div>`;
};
