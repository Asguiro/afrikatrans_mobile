# AfrikaTrans — Règles de tarification

## 1. Objectif

Permettre une tarification configurable, explicable, versionnée et reproductible.

## 2. Composants du prix

- montant source ;
- frais fixes ;
- frais variables ;
- frais opérateur source ;
- frais opérateur destination ;
- commission partenaire ;
- marge AfrikaTrans ;
- taux de change ;
- éventuelle promotion ;
- taxes applicables.

## 3. Types de règles

### Pourcentage

```text
frais = montant × taux
```

### Fixe

```text
frais = montant fixe
```

### Hybride

```text
frais = montant fixe + montant × taux
```

### Par paliers

Exemple :

- 0 à 50 000 : 10 % ;
- 50 001 à 150 000 : 8 % ;
- au-delà : 6 %.

## 4. Critères d’éligibilité

Une règle peut dépendre de :

- pays source ;
- pays destination ;
- devise ;
- opérateur source ;
- opérateur destination ;
- corridor ;
- montant ;
- niveau KYC ;
- segment client ;
- canal ;
- période ;
- promotion.

## 5. Priorité

Ordre recommandé :

1. promotion spécifique ;
2. règle opérateur + corridor ;
3. règle corridor ;
4. règle pays ;
5. règle globale.

À priorité égale, la règle la plus spécifique prévaut.

## 6. Versionnement

Chaque règle possède :

- id ;
- version ;
- date d’effet ;
- date de fin ;
- statut ;
- auteur ;
- date de création.

## 7. Devis

Le devis enregistre :

- règle utilisée ;
- version ;
- formule ;
- détail des frais ;
- taux ;
- validité ;
- montants calculés.

## 8. Arrondis

Les règles d’arrondi sont définies par devise et documentées.

Aucun arrondi implicite ne doit être appliqué.

## 9. Promotions

Types :

- réduction fixe ;
- réduction en pourcentage ;
- frais offerts ;
- premier transfert ;
- code promotionnel ;
- corridor promotionnel.

## 10. Exigence de transparence

Avant confirmation, le client voit :

- le montant envoyé ;
- le détail des frais ;
- le total à payer ;
- le montant reçu ;
- le taux ;
- la durée de validité du devis.
