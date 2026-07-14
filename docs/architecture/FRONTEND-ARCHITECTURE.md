# Architecture frontend AfrikaTrans

## Dépôts

```text
afrikatrans-web
afrikatrans-admin
```

## Stack

React Router v7 SSR, TypeScript, DaisyUI, Tailwind, TanStack Query, TanStack Table, Zod, Lucide, Lottie.

## Structure

```text
app/
├── components/
├── features/
├── routes/
├── server/
│   ├── loaders/
│   ├── actions/
│   └── services/
├── hooks/
├── lib/
├── schemas/
├── types/
└── styles/
```

## Règles

- SSR d’abord ;
- loaders séparés ;
- actions séparées ;
- domaine hors route ;
- composants métier dans features ;
- API privée via serveur ;
- TanStack après hydratation ;
- design tokens ;
- dark mode ;
- responsive ;
- accessibilité.
