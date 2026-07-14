# AfrikaTrans — Design Mobile

## 1. Stack de référence

```text
React Native CLI
React Navigation
TypeScript
TanStack Query
React Hook Form
Zod
Zustand
Lucide React Native
Lottie React Native
```

Aucun Expo ni Expo Router.

## 2. Navigation

Structure recommandée :

```text
RootNavigator
├── Splash
├── OnboardingStack
├── AuthStack
│   ├── Welcome
│   ├── SelectCountry
│   ├── Register
│   ├── VerifyOtp
│   ├── CreatePin
│   ├── ConfirmPin
│   ├── Login
│   ├── ForgotPassword
│   └── ResetPassword
├── KycStack
│   ├── KycIntro
│   ├── PersonalInfo
│   ├── IdentityDocument
│   ├── Selfie
│   ├── Review
│   └── KycStatus
└── AppNavigator
    ├── HomeTab
    ├── ActivityTab
    ├── BeneficiariesTab
    ├── SupportTab
    └── ProfileTab
```

Le transfert utilise un stack dédié :

```text
TransferStack
├── TransferStart
├── SelectSourceCountry
├── SelectSourceOperator
├── SenderAccount
├── SelectDestinationCountry
├── SelectDestinationOperator
├── Beneficiary
├── Amount
├── Quote
├── Review
├── ConfirmPin
├── Processing
├── Success
└── Receipt
```

## 3. Navigation principale

Bottom tabs :

1. Accueil ;
2. Activité ;
3. Bénéficiaires ;
4. Aide ;
5. Profil.

Le bouton « Envoyer » reste l’action principale de l’accueil, pas nécessairement un onglet flottant.

## 4. Écrans à concevoir

### 4.1 Démarrage et onboarding

- Splash animé ;
- présentation de la proposition de valeur ;
- transparence des frais ;
- transfert entre pays ;
- sécurité ;
- choix « Créer un compte » ou « Se connecter ».

### 4.2 Inscription

- choix du pays de résidence ;
- saisie du téléphone ;
- identité de base ;
- acceptation des conditions ;
- OTP ;
- création du PIN ;
- activation biométrique optionnelle ;
- confirmation de création du compte.

### 4.3 Connexion

- pays/indicatif ;
- numéro ;
- mot de passe ou PIN selon stratégie ;
- biométrie ;
- mot de passe oublié ;
- gestion d’une session expirée.

### 4.4 Accueil

Contenu recommandé :

```text
Bonjour, Amadou

[Envoyer de l’argent]

Solde ou aperçu du mois, si applicable

Taux / corridors récents

Bénéficiaires fréquents

Transactions récentes

Aide rapide
```

L’accueil ne doit pas afficher un long formulaire de transfert.

### 4.5 Nouveau transfert

Le parcours est découpé.

#### Écran 1 — D’où envoyez-vous ?

- pays source ;
- opérateur source ;
- numéro ou compte source ;
- compte récemment utilisé.

#### Écran 2 — À qui envoyez-vous ?

- bénéficiaire existant ;
- nouveau bénéficiaire ;
- pays ;
- opérateur ;
- nom ;
- téléphone.

#### Écran 3 — Combien ?

- montant à envoyer ;
- montant à recevoir ;
- bascule entre les deux ;
- devise ;
- aperçu des frais.

#### Écran 4 — Offre

Afficher :

- montant envoyé ;
- frais AfrikaTrans ;
- frais opérateur ;
- taux ;
- montant reçu ;
- total à payer ;
- délai estimé.

#### Écran 5 — Vérification

Afficher un résumé éditable.

#### Écran 6 — Confirmation sécurisée

- PIN ;
- biométrie ;
- OTP si risque élevé.

#### Écran 7 — Traitement

Animation Lottie discrète avec étapes :

```text
Paiement confirmé
Transfert en cours
Envoi au bénéficiaire
```

#### Écran 8 — Succès

- statut ;
- montant reçu ;
- bénéficiaire ;
- référence ;
- heure ;
- partager ;
- télécharger le reçu ;
- refaire un transfert ;
- retour accueil.

### 4.6 Activité

Filtres :

- toutes ;
- en cours ;
- réussies ;
- échouées ;
- remboursées.

Chaque ligne :

- avatar ou opérateur ;
- nom bénéficiaire ;
- pays ;
- montant ;
- date ;
- statut.

### 4.7 Détail de transaction

Sections :

- statut ;
- progression ;
- montant ;
- frais ;
- bénéficiaire ;
- expéditeur ;
- opérateurs ;
- référence ;
- dates ;
- reçu ;
- aide.

### 4.8 Bénéficiaires

- recherche ;
- favoris ;
- récents ;
- ajouter ;
- modifier ;
- supprimer avec confirmation ;
- lancer un transfert.

### 4.9 Profil

- informations personnelles ;
- KYC ;
- sécurité ;
- appareils ;
- préférences ;
- langue ;
- apparence ;
- notifications ;
- documents légaux ;
- aide ;
- déconnexion.

### 4.10 Support

- FAQ ;
- WhatsApp ;
- téléphone ;
- email ;
- ticket ;
- suivi du ticket ;
- signaler un problème de transfert.

## 5. Composants mobiles

- `AppHeader`
- `Screen`
- `PrimaryButton`
- `SecondaryButton`
- `TextField`
- `PhoneField`
- `MoneyField`
- `OtpInput`
- `PinPad`
- `CountryPicker`
- `OperatorPicker`
- `CurrencyAmount`
- `FeeBreakdown`
- `QuoteCard`
- `BeneficiaryCard`
- `TransactionRow`
- `StatusBadge`
- `StatusTimeline`
- `ReceiptCard`
- `BottomSheet`
- `ConfirmationSheet`
- `EmptyState`
- `ErrorState`
- `OfflineBanner`
- `Skeleton`

## 6. Règles d’ergonomie mobile

- CTA principal collant en bas quand le contenu est long ;
- respect des safe areas ;
- contenu scrollable ;
- clavier ne doit jamais masquer l’action ;
- retour matériel Android géré ;
- éviter les doubles soumissions ;
- conserver les données d’un transfert interrompu ;
- avertir avant de quitter une confirmation ;
- les montants doivent rester visibles ;
- ne jamais afficher un loader sans message pendant une opération financière.

## 7. États obligatoires

Chaque écran connecté doit avoir :

- chargement ;
- vide ;
- erreur ;
- hors ligne ;
- succès ;
- session expirée ;
- maintenance si nécessaire.

## 8. Responsive mobile

Tailles ciblées :

- 320 px minimum ;
- 360 px ;
- 390 px ;
- 412 px ;
- 430 px ;
- tablettes si besoin.

Règles :

- aucun texte tronqué critique ;
- aucun bouton sous 44 px ;
- éviter les largeurs fixes ;
- utiliser des cartes empilées ;
- respecter l’agrandissement des polices.

## 9. Dark mode mobile

- suivre le système par défaut ;
- permettre clair, sombre, système ;
- statut visible dans les deux thèmes ;
- logos opérateurs sur surface adaptée ;
- images et Lottie compatibles ;
- clavier et barre système cohérents.

## 10. Micro-interactions

- vibration légère sur validation ;
- vibration d’erreur ;
- compteur animé pour le montant reçu ;
- transition douce entre étapes ;
- succès Lottie court ;
- skeleton sur historique ;
- animation de sélection pays/opérateur discrète.
