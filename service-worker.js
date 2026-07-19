const CACHE_NAME = "mein-deutsch-v2-plat-shell-11";
const APP_SHELL = [
  "./", "./index.html", "./manifest.json", "./style.css",
  "./icon-192.png", "./icon-512.png",
  "./constants.js", "./storage.js", "./srs.js",
  "./progression.js", "./stats.js", "./backup.js", "./router.js",
  "./profil.model.js", "./vocabulaire.model.js", "./vocabulaire.exercices.js", "./expressions.model.js",
  "./phrasesModeles.model.js", "./grammaire.model.js", "./conjugaison.model.js",
  "./phonetique.model.js", "./hoeren.model.js", "./lesen.model.js",
  "./schreiben.model.js", "./sprechen.model.js", "./bibliothequeDialogues.model.js",
  "./examens.model.js", "./pflege.model.js", "./vivreEnAllemagne.model.js",
  "./revision.model.js", "./dictionnairePersonnel.model.js", "./carnetVerbes.model.js",
  "./tableauDeBord.model.js",
  "./registre-modules.js", "./screens.js",
  "./vocabulaire.logic.js", "./contenu.A1.js", "./contenu.A2.js",
  "./app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      })).catch(() => caches.match("./index.html"))
    );
    return;
  }
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
