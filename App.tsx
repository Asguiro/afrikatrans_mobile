import React, {useEffect} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider, useTheme} from './src/theme/ThemeProvider';
import {RootNavigator} from './src/navigation/RootNavigator';
import {usePreferencesStore} from './src/stores/preferencesStore';
import {useBootstrapSession} from './src/hooks/useBootstrapSession';
import {useAppLockOnBackground} from './src/hooks/useAppLockOnBackground';
import {useSessionStore} from './src/stores/sessionStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function NavigationRoot() {
  const theme = useTheme();
  const systemScheme = useColorScheme();
  const appearance = usePreferencesStore(s => s.appearance);
  const hydrate = useSessionStore(s => s.hydrate);
  useBootstrapSession();
  useAppLockOnBackground();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const scheme =
    appearance === 'system' ? systemScheme : appearance === 'dark' ? 'dark' : 'light';

  const navTheme = {
    ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.colors.brandPrimary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.brandAccent,
    },
  };

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <NavigationRoot />
          </ThemeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
