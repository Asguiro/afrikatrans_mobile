# Skill — afrikatrans-feature-builder

## Objectif

Construire une fonctionnalité complète AfrikaTrans de façon cohérente.

## Entrée attendue

- nom ;
- dépôt ;
- objectif métier ;
- acteurs ;
- règles ;
- écrans ;
- endpoints ;
- données.

## Processus

1. Lire AGENTS.md.
2. Identifier le dépôt.
3. Définir le flux métier.
4. Lister les règles.
5. Définir données et contrats.
6. Définir états.
7. Implémenter par couches.
8. Ajouter erreurs.
9. Ajouter tests.
10. Mettre à jour documentation.

## Sortie

Toujours produire :

```text
scope
architecture
files
implementation
validation
tests
risks
```

## Contrôle

Refuser toute implémentation qui :

- calcule les frais côté client comme vérité ;
- contourne le backend ;
- ignore l’idempotence ;
- stocke un secret côté client.
