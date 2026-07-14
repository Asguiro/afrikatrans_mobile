# AfrikaTrans — Base Prisma

## 1. Objectif

La base Prisma doit couvrir les besoins fondamentaux sans surcharger le premier lot.

La modélisation doit rester :

- normalisée ;
- lisible ;
- évolutive ;
- adaptée aux transactions financières ;
- compatible avec l’audit.

## 2. Conventions

### Identifiants

Utiliser :

```prisma
id String @id @default(cuid())
```

Pour les transactions, ajouter une référence métier lisible :

```prisma
reference String @unique
```

### Horodatage

Chaque table métier :

```prisma
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```

Ajouter selon besoin :

```prisma
deletedAt DateTime?
```

### Montants

Ne jamais utiliser `Float`.

Utiliser :

```prisma
Decimal @db.Decimal(20, 6)
```

Pour les montants monétaires finaux :

```prisma
Decimal @db.Decimal(20, 2)
```

La précision dépend de la devise et du cas métier.

### Devises

Utiliser le code ISO :

```text
XOF
XAF
USD
EUR
```

## 3. Modèle initial

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserStatus {
  PENDING
  ACTIVE
  SUSPENDED
  BLOCKED
  CLOSED
}

enum UserType {
  CUSTOMER
  ADMIN
  SUPPORT
  FINANCE
  COMPLIANCE
  OPERATOR_MANAGER
}

enum KycStatus {
  NOT_STARTED
  IN_PROGRESS
  PENDING_REVIEW
  APPROVED
  REJECTED
  EXPIRED
}

enum TransactionStatus {
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
}

enum OperatorStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
  DEGRADED
  SUSPENDED
}

enum CorridorStatus {
  ACTIVE
  INACTIVE
  MAINTENANCE
  SUSPENDED
}

enum PricingRuleType {
  FIXED
  PERCENTAGE
  FIXED_PLUS_PERCENTAGE
  TIERED
}

model User {
  id              String      @id @default(cuid())
  type            UserType    @default(CUSTOMER)
  status          UserStatus  @default(PENDING)
  phone           String      @unique
  phoneCountryCode String
  email           String?     @unique
  passwordHash    String?
  pinHash         String?
  firstName       String?
  lastName        String?
  preferredLocale String       @default("fr")
  preferredTheme  String       @default("system")
  kycStatus       KycStatus    @default(NOT_STARTED)
  lastLoginAt     DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  deletedAt       DateTime?

  sessions        AuthSession[]
  otpChallenges   OtpChallenge[]
  devices         UserDevice[]
  beneficiaries   Beneficiary[]
  transactions    Transaction[]
  auditLogs       AuditLog[]   @relation("AuditActor")
}

model AuthSession {
  id               String   @id @default(cuid())
  userId           String
  refreshTokenHash String
  deviceId         String?
  ipAddress        String?
  userAgent        String?
  expiresAt        DateTime
  revokedAt        DateTime?
  createdAt        DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([expiresAt])
}

model OtpChallenge {
  id          String   @id @default(cuid())
  userId      String?
  destination String
  purpose     String
  codeHash    String
  attempts    Int      @default(0)
  maxAttempts Int      @default(5)
  expiresAt   DateTime
  verifiedAt  DateTime?
  createdAt   DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([destination, purpose])
  @@index([expiresAt])
}

model UserDevice {
  id           String   @id @default(cuid())
  userId       String
  deviceKey    String
  name         String?
  platform     String?
  appVersion   String?
  trusted      Boolean  @default(false)
  lastSeenAt   DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, deviceKey])
}

model Country {
  id           String   @id @default(cuid())
  iso2         String   @unique
  iso3         String   @unique
  name         String
  callingCode  String
  defaultCurrencyCode String
  active       Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  operatorsFrom Operator[] @relation("OperatorCountry")
  sourceCorridors Corridor[] @relation("SourceCountry")
  destinationCorridors Corridor[] @relation("DestinationCountry")
}

model Currency {
  code       String   @id
  name       String
  symbol     String
  decimals   Int      @default(2)
  active     Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Operator {
  id              String         @id @default(cuid())
  countryId       String
  code            String
  name            String
  type            String
  status          OperatorStatus @default(INACTIVE)
  logoUrl         String?
  integrationKey  String?
  supportsDebit   Boolean        @default(false)
  supportsPayout  Boolean        @default(false)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  country Country @relation("OperatorCountry", fields: [countryId], references: [id])
  sourceTransactions Transaction[] @relation("SourceOperator")
  destinationTransactions Transaction[] @relation("DestinationOperator")

  @@unique([countryId, code])
}

model Corridor {
  id                    String         @id @default(cuid())
  sourceCountryId       String
  destinationCountryId  String
  sourceCurrencyCode    String
  destinationCurrencyCode String
  status                CorridorStatus @default(INACTIVE)
  minAmount             Decimal        @db.Decimal(20, 2)
  maxAmount             Decimal        @db.Decimal(20, 2)
  estimatedDurationMin  Int?
  estimatedDurationMax  Int?
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt

  sourceCountry Country @relation("SourceCountry", fields: [sourceCountryId], references: [id])
  destinationCountry Country @relation("DestinationCountry", fields: [destinationCountryId], references: [id])
  pricingRules PricingRule[]
  quotes Quote[]
  transactions Transaction[]

  @@unique([
    sourceCountryId,
    destinationCountryId,
    sourceCurrencyCode,
    destinationCurrencyCode
  ])
}

model PricingRule {
  id            String          @id @default(cuid())
  corridorId    String
  name          String
  type          PricingRuleType
  fixedAmount   Decimal?        @db.Decimal(20, 2)
  percentage    Decimal?        @db.Decimal(10, 6)
  minFee        Decimal?        @db.Decimal(20, 2)
  maxFee        Decimal?        @db.Decimal(20, 2)
  startsAt      DateTime
  endsAt        DateTime?
  priority      Int             @default(100)
  active        Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  corridor Corridor @relation(fields: [corridorId], references: [id], onDelete: Cascade)

  @@index([corridorId, active])
}

model Beneficiary {
  id            String   @id @default(cuid())
  userId        String
  countryId     String
  operatorId    String
  firstName     String
  lastName      String?
  phone         String
  relationship  String?
  favorite      Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([phone])
}

model Quote {
  id                     String   @id @default(cuid())
  corridorId             String
  sourceOperatorId       String
  destinationOperatorId  String
  sourceAmount           Decimal  @db.Decimal(20, 2)
  sourceCurrencyCode     String
  destinationAmount      Decimal  @db.Decimal(20, 2)
  destinationCurrencyCode String
  exchangeRate           Decimal  @db.Decimal(20, 8)
  serviceFee             Decimal  @db.Decimal(20, 2)
  operatorFee            Decimal  @db.Decimal(20, 2)
  totalFee               Decimal  @db.Decimal(20, 2)
  totalToPay             Decimal  @db.Decimal(20, 2)
  expiresAt              DateTime
  createdAt              DateTime @default(now())

  corridor Corridor @relation(fields: [corridorId], references: [id])
  transaction Transaction?

  @@index([expiresAt])
}

model Transaction {
  id                      String            @id @default(cuid())
  reference               String            @unique
  userId                  String
  quoteId                 String            @unique
  corridorId              String
  sourceOperatorId        String
  destinationOperatorId   String
  beneficiaryId           String?
  status                  TransactionStatus @default(DRAFT)
  sourcePhone             String
  destinationPhone        String
  beneficiaryName         String
  transferPurpose         String?
  sourceAmount            Decimal           @db.Decimal(20, 2)
  sourceCurrencyCode      String
  destinationAmount       Decimal           @db.Decimal(20, 2)
  destinationCurrencyCode String
  exchangeRate            Decimal           @db.Decimal(20, 8)
  serviceFee              Decimal           @db.Decimal(20, 2)
  operatorFee             Decimal           @db.Decimal(20, 2)
  totalFee                Decimal           @db.Decimal(20, 2)
  totalToPay              Decimal           @db.Decimal(20, 2)
  idempotencyKey          String            @unique
  providerReference       String?
  failureCode             String?
  failureMessage          String?
  completedAt             DateTime?
  createdAt               DateTime          @default(now())
  updatedAt               DateTime          @updatedAt

  user                User      @relation(fields: [userId], references: [id])
  quote               Quote     @relation(fields: [quoteId], references: [id])
  corridor            Corridor  @relation(fields: [corridorId], references: [id])
  sourceOperator      Operator  @relation("SourceOperator", fields: [sourceOperatorId], references: [id])
  destinationOperator Operator  @relation("DestinationOperator", fields: [destinationOperatorId], references: [id])
  statusHistory       TransactionStatusHistory[]
  providerEvents      ProviderEvent[]
  payments            Payment[]

  @@index([userId, createdAt])
  @@index([status, createdAt])
  @@index([providerReference])
}

model TransactionStatusHistory {
  id            String            @id @default(cuid())
  transactionId String
  fromStatus    TransactionStatus?
  toStatus      TransactionStatus
  reason        String?
  metadata      Json?
  createdAt     DateTime          @default(now())

  transaction Transaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)

  @@index([transactionId, createdAt])
}

model Payment {
  id                String   @id @default(cuid())
  transactionId     String
  provider          String
  providerReference String?
  status            String
  amount            Decimal  @db.Decimal(20, 2)
  currencyCode      String
  metadata          Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  transaction Transaction @relation(fields: [transactionId], references: [id])

  @@index([transactionId])
  @@index([providerReference])
}

model ProviderEvent {
  id               String   @id @default(cuid())
  provider         String
  externalEventId  String
  transactionId    String?
  eventType        String
  payload          Json
  signatureValid   Boolean
  processedAt      DateTime?
  processingError  String?
  receivedAt       DateTime @default(now())

  transaction Transaction? @relation(fields: [transactionId], references: [id])

  @@unique([provider, externalEventId])
  @@index([processedAt])
}

model AuditLog {
  id          String   @id @default(cuid())
  actorUserId String?
  action      String
  resource    String
  resourceId  String?
  oldValue    Json?
  newValue    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  actor User? @relation("AuditActor", fields: [actorUserId], references: [id])

  @@index([resource, resourceId])
  @@index([actorUserId, createdAt])
}
```

## 4. Modèles à ajouter ensuite

- `Role`
- `Permission`
- `UserRole`
- `KycProfile`
- `KycDocument`
- `ComplianceAlert`
- `TransferLimit`
- `ExchangeRate`
- `Refund`
- `Settlement`
- `Reconciliation`
- `SupportTicket`
- `Notification`
- `WebhookSubscription`
- `ApiCredential`
- `OperatorConfiguration`
- `OperatorHealthCheck`
- `SystemSetting`

## 5. Règles Prisma

- pas de logique métier dans Prisma ;
- pas de suppression physique pour les données financières ;
- transactions SQL pour les changements critiques ;
- `select` explicites ;
- pagination ;
- index obligatoires ;
- migrations revues ;
- seed séparé ;
- aucune migration automatique en production sans pipeline.
