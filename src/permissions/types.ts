export type AppPermission =
  | 'contacts'
  | 'notifications'
  | 'camera'
  | 'photoLibrary'
  | 'biometrics';

export type PermissionStatus =
  | 'undetermined'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'unavailable';

export const ONBOARDING_PERMISSIONS = [
  'notifications',
  'contacts',
  'camera',
  'photoLibrary',
] as const satisfies ReadonlyArray<AppPermission>;

export type OnboardingPermission = (typeof ONBOARDING_PERMISSIONS)[number];

export const PERMISSION_COPY: Record<
  AppPermission,
  {title: string; benefit: string; missingMessage: string}
> = {
  contacts: {
    title: 'Contacts',
    benefit: 'Remplir le bénéficiaire depuis votre carnet d’adresses.',
    missingMessage:
      'Pour choisir un contact, autorisez l’accès au carnet d’adresses.',
  },
  notifications: {
    title: 'Notifications',
    benefit: 'Recevoir le statut de vos transferts en temps réel.',
    missingMessage:
      'Activez les notifications pour suivre vos transferts facilement.',
  },
  camera: {
    title: 'Caméra',
    benefit: 'Prendre un selfie ou photographier votre pièce d’identité.',
    missingMessage:
      'Pour continuer la vérification, autorisez l’accès à la caméra.',
  },
  photoLibrary: {
    title: 'Photos',
    benefit: 'Choisir une photo de profil ou un document depuis la galerie.',
    missingMessage:
      'Pour sélectionner une image, autorisez l’accès à vos photos.',
  },
  biometrics: {
    title: 'Biométrie',
    benefit: 'Déverrouiller l’application rapidement et en sécurité.',
    missingMessage:
      'Activez Face ID ou l’empreinte dans les réglages pour un déverrouillage rapide.',
  },
};
