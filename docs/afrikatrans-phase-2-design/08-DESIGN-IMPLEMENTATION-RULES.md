# AfrikaTrans — Règles d’implémentation Design

## 1. Principe

Les maquettes et le code doivent utiliser les mêmes tokens.

Aucune valeur visuelle importante ne doit être dupliquée arbitrairement.

## 2. Web et admin

Utiliser :

```text
DaisyUI pour les primitives
Tailwind CSS pour la composition
CSS variables pour les tokens
Lucide React pour les icônes
Lottie pour les animations ciblées
```

Éviter :

- composants HTML dupliqués ;
- couleurs hexadécimales dans les pages ;
- tailles arbitraires répétées ;
- styles inline ;
- logique responsive dispersée.

## 3. Mobile

Utiliser :

```text
React Native StyleSheet ou système de thème centralisé
React Navigation
Lucide React Native
Lottie React Native
tokens partagés
```

Ne pas copier les classes web dans le mobile.

Respecter les conventions natives :

- press states ;
- safe areas ;
- clavier ;
- retour Android ;
- gestes ;
- accessibilité.

## 4. Structure de composants

```text
components/
├── primitives/
├── forms/
├── feedback/
├── data-display/
├── navigation/
├── financial/
├── transaction/
└── domain/
```

## 5. Nommage

- composants : PascalCase ;
- hooks : `useXxx` ;
- tokens : notation sémantique ;
- ne pas nommer un composant par sa couleur.

Bon :

```text
PrimaryButton
SuccessBadge
TransactionSummary
```

Mauvais :

```text
BlueButton
GreenPill
YellowCard
```

## 6. Variantes

Utiliser des variantes contrôlées.

Exemple :

```text
Button
- primary
- secondary
- outline
- ghost
- danger
```

Ne pas créer un composant différent pour chaque écran.

## 7. Formulaires

- React Hook Form ;
- Zod ;
- messages métier ;
- focus sur le premier champ invalide ;
- validation serveur toujours prise en charge ;
- conserver les valeurs en cas d’erreur serveur.

## 8. TanStack

Utiliser TanStack Query pour :

- cache ;
- revalidation ;
- mutations ;
- invalidations ;
- états serveur.

Utiliser TanStack Table pour les listes administratives.

Ne pas utiliser TanStack Query comme stockage global de l’interface.

## 9. Chargement

- skeleton pour listes ;
- spinner pour action courte ;
- écran de progression pour opération financière ;
- message explicite si attente longue.

## 10. Erreurs

Chaque erreur doit répondre à :

1. que s’est-il passé ?
2. quel impact ?
3. que peut faire l’utilisateur ?

Exemple :

> Le transfert n’a pas pu être envoyé. Aucun montant n’a été débité. Réessayez dans quelques instants.

## 11. Données financières

- formatage centralisé ;
- devise toujours affichée ;
- pas de nombre brut ;
- séparateur adapté à la locale ;
- précision maîtrisée ;
- source de vérité backend.

## 12. Captures et documentation

Chaque écran final doit avoir :

- thème clair ;
- thème sombre ;
- mobile si applicable ;
- tablette si applicable ;
- desktop si applicable ;
- état normal ;
- état chargement ;
- état vide ;
- état erreur si pertinent.

## 13. Validation design

Avant intégration :

- cohérence tokens ;
- responsive ;
- dark mode ;
- accessibilité ;
- tous les états ;
- contenu réel ;
- absence de texte tronqué ;
- logique métier conforme.
