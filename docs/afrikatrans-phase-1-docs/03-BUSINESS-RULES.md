# AfrikaTrans — Règles métier

## 1. Identifiants

### BRULE-001
Chaque transaction possède une référence publique unique et un identifiant technique interne.

### BRULE-002
Une même demande de création doit être protégée par une clé d’idempotence.

## 2. Devis

### BRULE-003
Tout transfert doit être basé sur un devis valide.

### BRULE-004
Le devis contient les frais, commissions, taux, montants et sa date d’expiration.

### BRULE-005
Un devis expiré doit être recalculé avant confirmation.

## 3. Montants

### BRULE-006
Tous les montants sont stockés en unité minimale de devise lorsque possible.

### BRULE-007
Le système ne doit jamais utiliser les nombres flottants natifs pour les calculs financiers.

### BRULE-008
Le montant total payé doit être expliqué par une formule explicite.

## 4. Transactions

### BRULE-009
Une transaction confirmée ne peut plus être modifiée.

### BRULE-010
Une transaction réussie ne peut pas revenir à un état antérieur.

### BRULE-011
Chaque changement de statut crée un événement immuable.

### BRULE-012
Les appels aux opérateurs doivent être corrélés à la transaction.

### BRULE-013
Un webhook doit être authentifié et traité de manière idempotente.

## 5. Sécurité

### BRULE-014
Le PIN n’est jamais stocké en clair.

### BRULE-015
Le nombre d’essais PIN et OTP est limité.

### BRULE-016
Les actions sensibles peuvent imposer une réauthentification.

## 6. KYC

### BRULE-017
Les limites dépendent du niveau KYC.

### BRULE-018
Une opération peut être bloquée si le profil est incomplet, expiré ou sous revue.

## 7. Tarification

### BRULE-019
Une seule règle tarifaire active doit être sélectionnée selon une priorité déterministe.

### BRULE-020
Les frais appliqués sont figés dans la transaction.

### BRULE-021
Une modification tarifaire n’affecte jamais les transactions historiques.

## 8. Limites

### BRULE-022
Les plafonds peuvent être configurés par transaction, jour, semaine et mois.

### BRULE-023
Les plafonds peuvent dépendre du pays, opérateur, corridor, KYC et profil de risque.

## 9. Remboursements

### BRULE-024
Un remboursement doit référencer la transaction d’origine.

### BRULE-025
Un remboursement partiel ou total doit être explicitement distingué.

### BRULE-026
Aucun remboursement ne doit dépasser le montant éligible.

## 10. Administration

### BRULE-027
Les changements de configuration sensibles nécessitent un audit.

### BRULE-028
Les opérations critiques peuvent nécessiter une validation à deux niveaux.

## 11. Données

### BRULE-029
Les données financières et les journaux d’audit ne sont pas supprimés physiquement sans politique légale validée.

### BRULE-030
Les données personnelles doivent être minimisées et protégées.
