# AfrikaTrans — Dark Mode

## 1. Modes disponibles

- Clair ;
- Sombre ;
- Système.

Le mode « Système » est le défaut pour l’application mobile.

Pour le site marketing, le mode clair peut rester le premier affichage si aucune préférence n’existe.

## 2. Principes

Le thème sombre ne doit pas être une inversion automatique.

Il doit :

- réduire la fatigue visuelle ;
- conserver la hiérarchie ;
- garder les statuts compréhensibles ;
- éviter le noir pur sur de grandes surfaces ;
- préserver l’identité AfrikaTrans.

## 3. Surfaces

Hiérarchie :

```text
background
surface
surfaceRaised
overlay
```

Ne pas utiliser une seule couleur sombre partout.

## 4. Couleurs

- bleu de marque éclairci ;
- jaune légèrement plus lumineux ;
- texte principal presque blanc ;
- texte secondaire gris bleuté ;
- bordures visibles mais discrètes.

## 5. Contraste

- texte principal : contraste AA ;
- texte secondaire : AA quand il porte une information ;
- texte désactivé identifiable ;
- focus visible ;
- statut non dépendant uniquement de la couleur.

## 6. Composants

### Boutons

Primary :

- fond bleu clair ou bleu de marque adapté ;
- texte très sombre ou blanc selon contraste.

Accent :

- jaune ;
- texte bleu très foncé.

### Champs

- fond distinct de la page ;
- bordure visible ;
- focus clair ;
- erreur perceptible.

### Cartes

- surface surélevée ;
- ombre minimale ;
- bordure légère.

### Tables

- entête distinct ;
- lignes séparées discrètement ;
- survol visible ;
- sélection claire.

### Graphiques

- palette compatible dark ;
- grilles moins contrastées ;
- tooltips lisibles ;
- légendes accessibles.

## 7. Logos

Les logos foncés doivent avoir :

- variante claire ;
- fond de protection ;
- ou conteneur blanc.

Ne jamais appliquer arbitrairement un filtre CSS qui déforme la marque.

## 8. Images et illustrations

Prévoir :

- version sombre ;
- fond transparent ;
- surface dédiée.

## 9. Lottie

Chaque animation doit être vérifiée sur les deux thèmes.

Éviter :

- halos blancs ;
- aplats invisibles ;
- textes intégrés non adaptatifs.

## 10. Statuts

Les couleurs sémantiques doivent rester cohérentes :

- vert succès ;
- bleu information ;
- orange avertissement ;
- rouge erreur.

Toujours associer :

- icône ;
- libellé ;
- couleur.

## 11. Stockage de préférence

Web/admin :

- cookie ou stockage local selon architecture ;
- éviter le flash de mauvais thème en SSR ;
- appliquer le thème avant hydratation.

Mobile :

- préférence locale persistante ;
- écoute du thème système ;
- mise à jour en temps réel.

## 12. Tests

Vérifier :

- tous les écrans ;
- tous les états ;
- modales ;
- bottom sheets ;
- claviers ;
- graphiques ;
- documents ;
- captures ;
- splash ;
- erreurs ;
- offline.
