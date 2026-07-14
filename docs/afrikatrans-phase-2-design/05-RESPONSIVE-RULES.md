# AfrikaTrans — Règles Responsive

## 1. Principe

Le responsive ne consiste pas à réduire les écrans desktop.

Chaque largeur doit conserver :

- la priorité métier ;
- une hiérarchie lisible ;
- des actions accessibles ;
- des informations financières non tronquées.

## 2. Breakpoints web/admin

```text
xs : 0–479
sm : 480–639
md : 640–767
lg : 768–1023
xl : 1024–1279
2xl : 1280–1535
3xl : 1536+
```

Les noms peuvent être adaptés aux breakpoints Tailwind, mais les comportements doivent rester documentés.

## 3. Largeur du contenu

Site :

- maximum : 1280 px ;
- padding mobile : 20 px ;
- padding tablette : 32 px ;
- padding desktop : 40 à 64 px.

Admin :

- contenu fluide ;
- minimum de respiration 24 px ;
- sidebar fixe uniquement si l’espace le permet.

## 4. Mobile

- une colonne ;
- CTA pleine largeur ;
- cartes empilées ;
- bottom sheets ;
- filtres dans un drawer ;
- navigation simplifiée ;
- aucune table complexe.

## 5. Tablette

- une ou deux colonnes ;
- sidebar compacte ou drawer ;
- formulaires en une ou deux colonnes selon complexité ;
- cartes KPI en grille 2 × 2.

## 6. Desktop

- grilles 12 colonnes ;
- sidebar ;
- tableaux ;
- panneaux latéraux ;
- modales ;
- comparaisons côte à côte.

## 7. Très grand écran

Ne pas étirer les textes et formulaires.

- garder des max-width ;
- augmenter les marges ;
- utiliser l’espace pour les panneaux complémentaires ;
- ne pas dépasser une largeur de lecture confortable.

## 8. Formulaires

Mobile :

```text
Label
Champ
Aide
Erreur
```

Desktop :

- deux colonnes uniquement pour des champs indépendants ;
- un montant critique reste sur une seule ligne logique ;
- les résumés financiers peuvent être dans une colonne latérale.

## 9. Tableaux

Sous 768 px :

- transformer en cartes ;
- garder les informations prioritaires ;
- ouvrir le détail pour les données secondaires.

Entre 768 et 1023 px :

- réduire les colonnes ;
- autoriser scroll horizontal ;
- garder actions visibles.

## 10. Modales

Mobile :

- plein écran ou bottom sheet.

Desktop :

- modal centrée ;
- largeur adaptée au contenu.

Actions critiques :

- jamais dans une petite popover.

## 11. Navigation

Site :

- menu horizontal desktop ;
- drawer mobile.

Admin :

- sidebar desktop ;
- sidebar compacte tablette ;
- drawer mobile.

Mobile natif :

- bottom tabs ;
- stack ;
- bottom sheet.

## 12. Images

- ratio défini ;
- `object-fit` ;
- pas de texte important intégré dans une image ;
- sources responsive ;
- optimisation.

## 13. Tests obligatoires

Tester au minimum :

```text
320 × 568
360 × 800
390 × 844
412 × 915
768 × 1024
1024 × 768
1280 × 800
1440 × 900
1920 × 1080
```

Tester également :

- zoom navigateur 200 % ;
- texte agrandi ;
- paysage ;
- clavier ouvert ;
- langue avec texte plus long.
