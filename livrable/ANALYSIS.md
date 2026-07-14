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

## 2. Anti-patterns Vue / Nuxt

- **`console.log` partout** : beaucoup de logs de debug laissés dans le code livré. Il faudrait le nettoyer avant de mettre en prod.

- **`!important` sur tout le CSS de** `app.vue` : Mauvaise pratique car ça rend le style impossible à surcharger.

- **Computed** : plusieurs `computed()` contiennent des `console.log`. Un computed va s'executer à chaque modification de la variable alors les logs s'exécuteront à chaque recalcul.
- **Comparaisons sans égalité stricte** : `==` au lieu de `===` à plusieurs endroits, ce qui peut être source de bugs avec la valeur et logique voulu, il faudrait utiliser l'égalité stricte ici.

- **Styles en inline dans le html** : au lieu d'avoir des classes CSS réutilisables.

- **Mutation d'une prop** dans `TodoItem.vue` : une prop est censé être réçu d'un composant parent afin de l'afficher dans le composant enfant. Là dans le cas de l'app, la prop todo vient du store (todosWithFormattedDates qui vient de filteredTodos qui vient de store.getters.filteredTodos). La prop est muté via `props.todo.completed = !props.todo.completed` puis `v-model="props.todo.completed"`. La logique du toggle est dupliquée, le `store.commit('TOGGLE_TODO', ...)` aurait suffit. Vue affiche un warning en console à cause de cette pratique.

- **Store exposé sur `window.__store__`** : dangereux car un script qui vient par exemple d'une extension navigateur pourrait lire et/ou modifier le state de l'app depuis la console. Il ne faudrait pas garder ça pour une mise en prod.

## 3. Sécurité

**Faille XSS** : toujours dans `TodoItem.vue`, la directive `v-html` affiche le paramètre `text` d'un todo en tant que HTML. Seulement s'il on créé un todo avec comme contenu `<svg onload="alert('Piraté !')">`, ça donne la possiblité d'executer du JS chez d'autres users.

**Solution** : utiliser `{{ todo.text }}` qui est lu comme une value classique, pas comme du HTML brut.

**Supply chain possible** : si le serveur du CDN de Bootstrap se fait pirater et injecte autre chose (JS malvaillant) à la place du fichier d'origine. Car la lien CDN dans la config n'a pas de paramètre `integrity` et donc pas de hash de vérification pour le navigateur.

## 4. Bugs

**Le bouton "Reload direct" duplique la liste des todos avec un texte vide.** :
Après avoir chargé les todos depuis l'API, `ADD_TODO` est utilisé avec l'attribut `title` qui n'existe pas dans l'API donc ça rend `undefined`.
Ce bouton ajoute une copie de toute la liste avec du texte `undefined` au lieu de la
recharger.
**Idée de Correction** : utiliser `item.text` ou appeler `store.dispatch('fetchTodos')` comme le bouton "Recharger depuis l'API" donc il faudrait même garder un seul de ces deux boutons s'ils font la même chose.

**Le toggle n'est pas synchro avec le back-end.** :
`onToggle` ne fait qu'un `store.commit('TOGGLE_TODO', id)` local et pas de call API comme le fait pourtant `onDelete`. Donc dès qu'on actualise la page l'état "coché" repasse à la valeur initiale du serveur.
**Idée de Correction** : appeler l'API `PUT` dans `onToggle`, comme c'est déjà fait pour le delete.

## 5. Structure

- Pas de tests unitaires ou autres, pas de config ESLint/Prettier, pas de CI : rien ne garantit qu'une régression soit détectée avant de review le code.
