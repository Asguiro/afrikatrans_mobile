# Skill — react-native-screen

## Objectif

Créer un écran React Native  avec React Navigation.

## Contraintes

Interdit :

```text
Expo
Expo Router
```

## Structure

```text
features/<feature>/
├── screens/
├── components/
├── hooks/
├── schemas/
├── services/
└── types/
```

## Obligatoire

- type de navigation ;
- safe area ;
- clavier ;
- loading ;
- error ;
- empty ;
- offline ;
- accessibilité ;
- dark mode ;
- petits écrans ;
- retour Android.

## Données

- TanStack Query pour serveur ;
- Zustand uniquement pour état UI ou brouillon ;
- React Hook Form + Zod.

## Sécurité

- aucun token en AsyncStorage ;
- aucun log sensible ;
- Keychain/Keystore.
