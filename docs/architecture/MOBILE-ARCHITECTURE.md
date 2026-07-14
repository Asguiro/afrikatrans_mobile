# Architecture mobile AfrikaTrans

## Dépôt

```text
afrikatrans-mobile
```

## Stack

React Native CLI, React Navigation, TypeScript, TanStack Query, Zustand, React Hook Form, Zod, Lucide React Native, Lottie React Native.

## Interdiction

Expo et Expo Router.

## Structure

```text
src/
├── navigation/
├── features/
├── screens/
├── components/
├── services/
├── stores/
├── hooks/
├── theme/
├── schemas/
├── types/
└── utils/
```

## Navigation

```text
Root
├── Splash
├── Auth
├── KYC
└── App
    ├── Home
    ├── Activity
    ├── Beneficiaries
    ├── Support
    └── Profile
```

## Règles

- types de navigation ;
- safe area ;
- clavier ;
- retour Android ;
- stockage sécurisé ;
- offline ;
- dark mode ;
- accessibilité ;
- pas de données serveur dupliquées dans Zustand.
