# AfrikaTrans — Modules NestJS

## 1. Structure du projet

```text
src/
├── main.ts
├── app.module.ts
├── config/
│   ├── app.config.ts
│   ├── auth.config.ts
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── providers.config.ts
├── common/
│   ├── decorators/
│   ├── dto/
│   ├── enums/
│   ├── exceptions/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── middleware/
│   ├── pipes/
│   ├── serializers/
│   └── utils/
├── database/
│   ├── prisma.module.ts
│   ├── prisma.service.ts
│   └── seeds/
├── infrastructure/
│   ├── cache/
│   ├── queue/
│   ├── storage/
│   ├── sms/
│   ├── email/
│   ├── providers/
│   ├── logging/
│   └── observability/
└── modules/
```

## 2. Modules cœur

### `AuthModule`

Responsabilités :

- inscription ;
- connexion ;
- JWT ;
- refresh token ;
- OTP ;
- PIN ;
- réinitialisation ;
- sessions ;
- appareils ;
- MFA.

### `UsersModule`

- profil ;
- préférences ;
- statut ;
- coordonnées ;
- sécurité du compte.

### `BeneficiariesModule`

- CRUD ;
- favoris ;
- validation du téléphone ;
- appartenance au client.

### `CountriesModule`

- pays ;
- indicatifs ;
- devises ;
- disponibilité.

### `CurrenciesModule`

- devises ;
- précision ;
- format ;
- activation.

### `OperatorsModule`

- opérateurs ;
- capacités ;
- statut ;
- configuration ;
- santé ;
- disponibilité.

### `CorridorsModule`

- routes pays source → pays destination ;
- devises ;
- opérateurs autorisés ;
- limites ;
- disponibilité.

### `PricingModule`

- règles ;
- frais ;
- commissions ;
- promotions ;
- simulation.

### `QuotesModule`

- génération de devis ;
- expiration ;
- verrouillage des valeurs ;
- validation.

### `TransactionsModule`

- création ;
- confirmation ;
- cycle de vie ;
- historique ;
- reçu ;
- annulation ;
- reprise.

### `PaymentsModule`

- collecte ;
- statuts de paiement ;
- callbacks ;
- reversals.

### `PayoutsModule`

- envoi au bénéficiaire ;
- suivi opérateur ;
- retries ;
- callbacks.

### `RefundsModule`

- remboursement ;
- approbation ;
- exécution ;
- suivi.

## 3. Modules transversaux

### `KycModule`

- profil KYC ;
- documents ;
- niveau ;
- revue ;
- statut.

### `ComplianceModule`

- AML ;
- règles ;
- alertes ;
- limites ;
- blocage.

### `NotificationsModule`

- SMS ;
- email ;
- push ;
- templates ;
- préférences.

### `AuditModule`

- actions administratives ;
- changements sensibles ;
- traçabilité.

### `SupportModule`

- tickets ;
- commentaires ;
- incidents ;
- catégories.

### `ReportsModule`

- exports ;
- rapports ;
- agrégations.

### `ReconciliationModule`

- rapprochement ;
- écarts ;
- fichiers opérateurs ;
- clôtures.

### `AdminModule`

- endpoints internes ;
- rôles ;
- permissions ;
- statistiques.

## 4. Module opérateur

Chaque opérateur ne doit pas créer un module métier complètement différent.

Utiliser un modèle d’adaptateur :

```text
OperatorGateway
├── initiateDebit()
├── getDebitStatus()
├── initiatePayout()
├── getPayoutStatus()
├── refund()
├── validateWebhook()
└── normalizeWebhook()
```

Implémentations :

```text
AirtelGabonGateway
WaveSenegalGateway
OrangeMoneySenegalGateway
MoovMoneyGateway
```

## 5. Dépendances

Éviter les dépendances circulaires.

Ordre logique :

```text
Countries
Currencies
Operators
Corridors
Pricing
Quotes
Transactions
Payments
Payouts
Refunds
```

Le module `Transactions` orchestre mais ne doit pas connaître tous les détails de chaque fournisseur.

## 6. Events internes

Utiliser des événements métier :

```text
transaction.created
payment.confirmed
payment.failed
payout.started
payout.completed
payout.failed
transaction.completed
transaction.failed
refund.requested
refund.completed
```

Les événements servent à :

- notifications ;
- audit ;
- analytics ;
- orchestration secondaire.

## 7. Jobs BullMQ

Queues :

```text
transactions
payments
payouts
notifications
webhooks
reconciliation
reports
compliance
```

Chaque job doit avoir :

- identifiant ;
- retry policy ;
- backoff ;
- timeout ;
- logs ;
- dead-letter handling.

## 8. Règle importante

Le contrôleur ne contient pas de logique métier.

Le contrôleur :

- valide ;
- appelle ;
- transforme ;
- répond.

Le service métier :

- applique les règles ;
- orchestre ;
- persiste ;
- publie les événements.
