# AfrikaTrans — Exigences métier

## 1. Finalité

Ce document décrit les besoins métier à satisfaire indépendamment des choix techniques.

## 2. Besoins principaux

### BR-001 — Création de compte
Le client doit pouvoir créer un compte avec son numéro de téléphone, ses informations personnelles et la validation d’un OTP.

### BR-002 — Authentification sécurisée
Le client doit pouvoir se connecter avec téléphone et mot de passe ou PIN, avec biométrie locale en option.

### BR-003 — Simulation
Le client doit pouvoir connaître avant paiement :

- le montant envoyé ;
- les frais ;
- le taux appliqué ;
- le montant total à débiter ;
- le montant reçu ;
- le délai estimé.

### BR-004 — Transfert multi-pays
Le système doit permettre de transférer entre plusieurs pays selon des corridors configurables.

### BR-005 — Multi-opérateurs
Le système doit gérer plusieurs opérateurs par pays.

### BR-006 — Bénéficiaires
Le client doit pouvoir enregistrer et réutiliser ses bénéficiaires.

### BR-007 — Confirmation
Toute opération financière doit être confirmée par un facteur sécurisé : PIN, biométrie ou OTP selon la politique de risque.

### BR-008 — Suivi
Le client doit voir l’état exact de son transfert.

### BR-009 — Reçu
Un reçu horodaté et partageable doit être généré pour toute transaction finalisée.

### BR-010 — Historique
Le client doit consulter, rechercher et filtrer ses opérations.

### BR-011 — Gestion des incidents
Les équipes internes doivent pouvoir suivre, diagnostiquer et traiter les opérations bloquées ou échouées.

### BR-012 — Tarification dynamique
Les tarifs doivent être configurables par pays, corridor, opérateur, montant, date et type de client.

### BR-013 — Conformité
Le système doit appliquer des niveaux de vérification et des limites adaptées.

### BR-014 — Audit
Toute action sensible doit être enregistrée.

### BR-015 — Reporting
Les équipes doivent pouvoir exporter des rapports d’activité, financiers et opérationnels.

## 3. Exigences opérationnelles

- continuité de service ;
- reprise sur erreur ;
- retries contrôlés ;
- prévention des doublons ;
- suivi des appels opérateur ;
- gestion des webhooks ;
- journal des changements de statut ;
- capacité de rapprochement.

## 4. Exigences financières

Le système doit distinguer :

- montant source ;
- devise source ;
- frais client ;
- commission opérateur ;
- commission partenaire ;
- marge AfrikaTrans ;
- montant destination ;
- devise destination ;
- taux de change ;
- montant remboursé.

## 5. Exigences administratives

L’administration doit permettre :

- gestion des utilisateurs ;
- gestion des rôles ;
- configuration des pays ;
- configuration des opérateurs ;
- configuration des corridors ;
- configuration des tarifs ;
- suivi des transactions ;
- gestion KYC ;
- gestion fraude ;
- export ;
- audit.

## 6. Contraintes

- dépendance aux APIs opérateurs ;
- disponibilité variable selon les pays ;
- règles réglementaires variables ;
- gestion multi-devise ;
- exactitude comptable ;
- besoin d’une forte traçabilité.

## 7. Critères d’acceptation globaux

Le produit est acceptable lorsque :

1. un utilisateur peut s’inscrire et se connecter ;
2. il peut simuler un transfert ;
3. les frais affichés sont identiques aux frais enregistrés ;
4. une transaction n’est jamais dupliquée ;
5. le statut client correspond au statut métier ;
6. toutes les opérations sensibles sont auditables ;
7. les équipes peuvent diagnostiquer un échec.
