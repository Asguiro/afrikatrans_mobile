# Skill — transaction-flow-guardian

## Objectif

Vérifier tout flux de transaction.

## Contrôles

- devis valide ;
- montant autorisé ;
- KYC ;
- limite ;
- opérateur disponible ;
- idempotence ;
- état courant ;
- verrou ;
- transition autorisée ;
- paiement ;
- payout ;
- webhook ;
- retry ;
- remboursement ;
- audit ;
- notification.

## Questions

Avant validation :

1. Peut-on débiter deux fois ?
2. Peut-on payer deux fois ?
3. Que se passe-t-il après timeout ?
4. Comment reprend-on ?
5. Quelle est la source de vérité ?
6. Comment rapproche-t-on ?
7. Quel statut voit le client ?
