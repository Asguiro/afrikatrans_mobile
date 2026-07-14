# AfrikaTrans — Conception API

## 1. Convention

Préfixe :

```text
/api/v1
```

Format :

```json
{
  "data": {},
  "meta": {},
  "error": null
}
```

Erreur :

```json
{
  "data": null,
  "error": {
    "code": "TRANSACTION_NOT_FOUND",
    "message": "Transaction introuvable",
    "details": null
  }
}
```

## 2. Versionnement

Utiliser l’URI :

```text
/api/v1
```

Les changements incompatibles passent en `v2`.

## 3. Documentation

Swagger disponible :

```text
/api/docs
```

OpenAPI exporté dans le dépôt.

## 4. Authentification

```http
POST /api/v1/auth/register
POST /api/v1/auth/verify-otp
POST /api/v1/auth/resend-otp
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
POST /api/v1/auth/pin
POST /api/v1/auth/pin/verify
GET  /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:id
```

## 5. Utilisateur

```http
GET   /api/v1/me
PATCH /api/v1/me
GET   /api/v1/me/security
PATCH /api/v1/me/preferences
GET   /api/v1/me/devices
DELETE /api/v1/me/devices/:id
```

## 6. Référentiels

```http
GET /api/v1/countries
GET /api/v1/countries/:iso2
GET /api/v1/currencies
GET /api/v1/operators
GET /api/v1/operators/:id
GET /api/v1/corridors
GET /api/v1/corridors/:id
```

Filtres :

```text
sourceCountry
destinationCountry
country
status
capability
```

## 7. Bénéficiaires

```http
GET    /api/v1/beneficiaries
POST   /api/v1/beneficiaries
GET    /api/v1/beneficiaries/:id
PATCH  /api/v1/beneficiaries/:id
DELETE /api/v1/beneficiaries/:id
POST   /api/v1/beneficiaries/:id/favorite
DELETE /api/v1/beneficiaries/:id/favorite
```

## 8. Devis

```http
POST /api/v1/quotes
GET  /api/v1/quotes/:id
```

Requête :

```json
{
  "sourceCountry": "GA",
  "destinationCountry": "SN",
  "sourceOperatorId": "op_airtel_ga",
  "destinationOperatorId": "op_wave_sn",
  "amount": "10000",
  "amountMode": "SOURCE"
}
```

Réponse :

```json
{
  "data": {
    "id": "quote_123",
    "sourceAmount": "10000.00",
    "sourceCurrency": "XAF",
    "serviceFee": "800.00",
    "operatorFee": "200.00",
    "totalFee": "1000.00",
    "totalToPay": "11000.00",
    "exchangeRate": "1.00000000",
    "destinationAmount": "10000.00",
    "destinationCurrency": "XOF",
    "expiresAt": "2026-07-13T15:15:00Z"
  }
}
```

## 9. Transactions

```http
POST /api/v1/transactions
GET  /api/v1/transactions
GET  /api/v1/transactions/:id
POST /api/v1/transactions/:id/confirm
POST /api/v1/transactions/:id/cancel
GET  /api/v1/transactions/:id/status
GET  /api/v1/transactions/:id/receipt
POST /api/v1/transactions/:id/report-issue
```

Création :

```json
{
  "quoteId": "quote_123",
  "beneficiaryId": "beneficiary_123",
  "sourcePhone": "+241074967878",
  "transferPurpose": "FAMILY_SUPPORT"
}
```

Header obligatoire :

```http
Idempotency-Key: 0f48f5f4-...
```

## 10. Webhooks opérateurs

```http
POST /api/v1/webhooks/operators/:operatorCode
```

Exigences :

- signature ;
- horodatage ;
- anti-rejeu ;
- persistance brute ;
- traitement asynchrone ;
- réponse rapide.

## 11. Administration

Préfixe :

```text
/api/v1/admin
```

Exemples :

```http
GET /api/v1/admin/dashboard
GET /api/v1/admin/transactions
GET /api/v1/admin/transactions/:id
POST /api/v1/admin/transactions/:id/retry
POST /api/v1/admin/transactions/:id/refund
GET /api/v1/admin/users
GET /api/v1/admin/operators
PATCH /api/v1/admin/operators/:id/status
GET /api/v1/admin/pricing-rules
POST /api/v1/admin/pricing-rules
```

## 12. Pagination

Cursor pagination recommandée :

```text
?limit=25&cursor=xxx
```

Réponse :

```json
{
  "data": [],
  "meta": {
    "nextCursor": "xxx",
    "hasMore": true
  }
}
```

## 13. Tri et filtres

```text
?status=SUCCESS
&from=2026-07-01
&to=2026-07-31
&sort=-createdAt
```

## 14. Codes d’erreur métier

```text
AUTH_INVALID_CREDENTIALS
AUTH_OTP_EXPIRED
AUTH_OTP_INVALID
AUTH_SESSION_EXPIRED
QUOTE_EXPIRED
CORRIDOR_UNAVAILABLE
OPERATOR_UNAVAILABLE
AMOUNT_BELOW_MINIMUM
AMOUNT_ABOVE_MAXIMUM
INSUFFICIENT_LIMIT
KYC_REQUIRED
TRANSACTION_DUPLICATE
TRANSACTION_INVALID_STATE
PAYMENT_FAILED
PAYOUT_FAILED
REFUND_NOT_ALLOWED
RATE_LIMIT_EXCEEDED
```

## 15. Sécurité API

- HTTPS ;
- CORS strict ;
- rate limiting ;
- validation ;
- sérialisation ;
- headers de sécurité ;
- scopes ;
- permissions ;
- journalisation ;
- anti-bruteforce.
