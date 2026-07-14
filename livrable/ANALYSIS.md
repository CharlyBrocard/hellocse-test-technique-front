# ANALYSIS

## 1. Technologies obsolètes

### Lodash

Utilisé alors que le JS natif peut suffir pour les actions du type : `_.map`, `_.size`, `_.trim`,`_.isEmpty`, `_.includes`, `_.countBy`,
`_.cloneDeep`...

**Solution** : supprimer la dépendance et utiliser `Array.prototype.map/find/findIndex` (ex: monTableau.find()).

### Moment.js

La version est dépassée car l'outil n'est plus maintenu depuis 2020 et l'équipe recommande de ne pas l'utiliser sur de nouveaux produits "There may be better modern alternatives.". De plus, la version minifiée pèse 67Ko alors que `dayjs` fait 2Ko.

**Solution** :

- Supprimer la dépendance.
- Pour un simple formatage de date, on peut soit utiliser les API natives `Intl.DateTimeFormat` (ex: new Intl.DateTimeFormat("en-US").format(date)).
- S'il faut forcément une dépendance, il existe `dayjs` qui a des performances meilleures que `Momentjs` et l'API est similaire "Fast 2kB alternative to Moment.js with the same modern API" alors le portage pourrait être plus confortable.

### Bootstrap 3.4.1

- La version date de Février 2019 et n'est plus maintenu depuis Juillet 2019.
- Le JS pour Bootstrap 3 (pour les composants modal, dropdown, carousel...) a besoin de jQuery. Et jQuery n'est pas chargé dans le projet.
- Utilisation d'un CDN uniquement et donc pas de dépendance versionnée dans package.json. Ce qui représente un risque si le CDN change d'URL ou s'il crash.
- Dépendance peut-être sur-dimensioné pour la taille du projet.

**Solution** :

- Supprimer le call CDN dans la config nuxt.
- Installer un framework CSS via npm si on veut vraiment une lib (ex: TailwindCSS)

OU

- Faire du CSS custom car l'app est petite.

### Vuex

L'equipe du projet recommande `Pinia` sur la homepage de `vuex`.

**Solution** : Migrer vers `Pinia`.

### vue3-styled-components

Peu maintenu et Vue a un système avec `<style scoped>` natif. Alors que cette dépendance utilise du CSS dans du JS.

**Solution** : Repasser sur des `<style scoped>` (ou Tailwind comme dit au dessus).

### Pas de TS coté composants/store

Les composants et store sont en JS pur alors que le back-end est typé. Donc la doné coté client peut ne pas correspondre à ce que l'API a défini comme type.

**Solution** : Ajouter `lang="ts"` aux `<script setup>` et réutiliser le type `Todo` défini côté back-end.
