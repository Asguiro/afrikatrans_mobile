import {useCallback, useRef} from 'react';
import type {TextInput} from 'react-native';

type FieldProps = {
  ref: (node: TextInput | null) => void;
  returnKeyType: 'next' | 'done' | 'go' | 'send' | 'search';
  /** Garde le focus pour enchaîner sans forcer un blur intermédiaire. */
  submitBehavior: 'submit' | 'blurAndSubmit';
  onSubmitEditing: () => void;
  /** Libellé barre iOS (number-pad / phone-pad n’ont pas de touche Retour). */
  accessoryActionLabel: string;
};

/**
 * Chaîne de focus entre champs d’un formulaire (Suivant → champ suivant, OK → submit).
 */
export function useInputFocusChain<const T extends string>(
  fieldNames: readonly T[],
) {
  const refs = useRef<Partial<Record<T, TextInput | null>>>({});

  const setRef = useCallback(
    (name: T) => (node: TextInput | null) => {
      refs.current[name] = node;
    },
    [],
  );

  const focus = useCallback((name: T) => {
    refs.current[name]?.focus();
  }, []);

  const focusNext = useCallback(
    (name: T) => {
      const index = fieldNames.indexOf(name);
      const next = fieldNames[index + 1];
      if (next) {
        refs.current[next]?.focus();
      }
    },
    [fieldNames],
  );

  const fieldProps = useCallback(
    (
      name: T,
      options?: {
        onLastSubmit?: () => void;
        lastReturnKeyType?: FieldProps['returnKeyType'];
      },
    ): FieldProps => {
      const index = fieldNames.indexOf(name);
      const isLast = index === fieldNames.length - 1;
      return {
        ref: setRef(name),
        returnKeyType: isLast
          ? (options?.lastReturnKeyType ?? 'done')
          : 'next',
        submitBehavior: isLast ? 'blurAndSubmit' : 'submit',
        accessoryActionLabel: isLast ? 'OK' : 'Suivant',
        onSubmitEditing: () => {
          if (isLast) {
            options?.onLastSubmit?.();
            return;
          }
          focusNext(name);
        },
      };
    },
    [fieldNames, focusNext, setRef],
  );

  return {fieldProps, focus, focusNext, setRef};
}
