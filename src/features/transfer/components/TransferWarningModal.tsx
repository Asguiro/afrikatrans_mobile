import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {TriangleAlert, X} from 'lucide-react-native';
import {useTheme} from '../../../theme/ThemeProvider';
import {Button} from '../../../components/ui/Button';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/** Alerte d’irréversibilité avant saisie du PIN. */
export function TransferWarningModal({visible, onClose, onConfirm}: Props) {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fermer"
          style={[styles.backdrop, {backgroundColor: 'rgba(10, 22, 48, 0.55)'}]}
          onPress={onClose}
        />
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.xl,
            },
          ]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fermer l’alerte"
            hitSlop={8}
            onPress={onClose}
            style={styles.close}>
            <X color={theme.colors.error} size={22} strokeWidth={2.5} />
          </Pressable>

          <View
            style={[
              styles.iconWrap,
              {backgroundColor: theme.colors.errorSoft},
            ]}>
            <TriangleAlert
              color={theme.colors.error}
              size={28}
              strokeWidth={2.2}
            />
          </View>

          <Text
            style={{
              color: theme.colors.error,
              fontWeight: '600',
              fontSize: theme.typography.body,
              textAlign: 'center',
              lineHeight: 24,
              marginBottom: theme.spacing['2xl'],
            }}>
            Assurez-vous que les informations saisies sont correctes car, une
            fois le transfert effectué, l’annulation ne sera pas possible.
          </Text>

          <Button label="Confirmer" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 1,
  },
  close: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconWrap: {
    alignSelf: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
});
