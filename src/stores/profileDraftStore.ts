import {create} from 'zustand';

/**
 * Brouillon local du profil (ex. photo choisie) — survit à un remount
 * de l’écran si l’activité Android / le lock écrase le state React.
 */
type ProfileDraftState = {
  pendingAvatarUri: string | null;
  setPendingAvatarUri: (uri: string | null) => void;
  clearPendingAvatar: () => void;
};

export const useProfileDraftStore = create<ProfileDraftState>(set => ({
  pendingAvatarUri: null,
  setPendingAvatarUri: uri => set({pendingAvatarUri: uri}),
  clearPendingAvatar: () => set({pendingAvatarUri: null}),
}));
