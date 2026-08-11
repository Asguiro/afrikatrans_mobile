import {createContext, useContext} from 'react';

type KeyboardScrollApi = {
  onInputFocus: () => void;
};

export const KeyboardScrollContext = createContext<KeyboardScrollApi | null>(
  null,
);

export function useKeyboardScroll(): KeyboardScrollApi | null {
  return useContext(KeyboardScrollContext);
}
