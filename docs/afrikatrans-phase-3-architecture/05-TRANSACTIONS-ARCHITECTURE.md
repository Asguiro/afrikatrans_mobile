# AfrikaTrans — Architecture des transactions

## 1. Principe

Une transaction financière ne doit jamais dépendre d’un unique appel HTTP long.

Le processus est orchestré et persistant.

## 2. Étapes

```text
1. Générer un devis
2. Créer une transaction
3. Confirmer
4. Initier le débit
5. Attendre la confirmation
6. Initier le paiement bénéficiaire
7. Attendre la confirmation
8. Finaliser
9. Notifier
10. Produire le reçu
```

## 3. États

```text
DRAFT
QUOTED
PENDING_PAYMENT
PAYMENT_PROCESSING
PAYMENT_CONFIRMED
PROCESSING
PAYOUT_PROCESSING
SUCCESS
FAILED
CANCELLED
REFUND_PENDING
REFUNDED
EXPIRED
MANUAL_REVIEW
```

## 4. Machine à états

Transitions autorisées :

```text
DRAFT
→ QUOTED
→ PENDING_PAYMENT
→ PAYMENT_PROCESSING
→ PAYMENT_CONFIRMED
→ PROCESSING
→ PAYOUT_PROCESSING
→ SUCCESS
```

Branches :

```text
PAYMENT_PROCESSING
→ FAILED

PAYMENT_CONFIRMED
→ MANUAL_REVIEW

PAYOUT_PROCESSING
→ FAILED

FAILED
→ REFUND_PENDING
→ REFUNDED
```

Toute transition passe par un service central.

## 5. Idempotence

La création exige :

```http
Idempotency-Key
```

Le serveur :

1. recherche la clé ;
2. renvoie le résultat existant si déjà traité ;
3. bloque la duplication ;
4. persiste la clé avec la transaction.

## 6. Verrouillage

Pour éviter deux traitements :

- verrou Redis ;
- verrou base ;
- contrôle de version ;
- transition atomique.

Exemple :

```sql
UPDATE transaction
SET status = 'PROCESSING'
WHERE id = ?
AND status = 'PAYMENT_CONFIRMED'
```

## 7. Orchestration

Le service `TransactionOrchestrator` :

- valide l’état ;
- lance les étapes ;
- enregistre les transitions ;
- pousse les jobs ;
- publie les événements.

Il ne fait pas de requête opérateur directement.

## 8. Paiement source

Interface :

```ts
interface DebitGateway {
  initiate(input: DebitRequest): Promise<DebitResult>;
  getStatus(reference: string): Promise<DebitStatus>;
}
```

## 9. Payout

```ts
interface PayoutGateway {
  initiate(input: PayoutRequest): Promise<PayoutResult>;
  getStatus(reference: string): Promise<PayoutStatus>;
}
```

## 10. Webhooks

Flux :

```text
Opérateur
↓
Webhook Controller
↓
Validation signature
↓
ProviderEvent persisté
↓
Job BullMQ
↓
Normalisation
↓
Transition métier
↓
Notification
```

## 11. Polling

Si l’opérateur n’a pas de webhook fiable :

- polling ;
- intervalle progressif ;
- limite ;
- passage en revue manuelle.

## 12. Retry

Retry uniquement si l’opération est sûre.

Jamais de retry aveugle sur une action pouvant créer un double débit ou double payout.

Chaque retry doit utiliser :

- référence opérateur ;
- clé idempotente ;
- vérification préalable.

## 13. Échecs

Catégories :

```text
VALIDATION
AUTHENTICATION
LIMIT
INSUFFICIENT_FUNDS
PROVIDER_TIMEOUT
PROVIDER_REJECTED
PROVIDER_UNAVAILABLE
DUPLICATE
TECHNICAL
UNKNOWN
```

## 14. Reçu

Le reçu contient :

- référence ;
- statut ;
- expéditeur ;
- bénéficiaire ;
- pays ;
- opérateurs ;
- montants ;
- frais ;
- taux ;
- date ;
- identifiants utiles.

## 15. Audit

Chaque transition conserve :

- ancien état ;
- nouvel état ;
- raison ;
- source ;
- métadonnées ;
- date.

## 16. Réconciliation

Comparer :

- transactions internes ;
- opérations opérateurs ;
- paiements ;
- payouts ;
- remboursements.

Les écarts génèrent un dossier.
