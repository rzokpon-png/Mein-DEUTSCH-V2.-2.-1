/* ==================================================================
   MEIN DEUTSCH — BOOTSTRAP DE L'INTERFACE (ÉTAPE 2)
   ================================================================== */

const ECRANS_AVEC_NAV_BASSE = ["tableauDeBord", "monNiveau", "reviser", "menu"];

function appEl() { return document.getElementById("app"); }

function render(route) {
  try {
    const fn = MD.ui.screens[route.screen];
    const html = fn ? fn(route.params) : `<div class="screen center-screen"><p class="muted">Écran inconnu : ${route.screen}</p></div>`;
    const avecNav = ECRANS_AVEC_NAV_BASSE.includes(route.screen);
    appEl().innerHTML = html + (avecNav ? MD.ui.bottomNav(route.screen) : "");
    bindEvents();
  } catch (e) {
    afficherErreurFatale("Erreur pendant l'affichage de l'écran « " + route.screen + " »", e.stack || e.message);
  }
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

    /* ---- vocabulaire (étape 3) ---- */
    case "vocab-flip": 
  vocabSession.revele = !vocabSession.revele; 
  render(MD.core.router.current()); 
  return;

case "vocab-exercice": {
  MD.core.router.goto("vocabulaireExercices", {
    niveau: btn.dataset.niveau
  });
  return;
}
    case "vocab-speak": {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(btn.dataset.text);
        u.lang = "de-DE";
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
      }
      bindEvents();
      return;
    }
    case "vocab-rate": {
      const q = parseInt(btn.dataset.q, 10);
      const c = vocabSession.cartes[vocabSession.idx];
      MD.modules.vocabulaire.noterCarte(c.cle, c.mot.id, vocabSession.niveau, c.theme.label, q);
      vocabSession.revele = false;
      vocabSession.idx++;
      render(MD.core.router.current());
      return;
    }

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

function afficherErreurFatale(titre, details) {
  const el = document.getElementById("app");
  if (!el) return;
  el.innerHTML = `
    <div style="padding:24px;font-family:sans-serif;background:#2a1414;color:#f2caca;min-height:100vh;box-sizing:border-box;">
      <h1 style="font-size:18px;">⚠️ ${titre}</h1>
      <pre style="white-space:pre-wrap;background:#1a0d0d;padding:12px;border-radius:8px;font-size:12px;overflow-x:auto;">${(details || "").toString().replace(/</g, "&lt;")}</pre>
      <p style="font-size:13px;margin-top:16px;">Envoie une capture de cet écran pour obtenir de l'aide.</p>
    </div>`;
}

window.addEventListener("error", (e) => {
  /* Les navigateurs masquent volontairement les détails ("Script error.",
     sans fichier ni ligne) pour les erreurs venant de scripts tiers
     (polices, extensions, autofill...). Sans fichier ni ligne, on n'a
     aucun diagnostic exploitable et ce n'est presque jamais notre code
     — nos propres scripts, tous en même origine, donnent toujours ces
     informations. On ignore donc ce cas précis pour éviter les fausses
     alertes, et on garde l'alerte pour toute vraie erreur de l'app. */
  if (!e.filename && !e.lineno) return;
  afficherErreurFatale("Erreur JavaScript détectée", `${e.message}\nFichier : ${e.filename}\nLigne : ${e.lineno}`);
});

/* ------------------------------------------------------------------ DÉMARRAGE */
function demarrer() {
  try {
    if (typeof MD === "undefined" || typeof MD.core === "undefined" || typeof MD.models === "undefined" || typeof MD.ui === "undefined") {
      afficherErreurFatale(
        "L'application n'a pas pu se charger",
        "Un ou plusieurs fichiers JavaScript n'ont pas pu être lus depuis cet emplacement (MD non défini). Vérifie que tous les fichiers ont bien été envoyés, sans dossier manquant ni fichier renommé."
      );
      return;
    }
    MD.core.router.onChange(render);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    }
    const profil = MD.models.profil.load();
    MD.core.router.goto(profil.onboarded ? "tableauDeBord" : "onboarding", {}, { isBack: true });
  } catch (e) {
    afficherErreurFatale("Erreur au démarrage", e.stack || e.message);
  }
}

window.addEventListener("DOMContentLoaded", demarrer);
