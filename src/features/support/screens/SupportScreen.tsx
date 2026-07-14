import React from 'react';
import {Linking, Text, View} from 'react-native';
import {Mail, MessageCircle, ChevronRight} from 'lucide-react-native';
import {Screen} from '../../../components/ui/Screen';
import {ListGroup, ListRow, IconBubble} from '../../../components/ui/ListRow';
import {useTheme} from '../../../theme/ThemeProvider';

const faqs = [
  {
    q: 'Combien de temps prend un transfert ?',
    a: 'En général quelques minutes selon les opérateurs.',
  },
  {
    q: 'Les frais sont-ils définitifs ?',
    a: 'Oui, une fois le devis confirmé et non expiré.',
  },
  {
    q: 'Que faire en cas d’échec ?',
    a: 'Consultez le détail puis contactez le support.',
  },
];

export function SupportScreen() {
  const theme = useTheme();
  return (
    <Screen title="Aide" subtitle="Réponses rapides et contact support.">
      <ListGroup title="Nous contacter">
        <ListRow
          label="E-mail support"
          subtitle="support@afrikatrans.example"
          onPress={() => Linking.openURL('mailto:support@afrikatrans.example')}
          leading={
            <IconBubble>
              <Mail color={theme.colors.brandPrimary} size={18} strokeWidth={2} />
            </IconBubble>
          }
          trailing={<ChevronRight color={theme.colors.textMuted} size={18} />}
        />
        <ListRow
          label="WhatsApp"
          subtitle="Réponse en quelques heures"
          onPress={() => Linking.openURL('https://wa.me/221700000000')}
          leading={
            <IconBubble soft={theme.colors.successSoft}>
              <MessageCircle
                color={theme.colors.success}
                size={18}
                strokeWidth={2}
              />
            </IconBubble>
          }
          trailing={<ChevronRight color={theme.colors.textMuted} size={18} />}
          last
        />
      </ListGroup>

      <Text
        style={{
          color: theme.colors.textMuted,
          fontSize: theme.typography.caption,
          fontWeight: '700',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          marginBottom: theme.spacing.sm,
          marginLeft: 4,
        }}>
        Questions fréquentes
      </Text>
      {faqs.map((item, index) => (
        <View
          key={item.q}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: theme.spacing.lg,
            marginBottom: theme.spacing.md,
          }}>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontWeight: '700',
              fontSize: theme.typography.bodySmall,
              marginBottom: 6,
            }}>
            {index + 1}. {item.q}
          </Text>
          <Text
            style={{
              color: theme.colors.textSecondary,
              lineHeight: 20,
              fontSize: theme.typography.bodySmall,
            }}>
            {item.a}
          </Text>
        </View>
      ))}
    </Screen>
  );
}
