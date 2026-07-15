/* ==================================================================
   MEIN DEUTSCH — BOOTSTRAP DE L'INTERFACE (ÉTAPE 2)
   ================================================================== */

const ECRANS_AVEC_NAV_BASSE = ["tableauDeBord", "monNiveau", "reviser", "menu"];

function appEl() { return document.getElementById("app"); }

function render(route) {
  const fn = MD.ui.screens[route.screen];
  const html = fn ? fn(route.params) : `<div class="screen center-screen"><p class="muted">Écran inconnu : ${route.screen}</p></div>`;
  const avecNav = ECRANS_AVEC_NAV_BASSE.includes(route.screen);
  appEl().innerHTML = html + (avecNav ? MD.ui.bottomNav(route.screen) : "");
  bindEvents();
}

function bindEvents() {
  appEl().addEventListener("click", onClick, { once: true });
  const importInput = document.getElementById("import-file");
  if (importInput) importInput.addEventListener("change", onImportFile);
  const nameInput = document.getElementById("ob-name");
  if (nameInput) nameInput.addEventListener("input", (e) => (ob.name = e.target.value));
}

function onClick(e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) { bindEvents(); return; }
  const action = btn.dataset.action;

  switch (action) {
    case "back": MD.core.router.back("tableauDeBord"); return;
    case "nav": {
      const params = { ...btn.dataset };
      delete params.action;
      MD.core.router.goto(btn.dataset.screen, params);
      return;
    }

    /* ---- onboarding ---- */
    case "ob-next-0": {
      const v = document.getElementById("ob-name").value.trim();
      if (v) { ob.name = v; ob.step = 1; render(MD.core.router.current()); }
      else bindEvents();
      return;
    }
    case "ob-cert-yes": ob.step = 2; render(MD.core.router.current()); return;
    case "ob-cert-no": {
      finirOnboarding(ob.name.trim() || "Freund", "A1");
      return;
    }
    case "ob-setlevel": ob.certLevel = btn.dataset.level; render(MD.core.router.current()); return;
    case "ob-finish-cert": {
      const idx = MD.LEVELS.indexOf(ob.certLevel);
      const startLevel = idx < MD.LEVELS.length - 1 ? MD.LEVELS[idx + 1] : "B2";
      finirOnboarding(ob.name.trim() || "Freund", startLevel);
      return;
    }

    /* ---- mon niveau ---- */
    case "niveau-tab": niveauTab = btn.dataset.level; render(MD.core.router.current()); return;

    /* ---- dictionnaire personnel ---- */
    case "dico-ajouter": {
      const motAllemand = document.getElementById("dico-mot").value.trim();
      const traductionFr = document.getElementById("dico-trad").value.trim();
      const noteLibre = document.getElementById("dico-note").value.trim();
      if (!motAllemand) { bindEvents(); return; }
      const vocab = MD.models.vocabulaire.load();
      const dico = MD.models.dictionnairePersonnel.load();
      const { data } = MD.models.dictionnairePersonnel.ajouterMot(
        dico, { motAllemand, traductionFr, origine: "noteLibre", typeMot: "autre", noteLibre }, vocab
      );
      MD.models.dictionnairePersonnel.save(data);
      render(MD.core.router.current());
      return;
    }

    /* ---- réglages ---- */
    case "settings-save": {
      const profil = MD.models.profil.load();
      const target = document.getElementById("set-target").value;
      if (target) MD.models.profil.save({ ...profil, targetDate: target });
      const tdb = MD.models.tableauDeBord.load();
      const hebdo = parseInt(document.getElementById("set-hebdo").value, 10);
      if (!isNaN(hebdo)) MD.models.tableauDeBord.save({ ...tdb, objectifHebdomadaireMinutes: hebdo });
      render(MD.core.router.current());
      return;
    }
    case "settings-export": MD.core.backup.exportAll(); bindEvents(); return;
    case "settings-reset": {
      if (confirm("Réinitialiser toutes tes données ? Cette action est irréversible.")) {
        MD.core.storage.clearAll();
        MD.core.router.resetStack();
        ob = { step: 0, name: "", certLevel: "A2" };
        niveauTab = null;
        MD.core.router.goto("onboarding", {}, { isBack: true });
      } else bindEvents();
      return;
    }

    default: bindEvents();
  }
}

function onImportFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  MD.core.backup.importAll(file)
    .then(() => { alert("Sauvegarde importée avec succès."); MD.core.router.goto("tableauDeBord"); })
    .catch((err) => alert("Import impossible : " + err.message));
}

function finirOnboarding(name, level) {
  const profil = MD.models.profil.createEmpty();
  profil.onboarded = true;
  profil.name = name;
  profil.currentLevel = level;
  MD.models.profil.save(profil);
  niveauTab = level;
  MD.core.router.goto("tableauDeBord", {}, { isBack: true });
}

/* ------------------------------------------------------------------ DÉMARRAGE */
function demarrer() {
  if (typeof MD === "undefined" || typeof MD.core === "undefined" || typeof MD.models === "undefined" || typeof MD.ui === "undefined") {
    document.getElementById("app").innerHTML = `
      <div style="padding:24px;font-family:sans-serif;background:#2a1414;color:#f2caca;min-height:100vh;box-sizing:border-box;">
        <h1 style="font-size:18px;">⚠️ L'application n'a pas pu se charger</h1>
        <p>Les fichiers JavaScript n'ont pas pu être lus depuis cet emplacement.</p>
        <p><strong>Cause la plus fréquente sur mobile :</strong> ce fichier a été ouvert via un lien <code>content://</code> (aperçu depuis une appli de fichiers) plutôt qu'un vrai chemin de dossier.</p>
        <p><strong>Solution recommandée :</strong> héberge ce dossier gratuitement (GitHub Pages ou Netlify Drop) et ouvre l'adresse https:// obtenue, plutôt que le fichier local.</p>
      </div>`;
    return;
  }
  MD.core.router.onChange(render);
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  }
  const profil = MD.models.profil.load();
  MD.core.router.goto(profil.onboarded ? "tableauDeBord" : "onboarding", {}, { isBack: true });
}

window.addEventListener("DOMContentLoaded", demarrer);
