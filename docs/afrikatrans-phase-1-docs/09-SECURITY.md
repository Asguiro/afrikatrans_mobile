# AfrikaTrans — Sécurité

## 1. Principes

- zero trust ;
- moindre privilège ;
- défense en profondeur ;
- chiffrement ;
- secrets hors du code ;
- audit ;
- sécurité par défaut.

## 2. Authentification

- mot de passe haché avec un algorithme moderne ;
- OTP à durée limitée ;
- PIN haché séparément ;
- limitation d’essais ;
- verrouillage temporaire ;
- MFA obligatoire pour l’administration ;
- rotation et révocation des sessions.

## 3. Mobile React Native

Stack retenue :

- React Native  ;
- React Navigation ;
- TanStack Query ;
- stockage sécurisé natif pour les secrets ;
- biométrie via APIs natives ou bibliothèque compatible React Native CLI.

Règles :

- aucun token sensible dans AsyncStorage ;
- désactiver les logs sensibles en production ;
- protéger les écrans sensibles contre les captures selon faisabilité ;
- détecter les sessions expirées ;
- vérifier l’intégrité des deep links ;
- ne jamais faire confiance aux données calculées côté mobile.

## 4. API

- validation stricte des entrées ;
- authentification JWT courte durée ;
- refresh tokens rotatifs ;
- rate limiting ;
- idempotence ;
- CORS strict ;
- headers de sécurité ;
- protection contre injections ;
- journalisation corrélée ;
- contrôle RBAC/ABAC.

## 5. Web et administration

- SSR sécurisé ;
- cookies HttpOnly si stratégie session web ;
- SameSite ;
- CSRF selon architecture ;
- CSP ;
- protection XSS ;
- pas de secrets dans le bundle ;
- contrôle des routes côté serveur.

## 6. Données

- TLS en transit ;
- chiffrement au repos ;
- champs sensibles chiffrés applicativement si nécessaire ;
- sauvegardes ;
- restauration testée ;
- séparation des environnements.

## 7. Opérateurs et webhooks

- signatures ;
- allowlist si disponible ;
- timestamp anti-rejeu ;
- idempotence ;
- validation du payload ;
- conservation du payload brut chiffré si nécessaire ;
- réponse rapide puis traitement asynchrone.

## 8. Secrets

- gestionnaire de secrets ;
- rotation ;
- accès restreint ;
- aucune clé dans Git ;
- clés distinctes par environnement.

## 9. Audit

Journaliser :

- connexion ;
- échec ;
- changement de rôle ;
- changement tarifaire ;
- action transactionnelle ;
- remboursement ;
- décision KYC ;
- export de données.

## 10. Observabilité

- logs structurés ;
- métriques ;
- traces ;
- alertes ;
- suivi des erreurs ;
- corrélation par requestId, transactionId et providerRequestId.

## 11. Sécurité du développement

- revue de code ;
- lint ;
- tests ;
- scan des dépendances ;
- scan des secrets ;
- CI obligatoire ;
- protection des branches ;
- mise à jour régulière des dépendances.

## 12. Réponse à incident

Prévoir :

- classification ;
- confinement ;
- analyse ;
- correction ;
- communication ;
- post-mortem ;
- actions préventives.
