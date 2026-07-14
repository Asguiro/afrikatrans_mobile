# AfrikaTrans — Architecture technique globale

## 1. Objectif de la phase

La Phase 3 définit l’architecture backend d’AfrikaTrans afin de disposer d’une base :

- modulaire ;
- sécurisée ;
- testable ;
- observable ;
- évolutive ;
- adaptée aux transactions financières ;
- compatible avec plusieurs pays, devises, opérateurs et corridors.

La stack retenue est :

```text
NestJS
TypeScript
Prisma ORM
PostgreSQL
Redis
BullMQ
Swagger / OpenAPI
JWT
Passport
Zod
Docker
Render
```

## 2. Principes d’architecture

### 2.1 Modularité métier

Le backend est structuré par domaines métier et non par couches techniques globales.

Exemple :

```text
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── customers/
│   ├── beneficiaries/
│   ├── operators/
│   ├── countries/
│   ├── corridors/
│   ├── pricing/
│   ├── quotes/
│   ├── transactions/
│   ├── payments/
│   ├── kyc/
│   ├── compliance/
│   ├── notifications/
│   ├── support/
│   ├── audit/
│   └── admin/
├── common/
├── config/
├── database/
├── infrastructure/
└── main.ts
```

### 2.2 Séparation des responsabilités

Chaque module possède idéalement :

```text
domain/
application/
infrastructure/
presentation/
```

Pour rester pragmatique, l’implémentation NestJS peut être organisée ainsi :

```text
transactions/
├── controllers/
├── dto/
├── entities/
├── repositories/
├── services/
├── strategies/
├── events/
├── jobs/
├── mappers/
├── guards/
├── transactions.module.ts
└── index.ts
```

### 2.3 Source de vérité

- PostgreSQL est la source de vérité des données métier.
- Redis sert au cache, aux verrous, aux OTP, aux sessions techniques et aux files.
- Les événements externes sont persistés avant traitement.
- Les calculs financiers critiques sont validés côté backend.

### 2.4 Sécurité par défaut

- validation stricte de toutes les entrées ;
- authentification et autorisation séparées ;
- permissions explicites ;
- journalisation des actions sensibles ;
- secrets uniquement par variables d’environnement ;
- aucune donnée sensible dans les logs ;
- protection contre la duplication de requêtes.

### 2.5 Résilience

- idempotence ;
- retries contrôlés ;
- queues ;
- circuit breaker ;
- timeouts ;
- dead-letter queue ;
- reprise après incident ;
- rapprochement.

## 3. Vue d’ensemble

```text
Web React Router v7 SSR
Mobile React Native CLI
Admin React Router v7 SSR
            │
            ▼
        API NestJS
            │
 ┌──────────┼───────────┐
 ▼          ▼           ▼
PostgreSQL Redis      Object Storage
            │
            ▼
          BullMQ
            │
 ┌──────────┼──────────┐
 ▼          ▼          ▼
SMS      Email      Opérateurs
                     Mobile Money
```

## 4. Contextes fonctionnels

### Identité et accès

- Authentification
- Comptes
- Sessions
- Appareils
- OTP
- PIN
- MFA
- Rôles
- Permissions

### Référentiels

- Pays
- Devises
- Opérateurs
- Corridors
- Méthodes de paiement
- Configurations

### Transfert

- Devis
- Tarification
- Bénéficiaires
- Transactions
- Paiements
- Exécution
- Statuts
- Reçus
- Remboursements

### Conformité

- KYC
- AML
- Limites
- Alertes
- Contrôles
- Cas manuels

### Opérations

- Support
- Incidents
- Rapprochement
- Rapports
- Audit
- Monitoring

## 5. Environnements

```text
local
development
staging
production
```

Chaque environnement utilise :

- sa propre base ;
- ses propres secrets ;
- ses propres intégrations ;
- ses propres URLs ;
- ses propres clés de signature.

## 6. Déploiement

### API

Render Web Service.

### PostgreSQL

Render PostgreSQL.

### Redis

Render Redis ou fournisseur compatible.

### Workers

Render Background Workers.

### Cron

Render Cron Jobs pour :

- rapprochement ;
- expiration ;
- nettoyage ;
- rapports ;
- contrôles périodiques.

## 7. Exigences non fonctionnelles

- disponibilité cible définie ;
- latence API mesurée ;
- sauvegardes PostgreSQL ;
- migrations versionnées ;
- observabilité ;
- tests automatisés ;
- documentation OpenAPI ;
- politique de reprise.
