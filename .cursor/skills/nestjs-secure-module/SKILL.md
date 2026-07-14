# Skill — nestjs-secure-module

## Objectif

Créer un module NestJS sécurisé et modulaire.

## Structure

```text
module/
├── controllers/
├── dto/
├── services/
├── repositories/
├── entities/
├── mappers/
├── events/
├── jobs/
├── guards/
├── module.module.ts
└── index.ts
```

## Checklist

- DTO validés ;
- permissions ;
- erreurs métier ;
- repository ;
- service ;
- controller léger ;
- Swagger ;
- logs ;
- audit ;
- tests unitaires ;
- tests e2e ;
- pas de secret ;
- pas d’accès Prisma dans controller.

## Transactions financières

Ajouter :

- idempotence ;
- verrou ;
- transition atomique ;
- historique ;
- événement ;
- tests concurrence.
