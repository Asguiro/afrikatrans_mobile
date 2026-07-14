# AfrikaTrans — Vision et périmètre du projet

## 1. Résumé exécutif

AfrikaTrans est une plateforme panafricaine de transfert d’argent interopérable entre opérateurs Mobile Money. Elle doit permettre à un utilisateur d’envoyer de l’argent depuis un pays et un opérateur source vers un bénéficiaire utilisant un autre opérateur dans un autre pays, avec transparence sur les frais, le taux appliqué, le montant total débité et le montant reçu.

Le produit est constitué de plusieurs applications indépendantes :

- un site web public et transactionnel ;
- une application mobile React Native CLI utilisant React Navigation ;
- un tableau de bord d’administration ;
- un backend NestJS centralisant les règles métier et les intégrations ;
- une base PostgreSQL gérée avec Prisma.

## 2. Vision produit

Construire une infrastructure de transfert d’argent interafricain simple, fiable, sécurisée, traçable et extensible, capable d’intégrer progressivement de nouveaux pays, devises, opérateurs, partenaires et règles tarifaires sans devoir modifier le cœur du produit.

## 3. Proposition de valeur

AfrikaTrans doit offrir :

- une expérience d’envoi claire en quelques étapes ;
- une estimation instantanée du coût total ;
- une transparence complète sur les frais ;
- un suivi temps réel du statut du transfert ;
- un reçu numérique partageable ;
- un historique centralisé ;
- une assistance accessible ;
- une plateforme d’administration complète pour les opérations, la conformité et la finance.

## 4. Objectifs stratégiques

1. Réduire la complexité des transferts entre plusieurs opérateurs africains.
2. Centraliser les règles de prix, de commission et de conversion.
3. Garantir une traçabilité complète de chaque transaction.
4. Permettre l’ajout de nouveaux corridors sans refonte majeure.
5. Donner aux équipes métiers une autonomie de configuration.
6. Sécuriser le parcours par OTP, PIN, biométrie et contrôles de risque.
7. Préparer la plateforme aux exigences KYC, AML et audit.

## 5. Utilisateurs cibles

- particuliers envoyant de l’argent à leurs proches ;
- bénéficiaires recevant sur leur compte Mobile Money ;
- agents support ;
- opérateurs métiers ;
- responsables finance ;
- responsables conformité ;
- administrateurs ;
- intégrateurs et partenaires techniques.

## 6. Périmètre fonctionnel

### Inclus

- création de compte ;
- authentification ;
- validation OTP ;
- code PIN ;
- biométrie locale ;
- gestion du profil ;
- KYC progressif ;
- simulation de transfert ;
- calcul des frais ;
- sélection pays, devise et opérateur ;
- gestion des bénéficiaires ;
- initiation et confirmation d’un transfert ;
- intégration aux opérateurs ;
- suivi des statuts ;
- historique ;
- reçus ;
- notifications ;
- support ;
- administration ;
- reporting ;
- rapprochement ;
- audit.

### Hors périmètre initial

- crédit ;
- épargne ;
- cryptoactifs ;
- marketplace ;
- cartes bancaires émises par AfrikaTrans ;
- caisse physique propriétaire ;
- réseau d’agents de dépôt/retrait propre.

## 7. Applications et dépôts

- `afrikatrans-api` — NestJS, Prisma, PostgreSQL
- `afrikatrans-web` — React Router v7 SSR, DaisyUI, TanStack
- `afrikatrans-mobile` — React Native CLI, React Navigation, TanStack Query
- `afrikatrans-admin` — React Router v7 SSR, DaisyUI, TanStack

## 8. Principes directeurs

- sécurité par défaut ;
- aucune logique critique uniquement côté client ;
- configuration plutôt que code en dur ;
- idempotence des opérations financières ;
- audit systématique ;
- observabilité complète ;
- UX claire, rassurante et accessible ;
- séparation stricte des responsabilités.

## 9. Indicateurs de succès

- taux de réussite des transactions ;
- temps moyen de traitement ;
- taux d’abandon du parcours ;
- taux d’erreur par opérateur ;
- volume transféré ;
- chiffre d’affaires ;
- revenu net ;
- délai moyen de résolution des incidents ;
- satisfaction client.

## 10. Roadmap macro

### Phase 1 — Cadrage
Documentation métier, règles, modèle de données et sécurité.

### Phase 2 — Design
Design system, écrans mobile, web et administration.

### Phase 3 — Fondations techniques
Repositories, CI, architecture, authentification, base de données.

### Phase 4 — MVP
Inscription, connexion, simulation, transfert, historique, administration minimale.

### Phase 5 — Industrialisation
KYC avancé, antifraude, rapprochement, reporting, observabilité et montée en charge.
