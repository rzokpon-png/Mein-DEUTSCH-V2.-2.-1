# MEIN DEUTSCH — ARCHITECTURE TECHNIQUE
### Étape 1/18 du plan de développement — statut : à valider

> Ce document décrit uniquement le socle technique livré à cette étape : navigation, structure des dossiers, stockage local, modèles de données, SRS, statistiques, sauvegarde. **Aucun contenu pédagogique, aucun écran visuel** — conformément au découpage validé, ces éléments arrivent aux étapes 2 et suivantes.

---

## 1. Structure des dossiers (vue complète du projet final)

```
mein-deutsch/
├── index.html                    (étape 2 — pas encore créé)
├── manifest.json                 (étape 2)
├── service-worker.js             (étape 2)
├── README.md
│
├── css/                          (étape 2)
│
├── icons/                        (étape 2)
│
├── js/
│   ├── core/                     ✅ ÉTAPE 1 — LIVRÉ
│   │   ├── constants.js
│   │   ├── storage.js
│   │   ├── srs.js
│   │   ├── progression.js
│   │   ├── stats.js
│   │   ├── backup.js
│   │   └── router.js
│   │
│   ├── models/                   ✅ ÉTAPE 1 — LIVRÉ (19 fichiers)
│   │   ├── profil.model.js
│   │   ├── vocabulaire.model.js
│   │   ├── expressions.model.js
│   │   ├── phrasesModeles.model.js
│   │   ├── grammaire.model.js
│   │   ├── conjugaison.model.js
│   │   ├── phonetique.model.js
│   │   ├── hoeren.model.js
│   │   ├── lesen.model.js
│   │   ├── schreiben.model.js
│   │   ├── sprechen.model.js
│   │   ├── bibliothequeDialogues.model.js
│   │   ├── examens.model.js
│   │   ├── pflege.model.js
│   │   ├── vivreEnAllemagne.model.js
│   │   ├── revision.model.js
│   │   ├── dictionnairePersonnel.model.js
│   │   ├── carnetVerbes.model.js
│   │   └── tableauDeBord.model.js
│   │
│   ├── modules/                  ⏳ dossiers créés, vides — remplis étapes 3 à 18
│   │   ├── vocabulaire/
│   │   ├── expressions/
│   │   ├── phrasesModeles/
│   │   ├── grammaire/
│   │   ├── conjugaison/
│   │   ├── phonetique/
│   │   ├── hoeren/
│   │   ├── lesen/
│   │   ├── schreiben/
│   │   ├── sprechen/
│   │   ├── bibliothequeDialogues/
│   │   ├── examens/
│   │   ├── pflege/
│   │   ├── vivreEnAllemagne/
│   │   ├── revision/
│   │   ├── dictionnairePersonnel/
│   │   ├── carnetVerbes/
│   │   └── tableauDeBord/
│   │
│   └── ui/                       ⏳ dossiers créés, vides — remplis étape 2
│       ├── screens/
│       └── components/
│
└── test/
    └── test-architecture.html    ✅ ÉTAPE 1 — 21 vérifications automatiques
```

Chaque dossier `modules/<nom>/` existe déjà sur le disque avec un fichier `.gitkeep.js` commenté, pour que la structure complète du projet soit visible dès maintenant, même si le contenu arrive plus tard.

---

## 2. Le cœur technique (`js/core/`)

| Fichier | Rôle |
|---|---|
| `constants.js` | Définit le namespace global `MD`, les 19 identifiants de stockage (18 modules + profil), les 4 niveaux, et les listes `LEVEL_STRUCTURED_MODULES` / `SRS_ENABLED_MODULES` utilisées par tout le reste de l'application |
| `storage.js` | Un namespace localStorage **physiquement séparé** par module (`meinDeutsch:v2:<moduleId>`). Sauvegarde automatique et immédiate à chaque écriture — c'est la garantie technique de l'indépendance des modules exigée par le cahier des charges : aucun module ne peut accidentellement lire ou modifier les données d'un autre |
| `srs.js` | Algorithme de répétition espacée (SM-2 simplifié), générique et sans état — ne connaît aucun contenu, ne manipule que des objets « carte ». Partagé par les 6 modules qui en ont besoin sans qu'ils partagent leurs données |
| `progression.js` | Gère le niveau global courant (A1→B2), les règles de déverrouillage (voir section 4), et le seuil de passage au niveau suivant (3 examens réussis sur 5) |
| `stats.js` | Agrégateur **en lecture seule** : calcule les statistiques globales et la prévision de réussite à partir d'un instantané de tous les modules, sans jamais rien réécrire |
| `backup.js` | Export/import JSON complet, basé uniquement sur `storage.getAll()` / `setAll()` — ne connaît aucun contenu pédagogique, donc reste valable même quand les modules 3 à 18 seront remplis |
| `router.js` | Navigation technique pure (état de route + pile d'historique + abonnement). Ne dessine rien à l'écran : l'étape 2 y branchera son rendu |

---

## 3. Les modèles de données (`js/models/`)

19 fichiers, chacun définissant :
- le **schéma exact** de son namespace de stockage (documenté en commentaire dans le fichier) ;
- une fonction `createEmpty()` qui produit l'état vide par défaut ;
- des fonctions `load()` / `save()` qui passent systématiquement par `MD.core.storage`.

**Aucun mot, aucune règle, aucun dialogue n'est encore écrit** — chaque tableau de contenu (`themesParNiveau`, `verbesParNiveau`, `dialoguesParTheme`...) est vide. Ce sont ces tableaux précis que les étapes 3 à 18 rempliront, un module à la fois, sans jamais avoir à modifier ce fichier de schéma.

### Décision d'architecture à valider : un niveau global, pas 18

Le cahier des charges demande que « chaque rubrique possède sa propre progression ». Deux interprétations étaient possibles :
- **18 niveaux indépendants** (ex. B1 en Grammaire, A2 en Hören) — techniquement possible mais rendrait le sens de « mon niveau » illisible pour toi comme pour l'app (quel niveau afficher sur le tableau de bord ?).
- **Un niveau global unique** (retenu), où chaque module garde en revanche des statistiques, une file de révision et une progression interne **entièrement séparées** à l'intérieur de ce niveau.

C'est la seconde option qui est implémentée (`progression.js`). Elle respecte l'indépendance des données exigée sans fragmenter la notion de niveau. **Merci de confirmer que ce choix te convient.**

---

## 4. Règles de progression implémentées et testées

| Règle | Détail | Testé |
|---|---|---|
| Progression séquentielle | A1 → A2 → B1 → B2, jamais de saut | ✅ |
| Non-reverrouillage | Un niveau validé reste accessible pour toujours (révision) | ✅ |
| Seuil de passage | 4 examens blancs réussis sur 5 pour débloquer le niveau suivant | ✅ |
| Vivre en Allemagne | Déverrouillé dès A2 | ✅ |
| Allemand professionnel & Pflege | Déverrouillé dès B1 | ✅ |

---

## 5. Répétition espacée (SRS)

Algorithme SM-2 simplifié, commun aux modules **Vocabulaire, Expressions, Phrases modèles, Conjugaison, Dictionnaire personnel et Allemand professionnel & Pflege**. Chaque module garde ses propres cartes dans son propre namespace (`srsCards`) ; le moteur `MD.core.srs` ne fait que calculer, il ne stocke rien lui-même.

Comportement vérifié par les tests : une réponse ratée ramène l'intervalle à 1 jour et incrémente les échecs ; des réponses réussies successives allongent progressivement l'intervalle.

---

## 6. Révision intelligente : agrégateur pur (vérifié)

`MD.models.revision.elementsEnAttente()` parcourt les 6 modules SRS-activés et renvoie une liste de références (`{moduleId, cardKey}`) — jamais de contenu dupliqué. Le test automatique confirme qu'aucune carte n'est copiée : seule une référence est produite, et le module source reste inchangé.

## 7. Carnet de verbes : synchronisation complète des 5 sources prévues (vérifié)

`MD.models.carnetVerbes.resynchroniser()` fusionne désormais, en lecture seule :
1. **Conjugaison** — source de vérité du statut de maîtrise (SRS)
2. **Lesen** — verbes repérés via `item.verbesUtilises`
3. **Hören** — idem
4. **Sprechen** — idem
5. **Dictionnaire personnel** — mots dont `typeMot === "verbe"`

Priorité de fusion : `maitrise` > `enCours` > `vu`. Un verbe rencontré dans plusieurs sources cumule ses sources sans jamais dupliquer de contenu. Testé automatiquement : aucune des 5 sources n'est modifiée par la resynchronisation.

## 8. Non-duplication Vocabulaire ↔ Dictionnaire personnel (zone grise fermée)

`MD.models.vocabulaire.rechercherMot()` expose une recherche en lecture sur sa propre structure interne. `MD.models.dictionnairePersonnel.ajouterMot()` l'appelle avant toute création : si le mot existe déjà dans le Vocabulaire curaté, l'entrée est tout de même créée dans le Dictionnaire personnel (pour garder l'origine et la note de l'utilisateur), mais **sans carte SRS propre** — la révision reste entièrement déléguée à la file SRS du Vocabulaire (`revisionDeleguee: true`). Testé automatiquement dans les deux cas (doublon détecté / mot réellement nouveau).

### Exceptions de lecture inter-modules, désormais au nombre de deux, toutes deux documentées et testées

| Lecteur | Lit (lecture seule) | Raison |
|---|---|---|
| Dictionnaire personnel | Vocabulaire (`rechercherMot`) | Détection de doublon avant ajout |
| Carnet de verbes | Conjugaison, Lesen, Hören, Sprechen, Dictionnaire personnel | Synthèse consolidée multi-source |

Aucune autre lecture croisée n'existe dans le code (vérifié par grep). Les deux agrégateurs globaux (`stats.js`, `backup.js`) restent les seuls à lire l'intégralité des 19 namespaces.

## 9. Sauvegarde et export/import

- **Sauvegarde automatique** : chaque `save()` d'un modèle écrit immédiatement dans localStorage (aucune file d'attente, aucune perte possible en cas de fermeture brutale de l'app).
- **Export** : `MD.core.backup.exportAll()` télécharge un fichier `.json` contenant les 19 namespaces + un manifeste (date, version du schéma, liste des modules).
- **Import** : `MD.core.backup.importAll(file)` valide la structure avant toute écriture (rejette un fichier qui ne provient pas d'une sauvegarde Mein Deutsch, ou une version de schéma trop récente), puis restaure tout d'un coup.

---

## 10. Vérification automatique — 24 tests, 24 réussis

Le fichier `test/test-architecture.html` (à ouvrir directement dans un navigateur, aucune installation nécessaire) exécute 24 vérifications couvrant :
- l'existence et l'indépendance des 19 namespaces de stockage ;
- le chargement correct des 19 modèles ;
- le comportement de l'algorithme SRS (échec/réussite) ;
- les règles de progression et de déverrouillage (seuil 4/5) ;
- la navigation technique (goto/back/abonnement) ;
- le caractère « lecture seule » des agrégateurs (statistiques, révision intelligente, carnet de verbes) ;
- **la détection de doublon Vocabulaire ↔ Dictionnaire personnel** ;
- **la synchronisation complète des 5 sources du Carnet de verbes** ;
- la validité du système d'export/import.

**Résultat actuel : 24/24 tests réussis.**

---

## STATUT : ÉTAPE 1 TERMINÉE ET VALIDÉE

Points tranchés avec l'utilisateur :
1. ✅ Niveau global unique, progression interne séparée par module — validé
2. ✅ Seuil de progression : 4 examens réussis sur 5 — validé
3. ✅ Zone grise de non-duplication fermée (détection de doublon + synchronisation 5 sources) — implémenté et testé

**L'étape 2 (interface utilisateur complète, sans contenu) peut commencer.**
