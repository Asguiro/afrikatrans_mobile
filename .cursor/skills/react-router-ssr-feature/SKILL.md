# Skill — react-router-ssr-feature

## Objectif

Créer une feature React Router v7 SSR.

## Structure

```text
features/<feature>/
├── components/
├── hooks/
├── schemas/
├── types/
├── services/
└── index.ts

server/
├── loaders/<feature>.server.ts
└── actions/<feature>.server.ts
```

## Règles

- loader pour données initiales ;
- action pour mutation SSR ;
- TanStack Query pour interactions client ;
- Zod partagé ;
- composants accessibles ;
- error boundary ;
- loading ;
- empty ;
- error ;
- responsive ;
- dark mode.

## Validation

Tester :

- SSR ;
- hydratation ;
- erreur ;
- mobile ;
- clavier ;
- thème.
