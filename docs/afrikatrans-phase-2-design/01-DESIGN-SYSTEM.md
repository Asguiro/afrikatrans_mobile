# AfrikaTrans — Design System

## 1. Nom du système

Nom interne :

> **Afrika UI**

Tous les produits AfrikaTrans utilisent les mêmes fondations, mais chaque plateforme conserve ses conventions natives.

## 2. Couleurs

### 2.1 Couleurs de marque

| Token | Clair | Sombre | Usage |
|---|---:|---:|---|
| `brand.primary` | `#0A2E63` | `#7FB3FF` | actions principales, navigation |
| `brand.primaryHover` | `#082650` | `#9AC3FF` | survol |
| `brand.primarySoft` | `#EAF2FF` | `#102745` | fonds doux |
| `brand.accent` | `#F5B700` | `#FFC83D` | accent de marque |
| `brand.accentHover` | `#DFA600` | `#FFD66B` | survol |
| `brand.accentSoft` | `#FFF7D6` | `#3A300F` | fonds d’accent |

### 2.2 Couleurs sémantiques

| Token | Clair | Sombre |
|---|---:|---:|
| `success` | `#168A4A` | `#55D68A` |
| `successSoft` | `#E7F7EE` | `#123524` |
| `warning` | `#B36B00` | `#FFBC55` |
| `warningSoft` | `#FFF3DF` | `#3A2A12` |
| `error` | `#C63C3C` | `#FF7D7D` |
| `errorSoft` | `#FDECEC` | `#3C1A1A` |
| `info` | `#1677B8` | `#63B8EE` |
| `infoSoft` | `#E9F5FC` | `#102E40` |

### 2.3 Neutres

| Token | Clair | Sombre |
|---|---:|---:|
| `background` | `#F6F8FC` | `#0B1220` |
| `surface` | `#FFFFFF` | `#111B2E` |
| `surfaceRaised` | `#FFFFFF` | `#172338` |
| `textPrimary` | `#10213A` | `#F4F7FB` |
| `textSecondary` | `#5C6B80` | `#A8B4C5` |
| `textMuted` | `#8793A5` | `#7E8B9E` |
| `border` | `#DCE3ED` | `#2A3951` |
| `divider` | `#E9EDF3` | `#233148` |

## 3. Règles de couleur

- Le bleu profond est la couleur principale.
- Le jaune est un accent et ne doit pas couvrir de grandes surfaces.
- Une seule couleur dominante par bloc.
- Les couleurs de statut sont réservées au statut.
- Le texte jaune sur fond blanc est interdit.
- Le jaune sur fond bleu peut être utilisé pour la marque ou un accent très ciblé.
- Toujours respecter le contraste WCAG AA.

## 4. Typographie

Police recommandée :

```text
Inter
```

Alternative :

```text
Manrope
```

Pour l’identité de marque, le logo peut conserver sa propre typographie, mais l’interface ne doit pas utiliser une police décorative.

### Échelle

| Style | Taille | Graisse | Hauteur |
|---|---:|---:|---:|
| Display | 48 px | 700 | 56 px |
| H1 | 36 px | 700 | 44 px |
| H2 | 30 px | 700 | 38 px |
| H3 | 24 px | 650 | 32 px |
| H4 | 20 px | 650 | 28 px |
| Body large | 18 px | 400 | 28 px |
| Body | 16 px | 400 | 24 px |
| Body small | 14 px | 400 | 20 px |
| Caption | 12 px | 500 | 16 px |
| Button | 15–16 px | 600 | 20–24 px |

Mobile :

- titre d’écran : 24 px ;
- titre de section : 18–20 px ;
- corps : 16 px ;
- légende : 13–14 px.

## 5. Espacement

Base :

```text
4 px
```

Échelle :

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96
```

Règles :

- padding mobile horizontal : 20 px ;
- padding cartes : 16 à 24 px ;
- espace entre sections : 32 à 48 px ;
- largeur maximale contenu web : 1200 à 1280 px ;
- largeur de lecture texte : 680 à 760 px.

## 6. Rayons

| Token | Valeur |
|---|---:|
| `radius.sm` | 8 px |
| `radius.md` | 12 px |
| `radius.lg` | 16 px |
| `radius.xl` | 24 px |
| `radius.full` | 999 px |

Règles :

- champs : 12 px ;
- boutons : 12 px ;
- cartes : 16 px ;
- modales importantes : 20 à 24 px.

## 7. Ombres

Utiliser peu d’ombres.

- `shadow.sm` : petites cartes ;
- `shadow.md` : menus, popovers ;
- `shadow.lg` : modales.

En thème sombre, privilégier les différences de surface et les bordures plutôt que des ombres noires.

## 8. Iconographie

Bibliothèque :

```text
Lucide
Lucide React
Lucide React Native
```

Règles :

- trait cohérent ;
- taille standard 20 ou 24 px ;
- 16 px dans les éléments compacts ;
- 32 à 48 px pour les illustrations d’état ;
- ne pas mélanger plusieurs familles d’icônes ;
- toujours ajouter un libellé aux actions critiques.

## 9. Drapeaux et opérateurs

- utiliser des assets SVG ou PNG validés ;
- ne pas utiliser les emoji drapeaux comme élément principal ;
- conserver le ratio du logo opérateur ;
- afficher le pays avec son nom et son indicatif ;
- ne jamais dépendre uniquement du drapeau.

## 10. Boutons

### Variantes

- `Primary`
- `Secondary`
- `Outline`
- `Ghost`
- `Danger`
- `Link`

### Tailles

- small : 36 px ;
- medium : 44 px ;
- large : 52 px.

### États

- default ;
- hover ;
- pressed ;
- focus ;
- disabled ;
- loading.

Règles :

- un bouton primaire par zone de décision ;
- largeur totale sur mobile pour les actions de parcours ;
- icône à gauche si elle améliore la compréhension ;
- loader dans le bouton sans modifier sa largeur.

## 11. Champs

Types :

- texte ;
- téléphone ;
- montant ;
- mot de passe ;
- OTP ;
- PIN ;
- recherche ;
- select pays ;
- select opérateur ;
- date ;
- upload ;
- textarea.

Chaque champ doit gérer :

- label ;
- valeur ;
- placeholder ;
- aide ;
- erreur ;
- succès ;
- désactivé ;
- lecture seule ;
- chargement.

Règles :

- ne jamais utiliser le placeholder comme seul label ;
- messages d’erreur spécifiques ;
- clavier numérique pour téléphone, OTP, PIN et montant ;
- formatage visuel des numéros et montants.

## 12. Cartes

Types :

- résumé financier ;
- transaction ;
- bénéficiaire ;
- indicateur ;
- alerte ;
- aide ;
- opérateur ;
- pays.

Une carte doit avoir une fonction, pas uniquement encadrer du contenu.

## 13. États transactionnels

| Statut | Couleur | Libellé |
|---|---|---|
| Draft | neutre | Brouillon |
| Pending | info | En attente |
| Processing | info | En cours |
| Success | succès | Argent reçu |
| Failed | erreur | Échec |
| Cancelled | neutre | Annulé |
| Refund pending | avertissement | Remboursement en cours |
| Refunded | succès | Remboursé |
| Expired | neutre | Expiré |

## 14. Feedback

Utiliser :

- toast pour confirmation légère ;
- banner pour information persistante ;
- inline error pour un champ ;
- modal pour décision importante ;
- full-screen state pour succès de transfert ;
- skeleton pour chargement de contenu.

## 15. Lottie

Utilisations autorisées :

- splash ;
- transfert en cours ;
- succès ;
- échec ;
- absence de données ;
- vérification d’identité ;
- connexion perdue.

Règles :

- animation courte ;
- pas d’animation permanente ;
- respecter « réduire les animations » ;
- prévoir une image statique de remplacement.

## 16. Accessibilité

- contraste AA minimum ;
- zones tactiles de 44 × 44 px minimum ;
- labels accessibles ;
- ordre de focus logique ;
- navigation clavier sur web/admin ;
- lecteur d’écran ;
- erreurs non communiquées uniquement par couleur ;
- support du zoom texte ;
- animations réduites.
