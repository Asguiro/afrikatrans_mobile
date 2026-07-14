import React, {createContext, useContext, useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {AppTheme, getTheme} from './tokens';
import {usePreferencesStore} from '../stores/preferencesStore';

const ThemeContext = createContext<AppTheme>(getTheme('light'));

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const systemScheme = useColorScheme();
  const appearance = usePreferencesStore(s => s.appearance);
  const scheme =
    appearance === 'system' ? systemScheme : appearance === 'dark' ? 'dark' : 'light';
  const theme = useMemo(() => getTheme(scheme), [scheme]);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
