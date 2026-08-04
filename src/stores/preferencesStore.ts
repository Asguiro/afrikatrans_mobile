import {create} from 'zustand';

type Appearance = 'system' | 'light' | 'dark';

type PreferencesState = {
  appearance: Appearance;
  language: 'fr';
  onboardingCompleted: boolean;
  permissionsOnboardingSeen: boolean;
  notificationsSoftPromptSeen: boolean;
  biometricEnabled: boolean;
  setAppearance: (appearance: Appearance) => void;
  setOnboardingCompleted: (value: boolean) => void;
  setPermissionsOnboardingSeen: (value: boolean) => void;
  setNotificationsSoftPromptSeen: (value: boolean) => void;
  setBiometricEnabled: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>(set => ({
  appearance: 'system',
  language: 'fr',
  onboardingCompleted: false,
  permissionsOnboardingSeen: false,
  notificationsSoftPromptSeen: false,
  biometricEnabled: false,
  setAppearance: appearance => set({appearance}),
  setOnboardingCompleted: onboardingCompleted => set({onboardingCompleted}),
  setPermissionsOnboardingSeen: permissionsOnboardingSeen =>
    set({permissionsOnboardingSeen}),
  setNotificationsSoftPromptSeen: notificationsSoftPromptSeen =>
    set({notificationsSoftPromptSeen}),
  setBiometricEnabled: biometricEnabled => set({biometricEnabled}),
}));
