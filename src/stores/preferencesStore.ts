import {create} from 'zustand';

type Appearance = 'system' | 'light' | 'dark';

type PreferencesState = {
  appearance: Appearance;
  language: 'fr';
  onboardingCompleted: boolean;
  biometricEnabled: boolean;
  setAppearance: (appearance: Appearance) => void;
  setOnboardingCompleted: (value: boolean) => void;
  setBiometricEnabled: (value: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>(set => ({
  appearance: 'system',
  language: 'fr',
  onboardingCompleted: false,
  biometricEnabled: false,
  setAppearance: appearance => set({appearance}),
  setOnboardingCompleted: onboardingCompleted => set({onboardingCompleted}),
  setBiometricEnabled: biometricEnabled => set({biometricEnabled}),
}));
