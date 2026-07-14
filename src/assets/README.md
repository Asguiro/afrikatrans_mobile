# Assets mobile AfrikaTrans

Catalogue central : [`index.ts`](./index.ts). **Toujours** importer depuis ce module plutôt que des `require` dispersés.

## Aperçu

<p>
  <img src="logos/logo_light.png" alt="Logo light" width="88" />
  <img src="logos/logo_dark.png" alt="Logo dark" width="88" />
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
│   ├── logo_light.png    # marque claire (fond clair)
│   ├── logo_dark.png     # marque sombre (fond sombre)
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
| `logos` | `light`, `dark` — **seules** sources UI via `BrandLogo` |
| `operatorLogos` | `wave`, `orange`, `mtn`, `moov` |
| `splash` | `light`, `dark` |
| `backgrounds` | `worldLight`, `africaNetworkLight`, `africaNetworkDark` |
| `authAssets` | `loginPreview` |
| `lottieAssets` | `networkOrbit`, `securePulse`, `transferFlow` |

**Interdit en UI :** `app-icon.png`. Utiliser `logos.light` / `logos.dark` (ou `BrandLogo`).

## Usage

```ts
import { logos, operatorLogos, splash, backgrounds, lottieAssets } from '../assets';
import { BrandLogo } from '../components/brand/BrandLogo';

<BrandLogo variant="icon" size={72} plate="plain" />
<Image source={operatorLogos.wave} />
```

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
