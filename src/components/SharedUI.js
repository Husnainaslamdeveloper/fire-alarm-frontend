// ============================================================================
// Smart Fire Alarm System — Shared Figma-Faithful UI Components
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../theme/tokens';

// US-FLR-06 & US-FLR-07: Battery icon with fill & percentage (or dash until first reading)
export function BatteryIndicator({ percent, voltage, showVoltage = false }) {
  const hasReading = percent !== null && percent !== undefined;
  const pct = hasReading ? Math.max(0, Math.min(100, Number(percent))) : null;

  let color = COLORS.safeText;
  if (!hasReading) color = COLORS.textMuted;
  else if (pct <= 20) color = COLORS.dangerText;
  else if (pct <= 45) color = COLORS.warningText;

  return (
    <View style={styles.batteryWrap}>
      <View style={[styles.batteryBody, { borderColor: color }]}>
        {hasReading ? (
          <View
            style={[
              styles.batteryFill,
              {
                width: `${Math.max(12, pct)}%`,
                backgroundColor: color,
              },
            ]}
          />
        ) : null}
      </View>
      <View style={[styles.batteryCap, { backgroundColor: color }]} />
      <Text style={[styles.batteryText, { color }]}>
        {hasReading ? `${pct}%` : '—'}
        {showVoltage && voltage ? ` (${Number(voltage).toFixed(2)}V)` : ''}
      </Text>
    </View>
  );
}

// Semantic status pill matching Figma badges
export function StatusBadge({ label, tone = 'info', small = false }) {
  const palette = {
    safe: { bg: COLORS.safeBg, border: COLORS.safeBorder, text: COLORS.safeText },
    danger: { bg: COLORS.dangerCardBg, border: COLORS.dangerBorder, text: COLORS.dangerSoftText },
    warning: { bg: COLORS.warningBg, border: COLORS.warningBorder, text: COLORS.warningText },
    info: { bg: COLORS.primarySoftBg, border: COLORS.primaryBorder, text: COLORS.accentCyan },
    purple: { bg: COLORS.purpleBg, border: COLORS.purpleBorder, text: COLORS.purpleText },
    muted: { bg: COLORS.bgSurface, border: COLORS.borderDefault, text: COLORS.textSecondary },
  }[tone] || { bg: COLORS.bgSurface, border: COLORS.borderDefault, text: COLORS.textSecondary };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          paddingVertical: small ? 3 : 5,
          paddingHorizontal: small ? 8 : 11,
        },
      ]}
    >
      <Text style={[styles.badgeText, { color: palette.text, fontSize: small ? 10 : 11 }]}>
        {label}
      </Text>
    </View>
  );
}

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  editable = true,
  rightTag = null,
  onRightTagPress = null,
  errorText = '',
  validText = '',
  multiline = false,
}) {
  return (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelRow}>
        <Text style={styles.inputLabel}>{label}</Text>
        {validText ? <Text style={styles.validText}>{validText}</Text> : null}
      </View>
      <View
        style={[
          styles.inputBox,
          !editable && { opacity: 0.72, backgroundColor: '#090f1d' },
          errorText ? { borderColor: COLORS.dangerBorder } : null,
          multiline && { minHeight: 82, alignItems: 'flex-start', paddingVertical: 10 },
        ]}
      >
        <TextInput
          style={[styles.textInput, multiline && { minHeight: 62, textAlignVertical: 'top' }]}
          value={String(value ?? '')}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={multiline}
        />
        {rightTag ? (
          <TouchableOpacity disabled={!onRightTagPress} onPress={onRightTagPress}>
            <Text style={styles.rightTagText}>{rightTag}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
    </View>
  );
}

export function ActionButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style = null,
  small = false,
}) {
  const bgMap = {
    primary: COLORS.primary,
    danger: COLORS.danger,
    safe: COLORS.safe,
    secondary: COLORS.bgCardElevated,
    outline: 'transparent',
  };
  const borderMap = {
    primary: COLORS.primaryBorder,
    danger: COLORS.dangerBorder,
    safe: COLORS.safeBorder,
    secondary: COLORS.borderDefault,
    outline: COLORS.accentCyan,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: bgMap[variant] || COLORS.primary,
          borderColor: borderMap[variant] || COLORS.primaryBorder,
          paddingVertical: small ? 9 : 13,
          paddingHorizontal: small ? 14 : 18,
          opacity: disabled || loading ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          {
            fontSize: small ? 12 : 14,
            color: variant === 'outline' ? COLORS.accentCyan : '#ffffff',
          },
        ]}
      >
        {loading ? '⟳ Processing...' : title}
      </Text>
    </TouchableOpacity>
  );
}

// US-DSH-07 / US-SYS-01: Global No-Internet Banner
export function NoInternetBanner({ visible, onRetry }) {
  if (!visible) return null;
  return (
    <View style={styles.offlineBanner}>
      <View style={{ flex: 1 }}>
        <Text style={styles.offlineBannerTitle}>⚠ No Internet Connection (Showing Last Known Data — Not Live)</Text>
        <Text style={styles.offlineBannerSub}>
          Live telemetry is paused until Wi-Fi or mobile data reconnects (US-DSH-07 / US-ADM-27).
        </Text>
      </View>
      {onRetry ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryBtnText}>Retry Now</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function ToastFeedback({ toast }) {
  if (!toast) return null;
  const isDanger = toast.tone === 'danger';
  return (
    <View
      style={[
        styles.toast,
        {
          backgroundColor: isDanger ? COLORS.dangerCardBg : COLORS.safeBg,
          borderColor: isDanger ? COLORS.dangerBorder : COLORS.safeBorder,
        },
      ]}
    >
      <Text style={[styles.toastText, { color: isDanger ? COLORS.dangerLight : COLORS.safeLight }]}>
        {isDanger ? '⚠ ' : '✓ '}
        {toast.message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  batteryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryBody: {
    width: 24,
    height: 12,
    borderWidth: 1.5,
    borderRadius: 3,
    padding: 1.5,
    justifyContent: 'center',
  },
  batteryFill: {
    height: '100%',
    borderRadius: 1,
  },
  batteryCap: {
    width: 2.5,
    height: 6,
    borderTopRightRadius: 1.5,
    borderBottomRightRadius: 1.5,
    marginRight: 4,
  },
  batteryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  inputLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  validText: {
    color: COLORS.safeText,
    fontSize: 11,
    fontWeight: '700',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 10,
    paddingHorizontal: 13,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 8,
  },
  rightTagText: {
    color: COLORS.accentCyan,
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
  },
  errorText: {
    color: COLORS.dangerSoftText,
    fontSize: 11.5,
    marginTop: 4,
    fontWeight: '600',
  },
  button: {
    borderWidth: 1,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  buttonText: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  offlineBanner: {
    backgroundColor: COLORS.dangerCardBg,
    borderBottomWidth: 1,
    borderColor: COLORS.dangerBorder,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  offlineBannerTitle: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  offlineBannerSub: {
    color: COLORS.dangerLight,
    fontSize: 11,
    marginTop: 2,
  },
  retryBtn: {
    backgroundColor: COLORS.danger,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  retryBtnText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  toast: {
    position: 'absolute',
    bottom: 22,
    right: 22,
    left: 22,
    maxWidth: 460,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 9999,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
