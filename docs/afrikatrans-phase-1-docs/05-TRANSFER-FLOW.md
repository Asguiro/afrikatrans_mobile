# AfrikaTrans — Parcours de transfert

## 1. Préconditions

Le client doit :

- être authentifié ;
- avoir un compte actif ;
- respecter les conditions KYC ;
- ne pas être bloqué ;
- disposer d’un appareil autorisé si requis.

## 2. Parcours nominal

### Étape 1 — Choisir la source

- pays source ;
- devise source ;
- opérateur source ;
- numéro payeur.

### Étape 2 — Choisir la destination

- pays destination ;
- devise destination ;
- opérateur destination.

### Étape 3 — Bénéficiaire

- sélectionner un bénéficiaire ; ou
- créer un bénéficiaire.

Informations minimales :

- prénom et nom ;
- téléphone ;
- pays ;
- opérateur.

### Étape 4 — Montant

Deux modes :

1. je saisis le montant envoyé ;
2. je saisis le montant à recevoir.

Le système calcule le reste.

### Étape 5 — Motif

Exemples :

- aide familiale ;
- frais de santé ;
- études ;
- dépenses personnelles ;
- commerce ;
- autre.

### Étape 6 — Génération du devis

Le backend retourne :

- montant source ;
- frais ;
- commission ;
- taux ;
- montant total ;
- montant destination ;
- expiration ;
- délai estimé.

### Étape 7 — Vérification

Le client voit un récapitulatif complet et doit confirmer les coordonnées.

### Étape 8 — Authentification forte

Selon le risque :

- PIN ;
- biométrie ;
- OTP ;
- combinaison de facteurs.

### Étape 9 — Débit

Le système initie le paiement chez l’opérateur source.

### Étape 10 — Crédit

Après confirmation du débit, le système initie le crédit chez l’opérateur destination.

### Étape 11 — Finalisation

Le système :

- met à jour le statut ;
- génère le reçu ;
- notifie le client ;
- journalise les événements.

## 3. Parcours d’échec

### Échec avant débit

- transaction échouée ;
- aucun crédit ;
- aucun remboursement nécessaire.

### Débit confirmé, crédit en attente

- transaction en attente de livraison ;
- retries contrôlés ;
- surveillance opérationnelle.

### Débit confirmé, crédit impossible

- transaction à rembourser ;
- création d’un dossier d’exception ;
- information du client.

## 4. Garde-fous UX

- ne jamais masquer les frais ;
- afficher le montant final avant confirmation ;
- demander une confirmation explicite ;
- afficher clairement le bénéficiaire ;
- empêcher les doubles clics ;
- conserver une trace de l’état ;
- proposer une aide en cas de blocage.

## 5. Séquence technique simplifiée

```text
Mobile/Web
   |
   | POST /quotes
   v
API -> Pricing Engine
   |
   | quote
   v
Client
   |
   | POST /transfers + Idempotency-Key
   v
API -> Risk/KYC -> Source Operator
   |
   | debit confirmed
   v
Destination Operator
   |
   | credit confirmed
   v
API -> Notification -> Receipt
```
