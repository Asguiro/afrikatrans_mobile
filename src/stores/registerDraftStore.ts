import {create} from 'zustand';

type RegisterDraftState = {
  firstName: string;
  lastName: string;
  countryCode: string;
  nationalNumber: string;
  phone: string;
  password: string;
  setIdentity: (firstName: string, lastName: string) => void;
  setPhoneDraft: (input: {
    countryCode: string;
    nationalNumber: string;
    phone: string;
  }) => void;
  setPassword: (password: string) => void;
  clear: () => void;
};

const initial = {
  firstName: '',
  lastName: '',
  countryCode: 'SN',
  nationalNumber: '',
  phone: '',
  password: '',
};

export const useRegisterDraftStore = create<RegisterDraftState>(set => ({
  ...initial,
  setIdentity: (firstName, lastName) => set({firstName, lastName}),
  setPhoneDraft: input =>
    set({
      countryCode: input.countryCode,
      nationalNumber: input.nationalNumber,
      phone: input.phone,
    }),
  setPassword: password => set({password}),
  clear: () => set({...initial}),
}));
