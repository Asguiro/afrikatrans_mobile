# AfrikaTrans — Modèle de données conceptuel

## 1. Principes

- PostgreSQL ;
- Prisma ;
- UUID internes ;
- références publiques séparées ;
- montants en unités minimales ;
- timestamps en UTC ;
- audit immuable ;
- soft delete uniquement quand pertinent.

## 2. Entités principales

### User

- id ;
- publicId ;
- firstName ;
- lastName ;
- phone ;
- email ;
- countryId ;
- status ;
- riskLevel ;
- createdAt ;
- updatedAt.

### UserCredential

- id ;
- userId ;
- passwordHash ;
- pinHash ;
- pinFailedAttempts ;
- lockedUntil ;
- passwordChangedAt.

### UserSession

- id ;
- userId ;
- deviceId ;
- refreshTokenHash ;
- expiresAt ;
- revokedAt.

### Device

- id ;
- userId ;
- name ;
- platform ;
- fingerprint ;
- trusted ;
- lastSeenAt.

### Country

- id ;
- iso2 ;
- iso3 ;
- name ;
- callingCode ;
- currencyId ;
- enabled.

### Currency

- id ;
- code ;
- name ;
- exponent ;
- symbol.

### Operator

- id ;
- countryId ;
- name ;
- code ;
- type ;
- enabled ;
- configuration.

### Corridor

- id ;
- sourceCountryId ;
- destinationCountryId ;
- sourceCurrencyId ;
- destinationCurrencyId ;
- enabled ;
- minAmount ;
- maxAmount.

### CorridorOperator

- id ;
- corridorId ;
- sourceOperatorId ;
- destinationOperatorId ;
- enabled.

### Beneficiary

- id ;
- ownerUserId ;
- firstName ;
- lastName ;
- phone ;
- countryId ;
- operatorId ;
- favorite ;
- createdAt.

### PricingRule

- id ;
- version ;
- name ;
- type ;
- priority ;
- fixedFee ;
- percentageFee ;
- minAmount ;
- maxAmount ;
- criteria ;
- effectiveFrom ;
- effectiveTo ;
- active.

### Quote

- id ;
- userId ;
- corridorId ;
- sourceOperatorId ;
- destinationOperatorId ;
- sourceAmount ;
- destinationAmount ;
- totalFee ;
- totalDebit ;
- exchangeRate ;
- pricingSnapshot ;
- expiresAt ;
- createdAt.

### Transfer

- id ;
- reference ;
- userId ;
- beneficiaryId ;
- quoteId ;
- corridorId ;
- sourceOperatorId ;
- destinationOperatorId ;
- sourceAmount ;
- destinationAmount ;
- totalFee ;
- totalDebit ;
- status ;
- idempotencyKey ;
- reasonCode ;
- createdAt ;
- completedAt.

### TransferEvent

- id ;
- transferId ;
- type ;
- previousStatus ;
- nextStatus ;
- source ;
- payload ;
- createdAt.

### ProviderOperation

- id ;
- transferId ;
- operatorId ;
- direction ;
- providerReference ;
- requestPayload ;
- responsePayload ;
- status ;
- requestedAt ;
- respondedAt.

### Refund

- id ;
- transferId ;
- amount ;
- reason ;
- status ;
- providerReference ;
- createdAt ;
- completedAt.

### KycProfile

- id ;
- userId ;
- level ;
- status ;
- submittedAt ;
- approvedAt ;
- expiresAt.

### KycDocument

- id ;
- kycProfileId ;
- type ;
- number ;
- issuingCountry ;
- expiresAt ;
- storageKey ;
- verificationStatus.

### RiskAssessment

- id ;
- userId ;
- transferId ;
- score ;
- decision ;
- rulesTriggered ;
- createdAt.

### Notification

- id ;
- userId ;
- channel ;
- type ;
- payload ;
- status ;
- sentAt.

### SupportTicket

- id ;
- userId ;
- transferId ;
- subject ;
- status ;
- priority ;
- assignedTo ;
- createdAt.

### AdminUser

- id ;
- firstName ;
- lastName ;
- email ;
- status ;
- mfaEnabled.

### Role

- id ;
- name ;
- description.

### Permission

- id ;
- code ;
- description.

### AuditLog

- id ;
- actorType ;
- actorId ;
- action ;
- resourceType ;
- resourceId ;
- before ;
- after ;
- ip ;
- userAgent ;
- createdAt.

## 3. Relations majeures

```text
User
 ├── UserCredential
 ├── UserSession[]
 ├── Device[]
 ├── Beneficiary[]
 ├── Quote[]
 ├── Transfer[]
 ├── KycProfile
 └── Notification[]

Corridor
 ├── CorridorOperator[]
 ├── Quote[]
 └── Transfer[]

Transfer
 ├── TransferEvent[]
 ├── ProviderOperation[]
 ├── Refund[]
 ├── RiskAssessment[]
 └── SupportTicket[]
```

## 4. Index importants

- User.phone unique ;
- Transfer.reference unique ;
- Transfer.idempotencyKey unique par utilisateur ou canal ;
- ProviderOperation.providerReference ;
- Transfer.status + createdAt ;
- Transfer.userId + createdAt ;
- Quote.expiresAt ;
- AuditLog.resourceType + resourceId ;
- Notification.userId + status.

## 5. Contraintes

- montants non négatifs ;
- devise obligatoire ;
- unicité des codes pays, devises et opérateurs ;
- aucune suppression en cascade des données financières ;
- historique de statuts immuable ;
- snapshot tarifaire obligatoire.

## 6. Étape suivante

Transformer ce modèle conceptuel en :

- diagramme ERD ;
- schéma Prisma ;
- conventions de nommage ;
- stratégie de migration ;
- seed initial pays, devises, opérateurs et rôles.
