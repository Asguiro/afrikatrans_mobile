# AfrikaTrans — Design du tableau d’administration

## 1. Objectif

Le tableau d’administration doit permettre aux équipes de piloter les opérations sans dépendre des développeurs.

Il doit servir :

- aux opérations ;
- au support ;
- à la finance ;
- à la conformité ;
- aux administrateurs ;
- aux responsables métier.

## 2. Stack

```text
React Router v7 SSR
TypeScript
Tailwind CSS
DaisyUI
TanStack Query
TanStack Table
TanStack Form
Lucide React
Recharts
```

## 3. Structure globale

Desktop :

```text
Sidebar
Topbar
Breadcrumb
Page header
Filters
Content
Context panel / modal
```

La sidebar est :

- large à partir de 1280 px ;
- compacte entre 1024 et 1279 px ;
- transformée en drawer sous 1024 px.

## 4. Navigation

### Vue d’ensemble

- Tableau de bord ;
- Activité temps réel.

### Opérations

- Transactions ;
- Transferts en attente ;
- Échecs ;
- Remboursements ;
- Litiges ;
- Rapprochements.

### Clients

- Utilisateurs ;
- Bénéficiaires ;
- KYC ;
- Appareils ;
- Sessions.

### Réseau

- Pays ;
- Devises ;
- Opérateurs ;
- Corridors ;
- Intégrations ;
- Santé des fournisseurs.

### Finance

- Tarification ;
- Commissions ;
- Revenus ;
- Règlements ;
- Rapports ;
- Exports.

### Risque et conformité

- Alertes ;
- AML ;
- Listes de surveillance ;
- Limites ;
- Cas à examiner.

### Support

- Tickets ;
- Incidents ;
- Modèles de réponse ;
- FAQ.

### Administration

- Utilisateurs internes ;
- Rôles ;
- Permissions ;
- Paramètres ;
- Notifications ;
- Audit ;
- Logs.

## 5. Dashboard

### KPI principaux

- volume transféré ;
- transactions ;
- taux de réussite ;
- chiffre d’affaires ;
- revenus nets ;
- frais ;
- montant en attente ;
- remboursements.

### Graphiques

- volume par jour ;
- transactions par statut ;
- corridors ;
- opérateurs ;
- revenus ;
- erreurs fournisseurs.

### Blocs opérationnels

- transactions bloquées ;
- échecs récents ;
- alertes conformité ;
- rapprochements à traiter ;
- opérateurs dégradés.

## 6. Liste de transactions

Colonnes :

- référence ;
- date ;
- expéditeur ;
- bénéficiaire ;
- corridor ;
- opérateurs ;
- montant source ;
- montant destination ;
- frais ;
- statut ;
- risque ;
- action.

Fonctions :

- recherche ;
- filtres ;
- tri ;
- pagination ;
- colonnes configurables ;
- export ;
- vues enregistrées ;
- sélection multiple selon permissions.

## 7. Détail de transaction

Organisation :

### En-tête

- référence ;
- statut ;
- risque ;
- actions autorisées.

### Résumé

- montants ;
- frais ;
- taux ;
- corridor ;
- opérateurs.

### Parties

- expéditeur ;
- bénéficiaire.

### Chronologie

- création ;
- paiement ;
- envoi ;
- callbacks ;
- succès ou échec ;
- remboursement.

### Technique

- provider request id ;
- idempotency key ;
- payloads masqués ;
- erreurs ;
- tentatives.

### Audit

- utilisateur ;
- action ;
- date ;
- justification.

## 8. Gestion tarifaire

Écran avec :

- corridors ;
- règles actives ;
- dates d’effet ;
- paliers ;
- frais fixes ;
- pourcentages ;
- marges ;
- promotions ;
- simulation avant publication ;
- double validation.

Aucun tarif ne doit être modifié directement depuis un tableau sans confirmation.

## 9. KYC

Vue :

- identité ;
- niveau ;
- documents ;
- contrôles ;
- statut ;
- historique ;
- décisions ;
- justification obligatoire.

Les documents sensibles sont masqués par défaut.

## 10. Design des tables

Desktop :

- entête collant ;
- densité normale par défaut ;
- mode compact optionnel ;
- largeur contrôlée ;
- scroll horizontal si nécessaire ;
- actions dans menu contextuel.

Mobile/tablette :

- cartes de résumé ;
- filtres en drawer ;
- colonnes prioritaires uniquement.

## 11. Formulaires

Pour les formulaires longs :

- sections ;
- progression ;
- sauvegarde brouillon ;
- validation inline ;
- résumé avant publication.

## 12. Actions critiques

Exemples :

- annuler ;
- rembourser ;
- bloquer ;
- débloquer ;
- valider KYC ;
- changer un tarif ;
- modifier une permission.

Exiger :

- modal ;
- résumé ;
- motif ;
- confirmation ;
- permission ;
- audit.

Pour certaines actions :

- second facteur ;
- double validation.

## 13. États du dashboard

Chaque bloc doit gérer :

- loading ;
- empty ;
- error ;
- stale ;
- permission denied ;
- maintenance.

## 14. Responsive admin

- desktop prioritaire ;
- tablette pleinement utilisable ;
- mobile réservé aux consultations et actions simples ;
- ne pas tenter d’afficher les grandes tables complètes sur mobile.

## 15. Dark mode admin

Le dark mode est pleinement supporté.

Exigences :

- graphiques lisibles ;
- grille discrète ;
- statuts accessibles ;
- tables non éblouissantes ;
- contrastes maîtrisés ;
- éditeurs et logs adaptés.
