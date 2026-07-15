/* ==================================================================
   MEIN DEUTSCH — MOTEUR DE STOCKAGE LOCAL
   Chaque module lit et écrit UNIQUEMENT dans son propre namespace
   localStorage (meinDeutsch:v2:<moduleId>). Rien n'est partagé au
   niveau du stockage : c'est la garantie technique de l'indépendance
   des 18 modules définie dans le cahier des charges.
   Toute écriture est immédiate (pas de file d'attente) : c'est la
   "sauvegarde automatique locale" exigée par le cahier des charges.
   ================================================================== */

MD.core.storage = (function () {
  function key(moduleId) {
    return MD.STORAGE_PREFIX + moduleId;
  }

  /** Lit les données d'un module. Retourne null si jamais initialisé. */
  function get(moduleId) {
    try {
      const raw = localStorage.getItem(key(moduleId));
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.error(`[storage] Lecture impossible pour "${moduleId}" :`, e);
      return null;
    }
  }

  /** Écrit les données d'un module. Sauvegarde automatique et immédiate. */
  function set(moduleId, data) {
    try {
      localStorage.setItem(key(moduleId), JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`[storage] Écriture impossible pour "${moduleId}" :`, e);
      return false;
    }
  }

  function remove(moduleId) {
    localStorage.removeItem(key(moduleId));
  }

  /** Lit tous les namespaces connus. Utilisé par l'export et le tableau de bord. */
  function getAll() {
    const out = {};
    MD.ALL_MODULE_IDS.forEach((id) => {
      out[id] = get(id);
    });
    return out;
  }

  /** Écrit tous les namespaces d'un coup. Utilisé par l'import. */
  function setAll(bundle) {
    let ok = true;
    MD.ALL_MODULE_IDS.forEach((id) => {
      if (bundle[id] !== undefined && bundle[id] !== null) {
        ok = set(id, bundle[id]) && ok;
      }
    });
    return ok;
  }

  /** Réinitialisation complète (Réglages → Réinitialiser). */
  function clearAll() {
    MD.ALL_MODULE_IDS.forEach((id) => remove(id));
  }

  /** Initialise un module avec sa valeur par défaut s'il n'existe pas encore. */
  function ensure(moduleId, factoryFn) {
    const existing = get(moduleId);
    if (existing) return existing;
    const fresh = factoryFn();
    set(moduleId, fresh);
    return fresh;
  }

  return { get, set, remove, getAll, setAll, clearAll, ensure };
})();
