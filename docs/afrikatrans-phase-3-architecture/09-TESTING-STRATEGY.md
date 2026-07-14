# AfrikaTrans — Stratégie de tests

## 1. Types

- unitaires ;
- intégration ;
- contract tests ;
- e2e ;
- charge ;
- sécurité ;
- migrations.

## 2. Unitaires

Tester :

- calcul frais ;
- taux ;
- limites ;
- transitions ;
- permissions ;
- mapping opérateur.

## 3. Intégration

Tester avec PostgreSQL et Redis réels en environnement de test.

## 4. Contract tests

Chaque opérateur :

- requête ;
- signature ;
- réponse ;
- erreurs ;
- webhooks ;
- timeout.

## 5. E2E

Scénarios :

```text
inscription
OTP
connexion
devis
création transaction
confirmation
paiement succès
payout succès
reçu
```

Branches :

```text
OTP invalide
devis expiré
montant hors limite
opérateur indisponible
paiement échoué
payout échoué
remboursement
double requête
```

## 6. Idempotence

Test obligatoire :

- même clé ;
- même requête ;
- réponse identique ;
- une seule transaction.

## 7. Concurrence

Tester :

- deux confirmations ;
- deux webhooks ;
- deux workers ;
- double callback.

## 8. Migrations

Chaque migration :

- test local ;
- test staging ;
- backup ;
- plan rollback.
