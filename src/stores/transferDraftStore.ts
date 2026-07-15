import {create} from 'zustand';

export type TransferDraft = {
  /** Marque choisie côté payeur (Wave, Orange…). */
  sourceOperatorCode?: string;
  /** Marque choisie pour le destinataire (Wave, Orange…). */
  destinationOperatorCode?: string;
  sourceCountryCode?: string;
  sourceOperatorId?: string;
  sourceAccountPhone?: string;
  destinationCountryCode?: string;
  destinationOperatorId?: string;
  destinationPhone?: string;
  destinationFirstName?: string;
  destinationLastName?: string;
  beneficiaryId?: string;
  amountMode: 'SEND' | 'RECEIVE';
  amount?: number;
  purpose?: string;
  quoteId?: string;
};

type TransferDraftState = TransferDraft & {
  setDraft: (patch: Partial<TransferDraft>) => void;
  reset: () => void;
};

const initial: TransferDraft = {
  amountMode: 'SEND',
};

export const useTransferDraftStore = create<TransferDraftState>(set => ({
  ...initial,
  setDraft: patch => set(state => ({...state, ...patch})),
  reset: () => set({...initial}),
}));
