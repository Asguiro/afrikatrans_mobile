# AfrikaTrans — Sécurité et observabilité backend

## 1. Logs

Logs structurés JSON.

Champs :

```text
timestamp
level
requestId
correlationId
userId
transactionId
module
action
duration
status
```

Ne jamais logger :

- mot de passe ;
- PIN ;
- OTP ;
- token ;
- document complet ;
- données bancaires sensibles.

## 2. Correlation ID

Chaque requête reçoit :

```http
X-Request-Id
```

Chaque transaction utilise aussi une corrélation métier.

## 3. Metrics

Mesurer :

- requêtes ;
- latence ;
- erreurs ;
- jobs ;
- retries ;
- timeouts ;
- succès opérateur ;
- taux de transaction ;
- durée de transfert.

## 4. Alertes

- échec massif ;
- opérateur indisponible ;
- queue bloquée ;
- forte latence ;
- webhooks invalides ;
- rapprochement en écart ;
- taux d’échec inhabituel.

## 5. Protection API

- Helmet ;
- CORS strict ;
- rate limiting ;
- validation ;
- body size limit ;
- timeout ;
- sanitation ;
- auth ;
- permission.

## 6. Secrets

- variables d’environnement ;
- jamais dans Git ;
- rotation ;
- accès restreint.

## 7. Base

- TLS ;
- utilisateur dédié ;
- sauvegardes ;
- migrations contrôlées ;
- accès réseau limité ;
- chiffrement des données très sensibles si nécessaire.

## 8. Audit

Actions auditées :

- connexion admin ;
- changement de rôle ;
- changement de tarif ;
- activation opérateur ;
- remboursement ;
- blocage utilisateur ;
- décision KYC ;
- modification de limites.
