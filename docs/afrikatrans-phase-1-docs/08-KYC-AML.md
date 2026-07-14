# AfrikaTrans — KYC et AML

## 1. Objectif

Mettre en place une conformité progressive permettant d’identifier les clients, de contrôler les risques et de respecter les obligations applicables dans les pays d’activité.

Ce document est un cadre fonctionnel. Les règles finales doivent être validées par des spécialistes juridiques et conformité locaux.

## 2. Niveaux KYC

### Niveau 0 — Compte créé

- téléphone vérifié ;
- accès limité ;
- plafonds très faibles ou simulation uniquement.

### Niveau 1 — Identité de base

- prénom ;
- nom ;
- date de naissance ;
- pays ;
- adresse ;
- pièce d’identité.

### Niveau 2 — Identité renforcée

- document validé ;
- selfie ou preuve de présence ;
- contrôle de cohérence ;
- informations complémentaires.

### Niveau 3 — Due diligence renforcée

- justificatifs supplémentaires ;
- source des fonds ;
- revue manuelle ;
- seuils supérieurs.

## 3. Statuts KYC

- NOT_STARTED ;
- IN_PROGRESS ;
- SUBMITTED ;
- UNDER_REVIEW ;
- APPROVED ;
- REJECTED ;
- EXPIRED ;
- REQUIRES_UPDATE.

## 4. Contrôles AML

Le système doit pouvoir appliquer :

- limites cumulées ;
- vélocité des transactions ;
- fréquence inhabituelle ;
- multiplicité de bénéficiaires ;
- multiplicité d’appareils ;
- montants fractionnés ;
- comportements anormaux ;
- pays ou corridor à risque ;
- incohérences de profil ;
- listes de surveillance si un fournisseur est retenu.

## 5. Score de risque

Facteurs possibles :

- KYC ;
- appareil ;
- géolocalisation approximative ;
- ancienneté ;
- montant ;
- fréquence ;
- corridor ;
- historique d’échec ;
- comportement.

Décisions :

- autoriser ;
- autoriser avec contrôle supplémentaire ;
- demander OTP ;
- mettre en attente ;
- bloquer ;
- envoyer en revue manuelle.

## 6. Dossier client

Conserver :

- données d’identité ;
- documents ;
- résultats de vérification ;
- dates d’expiration ;
- historique de décisions ;
- commentaires ;
- preuves d’accord.

## 7. Confidentialité

- minimisation ;
- chiffrement ;
- accès par rôle ;
- journalisation ;
- durée de conservation définie ;
- suppression ou anonymisation selon obligations.

## 8. Alertes

Une alerte comporte :

- type ;
- score ;
- gravité ;
- transaction ;
- utilisateur ;
- éléments déclencheurs ;
- décision ;
- analyste ;
- commentaires.

## 9. Revue manuelle

Actions :

- approuver ;
- rejeter ;
- demander des informations ;
- suspendre ;
- escalader.

Toutes les décisions sont auditées.
