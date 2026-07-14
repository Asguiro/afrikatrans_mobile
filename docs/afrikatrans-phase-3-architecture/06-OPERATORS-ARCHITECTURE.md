# AfrikaTrans — Architecture des opérateurs

## 1. Objectif

Ajouter un nouvel opérateur sans modifier le cœur des transactions.

## 2. Modèle

```text
Transaction Domain
        │
        ▼
Operator Gateway Registry
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Airtel  Wave   Orange Money
```

## 3. Interface commune

```ts
export interface OperatorGateway {
  getCapabilities(): OperatorCapabilities;

  initiateDebit(
    input: InitiateDebitInput,
  ): Promise<OperatorOperationResult>;

  getDebitStatus(
    input: GetOperationStatusInput,
  ): Promise<OperatorOperationStatus>;

  initiatePayout(
    input: InitiatePayoutInput,
  ): Promise<OperatorOperationResult>;

  getPayoutStatus(
    input: GetOperationStatusInput,
  ): Promise<OperatorOperationStatus>;

  initiateRefund?(
    input: InitiateRefundInput,
  ): Promise<OperatorOperationResult>;

  validateWebhook(
    input: ValidateWebhookInput,
  ): Promise<boolean>;

  normalizeWebhook(
    input: NormalizeWebhookInput,
  ): Promise<NormalizedOperatorEvent>;
}
```

## 4. Capacités

```ts
type OperatorCapabilities = {
  debit: boolean;
  payout: boolean;
  refund: boolean;
  webhook: boolean;
  polling: boolean;
  beneficiaryNameLookup: boolean;
};
```

## 5. Registry

```ts
OperatorGatewayRegistry
```

Responsabilité :

```text
operatorId
↓
integrationKey
↓
gateway
```

Aucune condition géante :

```ts
if (operator === 'AIRTEL') ...
```

dans le service transaction.

## 6. Configuration

Ne pas stocker les secrets directement dans la base.

Base :

- URL ;
- mode ;
- timeout ;
- statut ;
- capacités ;
- options non sensibles.

Secrets :

- variables d’environnement ;
- secret manager si disponible.

## 7. Mapping

Chaque gateway transforme :

```text
modèle AfrikaTrans
↔
modèle fournisseur
```

Le domaine ne connaît pas les champs spécifiques de l’opérateur.

## 8. Réponses normalisées

```ts
type OperatorOperationResult = {
  accepted: boolean;
  providerReference?: string;
  providerStatus: string;
  message?: string;
  rawCode?: string;
};
```

## 9. Statut normalisé

```text
PENDING
PROCESSING
SUCCESS
FAILED
CANCELLED
UNKNOWN
```

## 10. Santé

Chaque opérateur a :

- statut manuel ;
- statut technique ;
- dernier succès ;
- dernier échec ;
- latence ;
- taux de réussite ;
- message de maintenance.

## 11. Circuit breaker

Déclencher si :

- erreurs répétées ;
- timeouts ;
- taux d’échec élevé.

États :

```text
CLOSED
OPEN
HALF_OPEN
```

## 12. Timeout

Chaque appel fournisseur :

- timeout explicite ;
- pas d’attente infinie ;
- journalisation structurée.

## 13. Webhooks

Exigences :

- signature ;
- nonce ou timestamp ;
- anti-rejeu ;
- event id unique ;
- stockage brut ;
- normalisation.

## 14. Sandbox

Chaque intégration supporte :

```text
sandbox
production
```

Les données de test ne doivent jamais atteindre la production.

## 15. Ajout d’un nouvel opérateur

Checklist :

1. créer le gateway ;
2. déclarer les capacités ;
3. ajouter la configuration ;
4. ajouter les mappings ;
5. ajouter les tests ;
6. brancher le registry ;
7. configurer les webhooks ;
8. tester sandbox ;
9. activer par pays ;
10. surveiller.
