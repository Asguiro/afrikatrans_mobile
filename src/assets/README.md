# Assets mobile AfrikaTrans

Catalogue central : [`index.ts`](./index.ts). **Toujours** importer depuis ce module plutôt que des `require` dispersés.

## Aperçu

<p>
  <img src="logos/logo_light.png" alt="Logo light" width="88" />
  <img src="logos/logo_dark.png" alt="Logo dark" width="88" />
  <img src="logos/logo-horizontal.png" alt="Logo horizontal" width="200" />
</p>

<p>
  <img src="splash/splash-light.png" alt="Splash light" width="120" />
  <img src="splash/splash-dark.png" alt="Splash dark" width="120" />
</p>

<p>
  <img src="logos/wave_logo.webp" alt="Wave" height="40" />
  &nbsp;
  <img src="logos/Orange_Money_logo.png" alt="Orange Money" height="40" />
  &nbsp;
  <img src="logos/mtnmomo_logo.webp" alt="MTN" height="40" />
  &nbsp;
  <img src="logos/moovmoney_logo.png" alt="Moov" height="40" />
</p>

## Arborescence

```text
assets/
├── logos/
│   ├── logo_light.png       # picto PNG transparent (fond clair)
│   ├── logo_dark.png        # picto PNG transparent (fond sombre)
│   ├── logo-horizontal.png  # wordmark PNG (~3:1)
│   ├── wave_logo.webp
│   ├── Orange_Money_logo.png
│   ├── mtnmomo_logo.webp
│   └── moovmoney_logo.png
├── splash/
│   ├── splash-light.png
│   └── splash-dark.png
├── backgrounds/
│   ├── africa-network-light.png
│   ├── africa-network-dark.png
│   └── world-light.png
├── auth/
│   └── login-preview.png
├── lottie/
│   ├── network-orbit.json
│   ├── secure-pulse.json
│   └── transfer-flow.json
└── reference/admin/          # Visuels web/admin — hors UI mobile
```

## Exports (`index.ts`)

| Export | Contenu |
| --- | --- |
| `logos` | `light`, `dark`, `horizontal` — **uniquement** via `BrandLogo` |
| `operatorLogos` | `wave`, `orange`, `mtn`, `moov` — via `OperatorLogoMark` |
| `splash` | `light`, `dark` |
| `backgrounds` | `worldLight`, `africaNetworkLight`, `africaNetworkDark` |
| `authAssets` | `loginPreview` |
| `lottieAssets` | `networkOrbit`, `securePulse`, `transferFlow` |

## Usage

Les logos marque sont des **PNG** (transparence / fonds intégrés) : toujours passer par un composant qui gère `contain`, ratio et pastille.

```ts
import { BrandLogo } from '../components/brand/BrandLogo';
import { OperatorLogoMark } from '../features/transfer/components/OperatorBrandGrid';

<BrandLogo variant="icon" size={72} plate="plain" />
<BrandLogo variant="horizontal" size={48} />
<OperatorLogoMark brand={brand} size={56} />
```

| Variante `BrandLogo` | Source | Notes |
| --- | --- | --- |
| `icon` | `logo_light` / `logo_dark` | Picto carré, thème auto |
| `horizontal` / `wordmark` | `logo-horizontal` | Ratio ~3:1 ; pastille claire auto en dark |

## Lottie (iOS)

- **Android** : autolink Gradle, rien à faire.
- **iOS** : si le CDN CocoaPods est indisponible :

```bash
npm run ios:pods
```

Télécharge `lottie-ios` en local (`vendor/`, gitignored) puis lance `pod install`.

## Règles

- Ne pas committer de secrets ni de captures personnelles dans `assets/`.
- Optimiser les PNG lourds avant d’en ajouter de nouveaux (idéalement &lt; 300 Ko pour l’UI runtime).
- Les fichiers `reference/admin/` ne doivent pas être branchés dans l’UI mobile.
- Ne pas réintroduire d’asset type « app-icon » pre-plaqué dans `src/assets` : l’UI consomme les PNG light/dark/horizontal via `BrandLogo`.
