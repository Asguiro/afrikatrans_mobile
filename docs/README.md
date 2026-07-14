# AfrikaTrans — Phase 4 Cursor

Ce pack prépare Cursor pour les quatre dépôts AfrikaTrans.

## Contenu

```text
AGENTS.md

.cursor/
├── rules/
│   ├── 00-project-context.mdc
│   ├── 01-frontend-architecture.mdc
│   ├── 02-backend-architecture.mdc
│   ├── 03-mobile-architecture.mdc
│   ├── 04-ui-design-rules.mdc
│   ├── 05-security-rules.mdc
│   ├── 06-prisma-rules.mdc
│   ├── 07-testing-rules.mdc
│   ├── 08-api-rules.mdc
│   └── 09-git-quality-rules.mdc
└── skills/
    ├── afrikatrans-feature-builder/
    ├── nestjs-secure-module/
    ├── react-router-ssr-feature/
    ├── react-native-cli-screen/
    ├── prisma-fintech-modeling/
    ├── transaction-flow-guardian/
    ├── operator-integration-builder/
    ├── ui-fintech-review/
    ├── security-review-guardian/
    └── test-review-qa/

docs/
└── architecture/
    ├── FRONTEND-ARCHITECTURE.md
    ├── BACKEND-ARCHITECTURE.md
    └── MOBILE-ARCHITECTURE.md
```

## Installation

Copier `AGENTS.md` à la racine de chaque dépôt.

Copier `.cursor/` à la racine de chaque dépôt.

Les règles utilisent des globs pour s’activer selon les fichiers.

## Adaptation recommandée

Dans chaque dépôt, garder uniquement les règles pertinentes ou conserver le pack complet si les globs sont correctement configurés.

## Mobile

Le projet utilise React Native CLI et React Navigation.

Expo et Expo Router sont interdits.
