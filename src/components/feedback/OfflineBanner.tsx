import React from 'react';
import {Text, View} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useTheme} from '../../theme/ThemeProvider';

export function OfflineBanner() {
  const netInfo = useNetInfo();
  const theme = useTheme();
  const offline =
    netInfo.isConnected === false || netInfo.isInternetReachable === false;

  if (!offline) {
    return null;
  }

  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        backgroundColor: theme.colors.warningSoft,
        borderColor: theme.colors.warning,
        borderWidth: 1,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
      }}>
      <Text style={{color: theme.colors.warning, fontWeight: '600'}}>
        Hors ligne — certaines actions seront synchronisées plus tard.
      </Text>
    </View>
  );
}
