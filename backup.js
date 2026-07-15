/* ==================================================================
   MEIN DEUTSCH — MOTEUR DE SAUVEGARDE (EXPORT / IMPORT)
   S'appuie uniquement sur MD.core.storage.getAll() / setAll(). Ne
   connaît aucun contenu pédagogique — traite les 19 namespaces comme
   des blocs opaques, ce qui garantit qu'un export/import futur reste
   valable même quand les modules 3 à 18 auront été remplis de
   contenu.
   ================================================================== */

MD.core.backup = (function () {
  function buildManifest() {
    return {
      app: "Mein Deutsch",
      schemaVersion: MD.SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      modules: MD.ALL_MODULE_IDS,
    };
  }

  /** Télécharge un fichier .json contenant l'intégralité des données locales. */
  function exportAll() {
    const bundle = {
      manifest: buildManifest(),
      data: MD.core.storage.getAll(),
    };
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mein-deutsch-sauvegarde-${MD.core.today()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /** Valide la structure d'un fichier avant import (ne restaure rien si invalide). */
  function validate(parsed) {
    if (!parsed || typeof parsed !== "object") return "Fichier invalide.";
    if (!parsed.manifest || !parsed.data) return "Ce fichier ne provient pas d'une sauvegarde Mein Deutsch.";
    if (parsed.manifest.schemaVersion > MD.SCHEMA_VERSION) {
      return "Cette sauvegarde provient d'une version plus récente de l'application.";
    }
    return null; // pas d'erreur
  }

  /** Lit un fichier importé par l'utilisateur et restaure toutes les données. */
  function importAll(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        let parsed;
        try {
          parsed = JSON.parse(reader.result);
        } catch (e) {
          reject(new Error("Le fichier n'est pas un JSON valide."));
          return;
        }
        const error = validate(parsed);
        if (error) {
          reject(new Error(error));
          return;
        }
        const ok = MD.core.storage.setAll(parsed.data);
        if (ok) resolve(parsed.manifest);
        else reject(new Error("Échec de l'écriture locale pendant l'import."));
      };
      reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
      reader.readAsText(file);
    });
  }

  return { exportAll, importAll, buildManifest, validate };
})();
