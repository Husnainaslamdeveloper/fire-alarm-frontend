// ============================================================================
// Smart Fire Alarm System — Homeowner Mobile & Tablet App
// Implements All 51 Mobile Screens (M-01 to M-51) + 5 Push Notifications (N-01..N-05)
// Cross-Platform: Android, iOS & Responsive Tablet Layout (iPad / Android Tablet)
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { COLORS, MOBILE_SCREENS } from '../theme/tokens';
import { useResponsive } from '../hooks/useResponsive';
import { useApp } from '../context/AppContext';
import {
  BatteryIndicator,
  StatusBadge,
  LabeledInput,
  ActionButton,
  NoInternetBanner,
  ToastFeedback,
} from '../components/SharedUI';

export default function MobileUserApp({ onSwitchToAdminWeb }) {
  const responsive = useResponsive();
  const {
    mobileData,
    serverConnected,
    simulatedNoInternet,
    setSimulatedNoInternet,
    loading,
    toast,
    showToast,
    selectedPanelId,
    setSelectedPanelId,
    activePushBanner,
    setActivePushBanner,
    apiRequest,
    refreshData,
    playEmergencyTone,
  } = useApp();

  // Active Screen ID (M-01 to M-51) — Starts at M-01 Splash Screen per Figma flow
  const [screenId, setScreenId] = useState('M-01');
  const [tabletFullWidthMode, setTabletFullWidthMode] = useState(true);
  const [showScreenPicker, setShowScreenPicker] = useState(false);
  const [showDevToolbar, setShowDevToolbar] = useState(false);

  // Selected Floor & Sensor for Detail Screens (M-26, M-27, M-28, M-33, M-34, M-41)
  const [selectedFloorId, setSelectedFloorId] = useState(1);
  const [selectedSensorId, setSelectedSensorId] = useState(1);
  const [selectedHistoryId, setSelectedHistoryId] = useState(1);

  // Auth & Sign-up states (M-03..M-09)
  const [loginEmail, setLoginEmail] = useState('husnain.aslam@example.com');
  const [loginPassword, setLoginPassword] = useState('Pass1234');
  const [showPass, setShowPass] = useState(false);
  const [signupName, setSignupName] = useState('Husnain Aslam');
  const [signupEmail, setSignupEmail] = useState('husnain.aslam@example.com');
  const [signupPhone, setSignupPhone] = useState('+92 300 1234567');
  const [signupPass, setSignupPass] = useState('Pass1234');
  const [signupConfirm, setSignupConfirm] = useState('Pass1234');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [otpCode, setOtpCode] = useState('482910');
  const [otpSeconds, setOtpSeconds] = useState(48);

  // Intro Slide Index (M-10)
  const [introSlideIdx, setIntroSlideIdx] = useState(0);

  // Profile Setup & Edit states (M-11 / M-43)
  const [profLocation, setProfLocation] = useState('Aslam Residence');
  const [profStreet, setProfStreet] = useState('House 14-B, Street 4, DHA Ph 5');
  const [profUnit, setProfUnit] = useState('Ground');
  const [profCity, setProfCity] = useState('Lahore');
  const [profPostal, setProfPostal] = useState('54792');
  const [profPhone1, setProfPhone1] = useState('+92 300 1234567');
  const [profPhone2, setProfPhone2] = useState('+92 321 7654321');
  const [profLat, setProfLat] = useState(31.4697);
  const [profLng, setProfLng] = useState(74.4111);

  // Permissions toggles (M-12 / M-45)
  const [permNotifications, setPermNotifications] = useState(true);
  const [permCamera, setPermCamera] = useState(true);
  const [permLocation, setPermLocation] = useState(true);
  const [permCriticalAlert, setPermCriticalAlert] = useState(true);

  // Panel Binding states (M-15..M-22)
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualPanelUid, setManualPanelUid] = useState('PNL-PK-NEW1');
  const [newPanelName, setNewPanelName] = useState('Aslam Residence');
  const [lastLinked32Bit, setLastLinked32Bit] = useState('0x7F4A9C21');
  const [removeConfirmInput, setRemoveConfirmInput] = useState('');
  const [replaceCopyFloors, setReplaceCopyFloors] = useState(true);

  // Floor & Sensor Form states (M-25, M-26, M-28..M-34)
  const [newFloorName, setNewFloorName] = useState('');
  const [editFloorName, setEditFloorName] = useState('Ground Floor');
  const [pairingCountdown, setPairingCountdown] = useState(45);
  const [newSensorRoom, setNewSensorRoom] = useState('Study Room');
  const [pairedSensorObj, setPairedSensorObj] = useState(null);
  const [editSensorRoom, setEditSensorRoom] = useState('Kitchen');
  const [editSensorFloorId, setEditSensorFloorId] = useState(1);

  // Self-Test state (M-35)
  const [testRunning, setTestRunning] = useState(false);
  const [lastTestReport, setLastTestReport] = useState(null);

  // History filter (M-40)
  const [historyFilter, setHistoryFilter] = useState('All');

  // Password & Delete Account states (M-44, M-47)
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');
  const [deletePassInput, setDeletePassInput] = useState('');
  const [showSilenceConfirm, setShowSilenceConfirm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync profile fields when mobileData loads
  useEffect(() => {
    if (mobileData?.user) {
      setProfLocation(mobileData.user.location_name || 'Aslam Residence');
      setProfStreet(mobileData.user.street_address || 'House 14-B, Street 4, DHA Ph 5');
      setProfUnit(mobileData.user.unit_number || 'Ground');
      setProfCity(mobileData.user.city || 'Lahore');
      setProfPostal(mobileData.user.postal_code || '54792');
      setProfPhone1(mobileData.user.primary_phone || '+92 300 1234567');
      setProfPhone2(mobileData.user.secondary_phone || '+92 321 7654321');
      setProfLat(mobileData.user.latitude || 31.4697);
      setProfLng(mobileData.user.longitude || 74.4111);
    }
    if (mobileData?.activePanel) {
      setNewPanelName(mobileData.activePanel.panel_name);
    }
  }, [mobileData?.user?.id, mobileData?.activePanel?.id]);

  // Timers for OTP and Pairing
  useEffect(() => {
    const timer = setInterval(() => {
      setOtpSeconds((s) => (s > 0 ? s - 1 : 0));
      setPairingCountdown((s) => (s > 0 ? s - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const user = mobileData?.user || {};
  const panels = mobileData?.panels || [];
  const activePanel = mobileData?.activePanel || panels[0] || null;
  const floors = mobileData?.floors || [];
  const sensors = mobileData?.sensors || [];
  const activeIncident = mobileData?.activeIncident || null;
  const recentClearedIncident = mobileData?.recentClearedIncident || null;
  const history = mobileData?.history || [];
  const devices = mobileData?.devices || [];

  const currentFloor = useMemo(() => {
    return floors.find((f) => f.id === Number(selectedFloorId)) || floors[0] || null;
  }, [floors, selectedFloorId]);

  const currentSensor = useMemo(() => {
    return sensors.find((s) => s.id === Number(selectedSensorId)) || sensors[0] || null;
  }, [sensors, selectedSensorId]);

  const currentHistoryItem = useMemo(() => {
    return history.find((h) => h.id === Number(selectedHistoryId)) || history[0] || null;
  }, [history, selectedHistoryId]);

  const isTabletGrid = responsive.isTabletOrLarger && tabletFullWidthMode;

  // Push Notification presets (N-01 to N-05)
  const triggerPushNotificationDemo = (code) => {
    const map = {
      'N-01': {
        code: 'N-01',
        title: '🔥 FIRE ALARM — Aslam Residence',
        body: 'Ground Floor → Kitchen (Sensor Addr 01). Tap to open emergency screen & silence siren.',
        tone: 'danger',
        targetScreen: 'M-36',
      },
      'N-02': {
        code: 'N-02',
        title: '⚠ Panel Offline — Aslam Residence',
        body: 'Your panel is not connected to Wi-Fi or power. Reminder every 15m until restored.',
        tone: 'warning',
        targetScreen: 'M-39',
      },
      'N-03': {
        code: 'N-03',
        title: '✓ Panel Connected — Aslam Residence',
        body: 'Panel PNL-PK-8F2A is back online. 24/7 fire protection restored.',
        tone: 'safe',
        targetScreen: 'M-23',
      },
      'N-04': {
        code: 'N-04',
        title: '⚠ Sensor Offline — Ground Floor → Garage',
        body: 'Sensor Addr 03 stopped reporting. Tap to inspect sensor battery & status.',
        tone: 'warning',
        targetScreen: 'M-33',
      },
      'N-05': {
        code: 'N-05',
        title: '✓ Sensor Back Online — Ground Floor → Garage',
        body: 'Sensor Addr 03 is communicating normally with the main panel.',
        tone: 'safe',
        targetScreen: 'M-27',
      },
    };
    const chosen = map[code];
    if (chosen) {
      setActivePushBanner(chosen);
      if (code === 'N-01') playEmergencyTone('fire');
    }
  };

  // Bottom Tab Navigation visible on main screens
  const showBottomTabs = ['M-23', 'M-24', 'M-27', 'M-39', 'M-40', 'M-42'].includes(screenId);

  return (
    <View style={styles.root}>
      <NoInternetBanner visible={!serverConnected} onRetry={refreshData} />

      {/* Optional Developer / Screen Jumper Bar (Hidden by default to match exact Figma UI) */}
      {showDevToolbar && (
      <View style={styles.topControlStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.ctrlChip, { borderColor: COLORS.accentCyan, backgroundColor: COLORS.primarySoftBg }]}
            onPress={() => setShowScreenPicker(true)}
          >
            <Text style={[styles.ctrlChipText, { color: '#ffffff' }]}>
              📱 Screen: {screenId} ({MOBILE_SCREENS.find((s) => s.id === screenId)?.title}) ▾
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.ctrlChip, { borderColor: COLORS.dangerBorder, backgroundColor: COLORS.dangerCardBg }]}
            onPress={() => {
              playEmergencyTone('fire');
              setScreenId('M-36');
            }}
          >
            <Text style={[styles.ctrlChipText, { color: COLORS.dangerLight }]}>🔥 M-36 Fire Alert</Text>
          </TouchableOpacity>

          {['N-01', 'N-02', 'N-03', 'N-04', 'N-05'].map((nCode) => (
            <TouchableOpacity
              key={nCode}
              style={styles.ctrlChip}
              onPress={() => triggerPushNotificationDemo(nCode)}
            >
              <Text style={styles.ctrlChipText}>🔔 Push {nCode}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.ctrlChip}
            onPress={() => setShowDevToolbar(false)}
          >
            <Text style={styles.ctrlChipText}>✕ Hide</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      )}

      {/* Push Notification Interactive Banner (N-01 to N-05) */}
      {activePushBanner && (
        <TouchableOpacity
          style={[
            styles.pushNotificationCard,
            activePushBanner.tone === 'danger' && {
              backgroundColor: '#5c1118',
              borderColor: COLORS.dangerBorder,
            },
            activePushBanner.tone === 'warning' && {
              backgroundColor: COLORS.warningBg,
              borderColor: COLORS.warningBorder,
            },
            activePushBanner.tone === 'safe' && {
              backgroundColor: COLORS.safeBg,
              borderColor: COLORS.safeBorder,
            },
          ]}
          onPress={() => {
            const target = activePushBanner.targetScreen || 'M-23';
            setActivePushBanner(null);
            setScreenId(target);
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.pushTitle}>
              [{activePushBanner.code}] {activePushBanner.title}
            </Text>
            <Text style={styles.pushBody}>{activePushBanner.body}</Text>
          </View>
          <TouchableOpacity onPress={() => setActivePushBanner(null)}>
            <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '800' }}>✕</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Adaptive Phone / Tablet Container */}
      <View style={styles.outerCenter}>
        <View
          style={[
            styles.deviceContainer,
            {
              maxWidth: isTabletGrid ? 980 : 460,
            },
            screenId === 'M-36' && {
              backgroundColor: '#25070a',
              borderColor: COLORS.dangerBorder,
            },
          ]}
        >
          {/* Simulated Status Bar shown only on Web preview; Native uses OS StatusBar */}
          {Platform.OS === 'web' && (
            <View style={styles.statusBar}>
              <Text style={styles.statusBarTime}>9:41</Text>
              <View style={styles.dynamicIsland}>
                <Text style={styles.dynamicIslandText}>
                  {isTabletGrid ? 'Tablet Responsive View' : 'Smart Fire Protected'}
                </Text>
              </View>
              <Text style={styles.statusBarRight}>5G • 100%</Text>
            </View>
          )}

          <ScrollView
            style={styles.screenScroll}
            contentContainerStyle={[
              styles.screenContent,
              { padding: isTabletGrid ? 24 : 18 },
            ]}
          >
            {/* ==============================================================
                M-01: SPLASH SCREEN (US-AUTH-01)
               ============================================================== */}
            {screenId === 'M-01' && (
              <View style={styles.centeredScreen}>
                <View style={styles.splashOuterRing}>
                  <View style={styles.splashInnerCircle}>
                    <Text style={{ fontSize: 38 }}>🔥</Text>
                  </View>
                </View>
                <Text style={styles.splashTitle}>Smart Fire Alarm</Text>
                <Text style={styles.splashSub}>24/7 Home Fire Protection & Monitoring</Text>
                <Text style={styles.splashChecking}>⟳ Checking active session...</Text>

                <View style={styles.autoRouteCard}>
                  <Text style={styles.autoRouteTitle}>Auto-Route Logic (US-AUTH-01)</Text>
                  <Text style={styles.autoRouteSub}>
                    Valid Token → M-23 Dashboard | No Token → M-03 Login
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 12 }}>
                    <ActionButton title="Open M-23 Dashboard" small onPress={() => setScreenId('M-23')} />
                    <ActionButton title="Open M-03 Login" variant="secondary" small onPress={() => setScreenId('M-03')} />
                    <ActionButton title="M-02 Offline/Deleted" variant="secondary" small onPress={() => setScreenId('M-02')} />
                  </View>
                </View>
              </View>
            )}

            {/* ==============================================================
                M-02: SPLASH — OFFLINE & DELETED ACCOUNT STATE (US-AUTH-01)
               ============================================================== */}
            {screenId === 'M-02' && (
              <View style={{ gap: 18 }}>
                <View style={styles.card}>
                  <Text style={{ fontSize: 32, textAlign: 'center', marginBottom: 8 }}>📡</Text>
                  <Text style={[styles.h1, { textAlign: 'center' }]}>No Internet Connection</Text>
                  <Text style={[styles.subText, { textAlign: 'center', marginVertical: 8 }]}>
                    We could not verify your session. Check your Wi-Fi or mobile data and try again.
                  </Text>
                  <ActionButton title="Retry Connection" onPress={() => setScreenId('M-23')} />
                </View>

                <View style={[styles.card, { borderColor: COLORS.dangerBorder, backgroundColor: COLORS.dangerCardBg }]}>
                  <Text style={styles.sectionLabel}>ACCOUNT STATUS VARIANT (US-AUTH-01)</Text>
                  <Text style={[styles.h2, { color: '#ffffff', marginTop: 6 }]}>
                    Account Deleted or Deactivated
                  </Text>
                  <Text style={[styles.subText, { color: COLORS.dangerLight, marginVertical: 8 }]}>
                    This account is no longer active. You have been signed out on this device. Contact support if this is unexpected.
                  </Text>
                  <ActionButton
                    title="Continue to Login (M-03)"
                    variant="danger"
                    small
                    onPress={() => setScreenId('M-03')}
                  />
                </View>
              </View>
            )}

            {/* ==============================================================
                M-03: LOGIN SCREEN (US-AUTH-02 / 04 / 05)
               ============================================================== */}
            {screenId === 'M-03' && (
              <View>
                <View style={styles.smallFireLogo}>
                  <Text style={{ fontSize: 20 }}>🔥</Text>
                </View>
                <Text style={styles.h1}>Welcome Back</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Log in to monitor your home fire alarm panels
                </Text>

                <View style={styles.errorAlertCard}>
                  <Text style={styles.errorAlertTitle}>
                    ⚠ Invalid email or password (2 attempts left)
                  </Text>
                  <Text style={styles.errorAlertSub}>
                    Locked temporarily after 5 failed attempts.
                  </Text>
                </View>

                <LabeledInput
                  label="EMAIL ADDRESS"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                  placeholder="husnain.aslam@example.com"
                />

                <LabeledInput
                  label="PASSWORD"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry={!showPass}
                  rightTag={showPass ? 'HIDE' : 'SHOW'}
                  onRightTagPress={() => setShowPass(!showPass)}
                />

                <TouchableOpacity
                  style={{ alignSelf: 'flex-end', marginBottom: 14 }}
                  onPress={() => setScreenId('M-06')}
                >
                  <Text style={styles.cyanLink}>Forgot Password?</Text>
                </TouchableOpacity>

                <ActionButton
                  title="Log In"
                  disabled={!loginEmail.trim() || !loginPassword.trim()}
                  loading={loading}
                  onPress={async () => {
                    try {
                      await apiRequest('/auth/login', 'POST', {
                        email: loginEmail,
                        password: loginPassword,
                        platform: Platform.OS,
                      });
                      setScreenId('M-23');
                      showToast('Logged in to Aslam Residence.');
                    } catch {}
                  }}
                />

                <TouchableOpacity
                  style={styles.biometricCard}
                  onPress={() => {
                    showToast('Biometric Face ID / Fingerprint verified!');
                    setScreenId('M-23');
                  }}
                >
                  <StatusBadge label="P2" tone="purple" small />
                  <Text style={{ color: '#ffffff', fontSize: 13, fontWeight: '700' }}>
                    Unlock with Fingerprint / Face ID (US-AUTH-05)
                  </Text>
                </TouchableOpacity>

                <View style={styles.familyAlertInfoBox}>
                  <Text style={{ color: COLORS.safeText, fontSize: 12.5, fontWeight: '800' }}>
                    Family Multi-Phone Alerting Active (US-AUTH-04)
                  </Text>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 11.5, marginTop: 2 }}>
                    Logging in here keeps other family phones logged in so every phone receives fire alerts.
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 18 }}>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>New homeowner?</Text>
                  <TouchableOpacity onPress={() => setScreenId('M-04')}>
                    <Text style={styles.cyanLink}>Sign Up →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ==============================================================
                M-04: SIGN UP SCREEN (MOBILE ONLY / US-AUTH-06)
               ============================================================== */}
            {screenId === 'M-04' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-03')}>
                  <Text style={styles.backLink}>← Login</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Create Account</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Set up your homeowner fire monitoring profile
                </Text>

                <LabeledInput
                  label="FULL NAME"
                  value={signupName}
                  onChangeText={setSignupName}
                  validText={signupName.length > 2 ? 'Valid ✓' : ''}
                />
                <LabeledInput
                  label="EMAIL ADDRESS"
                  value={signupEmail}
                  onChangeText={setSignupEmail}
                  validText={signupEmail.includes('@') ? 'Valid ✓' : ''}
                />
                <LabeledInput
                  label="MOBILE NUMBER (PAKISTAN +92)"
                  value={signupPhone}
                  onChangeText={setSignupPhone}
                  validText={signupPhone.length >= 10 ? 'Valid ✓' : ''}
                />
                <LabeledInput
                  label="PASSWORD (MIN 8 CHARS, LETTERS & NUMBERS)"
                  value={signupPass}
                  onChangeText={setSignupPass}
                  secureTextEntry={!showPass}
                  rightTag={showPass ? 'HIDE' : 'SHOW'}
                  onRightTagPress={() => setShowPass(!showPass)}
                />
                <LabeledInput
                  label="CONFIRM PASSWORD"
                  value={signupConfirm}
                  onChangeText={setSignupConfirm}
                  secureTextEntry={!showPass}
                  errorText={
                    signupConfirm && signupPass !== signupConfirm ? 'Passwords do not match' : ''
                  }
                />

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                >
                  <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                    {termsAccepted && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>✓</Text>}
                  </View>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 12, flex: 1 }}>
                    I agree to the{' '}
                    <Text style={styles.cyanLink} onPress={() => setScreenId('M-49')}>
                      Terms of Use (M-49)
                    </Text>{' '}
                    and{' '}
                    <Text style={styles.cyanLink} onPress={() => setScreenId('M-48')}>
                      Privacy Policy (M-48)
                    </Text>
                  </Text>
                </TouchableOpacity>

                <ActionButton
                  title="Sign Up & Send OTP (M-05)"
                  disabled={!signupName || !signupEmail.includes('@') || signupPass.length < 8 || !termsAccepted}
                  onPress={() => {
                    setOtpSeconds(60);
                    showToast('Verification OTP sent to your email.');
                    setScreenId('M-05');
                  }}
                />
              </View>
            )}

            {/* ==============================================================
                M-05 & M-07: VERIFY OTP SCREEN (US-AUTH-07 / US-AUTH-09)
               ============================================================== */}
            {(screenId === 'M-05' || screenId === 'M-07') && (
              <View>
                <TouchableOpacity onPress={() => setScreenId(screenId === 'M-05' ? 'M-04' : 'M-06')}>
                  <Text style={styles.backLink}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>
                  {screenId === 'M-05' ? 'Verify Your Account (M-05)' : 'Verify Reset Code (M-07)'}
                </Text>
                <Text style={[styles.subText, { marginBottom: 16 }]}>
                  Enter the 6-digit code sent to {signupEmail || loginEmail}
                </Text>

                <LabeledInput
                  label="6-DIGIT OTP CODE"
                  value={otpCode}
                  onChangeText={setOtpCode}
                  placeholder="482910"
                />

                <View style={styles.rowBetween}>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                    Resend code in 00:{String(otpSeconds).padStart(2, '0')}
                  </Text>
                  <TouchableOpacity
                    disabled={otpSeconds > 0}
                    onPress={() => {
                      setOtpSeconds(60);
                      showToast('New 6-digit OTP code sent.');
                    }}
                  >
                    <Text style={[styles.cyanLink, otpSeconds > 0 && { opacity: 0.4 }]}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>

                <ActionButton
                  title={
                    screenId === 'M-05'
                      ? 'Verify & Continue to Profile Setup (M-11)'
                      : 'Verify & Set New Password (M-08)'
                  }
                  style={{ marginTop: 18 }}
                  disabled={otpCode.trim().length !== 6}
                  onPress={() => setScreenId(screenId === 'M-05' ? 'M-11' : 'M-08')}
                />
              </View>
            )}

            {/* ==============================================================
                M-06, M-08, M-09: FORGOT / RESET PASSWORD & SUCCESS
               ============================================================== */}
            {screenId === 'M-06' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-03')}>
                  <Text style={styles.backLink}>← Back to Login</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Forgot Password (M-06)</Text>
                <Text style={[styles.subText, { marginBottom: 16 }]}>
                  Enter your registered email to receive a 6-digit reset code.
                </Text>
                <LabeledInput label="EMAIL ADDRESS" value={loginEmail} onChangeText={setLoginEmail} />
                <ActionButton
                  title="Send Reset Code (M-07)"
                  disabled={!loginEmail.includes('@')}
                  onPress={() => {
                    showToast('If this email is registered, a reset code has been sent.');
                    setScreenId('M-07');
                  }}
                />
              </View>
            )}

            {screenId === 'M-08' && (
              <View>
                <Text style={styles.h1}>Reset Password (M-08)</Text>
                <Text style={[styles.subText, { marginBottom: 16 }]}>
                  Minimum 8 characters with letters and numbers.
                </Text>
                <LabeledInput
                  label="NEW PASSWORD"
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry={!showPass}
                  rightTag={showPass ? 'HIDE' : 'SHOW'}
                  onRightTagPress={() => setShowPass(!showPass)}
                />
                <LabeledInput
                  label="CONFIRM PASSWORD"
                  value={confPass}
                  onChangeText={setConfPass}
                  secureTextEntry={!showPass}
                />
                <ActionButton
                  title="Save Password (M-09)"
                  disabled={newPass.length < 8 || newPass !== confPass}
                  onPress={() => setScreenId('M-09')}
                />
              </View>
            )}

            {screenId === 'M-09' && (
              <View style={styles.centeredScreen}>
                <View style={styles.successCircle}>
                  <Text style={{ fontSize: 30, color: COLORS.safeText }}>✓</Text>
                </View>
                <Text style={styles.h1}>Password Reset Complete</Text>
                <Text style={[styles.subText, { textAlign: 'center', marginVertical: 10 }]}>
                  You can now sign in with your new password. All other active sessions have been logged out.
                </Text>
                <ActionButton title="Go to Login (M-03)" onPress={() => setScreenId('M-03')} />
              </View>
            )}

            {/* ==============================================================
                M-10: WELCOME / INTRO SLIDES (US-ONB-01)
               ============================================================== */}
            {screenId === 'M-10' && (
              <View style={styles.card}>
                <StatusBadge label={`M-10 • Intro Slide ${introSlideIdx + 1} of 3 (P2)`} tone="info" small />
                <Text style={[styles.h1, { marginTop: 12 }]}>
                  {introSlideIdx === 0 && 'Sub-Second Fire Zone Detection'}
                  {introSlideIdx === 1 && 'Automated Call & Family Multi-Phone Alerts'}
                  {introSlideIdx === 2 && '24/7 Central Monitoring Dispatch'}
                </Text>
                <Text style={[styles.subText, { marginVertical: 12 }]}>
                  {introSlideIdx === 0 &&
                    'Wireless sensors (01 to FE) pinpoint the exact floor and room the instant smoke or fire is detected.'}
                  {introSlideIdx === 1 &&
                    'Receive loud critical alerts that override Silent/DND mode, plus an automated verification call (Press 1 = Fire, Press 2 = False Alarm).'}
                  {introSlideIdx === 2 &&
                    'Our 24/7 monitoring team sees your pinned GPS coordinates and emergency contacts to assist immediately.'}
                </Text>
                <View style={styles.rowBetween}>
                  <ActionButton
                    title="Skip to Sign Up"
                    variant="secondary"
                    small
                    onPress={() => setScreenId('M-04')}
                  />
                  <ActionButton
                    title={introSlideIdx < 2 ? 'Next Slide →' : 'Get Started (M-04) →'}
                    small
                    onPress={() => {
                      if (introSlideIdx < 2) setIntroSlideIdx(introSlideIdx + 1);
                      else setScreenId('M-04');
                    }}
                  />
                </View>
              </View>
            )}

            {/* ==============================================================
                M-11 & M-43: PROFILE SETUP & DRAGGABLE MAP PIN (Exact Figma Match)
               ============================================================== */}
            {(screenId === 'M-11' || screenId === 'M-43') && (
              <View>
                {screenId === 'M-43' && (
                  <TouchableOpacity onPress={() => setScreenId('M-42')}>
                    <Text style={styles.backLink}>← Settings</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.h1}>Home Emergency Profile</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Shared read-only with 24/7 Monitoring Operators (US-ONB-02 / US-ONB-03)
                </Text>

                {/* Interactive Map Pin Card matching Figma M-11 */}
                <View style={styles.mapPinCard}>
                  <Text style={styles.mapCoordBanner}>
                    Drag Pin • {Number(profLat).toFixed(4)}° N, {Number(profLng).toFixed(4)}° E
                  </Text>
                  <View style={styles.mapPinCenterCircle}>
                    <Text style={{ fontSize: 22 }}>📍</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => {
                        setProfLat((l) => Number((l + 0.0012).toFixed(4)));
                        setProfLng((g) => Number((g + 0.0015).toFixed(4)));
                        showToast('Map pin moved; coordinates updated.');
                      }}
                    >
                      <Text style={styles.cyanLink}>↔ Nudge Pin</Text>
                    </TouchableOpacity>
                    <ActionButton
                      title="Use Current Location"
                      small
                      onPress={() => {
                        setProfLat(31.4697);
                        setProfLng(74.4111);
                        showToast('GPS Coordinates locked to current location.');
                      }}
                    />
                  </View>
                </View>

                <LabeledInput
                  label="LOCATION NAME *"
                  value={profLocation}
                  onChangeText={setProfLocation}
                  placeholder="Aslam Residence"
                />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 2 }}>
                    <LabeledInput
                      label="STREET ADDRESS *"
                      value={profStreet}
                      onChangeText={setProfStreet}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <LabeledInput
                      label="UNIT NO."
                      value={profUnit}
                      onChangeText={setProfUnit}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1.4 }}>
                    <LabeledInput label="CITY *" value={profCity} onChangeText={setProfCity} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <LabeledInput
                      label="POSTAL CODE *"
                      value={profPostal}
                      onChangeText={setProfPostal}
                    />
                  </View>
                </View>

                <LabeledInput
                  label="PRIMARY PHONE * (AUTOMATED CALL 1ST)"
                  value={profPhone1}
                  onChangeText={setProfPhone1}
                />
                <LabeledInput
                  label="SECONDARY PHONE (OPTIONAL FALLBACK)"
                  value={profPhone2}
                  onChangeText={setProfPhone2}
                />
                <LabeledInput
                  label="EMAIL (READ-ONLY)"
                  value={user.email || 'husnain.aslam@example.com'}
                  editable={false}
                  rightTag="LOCKED"
                />

                <ActionButton
                  title={screenId === 'M-11' ? 'Save & Continue (M-12)' : 'Save Profile Changes'}
                  disabled={!profLocation.trim() || !profStreet.trim() || !profCity.trim() || !profPhone1.trim()}
                  onPress={async () => {
                    await apiRequest('/user/profile', 'PUT', {
                      userId: user.id || 2,
                      location_name: profLocation,
                      street_address: profStreet,
                      unit_number: profUnit,
                      city: profCity,
                      postal_code: profPostal,
                      primary_phone: profPhone1,
                      secondary_phone: profPhone2,
                      latitude: profLat,
                      longitude: profLng,
                    });
                    showToast('Emergency Profile & GPS coordinates saved and synced to Admin Console!');
                    if (screenId === 'M-11') setScreenId('M-12');
                  }}
                />
              </View>
            )}

            {/* ==============================================================
                M-12 & M-45: APP PERMISSIONS & CRITICAL ALERT SETTINGS
               ============================================================== */}
            {(screenId === 'M-12' || screenId === 'M-45') && (
              <View>
                {screenId === 'M-45' && (
                  <TouchableOpacity onPress={() => setScreenId('M-42')}>
                    <Text style={styles.backLink}>← Settings</Text>
                  </TouchableOpacity>
                )}
                <Text style={styles.h1}>
                  {screenId === 'M-12' ? 'App Permissions (M-12)' : 'Notification & Alert Settings (M-45)'}
                </Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Required so emergency fire alerts wake you even on Silent or Do Not Disturb (US-ONB-04 / US-SET-03).
                </Text>

                {!permNotifications && (
                  <View style={styles.errorAlertCard}>
                    <Text style={styles.errorAlertTitle}>
                      ⚠ Warning: Push Notifications are OFF! Fire alerts may not reach your phone.
                    </Text>
                  </View>
                )}

                {[
                  {
                    title: 'Push Notifications (Required for Fire Alerts)',
                    sub: 'Instant N-01 fire location & N-02 panel offline alerts',
                    val: permNotifications,
                    toggle: () => setPermNotifications(!permNotifications),
                  },
                  {
                    title: 'Critical Alert / Do Not Disturb Override',
                    sub: 'Rings loudly even when phone is muted or in DND mode (US-ALR-02)',
                    val: permCriticalAlert,
                    toggle: () => setPermCriticalAlert(!permCriticalAlert),
                  },
                  {
                    title: 'Camera Access (QR Code Booklet Scan)',
                    sub: 'Used to bind your Wi-Fi Fire Panel in M-15',
                    val: permCamera,
                    toggle: () => setPermCamera(!permCamera),
                  },
                  {
                    title: 'Precise Location (Emergency GPS Pin)',
                    sub: 'Shares exact home coordinates for emergency response',
                    val: permLocation,
                    toggle: () => setPermLocation(!permLocation),
                  },
                ].map((item) => (
                  <View key={item.title} style={[styles.card, { marginBottom: 10 }]}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <Text style={styles.subText}>{item.sub}</Text>
                      </View>
                      <ActionButton
                        title={item.val ? '✓ Allowed' : 'Allow Now'}
                        variant={item.val ? 'safe' : 'primary'}
                        small
                        onPress={item.toggle}
                      />
                    </View>
                  </View>
                ))}

                {screenId === 'M-45' && (
                  <ActionButton
                    title="🔊 Play Test Alarm Sound (No Real Alarm Sent)"
                    variant="secondary"
                    style={{ marginVertical: 10 }}
                    onPress={() => {
                      playEmergencyTone('fire');
                      showToast('Playing loud emergency siren test sound.');
                    }}
                  />
                )}

                <ActionButton
                  title={screenId === 'M-12' ? 'Continue to Panel Setup (M-13)' : 'Done'}
                  onPress={() => setScreenId(screenId === 'M-12' ? 'M-13' : 'M-42')}
                />
              </View>
            )}

            {/* ==============================================================
                M-13 TO M-22: ONBOARDING & PANEL BINDING FLOW
               ============================================================== */}
            {screenId === 'M-13' && (
              <View style={styles.centeredScreen}>
                <Text style={{ fontSize: 48, marginBottom: 12 }}>🛡️</Text>
                <Text style={styles.h1}>No Fire Panel Linked Yet (M-13)</Text>
                <Text style={[styles.subText, { textAlign: 'center', marginVertical: 10 }]}>
                  Bind your Smart Fire Control Panel by scanning the QR code in your product booklet to activate 24/7 home protection.
                </Text>
                <ActionButton
                  title="+ Add My First Panel (M-14)"
                  onPress={() => setScreenId('M-14')}
                />
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 20 }}>
                  <TouchableOpacity onPress={() => setScreenId('M-42')}>
                    <Text style={styles.cyanLink}>Settings (M-42)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setScreenId('M-03')}>
                    <Text style={styles.cyanLink}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {screenId === 'M-14' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-13')}>
                  <Text style={styles.backLink}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Connect Your Panel (M-14)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Follow these 3 quick steps before scanning (US-PNL-01):
                </Text>
                {[
                  ['Step 1', 'Power on the main Fire Control Panel using the AC adapter & backup battery switch.'],
                  ['Step 2', 'Connect the panel to your 2.4GHz home Wi-Fi as shown in the booklet until the green LED is steady.'],
                  ['Step 3', 'Locate the unique Panel QR Code sticker inside your product booklet.'],
                ].map(([st, desc]) => (
                  <View key={st} style={[styles.card, { marginBottom: 10 }]}>
                    <Text style={styles.cyanLink}>{st}</Text>
                    <Text style={[styles.cardTitle, { marginTop: 4 }]}>{desc}</Text>
                  </View>
                ))}
                <ActionButton title="Scan Booklet QR Code (M-15) →" onPress={() => setScreenId('M-15')} />
                <TouchableOpacity
                  style={{ alignSelf: 'center', marginTop: 14 }}
                  onPress={() => setScreenId('M-50')}
                >
                  <Text style={styles.cyanLink}>Need Help? Open Support (M-50)</Text>
                </TouchableOpacity>
              </View>
            )}

            {screenId === 'M-15' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-14')}>
                  <Text style={styles.backLink}>← Instructions</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Scan Booklet QR Code (M-15)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Align the QR code inside the frame to bind your panel (US-PNL-02)
                </Text>

                <View style={styles.qrScannerBox}>
                  <View style={styles.qrTargetFrame}>
                    <Text style={{ fontSize: 34, textAlign: 'center' }}>📷</Text>
                    <Text style={{ color: COLORS.accentCyan, fontSize: 12, fontWeight: '700', marginTop: 8 }}>
                      QR Frame Ready • {flashlightOn ? '🔦 Flashlight ON' : 'Flashlight OFF'}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 14 }}>
                    <ActionButton
                      title={flashlightOn ? '🔦 Turn Off Light' : '🔦 Toggle Flashlight'}
                      variant="secondary"
                      small
                      onPress={() => setFlashlightOn(!flashlightOn)}
                    />
                    <ActionButton
                      title="Simulate QR Scan (PNL-PK-NEW1)"
                      small
                      onPress={() => {
                        setManualPanelUid('PNL-PK-NEW1');
                        setScreenId('M-17');
                      }}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={{ alignSelf: 'center', marginTop: 16 }}
                  onPress={() => setScreenId('M-16')}
                >
                  <Text style={styles.cyanLink}>Cannot scan? Enter Panel ID Manually (M-16) →</Text>
                </TouchableOpacity>
              </View>
            )}

            {screenId === 'M-16' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-15')}>
                  <Text style={styles.backLink}>← Back to QR Scanner</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Enter Panel ID Manually (M-16)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Type the serial ID printed below the QR code in your booklet (US-PNL-03)
                </Text>
                <LabeledInput
                  label="PANEL UNIQUE HARDWARE ID"
                  value={manualPanelUid}
                  onChangeText={setManualPanelUid}
                  placeholder="PNL-PK-NEW1"
                />
                <ActionButton
                  title="Find Panel & Continue (M-17)"
                  disabled={!manualPanelUid.trim()}
                  onPress={() => setScreenId('M-17')}
                />
              </View>
            )}

            {screenId === 'M-17' && (
              <View>
                <Text style={styles.h1}>Confirm & Name Panel (M-17)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Panel discovered on network. Give it a recognizable property name (US-PNL-04).
                </Text>
                <View style={[styles.card, { marginBottom: 14 }]}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.cardTitle}>Panel ID: {manualPanelUid}</Text>
                    <StatusBadge label="Online • Ready" tone="safe" small />
                  </View>
                </View>
                <LabeledInput
                  label="PANEL / PROPERTY NAME"
                  value={newPanelName}
                  onChangeText={setNewPanelName}
                  placeholder="Aslam Residence"
                />
                <ActionButton
                  title="Confirm & Link Panel (M-18)"
                  onPress={async () => {
                    try {
                      const res = await apiRequest('/panels/link', 'POST', {
                        userId: user.id || 2,
                        panelUid: manualPanelUid,
                        panelName: newPanelName,
                      });
                      if (res.linkAddress32Bit) setLastLinked32Bit(res.linkAddress32Bit);
                      if (res.panel?.id) setSelectedPanelId(res.panel.id);
                      setScreenId('M-18');
                    } catch {}
                  }}
                />
              </View>
            )}

            {screenId === 'M-18' && (
              <View style={styles.centeredScreen}>
                <View style={styles.successCircle}>
                  <Text style={{ fontSize: 30, color: COLORS.safeText }}>✓</Text>
                </View>
                <Text style={styles.h1}>Panel Linked Successfully! (M-18)</Text>
                <Text style={[styles.subText, { textAlign: 'center', marginVertical: 8 }]}>
                  Your app has received and stored the unique 32-bit hardware link address (SYS-09):
                </Text>
                <StatusBadge label={`32-Bit Link Address: ${lastLinked32Bit}`} tone="info" />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 20 }}>
                  <ActionButton title="+ Add Sensors (M-28)" onPress={() => setScreenId('M-28')} />
                  <ActionButton
                    title="Go to Dashboard (M-23)"
                    variant="secondary"
                    onPress={() => setScreenId('M-23')}
                  />
                </View>
              </View>
            )}

            {screenId === 'M-19' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-23')}>
                  <Text style={styles.backLink}>← Dashboard</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>My Panels List (M-19)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Tap any property panel to switch your active dashboard (US-PNL-06)
                </Text>

                {panels.map((p) => {
                  const isSelected = activePanel && activePanel.id === p.id;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      style={[
                        styles.card,
                        { marginBottom: 10 },
                        isSelected && { borderColor: COLORS.accentCyan, backgroundColor: '#132242' },
                      ]}
                      onPress={() => {
                        setSelectedPanelId(p.id);
                        showToast(`Switched active panel to ${p.panel_name}`);
                        setScreenId('M-23');
                      }}
                    >
                      <View style={styles.rowBetween}>
                        <View style={{ flex: 1, paddingRight: 8 }}>
                          <Text style={styles.cardTitle}>
                            {p.panel_name} {isSelected ? '✓ (Active)' : ''}
                          </Text>
                          <Text style={styles.subText}>
                            {p.panel_uid} • {p.floor_count} Floors • {p.sensor_count} Sensors
                          </Text>
                        </View>
                        <StatusBadge
                          label={p.status}
                          tone={p.status === 'Working' ? 'safe' : p.status === 'Offline' ? 'warning' : 'danger'}
                          small
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}

                <ActionButton
                  title="+ Add Another Panel / Replace System (M-22)"
                  variant="secondary"
                  onPress={() => setScreenId('M-22')}
                />
              </View>
            )}

            {screenId === 'M-20' && activePanel && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-23')}>
                  <Text style={styles.backLink}>← Dashboard</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Panel Details (M-20)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  View connection telemetry or rename your bound panel (US-PNL-07)
                </Text>

                <View style={[styles.card, { marginBottom: 14, gap: 8 }]}>
                  <Text style={styles.subText}>Panel Hardware ID (Read-Only): <Text style={{ color: '#fff', fontWeight: '700' }}>{activePanel.panel_uid}</Text></Text>
                  <Text style={styles.subText}>32-Bit Link Address: <Text style={{ color: COLORS.accentCyan, fontWeight: '700' }}>{activePanel.link_address_32bit}</Text></Text>
                  <Text style={styles.subText}>Connection Status: <Text style={{ color: COLORS.safeText, fontWeight: '700' }}>{activePanel.status}</Text></Text>
                  <Text style={styles.subText}>Last Seen: <Text style={{ color: '#fff' }}>{activePanel.last_seen_pkt}</Text></Text>
                  <Text style={styles.subText}>Setup Summary: <Text style={{ color: '#fff' }}>{activePanel.floor_count} Floors • {activePanel.sensor_count} Sensors</Text></Text>
                </View>

                <LabeledInput
                  label="PANEL NAME (EDITABLE)"
                  value={newPanelName}
                  onChangeText={setNewPanelName}
                />

                <View style={{ gap: 10 }}>
                  <ActionButton
                    title="Save Panel Name"
                    onPress={async () => {
                      await apiRequest(`/panels/${activePanel.id}`, 'PUT', {
                        userId: user.id || 2,
                        panelName: newPanelName,
                      });
                      showToast('Panel name updated.');
                    }}
                  />
                  <ActionButton
                    title="Remove Panel from Account (M-21)"
                    variant="danger"
                    onPress={() => setScreenId('M-21')}
                  />
                </View>
              </View>
            )}

            {screenId === 'M-21' && activePanel && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-20')}>
                  <Text style={styles.backLink}>← Back to Panel Details</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Remove Panel? (M-21)</Text>
                <View style={styles.errorAlertCard}>
                  <Text style={styles.errorAlertTitle}>
                    ⚠ Warning: All floors and sensor room names for {activePanel.panel_name} will be removed from your app.
                  </Text>
                  <Text style={styles.errorAlertSub}>
                    The monitoring company retains historical audit records for legal safety (US-PNL-08).
                  </Text>
                </View>
                <LabeledInput
                  label={`TYPE "${activePanel.panel_name}" OR YOUR PASSWORD TO CONFIRM`}
                  value={removeConfirmInput}
                  onChangeText={setRemoveConfirmInput}
                  placeholder={activePanel.panel_name}
                />
                <ActionButton
                  title="Confirm & Unlink Panel"
                  variant="danger"
                  disabled={!removeConfirmInput.trim()}
                  onPress={async () => {
                    await apiRequest(`/panels/${activePanel.id}`, 'DELETE', { userId: user.id || 2 });
                    setRemoveConfirmInput('');
                    showToast('Panel removed from your account.');
                    setScreenId('M-13');
                  }}
                />
              </View>
            )}

            {screenId === 'M-22' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-19')}>
                  <Text style={styles.backLink}>← My Panels</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Add / Replace Alarm System (M-22)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Assign a new hardware panel with its own unique 32-bit link address without mixing old and new telemetry (US-PNL-09).
                </Text>
                <LabeledInput
                  label="NEW PANEL HARDWARE ID"
                  value={manualPanelUid}
                  onChangeText={setManualPanelUid}
                  placeholder="PNL-PK-NEW1"
                />
                <LabeledInput
                  label="NEW PROPERTY / PANEL NAME"
                  value={newPanelName}
                  onChangeText={setNewPanelName}
                  placeholder="DHA Phase 6 Annex"
                />
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setReplaceCopyFloors(!replaceCopyFloors)}
                >
                  <View style={[styles.checkbox, replaceCopyFloors && styles.checkboxChecked]}>
                    {replaceCopyFloors && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>✓</Text>}
                  </View>
                  <Text style={{ color: COLORS.textSecondary, fontSize: 12, flex: 1 }}>
                    Copy existing panel's floor layout and sensor room labels to the replacement panel
                  </Text>
                </TouchableOpacity>
                <ActionButton
                  title="Link New Alarm System"
                  onPress={async () => {
                    const res = await apiRequest('/panels/link', 'POST', {
                      userId: user.id || 2,
                      panelUid: manualPanelUid,
                      panelName: newPanelName,
                      replacePanelId: activePanel?.id,
                      copyLayout: replaceCopyFloors,
                    });
                    if (res.linkAddress32Bit) setLastLinked32Bit(res.linkAddress32Bit);
                    showToast('New alarm system linked with separate 32-bit address!');
                    setScreenId('M-18');
                  }}
                />
              </View>
            )}

            {/* ==============================================================
                M-23: DASHBOARD (HOME) SCREEN (Exact Figma Match + Tablet Grid)
               ============================================================== */}
            {screenId === 'M-23' && (
              <View>
                {/* Top Property Switcher Row matching Figma M-23 */}
                <View style={styles.m23TopRow}>
                  <TouchableOpacity
                    style={styles.propertySwitcherBox}
                    onPress={() => setScreenId('M-19')}
                  >
                    <Text style={styles.propertySwitcherText}>
                      {activePanel ? activePanel.panel_name : 'Aslam Residence'} ▾
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.livePktPill}>
                    <Text style={styles.livePktText}>● Live PKT</Text>
                  </View>
                </View>

                {/* Main System Status Card (Working Green / Fault Red / Offline Grey) */}
                {activePanel?.status === 'Offline' ? (
                  <TouchableOpacity
                    style={[styles.m23HeroStatusCard, { backgroundColor: '#1e293b', borderColor: '#64748b' }]}
                    onPress={() => setScreenId('M-39')}
                  >
                    <View style={[styles.shieldCircle, { backgroundColor: '#334155' }]}>
                      <Text style={{ fontSize: 22 }}>📡</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.m23HeroTitle}>PANEL OFFLINE</Text>
                      <Text style={[styles.m23HeroSub, { color: COLORS.warningLight }]}>
                        Your panel is not connected. Check power & Wi-Fi.
                      </Text>
                      <Text style={[styles.m23HeroTap, { color: COLORS.warningText }]}>
                        Last seen {activePanel.last_seen_pkt} • Tap for M-39 Offline Help →
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : activeIncident ? (
                  <TouchableOpacity
                    style={[styles.m23HeroStatusCard, { backgroundColor: '#451015', borderColor: COLORS.dangerBorder }]}
                    onPress={() => setScreenId('M-36')}
                  >
                    <View style={[styles.shieldCircle, { backgroundColor: COLORS.danger }]}>
                      <Text style={{ fontSize: 22 }}>🔥</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.m23HeroTitle}>FIRE ALARM ACTIVE!</Text>
                      <Text style={[styles.m23HeroSub, { color: COLORS.dangerLight }]}>
                        {activeIncident.primary_floor} → {activeIncident.primary_room}
                      </Text>
                      <Text style={[styles.m23HeroTap, { color: COLORS.warningText }]}>
                        Tap to Open Full-Screen Emergency Alert (M-36) →
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.m23HeroStatusCard}
                    onPress={() => setScreenId('M-20')}
                  >
                    <View style={styles.shieldCircle}>
                      <Text style={{ fontSize: 22 }}>🛡️</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.m23HeroTitle}>SYSTEM WORKING</Text>
                      <Text style={styles.m23HeroSub}>
                        Home Protected • Panel #{activePanel?.panel_uid || 'PNL-PK-8F2A'}
                      </Text>
                      <Text style={styles.m23HeroTap}>
                        Updated 2s ago • Tap for Panel Details →
                      </Text>
                      <View style={styles.m23StateNoteChip}>
                        <Text style={styles.m23StateNoteText}>
                          States: [Working: Green] [Fault: Red → Room] [No Net Banner]
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}

                {/* 3 Summary KPI Boxes (FLOORS / SENSORS / OFFLINE) matching Figma M-23 */}
                <View style={styles.m23SummaryRow}>
                  <TouchableOpacity
                    style={styles.m23SummaryBox}
                    onPress={() => setScreenId('M-24')}
                  >
                    <Text style={styles.m23SummaryLabel}>FLOORS</Text>
                    <Text style={styles.m23SummaryVal}>{floors.length || 3}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.m23SummaryBox}
                    onPress={() => setScreenId('M-27')}
                  >
                    <Text style={styles.m23SummaryLabel}>SENSORS</Text>
                    <Text style={styles.m23SummaryVal}>{sensors.length || 8}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.m23SummaryBox}
                    onPress={() => setScreenId('M-27')}
                  >
                    <Text style={styles.m23SummaryLabel}>OFFLINE</Text>
                    <Text
                      style={[
                        styles.m23SummaryVal,
                        {
                          color:
                            (activePanel?.offline_sensor_count || 0) > 0
                              ? COLORS.warningText
                              : COLORS.safeText,
                        },
                      ]}
                    >
                      {activePanel?.offline_sensor_count ?? 0}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Responsive Tablet Split for Quick Actions & Recent Activity */}
                <View style={isTabletGrid ? styles.tabletTwoCol : null}>
                  <View style={isTabletGrid ? { flex: 1 } : null}>
                    <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
                    <View style={styles.quickActionsGrid}>
                      <TouchableOpacity
                        style={[styles.quickActionBtn, styles.quickActionPrimary]}
                        onPress={() => setScreenId('M-28')}
                      >
                        <Text style={styles.quickActionTextWhite}>+ Add Sensor</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.quickActionBtn}
                        onPress={() => setScreenId('M-35')}
                      >
                        <Text style={[styles.quickActionTextWhite, { color: COLORS.accentCyan }]}>
                          Run Self-Test
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.quickActionBtn}
                        onPress={() => setScreenId('M-24')}
                      >
                        <Text style={styles.quickActionTextWhite}>Manage Floors</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.quickActionBtn}
                        onPress={() => setScreenId('M-40')}
                      >
                        <Text style={styles.quickActionTextWhite}>Event History</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={isTabletGrid ? { flex: 1.2 } : null}>
                    <View style={[styles.rowBetween, { marginTop: isTabletGrid ? 0 : 16, marginBottom: 8 }]}>
                      <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
                      <TouchableOpacity onPress={() => setScreenId('M-40')}>
                        <Text style={styles.cyanLink}>See All →</Text>
                      </TouchableOpacity>
                    </View>

                    {history.slice(0, 4).map((ev) => {
                      const isTest = ev.event_type === 'self_test';
                      const isFire = ev.event_type === 'fire_alarm';
                      const isSensorOnline = ev.event_type === 'sensor_online';
                      return (
                        <TouchableOpacity
                          key={ev.id}
                          style={styles.activityCard}
                          onPress={() => {
                            setSelectedHistoryId(ev.id);
                            setScreenId('M-41');
                          }}
                        >
                          <Text
                            style={[
                              styles.activityCardTitle,
                              isTest && { color: COLORS.safeText },
                              isSensorOnline && { color: COLORS.accentCyan },
                              isFire && { color: COLORS.warningText },
                            ]}
                          >
                            {isTest ? '✓ ' : isFire ? '🔕 ' : '● '}
                            {ev.title}
                          </Text>
                          <Text style={styles.activityCardTime}>{ev.created_pkt}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {/* ==============================================================
                M-24, M-25, M-26, M-27: FLOORS & SENSOR BATTERY DISPLAY
               ============================================================== */}
            {screenId === 'M-24' && (
              <View>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={styles.h1}>Household Floors (M-24)</Text>
                    <Text style={styles.subText}>
                      Tap a floor to view sensors & battery levels (US-FLR-01)
                    </Text>
                  </View>
                  <ActionButton title="+ Add Floor" small onPress={() => setScreenId('M-25')} />
                </View>

                <View style={[isTabletGrid && styles.tabletGridWrap, { marginTop: 14 }]}>
                  {floors.map((fl, idx) => (
                    <TouchableOpacity
                      key={fl.id}
                      style={[styles.card, { marginBottom: 10 }, isTabletGrid && { flex: 1, minWidth: 280 }]}
                      onPress={() => {
                        setSelectedFloorId(fl.id);
                        setEditFloorName(fl.floor_name);
                        setScreenId('M-27');
                      }}
                    >
                      <View style={styles.rowBetween}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 8 }}>
                          <View
                            style={[
                              styles.statusDot,
                              {
                                backgroundColor: fl.has_offline
                                  ? COLORS.dangerBright
                                  : COLORS.safeText,
                              },
                            ]}
                          />
                          <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{fl.floor_name}</Text>
                            <Text style={styles.subText}>
                              {fl.sensor_count} Sensors{' '}
                              {fl.offline_count > 0 ? `• ${fl.offline_count} Offline` : '• All Online'}
                            </Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          {idx > 0 && (
                            <TouchableOpacity
                              style={styles.iconBtn}
                              onPress={async () => {
                                const ids = floors.map((f) => f.id);
                                const tmp = ids[idx - 1];
                                ids[idx - 1] = ids[idx];
                                ids[idx] = tmp;
                                await apiRequest('/floors/reorder', 'PUT', {
                                  userId: user.id || 2,
                                  panelId: activePanel.id,
                                  floorIds: ids,
                                });
                                showToast('Floor order saved (US-FLR-05).');
                              }}
                            >
                              <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>↑</Text>
                            </TouchableOpacity>
                          )}
                          <Text style={styles.cyanLink}>Open →</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {screenId === 'M-25' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-24')}>
                  <Text style={styles.backLink}>← Floors List</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Create Floor (M-25)</Text>
                <Text style={[styles.subText, { marginBottom: 12 }]}>
                  Pick a quick suggestion or type a custom floor name (US-FLR-02):
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                  {['Ground Floor', 'First Floor', 'Second Floor', 'Basement', 'Roof'].map((sug) => (
                    <TouchableOpacity
                      key={sug}
                      style={styles.ctrlChip}
                      onPress={() => setNewFloorName(sug)}
                    >
                      <Text style={styles.ctrlChipText}>{sug}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <LabeledInput
                  label="FLOOR NAME *"
                  value={newFloorName}
                  onChangeText={setNewFloorName}
                  placeholder="e.g. Second Floor"
                />

                <ActionButton
                  title="Create Floor"
                  disabled={!newFloorName.trim()}
                  onPress={async () => {
                    try {
                      await apiRequest('/floors', 'POST', {
                        userId: user.id || 2,
                        panelId: activePanel?.id || 1,
                        floorName: newFloorName,
                      });
                      setNewFloorName('');
                      showToast('Floor added.');
                      setScreenId('M-24');
                    } catch {}
                  }}
                />
              </View>
            )}

            {screenId === 'M-26' && currentFloor && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-27')}>
                  <Text style={styles.backLink}>← Back to {currentFloor.floor_name}</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Edit / Delete Floor (M-26)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Renaming updates alerts, history, and the Admin Console immediately (US-FLR-03..04).
                </Text>
                <LabeledInput
                  label="FLOOR NAME"
                  value={editFloorName}
                  onChangeText={setEditFloorName}
                />
                <View style={{ gap: 10 }}>
                  <ActionButton
                    title="Save Floor Name"
                    disabled={!editFloorName.trim()}
                    onPress={async () => {
                      try {
                        await apiRequest(`/floors/${currentFloor.id}`, 'PUT', {
                          userId: user.id || 2,
                          floorName: editFloorName,
                        });
                        showToast('Floor renamed everywhere.');
                        setScreenId('M-27');
                      } catch {}
                    }}
                  />
                  <ActionButton
                    title="Delete Floor"
                    variant="danger"
                    onPress={async () => {
                      try {
                        await apiRequest(`/floors/${currentFloor.id}`, 'DELETE', {
                          userId: user.id || 2,
                        });
                        showToast('Floor deleted.');
                        setScreenId('M-24');
                      } catch {}
                    }}
                  />
                </View>
              </View>
            )}

            {/* M-27: FLOOR DETAIL (Exact Match to Figma M-27 Screenshot) */}
            {screenId === 'M-27' && currentFloor && (
              <View>
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <TouchableOpacity onPress={() => setScreenId('M-24')}>
                      <Text style={styles.backLink}>← Floors</Text>
                    </TouchableOpacity>
                    <Text style={styles.h1}>{currentFloor.floor_name}</Text>
                    <Text style={styles.subText}>
                      {(currentFloor.sensors || []).length} Sensors • Tap any sensor for details (M-33)
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.menuDotsBtn}
                    onPress={() => {
                      setEditFloorName(currentFloor.floor_name);
                      setScreenId('M-26');
                    }}
                  >
                    <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '800' }}>⋮</Text>
                  </TouchableOpacity>
                </View>

                <View style={[isTabletGrid && styles.tabletGridWrap, { marginTop: 14 }]}>
                  {(currentFloor.sensors || []).map((s) => {
                    const isOffline = s.status === 'Offline';
                    return (
                      <TouchableOpacity
                        key={s.id}
                        style={[
                          styles.m27SensorCard,
                          isOffline && { borderColor: COLORS.dangerBorder, backgroundColor: '#1f1118' },
                          isTabletGrid && { flex: 1, minWidth: 280 },
                        ]}
                        onPress={() => {
                          setSelectedSensorId(s.id);
                          setEditSensorRoom(s.room_name || '');
                          setEditSensorFloorId(s.floor_id || currentFloor.id);
                          setScreenId('M-33');
                        }}
                      >
                        <View style={styles.rowBetween}>
                          <Text style={styles.m27RoomTitle}>{s.display_name}</Text>
                          <View style={styles.addrPill}>
                            <Text style={styles.addrPillText}>Addr {s.hex_address}</Text>
                          </View>
                          <BatteryIndicator percent={s.battery_percent} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: isOffline ? COLORS.dangerBright : COLORS.safeText },
                            ]}
                          />
                          <Text
                            style={[
                              styles.m27StatusText,
                              isOffline && { color: COLORS.dangerSoftText, fontWeight: '800' },
                            ]}
                          >
                            {isOffline
                              ? 'OFFLINE • Last seen 24m ago'
                              : s.battery_percent === null
                              ? 'Online • Awaiting 1st reading'
                              : `Online • Updated ${s.last_updated_pkt}`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <ActionButton
                  title={`+ Add Sensor to ${currentFloor.floor_name} (M-28)`}
                  style={{ marginTop: 10 }}
                  onPress={() => setScreenId('M-28')}
                />
              </View>
            )}

            {/* ==============================================================
                M-28 TO M-35: SENSOR PAIRING, DETAILS & SYSTEM SELF-TEST
               ============================================================== */}
            {screenId === 'M-28' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-27')}>
                  <Text style={styles.backLink}>← Back to Floor</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Add Wireless Sensor (M-28)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Send a remote pairing signal to put your panel into pairing mode without pressing the physical panel switch (US-SNS-01).
                </Text>

                <Text style={styles.sectionLabel}>SELECT TARGET FLOOR</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 10 }}>
                  {floors.map((fl) => (
                    <TouchableOpacity
                      key={fl.id}
                      style={[
                        styles.ctrlChip,
                        selectedFloorId === fl.id && { borderColor: COLORS.accentCyan, backgroundColor: COLORS.primarySoftBg },
                      ]}
                      onPress={() => setSelectedFloorId(fl.id)}
                    >
                      <Text style={styles.ctrlChipText}>{fl.floor_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={[styles.card, { marginVertical: 12 }]}>
                  <Text style={styles.cardTitle}>Sensor Pairing Instructions</Text>
                  <Text style={[styles.subText, { marginTop: 4 }]}>
                    1. Tap "Start Pairing Mode" below.{'\n'}
                    2. Flip the power switch on your wireless smoke sensor to ON.{'\n'}
                    3. The panel will automatically assign the next 8-bit hex address (01 to FE).
                  </Text>
                </View>

                <ActionButton
                  title="Start Pairing Mode on Panel (M-29)"
                  disabled={activePanel?.status === 'Offline'}
                  onPress={() => {
                    setPairingCountdown(45);
                    setScreenId('M-29');
                  }}
                />
              </View>
            )}

            {screenId === 'M-29' && (
              <View style={styles.centeredScreen}>
                <View style={styles.splashOuterRing}>
                  <Text style={{ fontSize: 34 }}>📡</Text>
                </View>
                <Text style={styles.h1}>Searching for Sensor... (M-29)</Text>
                <Text style={[styles.subText, { textAlign: 'center', marginVertical: 8 }]}>
                  Switch ON your wireless fire sensor now. Panel #{activePanel?.panel_uid} is listening on 8-bit hex bus (01–FE).
                </Text>
                <Text style={{ color: COLORS.accentCyan, fontSize: 22, fontWeight: '900', marginVertical: 10 }}>
                  00 : {String(pairingCountdown).padStart(2, '0')}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <ActionButton
                    title="✓ Simulate Sensor Discovered (M-30)"
                    small
                    onPress={() => setScreenId('M-30')}
                  />
                  <ActionButton
                    title="Simulate Timeout (M-31)"
                    variant="secondary"
                    small
                    onPress={() => setScreenId('M-31')}
                  />
                  <ActionButton
                    title="Cancel Pairing"
                    variant="danger"
                    small
                    onPress={() => setScreenId('M-27')}
                  />
                </View>
              </View>
            )}

            {screenId === 'M-30' && (
              <View>
                <StatusBadge label="NEW SENSOR DISCOVERED • 8-BIT HEX BUS" tone="safe" small />
                <Text style={[styles.h1, { marginTop: 8 }]}>Sensor Found — Name & Place (M-30)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Give this sensor a clear room label so emergency alerts are easy to understand (US-SNS-03).
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {['Kitchen', 'Master Bedroom', 'Living Room', 'Kids Room', 'Study Room', 'Garage'].map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={styles.ctrlChip}
                      onPress={() => setNewSensorRoom(r)}
                    >
                      <Text style={styles.ctrlChipText}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <LabeledInput
                  label="ROOM NAME *"
                  value={newSensorRoom}
                  onChangeText={setNewSensorRoom}
                  placeholder="e.g. Kitchen"
                />

                <ActionButton
                  title="Save Sensor to Floor (M-32)"
                  disabled={!newSensorRoom.trim()}
                  onPress={async () => {
                    try {
                      const res = await apiRequest('/sensors/pair', 'POST', {
                        userId: user.id || 2,
                        panelId: activePanel?.id || 1,
                        floorId: selectedFloorId,
                        roomName: newSensorRoom,
                        pairedVia: 'app',
                      });
                      setPairedSensorObj(res.sensor);
                      showToast(`Sensor Addr ${res.sensor.hex_address} paired!`);
                      setScreenId('M-32');
                    } catch {}
                  }}
                />
              </View>
            )}

            {screenId === 'M-31' && (
              <View style={styles.centeredScreen}>
                <Text style={{ fontSize: 40, marginBottom: 8 }}>⚠️</Text>
                <Text style={styles.h1}>Pairing Failed / Timed Out (M-31)</Text>
                <Text style={[styles.subText, { textAlign: 'center', marginVertical: 10 }]}>
                  No wireless sensor signal was detected within 45 seconds. Check that the sensor battery tab is removed and the panel is online (US-SNS-05).
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
                  <ActionButton title="Try Again (M-29)" onPress={() => setScreenId('M-29')} />
                  <ActionButton title="Get Help (M-50)" variant="secondary" onPress={() => setScreenId('M-50')} />
                </View>
              </View>
            )}

            {screenId === 'M-32' && (
              <View style={styles.centeredScreen}>
                <View style={styles.successCircle}>
                  <Text style={{ fontSize: 30, color: COLORS.safeText }}>✓</Text>
                </View>
                <Text style={styles.h1}>Sensor Added & Active! (M-32)</Text>
                <Text style={[styles.subText, { textAlign: 'center', marginVertical: 8 }]}>
                  {pairedSensorObj
                    ? `${pairedSensorObj.display_name} • ${pairedSensorObj.floor_name} • Hex Address ${pairedSensorObj.hex_address}`
                    : `${newSensorRoom} • Ground Floor • Hex Address 09`}
                </Text>
                <StatusBadge label="Limit Check: Up to 254 Addresses (01–FE) Supported" tone="info" small />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 18 }}>
                  <ActionButton title="+ Add Another Sensor" variant="secondary" onPress={() => setScreenId('M-28')} />
                  <ActionButton title="Done (M-27)" onPress={() => setScreenId('M-27')} />
                </View>
              </View>
            )}

            {screenId === 'M-33' && currentSensor && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-27')}>
                  <Text style={styles.backLink}>← Back to Floor</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Sensor Details (M-33)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Inspect hardware address, battery level, or rename/move sensor (US-SNS-08..09)
                </Text>

                <View style={[styles.card, { marginBottom: 14, gap: 10 }]}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.cardTitle}>Hardware Address (Read-Only)</Text>
                    <View style={styles.addrPill}>
                      <Text style={styles.addrPillText}>0x{currentSensor.hex_address}</Text>
                    </View>
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.subText}>Operational Status</Text>
                    <StatusBadge
                      label={currentSensor.status}
                      tone={currentSensor.status === 'Online' ? 'safe' : 'danger'}
                      small
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.subText}>Battery Level (SYS-08)</Text>
                    <BatteryIndicator
                      percent={currentSensor.battery_percent}
                      voltage={currentSensor.battery_voltage}
                      showVoltage
                    />
                  </View>
                  <View style={styles.rowBetween}>
                    <Text style={styles.subText}>Last Self-Test Result</Text>
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>
                      {currentSensor.last_test_result} • {currentSensor.last_updated_pkt}
                    </Text>
                  </View>
                </View>

                <LabeledInput
                  label="ROOM NAME"
                  value={editSensorRoom}
                  onChangeText={setEditSensorRoom}
                  placeholder="Enter room name"
                />

                <Text style={styles.sectionLabel}>MOVE TO FLOOR</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 10 }}>
                  {floors.map((fl) => (
                    <TouchableOpacity
                      key={fl.id}
                      style={[
                        styles.ctrlChip,
                        editSensorFloorId === fl.id && {
                          borderColor: COLORS.accentCyan,
                          backgroundColor: COLORS.primarySoftBg,
                        },
                      ]}
                      onPress={() => setEditSensorFloorId(fl.id)}
                    >
                      <Text style={styles.ctrlChipText}>{fl.floor_name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ gap: 10, marginTop: 8 }}>
                  <ActionButton
                    title="Save Sensor Changes"
                    disabled={!editSensorRoom.trim()}
                    onPress={async () => {
                      await apiRequest(`/sensors/${currentSensor.id}`, 'PUT', {
                        userId: user.id || 2,
                        roomName: editSensorRoom,
                        floorId: editSensorFloorId,
                      });
                      showToast('Sensor updated across app & Admin Console.');
                      setScreenId('M-27');
                    }}
                  />
                  <ActionButton
                    title="Remove Sensor (M-34)"
                    variant="danger"
                    onPress={() => setScreenId('M-34')}
                  />
                </View>
              </View>
            )}

            {screenId === 'M-34' && currentSensor && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-33')}>
                  <Text style={styles.backLink}>← Back to Sensor Details</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Remove Sensor? (M-34)</Text>
                <View style={styles.errorAlertCard}>
                  <Text style={styles.errorAlertTitle}>
                    ⚠ Confirm Removal: {currentSensor.display_name} (Addr {currentSensor.hex_address})
                  </Text>
                  <Text style={styles.errorAlertSub}>
                    This sensor will stop being monitored by the app until paired again (US-SNS-10).
                  </Text>
                </View>
                <ActionButton
                  title="Confirm & Delete Sensor"
                  variant="danger"
                  onPress={async () => {
                    await apiRequest(`/sensors/${currentSensor.id}`, 'DELETE', {
                      userId: user.id || 2,
                    });
                    showToast('Sensor removed.');
                    setScreenId('M-27');
                  }}
                />
              </View>
            )}

            {/* M-35: RUN SYSTEM SELF-TEST (US-TST-01 / SYS-12) */}
            {screenId === 'M-35' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-23')}>
                  <Text style={styles.backLink}>← Dashboard</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Run System Self-Test (M-35)</Text>
                <Text style={[styles.subText, { marginBottom: 12 }]}>
                  Verifies all wireless sensors and refreshes battery voltages. Self-tests NEVER trigger emergency calls, emails, or Admin fire alerts (SYS-12).
                </Text>

                <View style={[styles.card, { borderColor: COLORS.warningBorder, marginBottom: 14 }]}>
                  <Text style={{ color: COLORS.warningText, fontSize: 12.5, fontWeight: '700' }}>
                    🔊 Notice: The panel siren may sound briefly during the diagnostic check.
                  </Text>
                </View>

                <ActionButton
                  title={testRunning ? '⟳ Polling All Sensors (01–FE)...' : '▶ Start System Self-Test'}
                  disabled={activePanel?.status === 'Offline' || testRunning}
                  onPress={async () => {
                    setTestRunning(true);
                    try {
                      const res = await apiRequest(`/panels/${activePanel?.id || 1}/self-test`, 'POST', {
                        userId: user.id || 2,
                      });
                      setLastTestReport(res);
                      showToast(`Self-test completed: ${res.passedCount}/${res.totalCount} sensors passed!`);
                    } finally {
                      setTestRunning(false);
                    }
                  }}
                />

                <View style={{ marginTop: 16, gap: 8 }}>
                  {(lastTestReport?.results || sensors).map((s) => (
                    <View key={s.id || s.hex_address} style={styles.card}>
                      <View style={styles.rowBetween}>
                        <Text style={[styles.cardTitle, { flex: 1, paddingRight: 8 }]}>
                          Addr {s.hex_address} • {s.room_name || s.display_name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <StatusBadge
                            label={s.result || s.last_test_result || 'Passed'}
                            tone={(s.result || s.last_test_result) === 'No response' ? 'danger' : 'safe'}
                            small
                          />
                          <BatteryIndicator percent={s.battery_percent} />
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* ==============================================================
                M-36: FIRE ALARM EMERGENCY SCREEN (Exact Figma Match)
               ============================================================== */}
            {screenId === 'M-36' && (
              <View>
                <View style={styles.m36HeroRedBox}>
                  <View style={styles.m36FireCircle}>
                    <Text style={{ fontSize: 34 }}>🔥</Text>
                  </View>
                  <Text style={styles.m36FireAlarmTitle}>FIRE ALARM</Text>
                  <Text style={styles.m36SubUpper}>
                    {(activePanel?.panel_name || 'ASLAM RESIDENCE').toUpperCase()} • SOUND OVERRIDING SILENT/DND
                  </Text>
                  <Text style={styles.m36SensorCountAmber}>
                    {(activeIncident?.alarm_sensors?.length || 2)} SENSORS IN ALARM (LIVE)
                  </Text>
                </View>

                <Text style={styles.m36SectionLabel}>
                  ACTIVE ALARM LOCATIONS (NEWEST FIRST)
                </Text>

                {(activeIncident?.alarm_sensors || [
                  { id: 1, floor_name: 'Ground Floor', room_name: 'Kitchen', hex_address: '01', triggered_pkt: '11:08:42 PM' },
                  { id: 2, floor_name: 'Ground Floor', room_name: 'Unnamed (Addr 06)', hex_address: '06', triggered_pkt: '11:08:12 PM' },
                ]).map((as, idx) => (
                  <View key={as.id || idx} style={styles.m36LocationCard}>
                    <Text style={{ fontSize: 22 }}>🔥</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.m36LocationTitle}>
                        {as.floor_name} → {as.room_name}
                      </Text>
                      <Text style={styles.m36LocationSub}>
                        Sensor Addr {as.hex_address} • Triggered {as.triggered_pkt}
                      </Text>
                    </View>
                    {idx === 0 && (
                      <View style={styles.m36NewestPill}>
                        <Text style={styles.m36NewestText}>NEWEST</Text>
                      </View>
                    )}
                  </View>
                ))}

                {/* Automated Verification Call Info Card matching Figma M-36 */}
                <View style={styles.m36CallInfoCard}>
                  <Text style={{ fontSize: 22 }}>📞</Text>
                  <View style={{ flex: 1, gap: 3 }}>
                    <Text style={styles.m36CallTitle}>You Will Receive an Automated Call</Text>
                    <Text style={styles.m36CallPress1}>Press 1 → Confirm REAL FIRE</Text>
                    <Text style={styles.m36CallPress2}>Press 2 → Confirm FALSE ALARM</Text>
                  </View>
                </View>

                {/* 1-Tap Confirm Silence Siren Button matching Figma M-36 */}
                <TouchableOpacity
                  style={styles.m36SilenceButton}
                  onPress={() => setShowSilenceConfirm(true)}
                >
                  <Text style={styles.m36SilenceButtonText}>
                    🔕 SILENCE SIREN (1-Tap Confirm)
                  </Text>
                </TouchableOpacity>

                <Text style={styles.m36FooterNote}>
                  If Wi-Fi command fails, press physical Silence button on panel. Alert remains on screen until panel clears.
                </Text>
              </View>
            )}

            {/* ==============================================================
                M-37: ALARM STATUS (AFTER SIREN SILENCED) & M-38: ALL CLEAR
               ============================================================== */}
            {screenId === 'M-37' && (
              <View style={{ gap: 14 }}>
                <View style={[styles.card, { borderColor: COLORS.warningBorder, backgroundColor: COLORS.warningBg }]}>
                  <StatusBadge label="SIREN SILENCED • ALARM STILL ACTIVE" tone="warning" />
                  <Text style={[styles.h1, { marginTop: 10 }]}>Siren Muted — Incident Still Open (M-37)</Text>
                  <Text style={[styles.subText, { color: COLORS.warningLight, marginTop: 6 }]}>
                    The local siren has been silenced, but the fire alarm remains active until the panel clears or the monitoring operator resolves the incident (US-ALR-06).
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  <ActionButton title="Simulate All Clear (M-38)" variant="safe" onPress={() => setScreenId('M-38')} />
                  <ActionButton title="Back to Emergency (M-36)" variant="danger" onPress={() => setScreenId('M-36')} />
                </View>
              </View>
            )}

            {screenId === 'M-38' && (
              <View style={styles.centeredScreen}>
                <View style={styles.successCircle}>
                  <Text style={{ fontSize: 32, color: COLORS.safeText }}>✓</Text>
                </View>
                <Text style={styles.h1}>All Clear — Alarm Ended (M-38)</Text>
                <Text style={[styles.subText, { textAlign: 'center', marginVertical: 10 }]}>
                  Incident {recentClearedIncident?.incident_code || '#INC-2045'} has been cleared and logged in your History.
                  Outcome: {recentClearedIncident?.outcome || 'False Alarm (Verified Safe)'}.
                </Text>
                <ActionButton title="Back to Dashboard (M-23)" onPress={() => setScreenId('M-23')} />
              </View>
            )}

            {/* ==============================================================
                M-39: PANEL OFFLINE STATE (US-OFF-01..02)
               ============================================================== */}
            {screenId === 'M-39' && (
              <View style={{ gap: 14 }}>
                <View style={styles.errorAlertCard}>
                  <Text style={styles.errorAlertTitle}>
                    ⚠ Your panel is not connected. Check its power and Wi-Fi (US-OFF-01)
                  </Text>
                  <Text style={styles.errorAlertSub}>
                    Last seen: {activePanel?.last_seen_pkt || '24m ago'}. Reminders are sent every 15 minutes until reconnected.
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Panel LED Troubleshooting Guide</Text>
                  <Text style={[styles.subText, { marginTop: 6 }]}>
                    • The panel's red status LED blinks every 10 seconds when disconnected from home Wi-Fi.{'\n'}
                    • Verify your home router is powered on and broadcasting 2.4GHz Wi-Fi.{'\n'}
                    • Floor and sensor states shown below are last known values (marked outdated).
                  </Text>
                </View>

                <ActionButton
                  title="Simulate Panel Reconnected (US-OFF-02)"
                  variant="safe"
                  onPress={async () => {
                    if (activePanel?.status === 'Offline') {
                      await apiRequest('/simulator/toggle-offline', 'POST', { panelId: activePanel.id });
                    }
                    triggerPushNotificationDemo('N-03');
                    setScreenId('M-23');
                  }}
                />
              </View>
            )}

            {/* ==============================================================
                M-40 & M-41: EVENT HISTORY LIST & DETAIL
               ============================================================== */}
            {screenId === 'M-40' && (
              <View>
                <Text style={styles.h1}>Event History (M-40)</Text>
                <Text style={[styles.subText, { marginBottom: 12 }]}>
                  Past fire alarms, self-tests, siren silences, and connectivity logs (US-HIS-01)
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
                  {['All', 'fire_alarm', 'self_test', 'siren_silenced', 'panel_offline', 'sensor_online'].map((f) => (
                    <TouchableOpacity
                      key={f}
                      style={[
                        styles.ctrlChip,
                        historyFilter === f && { borderColor: COLORS.accentCyan, backgroundColor: COLORS.primarySoftBg },
                      ]}
                      onPress={() => setHistoryFilter(f)}
                    >
                      <Text style={styles.ctrlChipText}>{f === 'All' ? 'All Events' : f.replace('_', ' ').toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {history
                  .filter((h) => (historyFilter === 'All' ? true : h.event_type === historyFilter))
                  .map((h) => (
                    <TouchableOpacity
                      key={h.id}
                      style={[styles.card, { marginBottom: 10 }]}
                      onPress={() => {
                        setSelectedHistoryId(h.id);
                        setScreenId('M-41');
                      }}
                    >
                      <View style={styles.rowBetween}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardTitle}>{h.title}</Text>
                          <Text style={styles.subText}>{h.location_text}</Text>
                          <Text style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 4 }}>
                            {h.created_pkt}
                          </Text>
                        </View>
                        <StatusBadge label={h.outcome_text || 'Logged'} tone="info" small />
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            )}

            {screenId === 'M-41' && currentHistoryItem && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-40')}>
                  <Text style={styles.backLink}>← Back to History List</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Event Detail (M-41)</Text>
                <View style={[styles.card, { marginTop: 12, gap: 10 }]}>
                  <StatusBadge label={currentHistoryItem.event_type.toUpperCase()} tone="info" small />
                  <Text style={styles.cardTitle}>{currentHistoryItem.title}</Text>
                  <Text style={styles.subText}>Location: {currentHistoryItem.location_text}</Text>
                  <Text style={styles.subText}>Outcome: {currentHistoryItem.outcome_text || 'Completed'}</Text>
                  <Text style={styles.subText}>Duration: {currentHistoryItem.duration_text || '—'}</Text>
                  <Text style={styles.subText}>Timestamp: {currentHistoryItem.created_pkt}</Text>
                </View>
              </View>
            )}

            {/* ==============================================================
                M-42, M-44, M-46..M-51: SETTINGS, ACCOUNT, LEGAL & GLOBAL STATES
               ============================================================== */}
            {screenId === 'M-42' && (
              <View>
                <View style={[styles.card, { marginBottom: 14 }]}>
                  <Text style={styles.cardTitle}>{user.full_name || 'Husnain Aslam'}</Text>
                  <Text style={styles.subText}>{user.email || 'husnain.aslam@example.com'}</Text>
                </View>

                {[
                  ['M-43', 'My Emergency Profile & Map Pin', 'Edit address, phone numbers & GPS coordinates'],
                  ['M-44', 'Change Password', 'Update your account password'],
                  ['M-45', 'Notification & Critical Alert Settings', 'Verify DND override & play test alarm sound'],
                  ['M-46', 'Logged-in Family Devices (P2)', `${devices.length} active phones/tablets receiving alerts`],
                  ['M-19', 'My Panels', `${panels.length} bound fire control panel(s)`],
                  ['M-48', 'Privacy Policy', 'How your home & sensor data is protected'],
                  ['M-49', 'Terms of Use', 'Service & monitoring terms'],
                  ['M-50', 'About & Support', 'Booklet guide & 24/7 support contact'],
                  ['M-51', 'Global System States (5 Cards)', 'No internet, server error, session expired, update'],
                  ['M-47', 'Delete Account', 'Remove app data & unlink panels (Danger)'],
                ].map(([targetId, title, sub]) => (
                  <TouchableOpacity
                    key={targetId}
                    style={[
                      styles.card,
                      { marginBottom: 8 },
                      targetId === 'M-47' && { borderColor: COLORS.dangerBorder },
                    ]}
                    onPress={() => setScreenId(targetId)}
                  >
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.cardTitle,
                            targetId === 'M-47' && { color: COLORS.dangerSoftText },
                          ]}
                        >
                          {title}
                        </Text>
                        <Text style={styles.subText}>{sub}</Text>
                      </View>
                      <Text style={styles.cyanLink}>→</Text>
                    </View>
                  </TouchableOpacity>
                ))}

                <ActionButton
                  title="Log Out of This Device (US-AUTH-13)"
                  variant="secondary"
                  style={{ marginTop: 8 }}
                  onPress={() => setShowLogoutModal(true)}
                />
                <Text style={{ color: COLORS.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12 }}>
                  Smart Fire Alarm App v0.1.0 (Build 2026.11 • PKT)
                </Text>
              </View>
            )}

            {screenId === 'M-44' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-42')}>
                  <Text style={styles.backLink}>← Settings</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Change Password (M-44)</Text>
                <LabeledInput
                  label="CURRENT PASSWORD"
                  value={currPass}
                  onChangeText={setCurrPass}
                  secureTextEntry
                />
                <LabeledInput
                  label="NEW PASSWORD"
                  value={newPass}
                  onChangeText={setNewPass}
                  secureTextEntry
                />
                <LabeledInput
                  label="CONFIRM NEW PASSWORD"
                  value={confPass}
                  onChangeText={setConfPass}
                  secureTextEntry
                />
                <ActionButton
                  title="Update Password"
                  disabled={!currPass || newPass.length < 8 || newPass !== confPass}
                  onPress={async () => {
                    await apiRequest('/auth/change-password', 'POST', {
                      userId: user.id || 2,
                      currentPassword: currPass,
                      newPassword: newPass,
                    });
                    setCurrPass('');
                    setNewPass('');
                    setConfPass('');
                    showToast('Password updated.');
                    setScreenId('M-42');
                  }}
                />
              </View>
            )}

            {screenId === 'M-46' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-42')}>
                  <Text style={styles.backLink}>← Settings</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Logged-in Family Devices (M-46)</Text>
                <Text style={[styles.subText, { marginBottom: 14 }]}>
                  Every logged-in phone or tablet receives simultaneous fire alerts (US-AUTH-04 / US-SET-04).
                </Text>
                {devices.map((d) => (
                  <View key={d.id} style={[styles.card, { marginBottom: 10 }]}>
                    <View style={styles.rowBetween}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{d.device_name}</Text>
                        <Text style={styles.subText}>
                          {d.platform} • Last active: {d.last_active_pkt}
                        </Text>
                      </View>
                      {d.is_current ? (
                        <StatusBadge label="This Device" tone="safe" small />
                      ) : (
                        <ActionButton
                          title="Log Out Device"
                          variant="danger"
                          small
                          onPress={async () => {
                            await apiRequest(`/devices/${d.id}`, 'DELETE', { userId: user.id || 2 });
                            showToast(`Removed ${d.device_name}`);
                          }}
                        />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {screenId === 'M-47' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-42')}>
                  <Text style={styles.backLink}>← Settings</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Delete Account (M-47)</Text>
                <View style={styles.errorAlertCard}>
                  <Text style={styles.errorAlertTitle}>
                    ⚠ Permanent Action (US-SET-05 / SYS-13):
                  </Text>
                  <Text style={styles.errorAlertSub}>
                    • Your profile data is removed from your app and all family devices are signed out.{'\n'}
                    • Your panels are unlinked.{'\n'}
                    • The monitoring company retains customer history, incident records, and legal audit logs marked as "Deleted" for safety & legal compliance.
                  </Text>
                </View>
                <LabeledInput
                  label="CONFIRM WITH YOUR PASSWORD"
                  value={deletePassInput}
                  onChangeText={setDeletePassInput}
                  secureTextEntry
                  placeholder="Enter password to confirm"
                />
                <ActionButton
                  title="Permanently Delete My Account"
                  variant="danger"
                  disabled={!deletePassInput}
                  onPress={async () => {
                    try {
                      await apiRequest('/user/account', 'DELETE', {
                        userId: user.id || 2,
                        password: deletePassInput,
                      });
                      showToast('Account deleted from app; legal record preserved in Admin Console.');
                      setScreenId('M-03');
                    } catch {}
                  }}
                />
              </View>
            )}

            {(screenId === 'M-48' || screenId === 'M-49') && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-42')}>
                  <Text style={styles.backLink}>← Settings</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>
                  {screenId === 'M-48' ? 'Privacy Policy (M-48)' : 'Terms of Use (M-49)'}
                </Text>
                <Text style={styles.subText}>Version 1.0 • Last Updated: 04 Nov 2026</Text>
                <View style={[styles.card, { marginTop: 12, gap: 8 }]}>
                  <Text style={styles.subText}>
                    1. Emergency Telemetry & Location Data: Your home address, pinned GPS coordinates, and primary/secondary phone numbers are transmitted over encrypted HTTPS and displayed read-only to authorised 24/7 monitoring operators during fire incidents.
                  </Text>
                  <Text style={styles.subText}>
                    2. Legal Retention (SYS-13): In accordance with life-safety regulations, incident logs and immutable audit trails are retained even if an account is deleted from the mobile app.
                  </Text>
                </View>
              </View>
            )}

            {screenId === 'M-50' && (
              <View>
                <TouchableOpacity onPress={() => setScreenId('M-42')}>
                  <Text style={styles.backLink}>← Settings</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>About & 24/7 Support (M-50)</Text>
                <View style={[styles.card, { marginTop: 12, gap: 8 }]}>
                  <Text style={styles.cardTitle}>Smart Fire Alarm System v0.1.0</Text>
                  <Text style={styles.subText}>24/7 Emergency Monitoring Helpline: +92 42 111-FIRE-99</Text>
                  <Text style={styles.subText}>Technical Support Email: support@smartfire.pk</Text>
                  <Text style={styles.subText}>Hardware Protocol: Wi-Fi 32-Bit Link + 8-Bit Hex Sensor Bus (01–FE)</Text>
                </View>
              </View>
            )}

            {screenId === 'M-51' && (
              <View style={{ gap: 10 }}>
                <TouchableOpacity onPress={() => setScreenId('M-42')}>
                  <Text style={styles.backLink}>← Settings</Text>
                </TouchableOpacity>
                <Text style={styles.h1}>Global System States (M-51)</Text>
                {[
                  ['No Internet Connection', 'Banner appears automatically; shows last known data marked as not live.'],
                  ['500 Server Error', 'Displays clear message with 1-tap Retry button.'],
                  ['Session Expired', 'Prompts user to sign in again at M-03 Login.'],
                  ['Maintenance Mode (P2)', 'Scheduled server maintenance notice with estimated return time.'],
                  ['Forced App Update (P2)', 'Critical safety update prompt linking to App Store / Play Store.'],
                ].map(([t, d]) => (
                  <View key={t} style={styles.card}>
                    <Text style={styles.cardTitle}>{t}</Text>
                    <Text style={styles.subText}>{d}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Bottom Navigation Bar matching Figma M-23 */}
          {showBottomTabs && (
            <View style={styles.bottomTabBar}>
              {[
                { id: 'M-23', icon: '🛡️', label: 'Dashboard' },
                { id: 'M-24', icon: '🏢', label: 'Floors' },
                { id: 'M-40', icon: '🕒', label: 'History' },
                { id: 'M-42', icon: '⚙️', label: 'Settings' },
              ].map((tab) => {
                const active =
                  screenId === tab.id ||
                  (tab.id === 'M-24' && screenId === 'M-27');
                return (
                  <TouchableOpacity
                    key={tab.id}
                    style={styles.bottomTabItem}
                    onPress={() => setScreenId(tab.id)}
                  >
                    <Text style={{ fontSize: 16 }}>{tab.icon}</Text>
                    <Text
                      style={[
                        styles.bottomTabLabel,
                        active && { color: COLORS.accentCyan, fontWeight: '800' },
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>

      {/* ====================================================================
          1-TAP SILENCE SIREN CONFIRMATION MODAL (US-ALR-03)
         ==================================================================== */}
      <Modal visible={showSilenceConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.h2}>Silence Panel Siren? (US-ALR-03)</Text>
            <Text style={[styles.subText, { marginVertical: 10 }]}>
              This will mute the physical siren on your panel. The emergency alert will stay visible until the fire alarm is cleared.
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <ActionButton
                title="Cancel"
                variant="secondary"
                small
                onPress={() => setShowSilenceConfirm(false)}
              />
              <ActionButton
                title="🔕 Confirm & Silence Siren"
                variant="danger"
                small
                onPress={async () => {
                  setShowSilenceConfirm(false);
                  if (activeIncident) {
                    await apiRequest(`/incidents/${activeIncident.id}/silence-siren`, 'POST', {
                      userId: user.id || 2,
                    });
                  }
                  showToast('Siren silenced and recorded in History & Audit Log.');
                  setScreenId('M-37');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================================
          LOGOUT CONFIRMATION MODAL (US-AUTH-13)
         ==================================================================== */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.h2}>Log Out of This Device?</Text>
            <Text style={[styles.subText, { marginVertical: 10 }]}>
              This phone's push token will be removed so it stops receiving fire alerts. Other family phones stay logged in (US-AUTH-04 / US-AUTH-13).
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <ActionButton
                title="Cancel"
                variant="secondary"
                small
                onPress={() => setShowLogoutModal(false)}
              />
              <ActionButton
                title="Log Out"
                variant="danger"
                small
                onPress={() => {
                  setShowLogoutModal(false);
                  showToast('Signed out on this device.');
                  setScreenId('M-03');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================================
          ALL 51 MOBILE SCREENS QUICK PICKER MODAL
         ==================================================================== */}
      <Modal visible={showScreenPicker} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 680 }]}>
            <Text style={styles.h2}>Jump to Any Mobile Screen (M-01 to M-51)</Text>
            <Text style={[styles.subText, { marginBottom: 12 }]}>
              All 51 Homeowner Mobile/Tablet screens from Figma are built and interactive:
            </Text>
            <ScrollView style={{ maxHeight: 380 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {MOBILE_SCREENS.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.ctrlChip,
                      screenId === s.id && { borderColor: COLORS.accentCyan, backgroundColor: COLORS.primarySoftBg },
                    ]}
                    onPress={() => {
                      setShowScreenPicker(false);
                      setScreenId(s.id);
                    }}
                  >
                    <Text style={styles.ctrlChipText}>
                      {s.id} • {s.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View style={{ alignItems: 'flex-end', marginTop: 14 }}>
              <ActionButton
                title="Close"
                variant="secondary"
                small
                onPress={() => setShowScreenPicker(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ToastFeedback toast={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050914',
  },
  topControlStrip: {
    backgroundColor: '#0c1427',
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 36) + 8 : Platform.OS === 'ios' ? 46 : 8,
    paddingBottom: 10,
    paddingHorizontal: 14,
  },
  ctrlChip: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  ctrlChipText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  pushNotificationCard: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: COLORS.bgCardElevated,
    borderWidth: 1.5,
    borderColor: COLORS.primaryBorder,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pushTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  pushBody: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
  },
  outerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'web' ? 12 : 0,
  },
  deviceContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.bgPrimary,
    borderWidth: Platform.OS === 'web' ? 2 : 0,
    borderColor: '#1e293b',
    borderRadius: Platform.OS === 'web' ? 28 : 0,
    overflow: 'hidden',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 36) + 6 : Platform.OS === 'ios' ? 46 : 0,
  },
  statusBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statusBarTime: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  dynamicIsland: {
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dynamicIslandText: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  statusBarRight: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  screenScroll: {
    flex: 1,
  },
  screenContent: {
    paddingBottom: 36,
  },
  centeredScreen: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  splashOuterRing: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: 'rgba(220, 38, 38, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  splashInnerCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.dangerCardBg,
    borderWidth: 2,
    borderColor: COLORS.dangerBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  splashSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 6,
  },
  splashChecking: {
    color: COLORS.accentCyan,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 24,
  },
  autoRouteCard: {
    marginTop: 32,
    width: '100%',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  autoRouteTitle: {
    color: COLORS.accentCyan,
    fontSize: 12,
    fontWeight: '800',
  },
  autoRouteSub: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginTop: 4,
  },
  h1: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    flexShrink: 1,
  },
  h2: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    lineHeight: 18,
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 14,
    padding: 15,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: '800',
  },
  sectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  smallFireLogo: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: COLORS.dangerCardBg,
    borderWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorAlertCard: {
    backgroundColor: COLORS.dangerCardBg,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  errorAlertTitle: {
    color: COLORS.dangerLight,
    fontSize: 12.5,
    fontWeight: '800',
  },
  errorAlertSub: {
    color: COLORS.dangerSoftText,
    fontSize: 11.5,
    marginTop: 3,
    lineHeight: 16,
  },
  cyanLink: {
    color: COLORS.accentCyan,
    fontSize: 12.5,
    fontWeight: '700',
  },
  backLink: {
    color: COLORS.accentCyan,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  biometricCard: {
    marginTop: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 12,
    padding: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  familyAlertInfoBox: {
    marginTop: 12,
    backgroundColor: '#09222c',
    borderWidth: 1,
    borderColor: '#0e7490',
    borderRadius: 12,
    padding: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.accentCyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: COLORS.safeBg,
    borderWidth: 2,
    borderColor: COLORS.safeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  mapPinCard: {
    backgroundColor: '#0c1b33',
    borderWidth: 1.5,
    borderColor: COLORS.primaryBorder,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  mapCoordBanner: {
    color: COLORS.accentCyan,
    fontSize: 11.5,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  mapPinCenterCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 14,
  },
  qrScannerBox: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderColor: COLORS.accentCyan,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  qrTargetFrame: {
    width: 200,
    height: 160,
    borderWidth: 2,
    borderColor: COLORS.accentCyan,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#070e1c',
  },
  m23TopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10,
  },
  propertySwitcherBox: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 11,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  propertySwitcherText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  livePktPill: {
    backgroundColor: COLORS.safeBg,
    borderWidth: 1,
    borderColor: COLORS.safeBorder,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  livePktText: {
    color: COLORS.safeText,
    fontSize: 11,
    fontWeight: '800',
  },
  m23HeroStatusCard: {
    backgroundColor: COLORS.safeCardBg,
    borderWidth: 1.5,
    borderColor: COLORS.safeBorder,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  shieldCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(16, 185, 129, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  m23HeroTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  m23HeroSub: {
    color: COLORS.safeLight,
    fontSize: 12,
    marginTop: 2,
  },
  m23HeroTap: {
    color: COLORS.safeText,
    fontSize: 11,
    fontWeight: '800',
    marginTop: 4,
  },
  m23StateNoteChip: {
    marginTop: 8,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  m23StateNoteText: {
    color: COLORS.safeLight,
    fontSize: 9.5,
  },
  m23SummaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  m23SummaryBox: {
    flex: 1,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 14,
    padding: 13,
  },
  m23SummaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
  },
  m23SummaryVal: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  tabletTwoCol: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'flex-start',
  },
  tabletGridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickActionBtn: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  quickActionPrimary: {
    backgroundColor: '#172b69',
    borderColor: COLORS.primaryBorder,
  },
  quickActionTextWhite: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  activityCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    padding: 13,
    marginBottom: 8,
  },
  activityCardTitle: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '800',
  },
  activityCardTime: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  iconBtn: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  menuDotsBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  m27SensorCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  m27RoomTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  addrPill: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addrPillText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  m27StatusText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  m36HeroRedBox: {
    backgroundColor: '#7f1d1d',
    borderWidth: 2,
    borderColor: '#fca5a5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  m36FireCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dc2626',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  m36FireAlarmTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  m36SubUpper: {
    color: COLORS.dangerLight,
    fontSize: 10.5,
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
  },
  m36SensorCountAmber: {
    color: COLORS.warningText,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 6,
  },
  m36SectionLabel: {
    color: COLORS.dangerLight,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  m36LocationCard: {
    backgroundColor: '#450a0a',
    borderWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  m36LocationTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  m36LocationSub: {
    color: COLORS.dangerLight,
    fontSize: 11.5,
    marginTop: 3,
  },
  m36NewestPill: {
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: COLORS.dangerSoftText,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  m36NewestText: {
    color: COLORS.dangerLight,
    fontSize: 10,
    fontWeight: '800',
  },
  m36CallInfoCard: {
    backgroundColor: '#1e1b4b',
    borderWidth: 1.5,
    borderColor: '#6366f1',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  m36CallTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  m36CallPress1: {
    color: COLORS.dangerSoftText,
    fontSize: 12.5,
    fontWeight: '800',
  },
  m36CallPress2: {
    color: COLORS.safeText,
    fontSize: 12.5,
    fontWeight: '800',
  },
  m36SilenceButton: {
    backgroundColor: '#dc2626',
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  m36SilenceButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  m36FooterNote: {
    color: COLORS.dangerLight,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  bottomTabBar: {
    backgroundColor: '#080e1c',
    borderTopWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'android' ? 48 : Platform.OS === 'ios' ? 28 : 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  bottomTabItem: {
    alignItems: 'center',
    gap: 3,
  },
  bottomTabLabel: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 8, 18, 0.84)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    borderRadius: 18,
    padding: 22,
  },
});
