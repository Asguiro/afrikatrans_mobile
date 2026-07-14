# AfrikaTrans — Rôles et permissions

## 1. Client

Peut :

- gérer son compte ;
- gérer son profil ;
- effectuer un KYC ;
- simuler ;
- transférer ;
- gérer ses bénéficiaires ;
- consulter son historique ;
- télécharger ses reçus ;
- contacter le support.

Ne peut pas :

- modifier une transaction confirmée ;
- voir les données d’un autre client ;
- modifier les tarifs.

## 2. Agent support

Peut :

- rechercher un client ;
- consulter les transactions ;
- voir les statuts et événements ;
- ouvrir un incident ;
- ajouter des notes internes ;
- renvoyer certaines notifications.

Ne peut pas :

- modifier les montants ;
- changer les règles tarifaires ;
- valider seul un remboursement important.

## 3. Opérateur métier

Peut :

- surveiller les flux ;
- relancer une opération éligible ;
- gérer les exceptions ;
- traiter les incidents ;
- déclencher des actions contrôlées.

## 4. Responsable conformité

Peut :

- consulter les dossiers KYC ;
- approuver ou rejeter ;
- demander des documents ;
- suspendre un compte ;
- créer une alerte ;
- analyser les risques.

## 5. Responsable finance

Peut :

- consulter les flux financiers ;
- lancer des rapprochements ;
- traiter les écarts ;
- consulter les commissions ;
- exporter les rapports ;
- initier un remboursement selon délégation.

## 6. Administrateur fonctionnel

Peut :

- gérer pays ;
- gérer opérateurs ;
- gérer corridors ;
- gérer tarifs ;
- gérer limites ;
- gérer contenus et paramètres.

## 7. Super administrateur

Peut :

- gérer les rôles ;
- gérer les comptes administratifs ;
- accéder à toutes les configurations ;
- superviser l’audit.

Ce rôle doit être fortement restreint et protégé par MFA.

## 8. Auditeur

Accès lecture seule à :

- transactions ;
- configurations ;
- journaux ;
- événements ;
- rapports.

## 9. Intégrateur / partenaire

Peut :

- consulter ses propres opérations ;
- consulter ses commissions ;
- télécharger ses rapports ;
- gérer ses clés API selon politique.

## 10. Matrice simplifiée

| Module | Client | Support | Opérations | Conformité | Finance | Admin | Super Admin |
|---|---:|---:|---:|---:|---:|---:|---:|
| Profil personnel | RW | R | R | R | R | R | RW |
| Transactions | R propres | R | RW contrôlé | R | R | R | RW |
| KYC | RW propre | R | R | RW | R | R | RW |
| Tarifs | - | - | R | R | R | RW | RW |
| Remboursements | Demande | R | Initier | R | Valider | R | RW |
| Audit | - | - | R limité | R | R | R | R |
| Rôles | - | - | - | - | - | R limité | RW |
