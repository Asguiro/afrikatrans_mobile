# AfrikaTrans — Architecture d’authentification

## 1. Objectif

L’authentification doit protéger les comptes sans rendre le parcours inutilisable.

Canaux :

- mobile React Native ;
- web ;
- administration.

## 2. Stratégie client

### Inscription

```text
Téléphone
↓
OTP
↓
Profil minimal
↓
Mot de passe
↓
PIN
↓
Biométrie optionnelle
↓
Compte actif ou KYC à poursuivre
```

### Connexion

```text
Téléphone + mot de passe
ou
Session existante + PIN
ou
Session existante + biométrie
```

La biométrie ne remplace pas l’authentification serveur.

Elle protège localement l’accès à un secret ou à une session autorisée.

## 3. Tokens

### Access token

- JWT ;
- courte durée ;
- contient peu de données ;
- jamais de donnée sensible ;
- signé ;
- rotation des clés possible.

Claims :

```json
{
  "sub": "user_id",
  "type": "CUSTOMER",
  "sessionId": "session_id",
  "roles": ["customer"],
  "iat": 0,
  "exp": 0
}
```

### Refresh token

- aléatoire ;
- rotation à chaque utilisation ;
- stocké hashé ;
- lié à une session ;
- révocable ;
- détection de réutilisation.

## 4. Sessions

Chaque session conserve :

- utilisateur ;
- appareil ;
- IP ;
- user agent ;
- création ;
- expiration ;
- révocation ;
- dernière activité.

Fonctions :

- voir les sessions ;
- révoquer une session ;
- révoquer toutes les autres ;
- déconnexion globale.

## 5. OTP

Règles :

- durée courte ;
- hash en base ;
- nombre de tentatives limité ;
- resend limité ;
- cooldown ;
- anti-bruteforce ;
- usage unique ;
- lié à un objectif.

Objectifs :

```text
REGISTER
LOGIN_CHALLENGE
RESET_PASSWORD
CHANGE_PHONE
HIGH_RISK_TRANSACTION
```

## 6. Mot de passe

- hash Argon2id ;
- jamais chiffré réversiblement ;
- politique raisonnable ;
- blocage progressif ;
- vérification des mots de passe compromis si service disponible.

## 7. PIN

- hashé ;
- jamais stocké en clair ;
- usage limité ;
- tentative limitée ;
- délai croissant ;
- révocation en cas de risque.

Le PIN ne doit pas être :

- 1111 ;
- 1234 ;
- date évidente ;
- suite simple.

## 8. Biométrie

Mobile :

- Face ID ;
- Touch ID ;
- biométrie Android.

Le backend ne reçoit pas les données biométriques.

La biométrie autorise l’accès local à un secret stocké dans :

- iOS Keychain ;
- Android Keystore.

## 9. Administration

L’admin exige :

- email ;
- mot de passe fort ;
- MFA obligatoire ;
- sessions courtes ;
- confirmation pour actions critiques ;
- IP ou règles de risque si nécessaire.

## 10. Autorisation

Utiliser :

- rôles ;
- permissions ;
- guards.

Exemples :

```text
transactions.read
transactions.refund
transactions.retry
users.read
users.block
kyc.review
pricing.publish
operators.manage
audit.read
```

## 11. Guards

```text
JwtAuthGuard
RolesGuard
PermissionsGuard
MfaGuard
KycGuard
AccountStatusGuard
TransactionOwnershipGuard
```

## 12. Sécurité

- rate limit par IP et compte ;
- détection de login inhabituel ;
- notification de nouvel appareil ;
- révocation après changement de mot de passe ;
- verrouillage en cas d’abus ;
- audit.
