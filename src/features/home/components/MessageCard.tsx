import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../../theme/ThemeProvider';

export type AppMessage = {
  id: string;
  kind: 'promo' | 'update' | 'opportunity';
  title: string;
  body: string;
};

/** Messages mock — prêt pour un futur endpoint /api/v1/messages. */
export const MOCK_APP_MESSAGES: AppMessage[] = [
  {
    id: 'msg_1',
    kind: 'promo',
    title: 'Frais transparents',
    body: 'Comparez le montant envoyé et reçu avant chaque transfert.',
  },
  {
    id: 'msg_2',
    kind: 'update',
    title: 'Nouveau parcours d’envoi',
    body: 'Expéditeur et destinataire en une seule étape, plus simple.',
  },
  {
    id: 'msg_3',
    kind: 'opportunity',
    title: 'Corridors ouest-africains',
    body: 'Wave, Orange Money, MTN et Moov selon les pays disponibles.',
  },
];

const KIND_LABEL: Record<AppMessage['kind'], string> = {
  promo: 'Promo',
  update: 'Mise à jour',
  opportunity: 'Info',
};

type Props = {
  messages?: AppMessage[];
  /** Rotation automatique (ms). 0 = désactivé. */
  rotateMs?: number;
};

export function MessageCard({
  messages = MOCK_APP_MESSAGES,
  rotateMs = 8000,
}: Props) {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const safeMessages = messages.length > 0 ? messages : MOCK_APP_MESSAGES;
  const current = safeMessages[index % safeMessages.length];

  useEffect(() => {
    if (rotateMs <= 0 || safeMessages.length < 2) {
      return;
    }
    const id = setInterval(() => {
      setIndex(i => (i + 1) % safeMessages.length);
    }, rotateMs);
    return () => clearInterval(id);
  }, [rotateMs, safeMessages.length]);

  return (
    <Pressable
      accessibilityRole="summary"
      accessibilityLabel={`${KIND_LABEL[current.kind]} : ${current.title}`}
      onPress={() => setIndex(i => (i + 1) % safeMessages.length)}
      style={({pressed}) => [
        styles.card,
        {
          backgroundColor: theme.colors.brandPrimary,
          borderRadius: theme.radius.xl,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.badge,
            {backgroundColor: theme.colors.brandAccent},
          ]}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '800',
              fontSize: 11,
            }}>
            {KIND_LABEL[current.kind]}
          </Text>
        </View>
        {safeMessages.length > 1 ? (
          <Text
            style={{
              color: theme.colors.onBrandPrimary,
              opacity: 0.7,
              fontSize: 11,
              fontWeight: '600',
            }}>
            {((index % safeMessages.length) + 1)}/{safeMessages.length}
          </Text>
        ) : null}
      </View>
      <Text
        style={{
          color: theme.colors.onBrandPrimary,
          fontWeight: '800',
          fontSize: theme.typography.bodyLarge,
          marginTop: 6,
        }}>
        {current.title}
      </Text>
      <Text
        style={{
          color: theme.colors.onBrandPrimary,
          opacity: 0.88,
          marginTop: 4,
          lineHeight: 18,
          fontSize: theme.typography.caption,
        }}
        numberOfLines={2}>
        {current.body}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
});
