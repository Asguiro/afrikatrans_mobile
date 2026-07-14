import type {NavigatorScreenParams} from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  SelectCountry: undefined;
  Register: {countryCode: string};
  VerifyOtp: {phone: string};
  CreatePin: undefined;
  ConfirmPin: {pin: string};
  Login: undefined;
  ForgotPassword: undefined;
  SessionExpired: undefined;
};

export type OnboardingStackParamList = {
  Onboarding: undefined;
};

export type KycStackParamList = {
  KycIntro: undefined;
  KycPersonalInfo: undefined;
  KycDocument: undefined;
  KycSelfie: undefined;
  KycStatus: undefined;
};

export type TransferStackParamList = {
  /** Réseau destinataire (Wave, Orange Money…). */
  SelectOperator: undefined;
  /** Téléphones expéditeur + destinataire (pays / indicatif / numéro). */
  TransferPhones: undefined;
  Amount: undefined;
  Quote: undefined;
  ConfirmPin: undefined;
  Processing: {transactionId: string};
  Success: {transactionId: string};
  Receipt: {transactionId: string};
};

export type AppTabParamList = {
  HomeTab: undefined;
  ActivityTab: undefined;
  BeneficiariesTab: undefined;
  SupportTab: undefined;
  ProfileTab: undefined;
};

export type AppStackParamList = {
  Tabs: NavigatorScreenParams<AppTabParamList> | undefined;
  Transfer: NavigatorScreenParams<TransferStackParamList> | undefined;
  Kyc: NavigatorScreenParams<KycStackParamList> | undefined;
  TransactionDetail: {transactionId: string};
  BeneficiaryForm: {beneficiaryId?: string} | undefined;
  Appearance: undefined;
  Security: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
  AppLock: undefined;
};

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
