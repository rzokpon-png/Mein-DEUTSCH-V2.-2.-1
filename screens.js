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

MD.ui.screens.monNiveau = function () {
  const profil = MD.models.profil.load();
  if (!niveauTab) niveauTab = MD.core.progression.currentLevel(profil);

  return `<div class="screen">
    <div class="eyebrow" style="margin-bottom:4px">Mon parcours</div>
    <h1 class="display" style="font-size:22px;margin:0 0 16px">Niveau ${niveauTab}</h1>
    <div class="tabs">
      ${MD.LEVELS.map((l) => {
        const unlocked = MD.core.progression.isLevelUnlocked(l, profil);
        return `<button class="tab ${niveauTab === l ? "tab-active" : ""}" data-action="niveau-tab" data-level="${l}" ${unlocked ? "" : "disabled style='opacity:.4'"}>${l}${unlocked ? "" : " 🔒"}</button>`;
      }).join("")}
    </div>
    ${MD.ui.REGISTRE_MODULES.map((m) => `
      <div class="module-card" data-action="nav" data-screen="moduleVide" data-module="${m.id}" data-niveau="${niveauTab}">
        <span class="icon">${m.icone}</span>
        <div class="info">
          <div class="titre">${esc(m.label)}</div>
          <div class="sous-titre">Contenu à l'étape ${m.etape} du plan de développement</div>
        </div>
        <span class="muted">→</span>
      </div>
    `).join("")}
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
