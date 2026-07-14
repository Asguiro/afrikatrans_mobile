# AfrikaTrans — Infrastructure et files

## 1. Redis

Usages :

- cache ;
- rate limiting ;
- OTP ;
- verrous ;
- sessions techniques ;
- BullMQ ;
- idempotence courte durée ;
- état de circuit breaker.

Redis n’est pas la source de vérité financière.

## 2. BullMQ

Queues :

```text
transaction-orchestration
payment-processing
payout-processing
provider-webhooks
notifications
reconciliation
reports
compliance
```

## 3. Workers

Chaque worker :

- indépendant ;
- observable ;
- idempotent ;
- limité en concurrence ;
- configurable.

## 4. Retry

Exemple :

```text
attempts: 5
backoff: exponential
```

Mais les opérations financières suivent des règles spécifiques.

## 5. Dead-letter

Les jobs définitivement en erreur sont :

- conservés ;
- visibles ;
- alertés ;
- relançables manuellement avec permission.

## 6. Cache

À mettre en cache :

- pays ;
- devises ;
- opérateurs ;
- corridors ;
- configuration publique.

À éviter :

- solde critique ;
- statut transaction sans stratégie ;
- permissions sensibles trop longtemps.

## 7. Storage

Stockage objet pour :

- documents KYC ;
- reçus PDF ;
- exports ;
- pièces support.

Exigences :

- URLs signées ;
- accès privé ;
- chiffrement ;
- expiration.

## 8. Cron

Jobs :

- expiration des devis ;
- expiration OTP ;
- rapprochement ;
- vérification des transactions bloquées ;
- génération de rapports ;
- nettoyage contrôlé.
