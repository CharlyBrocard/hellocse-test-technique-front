# MIGRATION

## Objectif

Le but est de nettoyer l'app en rapport avec les points analysés dans le fichier `ANALYSIS.md` car la stack de l'app est correcte (Vue 3 + Nuxt 4).

| Sujet             | Actuel                 | Cible                                                             | Pourquoi                                                                                                                                                                                            |
| ----------------- | ---------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| State management  | Vuex 4                 | **Pinia**                                                         | Recommandation officielle de Vue/Nuxt, meilleur support TypeScript, intégré nativement à Nuxt.                                                                                                      |
| Format des dates  | moment.js              | **dayjs** (ou `Intl.DateTimeFormat`/`RelativeTimeFormat` natif)   | momentjs est en maintenance depuis 2020. dayjs a une API quasi identique donc migration confortable, et est plus léger. L'API `Intl` native évite une dépendance.                                   |
| Utils             | lodash                 | **JS natif**                                                      | Toutes les fonctions utilisées (`map`, `find`, `trim`, `includes`...) ont un équivalent en JS natif. Supprimer la dépendance réduit le bundle sans rien perdre en lisibilité.                       |
| Styles composants | vue3-styled-components | **`<style scoped>`**                                              | Pas cohérent dans l'écosystème Vue, peu maintenu.                                                                                                                                                   |
| CSS globale       | Bootstrap 3 en CDN     | **CSS custom** (ou Tailwind si l'équipe préfère un utility-first) | Bootstrap 3.4.1 est obsolète (2019) et son JS est cassé ici à cause de jQuery. Etant donné que l'app est petite, un peu de CSS maison suffit et sinon Tailwind s'installe via npm et donc sans CDN. |
| Typage            | JS pur côté front      | **TypeScript** (`<script setup lang="ts">`)                       | Le back-end est déjà typé (`Todo` dans `todoRepository.ts`) ; typer le front permet d'éviter les bugs de forme de données.                                                                          |
| Qualité du code   | Aucun                  | **ESLint + Prettier + Vitest**                                    | Nécessaire pour migrer sans regressions.                                                                                                                                                            |

## Comment faire ?

L'idée c'est de migrer petit à petit via des étapes vérifiées et testées, pour que l'app soit stable à chaque étape. Car actuellement il n'y a aucun test unitaire pour nous alerter d'une regression lors de la migration.

### 1. Un peu de config

- Ajout de ESlint et Prettier
- Ajout de config de test de base de Vue 3 + Vitest

### 2. Correction de bugs

Corriger les bugs remontés dans `ANALYSIS.md`.

### 3. Remplacement des dépendances "faciles"

Changer les dépendances qui n'ont pas un impact lourd sur le fonctionement de l'app.

- momentjs vers dayjs
- lodash vers du js natif
- vue3-styled-components vers du style scoped
- Retirer le CDN Bootstrap
- Nettoyer le CSS de app.vue (!important)

A faire avec un commit pour chaque étape, toujours pour garder une stabilité et des points de rappel en cas de regression.

### 4. State management

Passer de Vuex à Pinia. Une étape plus impactante, c'est à faire de façon progressive.

- Créer le store avec Pinia en reprenant les mêmes comportement que l'actuel.
- Modifier les composants un par un pour qu'ils utilisent le nouveau store.
- Supprimer Vuex de l'app
- Nettoyer la logique si besoin

### 5. TypeScript

Ajouter une notion de typage dans le front progressivement.

- Créer un type todo qui sera partagé pour le back-end et pour le nouveau store Pinia.
- Convertir les composants en `<script setup lang="ts">` et les valider un par un.
- Typer les props des composants (todo: Todo)

### 6. Nettoyage

- Supprimer les `console.log`
- Supprimer le `window._store_`

### Comment prioriser ?

- 1. Correction de bugs car ça demande un faible effort et l'impact est direct
- 2. Config, pour sécuriser avant de modifier le code (éviter les regressions)
- 3. Remplacement des dépendances "faciles", changements faciles à vérifier un par un
- 4. State management (Pinia), chantier plus lourd

Faire un commit à chaque étape ou même créer une branche dédiée s'il le faut afin de maitriser la migration et garder une app stable.
