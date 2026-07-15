import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useTheme} from '../../theme/ThemeProvider';

type Props = {
  label: string;
  value?: string;
  onPress?: () => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  destructive?: boolean;
  subtitle?: string;
  last?: boolean;
};

export function ListRow({
  label,
  value,
  onPress,
  leading,
  trailing,
  destructive,
  subtitle,
  last,
}: Props) {
  const theme = useTheme();
  const content = (
    <View
      style={[
        styles.row,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: theme.colors.divider,
        },
      ]}>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.body}>
        <Text
          style={{
            color: destructive ? theme.colors.error : theme.colors.textPrimary,
            fontWeight: '600',
            fontSize: theme.typography.body,
          }}>
          {label}
        </Text>
        {subtitle ? (
          <Text
            style={{
              color: theme.colors.textMuted,
              fontSize: theme.typography.caption,
              marginTop: 2,
            }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: theme.typography.bodySmall,
            marginRight: 6,
            maxWidth: '40%',
            textAlign: 'right',
          }}
          numberOfLines={1}>
          {value}
        </Text>
      ) : null}
      {trailing}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({pressed}) => ({opacity: pressed ? 0.7 : 1})}>
      {content}
    </Pressable>
  );
}

export function ListGroup({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const theme = useTheme();
  return (
    <View style={{marginBottom: theme.spacing.xl}}>
      {title ? (
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
          {title}
        </Text>
      ) : null}
      <View
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          overflow: 'hidden',
        }}>
        {children}
      </View>
    </View>
  );
}

export function IconBubble({
  children,
  soft,
}: {
  children: React.ReactNode;
  soft?: string;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: soft ?? theme.colors.brandPrimarySoft,
      }}>
      {/* tint via children */}
      {children}
    </View>
  );
}

export function StatusChip({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'info';
}) {
  const theme = useTheme();
  const map = {
    neutral: {
      bg: theme.colors.brandPrimarySoft,
      fg: theme.colors.brandPrimary,
    },
    success: {bg: theme.colors.successSoft, fg: theme.colors.success},
    warning: {bg: theme.colors.warningSoft, fg: theme.colors.warning},
    error: {bg: theme.colors.errorSoft, fg: theme.colors.error},
    info: {bg: theme.colors.infoSoft, fg: theme.colors.info},
  } as const;
  const colors = map[tone];
  return (
    <View
      style={{
        backgroundColor: colors.bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: theme.radius.full,
        alignSelf: 'flex-start',
      }}>
      <Text style={{color: colors.fg, fontSize: 12, fontWeight: '700'}}>
        {label}
      </Text>
    </View>
  );
}

export function Avatar({
  name,
  size = 64,
  imageUri,
}: {
  name: string;
  size?: number;
  imageUri?: string | null;
}) {
  const theme = useTheme();
  const [imageFailed, setImageFailed] = React.useState(false);
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  React.useEffect(() => {
    setImageFailed(false);
  }, [imageUri]);

  if (imageUri && !imageFailed) {
    return (
      <Image
        key={imageUri}
        source={{uri: imageUri}}
        accessibilityLabel={`Photo de ${name || 'profil'}`}
        onError={() => setImageFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.colors.brandPrimarySoft,
        }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme.colors.brandPrimary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: theme.colors.onBrandPrimary,
          fontWeight: '800',
          fontSize: size * 0.32,
        }}>
        {initials || '?'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 54,
  },
  leading: {
    marginRight: 12,
  },
  body: {
    flex: 1,
  },
});
