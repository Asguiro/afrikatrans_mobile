# AfrikaTrans — Cycle de vie d’une transaction

## 1. Statuts principaux

### DRAFT
Parcours commencé mais non confirmé.

### QUOTED
Un devis valide a été généré.

### PENDING_CONFIRMATION
En attente de confirmation utilisateur.

### AUTHORIZED
Authentification forte réussie.

### PAYMENT_PENDING
Débit source demandé.

### PAYMENT_CONFIRMED
Débit source confirmé.

### PAYOUT_PENDING
Crédit bénéficiaire demandé.

### PROCESSING
Traitement en cours chez un opérateur.

### SUCCESS
Bénéficiaire crédité et opération finalisée.

### FAILED
Échec définitif sans traitement complémentaire automatique.

### REQUIRES_REVIEW
Intervention humaine nécessaire.

### REFUND_PENDING
Remboursement demandé.

### REFUNDED
Remboursement confirmé.

### PARTIALLY_REFUNDED
Remboursement partiel confirmé.

### CANCELLED
Annulation autorisée avant engagement financier.

### EXPIRED
Devis ou opération expiré.

## 2. Transitions autorisées

```text
DRAFT
  -> QUOTED
  -> CANCELLED

QUOTED
  -> PENDING_CONFIRMATION
  -> EXPIRED

PENDING_CONFIRMATION
  -> AUTHORIZED
  -> CANCELLED
  -> EXPIRED

AUTHORIZED
  -> PAYMENT_PENDING
  -> FAILED

PAYMENT_PENDING
  -> PAYMENT_CONFIRMED
  -> PROCESSING
  -> FAILED
  -> REQUIRES_REVIEW

PAYMENT_CONFIRMED
  -> PAYOUT_PENDING
  -> REQUIRES_REVIEW

PAYOUT_PENDING
  -> SUCCESS
  -> PROCESSING
  -> FAILED
  -> REQUIRES_REVIEW

FAILED
  -> REFUND_PENDING si débit confirmé

REFUND_PENDING
  -> REFUNDED
  -> PARTIALLY_REFUNDED
  -> REQUIRES_REVIEW
```

## 3. Règles de transition

- une transition doit être validée côté backend ;
- aucune transition arbitraire depuis l’interface ;
- toute transition génère un événement ;
- toute transition conserve sa source : système, opérateur, webhook ou administrateur ;
- les statuts terminaux ne sont modifiables que par des processus autorisés.

## 4. Événements

Exemples :

- `transfer.created` ;
- `quote.created` ;
- `transfer.authorized` ;
- `source.debit.requested` ;
- `source.debit.confirmed` ;
- `destination.credit.requested` ;
- `destination.credit.confirmed` ;
- `transfer.succeeded` ;
- `transfer.failed` ;
- `refund.requested` ;
- `refund.completed`.

## 5. Données d’un événement

- id ;
- transactionId ;
- type ;
- ancien statut ;
- nouveau statut ;
- source ;
- payload normalisé ;
- référence opérateur ;
- date ;
- corrélation ;
- acteur.

## 6. Timeouts

Chaque intégration possède :

- un timeout technique ;
- un délai métier ;
- une stratégie de retry ;
- un seuil de bascule en revue manuelle.

## 7. Réconciliation

Une transaction peut être rapprochée comme :

- concordante ;
- absente chez l’opérateur ;
- absente chez AfrikaTrans ;
- montant différent ;
- statut différent ;
- doublon suspect.
