# AfrikaTrans — Vision Design

## 1. Objectif

La Phase 2 transforme les maquettes historiques d’AfrikaTrans en une expérience fintech panafricaine moderne, rassurante, cohérente et prête à être implémentée sur :

- le site web public et transactionnel ;
- l’application mobile React Native CLI avec React Navigation ;
- le tableau d’administration ;
- les écrans responsive ;
- les thèmes clair et sombre.

Le design doit inspirer immédiatement :

1. la confiance ;
2. la simplicité ;
3. la transparence ;
4. la rapidité ;
5. la sécurité ;
6. la proximité africaine.

## 2. Positionnement visuel

AfrikaTrans ne doit pas ressembler à un ancien portail de transfert d’argent ni à un simple formulaire bancaire.

La direction visuelle retenue est :

> **Fintech panafricaine premium, accessible, humaine et technologique.**

Le produit doit être :

- épuré sans être froid ;
- coloré sans être surchargé ;
- africain sans utiliser de clichés visuels ;
- professionnel sans paraître complexe ;
- moderne sans sacrifier la lisibilité ;
- animé avec mesure.

## 3. Principes UX

### 3.1 Une action principale par écran

Chaque écran doit avoir un objectif dominant.

Exemples :

- « Commencer un transfert »
- « Continuer »
- « Confirmer et payer »
- « Vérifier mon identité »
- « Télécharger le reçu »

Les actions secondaires doivent être visuellement moins fortes.

### 3.2 Montrer avant de demander

Avant une confirmation financière, toujours afficher :

- le pays source ;
- l’opérateur source ;
- le pays destinataire ;
- l’opérateur destinataire ;
- le bénéficiaire ;
- le montant envoyé ;
- les frais ;
- le taux de conversion ;
- le montant reçu ;
- le total à payer ;
- le délai estimé.

### 3.3 Rendre le statut compréhensible

Ne jamais afficher uniquement un code technique.

Exemple :

- `PROCESSING` → « Transfert en cours »
- `SUCCESS` → « Argent reçu »
- `FAILED` → « Échec du transfert »
- `REFUND_PENDING` → « Remboursement en cours »

### 3.4 Concevoir pour les contraintes réelles

Le produit doit rester utilisable avec :

- connexion lente ;
- petits écrans Android ;
- forte luminosité extérieure ;
- utilisateur peu familier des services financiers ;
- saisie fréquente de numéros de téléphone ;
- changements de pays et de devises.

### 3.5 Réduire le risque d’erreur

Avant le paiement :

- résumé complet ;
- nom du bénéficiaire mis en évidence ;
- numéro formaté ;
- bouton de modification ;
- avertissement clair mais non anxiogène.

## 4. Personnalité de marque

AfrikaTrans doit être perçue comme :

- fiable ;
- rapide ;
- transparente ;
- proche ;
- ambitieuse ;
- panafricaine ;
- sécurisée.

Le ton éditorial doit être :

- direct ;
- simple ;
- chaleureux ;
- rassurant ;
- précis.

## 5. Signature de marque

Signature conservée :

> **Au-delà des frontières**

Elle peut être accompagnée par un message produit plus explicite :

> Envoyez de l’argent simplement, partout en Afrique.

## 6. Références d’expérience

Le niveau de finition attendu est proche des meilleures applications fintech :

- simplicité des parcours de Wave ;
- clarté des montants de Wise ;
- sobriété des formulaires Stripe ;
- qualité des tableaux de bord modernes SaaS ;
- animations discrètes de Lottie ;
- iconographie cohérente Lucide.

Il ne s’agit pas de copier ces produits, mais de reprendre leurs bonnes pratiques.

## 7. Piliers du design

| Pilier | Traduction visuelle |
|---|---|
| Confiance | bleu profond, espaces généreux, informations structurées |
| Rapidité | parcours courts, actions visibles, feedback immédiat |
| Transparence | détail des frais, taux et montants avant confirmation |
| Afrique | identité de marque, pays, devises et opérateurs valorisés |
| Sécurité | confirmations, statuts explicites, traces et reçus |
| Accessibilité | contraste, tailles lisibles, zones tactiles confortables |

## 8. Anti-patterns interdits

- formulaires longs sans étapes ;
- plusieurs boutons primaires sur le même écran ;
- texte centré sur de longs paragraphes ;
- couleurs de statut utilisées comme décoration ;
- informations financières ambiguës ;
- frais cachés ;
- icônes sans libellé lorsque leur sens n’est pas évident ;
- tableaux impossibles à utiliser sur mobile ;
- animations permanentes ;
- dégradés excessifs ;
- ombres lourdes ;
- bordures sur chaque élément ;
- écrans blancs sans hiérarchie ;
- écrans surchargés de cartes.

## 9. Résultat attendu

La Phase 2 doit fournir une base assez précise pour :

- concevoir tous les écrans ;
- générer des maquettes cohérentes ;
- préparer Cursor ;
- implémenter les composants sans réinventer les règles ;
- maintenir une cohérence entre web, mobile et administration.
