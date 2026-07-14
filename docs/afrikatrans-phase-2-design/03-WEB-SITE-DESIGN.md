# AfrikaTrans — Design du site web

## 1. Rôle du site

Le site est à la fois :

- vitrine de confiance ;
- outil de simulation ;
- point d’entrée vers la création de compte ;
- support à l’acquisition ;
- centre d’information ;
- canal d’assistance ;
- éventuellement parcours transactionnel web.

## 2. Stack

```text
React Router v7
SSR
TypeScript
Tailwind CSS
DaisyUI
TanStack Query
TanStack Form
Lucide React
Lottie
```

## 3. Architecture de navigation

Navigation principale :

- Envoyer de l’argent ;
- Tarifs ;
- Pays et opérateurs ;
- Comment ça marche ;
- Sécurité ;
- Aide ;
- Se connecter ;
- Créer un compte.

Le bouton principal de l’en-tête :

> Envoyer de l’argent

## 4. Pages

### 4.1 Accueil

Sections :

1. Hero ;
2. simulateur rapide ;
3. preuve de valeur ;
4. comment ça marche ;
5. pays et opérateurs ;
6. transparence et sécurité ;
7. application mobile ;
8. témoignages ou preuves ;
9. FAQ ;
10. CTA final ;
11. footer.

### 4.2 Hero

Message recommandé :

> Envoyez de l’argent en Afrique, simplement.

Sous-texte :

> Comparez les frais, connaissez le montant reçu et suivez votre transfert à chaque étape.

Actions :

- Envoyer de l’argent ;
- Voir les tarifs.

Le visuel doit montrer une expérience produit réelle, pas un globe générique surchargé.

### 4.3 Simulateur

Champs :

- pays source ;
- opérateur source ;
- pays de destination ;
- opérateur destinataire ;
- montant.

Résultat :

- frais ;
- taux ;
- montant reçu ;
- total à payer ;
- temps estimé.

CTA :

> Continuer le transfert

### 4.4 Tarifs

- recherche de corridor ;
- calcul interactif ;
- détail des frais ;
- explication simple ;
- transparence ;
- FAQ tarifaire.

### 4.5 Pays et opérateurs

- grille filtrable ;
- pays actifs ;
- opérateurs disponibles ;
- devises ;
- corridors ;
- statut « bientôt disponible ».

### 4.6 Comment ça marche

Étapes :

1. choisissez le pays ;
2. saisissez le bénéficiaire ;
3. voyez les frais ;
4. confirmez ;
5. suivez le transfert.

### 4.7 Sécurité

Expliquer :

- protection du compte ;
- vérification ;
- surveillance ;
- confidentialité ;
- assistance ;
- bonnes pratiques.

### 4.8 Aide

- recherche ;
- catégories ;
- FAQ ;
- contact ;
- statut d’un transfert ;
- signalement.

### 4.9 Authentification

- connexion ;
- création de compte ;
- OTP ;
- mot de passe oublié ;
- nouvelle session ;
- vérification.

### 4.10 Espace utilisateur web

Si activé :

- dashboard ;
- transfert ;
- historique ;
- bénéficiaires ;
- reçus ;
- profil ;
- KYC ;
- support.

## 5. Design de l’en-tête

Desktop :

- logo à gauche ;
- navigation centrale ;
- connexion ;
- CTA.

Mobile :

- logo ;
- bouton de connexion ;
- menu ;
- CTA accessible dans le menu.

Header collant avec fond légèrement flouté après scroll.

## 6. Footer

Colonnes :

- Produit ;
- Entreprise ;
- Aide ;
- Légal ;
- Pays.

Inclure :

- email ;
- téléphone ;
- adresse ;
- réseaux ;
- badges stores ;
- choix de langue ;
- thème.

## 7. Composants web

- `MarketingHeader`
- `Hero`
- `TransferSimulator`
- `CountrySelect`
- `OperatorSelect`
- `QuoteSummary`
- `FeatureCard`
- `HowItWorks`
- `CountryGrid`
- `TrustSection`
- `MobileAppShowcase`
- `FaqAccordion`
- `Testimonials`
- `CtaBanner`
- `MarketingFooter`
- `LegalLayout`
- `AuthCard`

## 8. SEO et SSR

Chaque page doit avoir :

- title ;
- meta description ;
- canonical ;
- Open Graph ;
- données structurées si pertinentes ;
- contenu SSR ;
- URLs lisibles ;
- performances optimisées.

## 9. Performance

- images modernes ;
- lazy loading ;
- Lottie chargé à la demande ;
- taille JS maîtrisée ;
- skeleton si nécessaire ;
- éviter les vidéos lourdes au premier écran.

## 10. Responsive

Breakpoints recommandés :

```text
sm 640
md 768
lg 1024
xl 1280
2xl 1536
```

Règles :

- mobile-first ;
- simulateur empilé sur mobile ;
- hero sur une colonne mobile ;
- deux colonnes desktop ;
- navigation adaptée ;
- tableaux remplacés par cartes sous 768 px.

## 11. Dark mode site

Le dark mode est disponible mais le thème clair reste le thème marketing par défaut.

Le choix est mémorisé et suit le système si l’utilisateur n’a pas choisi.
