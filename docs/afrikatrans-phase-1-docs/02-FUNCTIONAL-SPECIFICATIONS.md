# AfrikaTrans — Spécifications fonctionnelles

## 1. Authentification

### 1.1 Inscription

Champs :

- pays de résidence ;
- prénom ;
- nom ;
- téléphone ;
- email optionnel ;
- mot de passe ;
- acceptation CGU et politique de confidentialité.

Étapes :

1. saisie des informations ;
2. validation du numéro ;
3. envoi OTP ;
4. vérification OTP ;
5. création du compte ;
6. création du PIN ;
7. proposition d’activation biométrique.

### 1.2 Connexion

Méthodes :

- téléphone + mot de passe ;
- téléphone + PIN ;
- biométrie sur appareil déjà approuvé.

### 1.3 Mot de passe oublié

1. saisir téléphone ;
2. recevoir OTP ;
3. vérifier OTP ;
4. définir un nouveau mot de passe ;
5. invalider les sessions sensibles si nécessaire.

## 2. Accueil mobile

Contenus :

- salutation ;
- bouton Envoyer ;
- raccourci Historique ;
- bénéficiaires récents ;
- dernières transactions ;
- notifications ;
- accès support.

## 3. Simulation

Entrées :

- pays source ;
- opérateur source ;
- pays destination ;
- opérateur destination ;
- montant ;
- sens du calcul : « montant envoyé » ou « montant reçu ».

Sorties :

- frais ;
- taux ;
- montant total ;
- montant reçu ;
- délai estimé ;
- validité du devis.

## 4. Création d’un transfert

Étapes :

1. source ;
2. destination ;
3. bénéficiaire ;
4. montant ;
5. motif ;
6. devis ;
7. récapitulatif ;
8. confirmation de sécurité ;
9. traitement ;
10. résultat.

## 5. Bénéficiaires

Fonctions :

- ajouter ;
- modifier ;
- supprimer ;
- marquer comme favori ;
- rechercher ;
- sélectionner pour un transfert.

## 6. Historique

Filtres :

- statut ;
- date ;
- pays ;
- opérateur ;
- bénéficiaire ;
- montant.

Détail :

- référence ;
- dates ;
- source ;
- destination ;
- frais ;
- taux ;
- statuts ;
- reçu ;
- assistance.

## 7. Notifications

Canaux :

- push ;
- SMS ;
- email ;
- notification in-app.

Événements :

- OTP ;
- transfert initié ;
- transfert en cours ;
- succès ;
- échec ;
- remboursement ;
- alerte sécurité.

## 8. Profil

Fonctions :

- consulter ;
- modifier ;
- KYC ;
- gérer les appareils ;
- modifier mot de passe ;
- modifier PIN ;
- préférences de notification ;
- langue ;
- déconnexion.

## 9. Administration

Modules :

- dashboard ;
- transactions ;
- utilisateurs ;
- KYC ;
- pays ;
- opérateurs ;
- corridors ;
- tarifs ;
- commissions ;
- partenaires ;
- réconciliation ;
- remboursements ;
- incidents ;
- fraude ;
- rapports ;
- rôles ;
- audit ;
- configuration.

## 10. États d’interface

Chaque écran doit gérer :

- chargement ;
- vide ;
- erreur ;
- hors ligne ;
- succès ;
- données partielles ;
- action indisponible.
