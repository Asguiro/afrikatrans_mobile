# Skill — operator-integration-builder

## Objectif

Ajouter un opérateur Mobile Money via un adapter.

## Étapes

1. Lire documentation fournisseur.
2. Définir capacités.
3. Créer gateway.
4. Mapper requêtes.
5. Mapper réponses.
6. Normaliser erreurs.
7. Ajouter signature.
8. Ajouter webhook.
9. Ajouter polling.
10. Ajouter sandbox.
11. Ajouter contract tests.
12. Ajouter monitoring.

## Interdit

- logique opérateur dans TransactionService ;
- conditions géantes ;
- secret en base non protégée ;
- retry aveugle.
