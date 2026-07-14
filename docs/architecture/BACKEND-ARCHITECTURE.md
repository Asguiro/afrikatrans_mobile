# Architecture backend AfrikaTrans

## Dépôt

```text
afrikatrans-api
```

## Stack

NestJS, Prisma, PostgreSQL, Redis, BullMQ, Swagger, JWT, Passport.

## Domaines

```text
auth
users
beneficiaries
countries
currencies
operators
corridors
pricing
quotes
transactions
payments
payouts
refunds
kyc
compliance
notifications
audit
support
reports
reconciliation
admin
```

## Règles

- controller léger ;
- service métier ;
- repository ;
- adapter opérateur ;
- événements ;
- queues ;
- idempotence ;
- audit ;
- observabilité ;
- tests.
