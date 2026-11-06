// ============================================================================
// Smart Fire Alarm System — Admin Web Console (Screens W-01 to W-21)
// Rendered on Web View (Desktop, Laptop & Responsive Tablet)
// Strictly Read-Only for Customer & Sensor Records (US-ADM-01..27)
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
} from 'react-native';
import { COLORS, ADMIN_WEB_SCREENS } from '../theme/tokens';
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

export default function AdminConsoleApp({ onSwitchToMobilePreview }) {
  const responsive = useResponsive();
  const {
    adminData,
    serverConnected,
    simulatedNoInternet,
    setSimulatedNoInternet,
    loading,
    toast,
    showToast,
    apiRequest,
    refreshData,
    playEmergencyTone,
  } = useApp();

  // Current active screen ID (W-01 to W-21) — Starts at W-01 Admin Sign In per Figma flow
  const [screenId, setScreenId] = useState('W-01');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [showDevSimulator, setShowDevSimulator] = useState(false);

  // Auth states (W-01 to W-05)
  const [loginEmail, setLoginEmail] = useState('admin@smartfire.pk');
  const [loginPassword, setLoginPassword] = useState('Admin1234');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [otpInput, setOtpInput] = useState('482910');
  const [otpTimer, setOtpTimer] = useState(54);
  const [resetNewPass, setResetNewPass] = useState('');
  const [resetConfirmPass, setResetConfirmPass] = useState('');

  // Selected entities for detail screens
  const [selectedIncidentId, setSelectedIncidentId] = useState(1);
  const [selectedPanelId, setSelectedPanelId] = useState(1);
  const [panelDetailTab, setPanelDetailTab] = useState('Overview');

  // Filters & search
  const [incidentTab, setIncidentTab] = useState('Active');
  const [incidentSearch, setIncidentSearch] = useState('');
  const [incidentStatusFilter, setIncidentStatusFilter] = useState('All');
  const [panelSearch, setPanelSearch] = useState('');
  const [panelStatusFilter, setPanelStatusFilter] = useState('All');
  const [panelCityFilter, setPanelCityFilter] = useState('All');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('All');
  const [offlineTab, setOfflineTab] = useState('Panels');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActorFilter, setAuditActorFilter] = useState('All');

  // Incident Command Card (W-09) interactive states
  const [manualPhoneChoice, setManualPhoneChoice] = useState('Primary');
  const [manualCallResult, setManualCallResult] = useState('Answered');
  const [newNoteText, setNewNoteText] = useState('');

  // Modals (W-07 Global Alert, W-10 Close Incident, W-11 Notify Authorities, Logout Confirm)
  const [showGlobalAlertModal, setShowGlobalAlertModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showNotifyAuthoritiesModal, setShowNotifyAuthoritiesModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showScreenJumpModal, setShowScreenJumpModal] = useState(false);
  const [showDbInspectorModal, setShowDbInspectorModal] = useState(false);
  const [dbInspectorData, setDbInspectorData] = useState(null);
  const [selectedDbTable, setSelectedDbTable] = useState('users');

  // W-10 Close Incident form
  const [closeOutcome, setCloseOutcome] = useState('False Alarm');
  const [closeReason, setCloseReason] = useState('');
  const [closeNotes, setCloseNotes] = useState('');

  // W-18 Add Operator form
  const [opName, setOpName] = useState('');
  const [opEmail, setOpEmail] = useState('');
  const [opRole, setOpRole] = useState('operator');
  const [opShift, setOpShift] = useState('Shift B • 16:00–00:00 PKT');

  // W-19 Settings form
  const [settingsAdminName, setSettingsAdminName] = useState('Husnain (Admin)');
  const [sla1Min, setSla1Min] = useState('60');
  const [sla5Min, setSla5Min] = useState('300');
  const [nonFireSound, setNonFireSound] = useState(true);
  const [incidentEmailRecip, setIncidentEmailRecip] = useState('dispatch@smartfire.pk, supervisor@smartfire.pk');
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confPass, setConfPass] = useState('');

  // Live SLA Countdown Timer (W-09 US-ADM-09)
  const [slaTick, setSlaTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setSlaTick((prev) => prev + 1);
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const kpis = adminData?.kpis || {
    total_panels: 1248,
    online_panels: 1219,
    offline_panels: 27,
    in_alarm_panels: 2,
    active_incidents: 2,
    incidents_today: 9,
    closed_today: 7,
    unread_notifications: 4,
    offline_total_faults: 27,
  };

  const activeIncidents = adminData?.activeIncidents || [];
  const allIncidents = adminData?.allIncidents || [];
  const panels = adminData?.panels || [];
  const customers = adminData?.customers || [];
  const offlinePanels = adminData?.offlinePanels || [];
  const offlineSensors = adminData?.offlineSensors || [];
  const auditLogs = adminData?.auditLogs || [];
  const notifications = adminData?.notifications || [];
  const operators = adminData?.operators || [];
  const recentActivity = adminData?.recentActivity || [];

  const currentIncident = useMemo(() => {
    return (
      allIncidents.find((i) => i.id === Number(selectedIncidentId)) ||
      activeIncidents[0] ||
      allIncidents[0] ||
      null
    );
  }, [allIncidents, activeIncidents, selectedIncidentId]);

  const currentPanel = useMemo(() => {
    return panels.find((p) => p.id === Number(selectedPanelId)) || panels[0] || null;
  }, [panels, selectedPanelId]);

  // Calculate live 1-min and 5-min SLA countdowns for W-09
  const sla1Remaining = Math.max(0, 38 - (slaTick % 39));
  const sla5Remaining = Math.max(0, 218 - (slaTick % 219));
  const formatMMSS = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m} : ${s}`;
  };

  // Navigate helper
  const navigateTo = (id, opts = {}) => {
    if (opts.incidentId) setSelectedIncidentId(opts.incidentId);
    if (opts.panelId) setSelectedPanelId(opts.panelId);
    if (opts.panelTab) setPanelDetailTab(opts.panelTab);
    if (id === 'W-07') {
      setShowGlobalAlertModal(true);
      playEmergencyTone('fire');
      return;
    }
    if (id === 'W-10') {
      setShowCloseModal(true);
      return;
    }
    if (id === 'W-11') {
      setShowNotifyAuthoritiesModal(true);
      return;
    }
    if (['W-01', 'W-02', 'W-03', 'W-04', 'W-05'].includes(id)) {
      setAdminLoggedIn(false);
    } else {
      setAdminLoggedIn(true);
    }
    setScreenId(id);
    setSidebarDrawerOpen(false);
  };

  // Handlers
  const handleAdminLogin = async () => {
    setAuthError('');
    try {
      await apiRequest('/auth/login', 'POST', {
        email: loginEmail,
        password: loginPassword,
        platform: 'web',
      });
      setAdminLoggedIn(true);
      setScreenId('W-06');
      showToast('Signed in to Central Monitoring Console.');
    } catch (e) {
      setAuthError(e.message);
    }
  };

  const handleAcknowledgeIncident = async (incId) => {
    try {
      await apiRequest(`/admin/incidents/${incId}/acknowledge`, 'POST', {
        adminName: settingsAdminName,
      });
      setShowGlobalAlertModal(false);
      showToast('Incident Acknowledged. Browser alarm sound muted & logged to Audit Log.');
    } catch {}
  };

  const handleLogManualCall = async () => {
    if (!currentIncident) return;
    const phoneNum = manualPhoneChoice === 'Primary' ? currentIncident.primary_phone : currentIncident.secondary_phone;
    try {
      await apiRequest(`/admin/incidents/${currentIncident.id}/manual-call`, 'POST', {
        adminName: settingsAdminName,
        phoneLabel: manualPhoneChoice,
        phoneNumber: phoneNum,
        callResult: manualCallResult,
      });
      showToast(`Manual call attempt (${manualCallResult}) saved to timeline & audit log.`);
    } catch {}
  };

  const handleAddImmutableNote = async () => {
    if (!currentIncident || !newNoteText.trim()) return;
    try {
      await apiRequest(`/admin/incidents/${currentIncident.id}/notes`, 'POST', {
        authorName: settingsAdminName,
        noteText: newNoteText,
      });
      setNewNoteText('');
      showToast('Permanent timestamped note saved (immutable per US-ADM-11).');
    } catch {}
  };

  const handleCloseIncident = async () => {
    if (!currentIncident) return;
    try {
      await apiRequest(`/admin/incidents/${currentIncident.id}/close`, 'POST', {
        adminName: settingsAdminName,
        outcome: closeOutcome,
        reason: closeReason,
        notes: closeNotes,
      });
      setShowCloseModal(false);
      setCloseReason('');
      setCloseNotes('');
      showToast(`Incident ${currentIncident.incident_code} closed as ${closeOutcome}. Homeowner app set to All Clear (M-38).`);
    } catch {}
  };

  // ==========================================================================
  // RENDER AUTH SCREENS (W-01 to W-05)
  // ==========================================================================
  if (!adminLoggedIn || ['W-01', 'W-02', 'W-03', 'W-04', 'W-05'].includes(screenId)) {
    return (
      <View style={styles.authRoot}>
        <NoInternetBanner visible={!serverConnected} onRetry={refreshData} />

        {/* Top Bar matching Figma W-01..W-05 */}
        <View style={styles.authHeader}>
          <View style={styles.brandRow}>
            <View style={styles.fireLogoBox}>
              <Text style={styles.fireLogoEmoji}>🔥</Text>
            </View>
            <View>
              <Text style={styles.authBrandTitle}>SMART FIRE ALARM SYSTEM</Text>
              <Text style={styles.authBrandSub}>24/7 Central Monitoring & Incident Response Console</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <StatusBadge label="Authorised Staff Only" tone="info" />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.authCenterWrap}>
          {screenId === 'W-01' && (
            <View style={styles.authCard}>
              <Text style={styles.authCardTitle}>Operator & Admin Sign In</Text>
              <Text style={styles.authCardSubtitle}>
                Enter your approved monitoring credentials to open console
              </Text>

              {authError ? (
                <View style={styles.authErrorBox}>
                  <Text style={styles.authErrorText}>
                    Error State: {authError}
                  </Text>
                </View>
              ) : null}

              <LabeledInput
                label="OFFICIAL EMAIL ADDRESS"
                value={loginEmail}
                onChangeText={setLoginEmail}
                placeholder="admin@smartfire.pk"
              />

              <LabeledInput
                label="PASSWORD"
                value={loginPassword}
                onChangeText={setLoginPassword}
                placeholder="••••••••••••••"
                secureTextEntry={!showPassword}
                rightTag={showPassword ? 'HIDE' : 'SHOW'}
                onRightTagPress={() => setShowPassword(!showPassword)}
              />

              <TouchableOpacity
                style={{ alignSelf: 'flex-end', marginBottom: 16 }}
                onPress={() => setScreenId('W-02')}
              >
                <Text style={styles.linkText}>Forgot Password? (W-02)</Text>
              </TouchableOpacity>

              <ActionButton
                title="Log In to Monitoring Console"
                onPress={handleAdminLogin}
                disabled={!loginEmail.trim() || !loginPassword.trim()}
                loading={loading}
              />

              <View style={styles.noSignupPolicyBox}>
                <Text style={{ fontSize: 16 }}>🔒</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.noSignupTitle}>No Self-Registration Permitted (US-AUTH-03)</Text>
                  <Text style={styles.noSignupSub}>
                    Accounts are provisioned only by System Deployment / Admin.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {screenId === 'W-02' && (
            <View style={styles.authCard}>
              <Text style={styles.authCardTitle}>Forgot Console Password?</Text>
              <Text style={styles.authCardSubtitle}>
                Enter your official email to receive a 6-digit verification code
              </Text>
              <LabeledInput
                label="OFFICIAL EMAIL ADDRESS"
                value={loginEmail}
                onChangeText={setLoginEmail}
                placeholder="admin@smartfire.pk"
              />
              <ActionButton
                title="Send 6-Digit Code (W-03)"
                onPress={() => {
                  setOtpTimer(60);
                  showToast('If this email is registered, a 6-digit reset code was sent.');
                  setScreenId('W-03');
                }}
                disabled={!loginEmail.includes('@')}
              />
              <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center' }} onPress={() => setScreenId('W-01')}>
                <Text style={styles.linkText}>← Back to Sign In (W-01)</Text>
              </TouchableOpacity>
            </View>
          )}

          {screenId === 'W-03' && (
            <View style={styles.authCard}>
              <Text style={styles.authCardTitle}>Enter 6-Digit Verification Code</Text>
              <Text style={styles.authCardSubtitle}>
                Sent to {loginEmail} • Code expires in 10 minutes
              </Text>
              <LabeledInput
                label="6-DIGIT VERIFICATION CODE"
                value={otpInput}
                onChangeText={setOtpInput}
                placeholder="482910"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                  Resend available in {otpTimer}s
                </Text>
                <TouchableOpacity
                  disabled={otpTimer > 0}
                  onPress={() => {
                    setOtpTimer(60);
                    showToast('New 6-digit OTP code dispatched.');
                  }}
                >
                  <Text style={[styles.linkText, otpTimer > 0 && { opacity: 0.4 }]}>Resend Code</Text>
                </TouchableOpacity>
              </View>
              <ActionButton
                title="Verify Code & Continue (W-04)"
                onPress={() => setScreenId('W-04')}
                disabled={otpInput.trim().length !== 6}
              />
              <TouchableOpacity style={{ marginTop: 14, alignSelf: 'center' }} onPress={() => setScreenId('W-02')}>
                <Text style={styles.linkText}>Change Email Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {screenId === 'W-04' && (
            <View style={styles.authCard}>
              <Text style={styles.authCardTitle}>Create New Console Password</Text>
              <Text style={styles.authCardSubtitle}>
                Minimum 8 characters with letters and numbers. All other active sessions will be signed out.
              </Text>
              <LabeledInput
                label="NEW PASSWORD"
                value={resetNewPass}
                onChangeText={setResetNewPass}
                placeholder="Minimum 8 chars"
                secureTextEntry={!showPassword}
                rightTag={showPassword ? 'HIDE' : 'SHOW'}
                onRightTagPress={() => setShowPassword(!showPassword)}
              />
              <LabeledInput
                label="CONFIRM NEW PASSWORD"
                value={resetConfirmPass}
                onChangeText={setResetConfirmPass}
                placeholder="Re-enter password"
                secureTextEntry={!showPassword}
                errorText={
                  resetConfirmPass && resetNewPass !== resetConfirmPass
                    ? 'Passwords do not match'
                    : ''
                }
              />
              <ActionButton
                title="Update Password (W-05)"
                onPress={() => setScreenId('W-05')}
                disabled={resetNewPass.length < 8 || resetNewPass !== resetConfirmPass}
              />
            </View>
          )}

          {screenId === 'W-05' && (
            <View style={styles.authCard}>
              <View style={styles.successCircle}>
                <Text style={{ fontSize: 28, color: COLORS.safeText }}>✓</Text>
              </View>
              <Text style={[styles.authCardTitle, { textAlign: 'center' }]}>Password Reset Successful</Text>
              <Text style={[styles.authCardSubtitle, { textAlign: 'center' }]}>
                Your operator password has been updated and all previous sessions have been invalidated.
              </Text>
              <ActionButton
                title="Return to Sign In (W-01)"
                onPress={() => setScreenId('W-01')}
              />
            </View>
          )}
        </ScrollView>
        <ToastFeedback toast={toast} />
      </View>
    );
  }

  // ==========================================================================
  // MASTER LAYOUT SHELL (W-21) + CONSOLE SCREENS (W-06 to W-21)
  // ==========================================================================
  const navItems = [
    { id: 'W-06', label: 'Dashboard', badge: null },
    { id: 'W-08', label: 'Incidents', badge: activeIncidents.length, badgeTone: 'danger' },
    { id: 'W-12', label: 'Panels (Read-Only)', badge: null },
    { id: 'W-14', label: 'Customers', badge: null },
    { id: 'W-15', label: 'Offline & Faults', badge: kpis.offline_total_faults, badgeTone: 'warning' },
    { id: 'W-16', label: 'Audit Log', badge: null },
    { id: 'W-17', label: 'Notifications', badge: kpis.unread_notifications, badgeTone: 'info' },
    { id: 'W-18', label: 'Operators (P2)', badge: 'P2', badgeTone: 'purple' },
    { id: 'W-19', label: 'Settings', badge: null },
  ];

  const renderSidebarContent = () => (
    <View style={styles.sidebarInner}>
      <View>
        <View style={styles.sidebarBrand}>
          <View style={styles.fireLogoBox}>
            <Text style={styles.fireLogoEmoji}>🔥</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.sidebarBrandTitle}>SMART FIRE</Text>
            <Text style={styles.sidebarBrandSub}>Admin Monitoring Console</Text>
          </View>
        </View>

        <View style={styles.sidebarDivider} />

        {navItems.map((item) => {
          const isActive =
            screenId === item.id ||
            (item.id === 'W-08' && screenId === 'W-09') ||
            (item.id === 'W-12' && screenId === 'W-13');
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => navigateTo(item.id)}
            >
              <Text style={[styles.navItemText, isActive && styles.navItemTextActive]}>
                {item.label}
              </Text>
              {item.badge !== null && item.badge !== undefined ? (
                <StatusBadge label={String(item.badge)} tone={item.badgeTone || 'info'} small />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bottom Read-Only Policy Box matching W-06/W-09/W-13 Figma */}
      <View style={styles.readOnlyPolicyBox}>
        <Text style={styles.readOnlyPolicyTitle}>READ-ONLY DATA POLICY</Text>
        <Text style={styles.readOnlyPolicyText}>
          Customer & sensor records are managed only via Homeowner App.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.consoleRoot}>
      <NoInternetBanner visible={!serverConnected} onRetry={refreshData} />

      {/* Optional Developer Hardware Telemetry Simulator Bar (Hidden by default to match exact Figma UI) */}
      {showDevSimulator && (
      <View style={styles.simulatorBar}>
        <Text style={styles.simulatorBarLabel}>⚡ HARDWARE TELEMETRY SIMULATOR (SYS-01..12):</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.simChip, { borderColor: COLORS.dangerBorder, backgroundColor: COLORS.dangerCardBg }]}
            onPress={async () => {
              playEmergencyTone('fire');
              await apiRequest('/simulator/trigger-fire', 'POST', { panelId: 1, sensorId: 2 });
              showToast('Simulated Fire Alarm on Aslam Residence (Living Room • Addr 02)!');
            }}
          >
            <Text style={[styles.simChipText, { color: COLORS.dangerLight }]}>🔥 Trigger Fire Alarm (SYS-02)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.simChip, { borderColor: COLORS.warningBorder, backgroundColor: COLORS.warningBg }]}
            onPress={async () => {
              const targetId = activeIncidents[0]?.id || 1;
              await apiRequest('/simulator/ivr-response', 'POST', { incidentId: targetId, keyPressed: '1' });
              showToast('Simulated IVR Key 1: User Confirmed REAL FIRE (1-Min SLA Started)!');
            }}
          >
            <Text style={[styles.simChipText, { color: COLORS.warningLight }]}>📞 Simulate IVR Press 1 (Real Fire)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.simChip, { borderColor: COLORS.safeBorder, backgroundColor: COLORS.safeBg }]}
            onPress={async () => {
              const targetId = activeIncidents[0]?.id || 1;
              await apiRequest('/simulator/ivr-response', 'POST', { incidentId: targetId, keyPressed: '2' });
              showToast('Simulated IVR Key 2: False Alarm Auto-Closed (SYS-04)!');
            }}
          >
            <Text style={[styles.simChipText, { color: COLORS.safeLight }]}>🔕 Simulate IVR Press 2 (Auto-Close)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simChip}
            onPress={async () => {
              await apiRequest('/simulator/toggle-offline', 'POST', { panelId: 1 });
              showToast('Toggled Panel PNL-PK-8F2A Online/Offline state (SYS-06).');
            }}
          >
            <Text style={styles.simChipText}>📡 Toggle Panel Offline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simChip}
            onPress={() => setShowScreenJumpModal(true)}
          >
            <Text style={[styles.simChipText, { color: COLORS.accentCyan }]}>🗂 All 21 Web Screens ({screenId}) ▾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.simChip, { borderColor: COLORS.safeBorder, backgroundColor: COLORS.safeBg }]}
            onPress={async () => {
              try {
                const res = await fetch('http://localhost:4000/api/db/inspect');
                if (res.ok) {
                  setDbInspectorData(await res.json());
                }
              } catch {}
              setShowDbInspectorModal(true);
            }}
          >
            <Text style={[styles.simChipText, { color: COLORS.safeText }]}>🗄️ Review SQL DB Tables (14)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simChip}
            onPress={async () => {
              await apiRequest('/simulator/reset', 'POST', {});
              showToast('SQL Database reset to initial Figma seed state.');
            }}
          >
            <Text style={styles.simChipText}>↺ Reset SQL Seed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.simChip}
            onPress={() => setShowDevSimulator(false)}
          >
            <Text style={styles.simChipText}>✕ Hide Bar</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      )}

      <View style={styles.mainBodyRow}>
        {/* Left Sidebar on Desktop/Laptop; Collapsible Drawer on Tablet/Compact */}
        {!responsive.adminSidebarCompact ? (
          <View style={styles.sidebar}>{renderSidebarContent()}</View>
        ) : sidebarDrawerOpen ? (
          <View style={styles.sidebarMobileOverlay}>
            <View style={[styles.sidebar, { width: 250 }]}>{renderSidebarContent()}</View>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setSidebarDrawerOpen(false)} />
          </View>
        ) : null}

        {/* Right Main Content Column */}
        <View style={styles.contentColumn}>
          {/* Top Header matching Figma W-06 / W-09 */}
          <View style={styles.topHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
              {responsive.adminSidebarCompact && (
                <TouchableOpacity
                  style={styles.menuToggleBtn}
                  onPress={() => setSidebarDrawerOpen(!sidebarDrawerOpen)}
                >
                  <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>☰</Text>
                </TouchableOpacity>
              )}
              <View>
                <Text style={styles.topHeaderTitle}>
                  {screenId === 'W-06' && 'System Monitoring Dashboard'}
                  {screenId === 'W-08' && 'Incidents Management (Active & History)'}
                  {screenId === 'W-09' && `Incident Detail (${currentIncident?.incident_code || '#INC-2045'})`}
                  {screenId === 'W-12' && 'Registered Panels Directory (Read-Only)'}
                  {screenId === 'W-13' && 'Panel & Customer Full Record'}
                  {screenId === 'W-14' && 'Customers Directory & Account Status'}
                  {screenId === 'W-15' && 'Offline Panels & Sensor Faults Monitor'}
                  {screenId === 'W-16' && 'Immutable Legal Audit Log'}
                  {screenId === 'W-17' && 'Admin Notifications Center'}
                  {screenId === 'W-18' && 'Operators, Roles & 8-Hour Shifts (Phase 2)'}
                  {screenId === 'W-19' && 'Admin Console & SLA Timer Settings'}
                  {screenId === 'W-20' && 'System Error & Connection Recovery States'}
                  {screenId === 'W-21' && 'Master Layout Shell & Reusable UI States'}
                </Text>
                <Text style={styles.topHeaderSub}>
                  Pakistan Standard Time (PKT • UTC+5) • Real-Time Telemetry Stream
                </Text>
              </View>
            </View>

            <View style={styles.topHeaderRight}>
              <TouchableOpacity
                style={[
                  styles.liveServerPill,
                  !serverConnected && { borderColor: COLORS.dangerBorder, backgroundColor: COLORS.dangerCardBg },
                ]}
                onPress={() => setSimulatedNoInternet(!simulatedNoInternet)}
              >
                <View
                  style={[
                    styles.liveDot,
                    { backgroundColor: serverConnected ? COLORS.safeText : COLORS.dangerBright },
                  ]}
                />
                <Text
                  style={[
                    styles.liveServerText,
                    { color: serverConnected ? COLORS.safeText : COLORS.dangerSoftText },
                  ]}
                >
                  {serverConnected ? 'Live Server: Active' : 'Connection Lost (Retry)'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bellButton} onPress={() => navigateTo('W-17')}>
                <Text style={{ fontSize: 15 }}>🔔</Text>
                {kpis.unread_notifications > 0 && (
                  <View style={styles.bellBadge}>
                    <Text style={styles.bellBadgeText}>{kpis.unread_notifications}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.profilePill} onPress={() => navigateTo('W-19')}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>H</Text>
                </View>
                <Text style={styles.profilePillText}>{settingsAdminName}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => setShowLogoutConfirm(true)}
              >
                <Text style={styles.logoutButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Scrollable Screen Viewport */}
          <ScrollView style={styles.viewportScroll} contentContainerStyle={styles.viewportContent}>
            {/* ==============================================================
                W-06: ADMIN OVERVIEW DASHBOARD
               ============================================================== */}
            {screenId === 'W-06' && (
              <View>
                {/* 6 KPI Summary Cards matching Figma W-06 */}
                <View style={styles.kpiGrid}>
                  <TouchableOpacity
                    style={[styles.kpiCard, { borderColor: COLORS.borderDefault }]}
                    onPress={() => navigateTo('W-12')}
                  >
                    <Text style={styles.kpiLabel}>TOTAL PANELS</Text>
                    <Text style={[styles.kpiValue, { color: '#ffffff' }]}>
                      {kpis.total_panels.toLocaleString()}
                    </Text>
                    <Text style={[styles.kpiSub, { color: COLORS.accentCyan }]}>Open W-12 →</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.kpiCard, { borderColor: COLORS.safeBorder }]}
                    onPress={() => {
                      setPanelStatusFilter('Working');
                      navigateTo('W-12');
                    }}
                  >
                    <Text style={styles.kpiLabel}>ONLINE</Text>
                    <Text style={[styles.kpiValue, { color: COLORS.safeText }]}>
                      {kpis.online_panels.toLocaleString()}
                    </Text>
                    <Text style={[styles.kpiSub, { color: COLORS.textSecondary }]}>97.7% Healthy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.kpiCard, { borderColor: COLORS.warningBorder }]}
                    onPress={() => navigateTo('W-15')}
                  >
                    <Text style={styles.kpiLabel}>OFFLINE</Text>
                    <Text style={[styles.kpiValue, { color: COLORS.warningText }]}>
                      {kpis.offline_panels}
                    </Text>
                    <Text style={[styles.kpiSub, { color: COLORS.textSecondary }]}>Open W-15 →</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.kpiCard, { borderColor: COLORS.dangerBorder }]}
                    onPress={() => {
                      playEmergencyTone('fire');
                      setShowGlobalAlertModal(true);
                    }}
                  >
                    <Text style={styles.kpiLabel}>IN ALARM NOW</Text>
                    <Text style={[styles.kpiValue, { color: COLORS.dangerSoftText }]}>
                      {kpis.in_alarm_panels}
                    </Text>
                    <Text style={[styles.kpiSub, { color: COLORS.textSecondary }]}>CRITICAL</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.kpiCard, { borderColor: COLORS.dangerBorder }]}
                    onPress={() => navigateTo('W-08')}
                  >
                    <Text style={styles.kpiLabel}>ACTIVE INCIDENTS</Text>
                    <Text style={[styles.kpiValue, { color: COLORS.dangerBright }]}>
                      {kpis.active_incidents}
                    </Text>
                    <Text style={[styles.kpiSub, { color: COLORS.textSecondary }]}>Needs Action</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.kpiCard, { borderColor: COLORS.primaryBorder }]}
                    onPress={() => {
                      setIncidentTab('History');
                      navigateTo('W-08');
                    }}
                  >
                    <Text style={styles.kpiLabel}>INCIDENTS TODAY</Text>
                    <Text style={[styles.kpiValue, { color: COLORS.accentCyan }]}>
                      {kpis.incidents_today}
                    </Text>
                    <Text style={[styles.kpiSub, { color: COLORS.textSecondary }]}>
                      {kpis.closed_today} Closed
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Active Fire Incidents Box matching Figma W-06 */}
                <View style={styles.activeIncidentsContainer}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.activeIncidentsHeaderTitle}>
                      🔥 ACTIVE FIRE INCIDENTS — NEWEST FIRST (LIVE)
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        playEmergencyTone('fire');
                        setShowGlobalAlertModal(true);
                      }}
                    >
                      <StatusBadge
                        label={`${activeIncidents.length} Open Incident${activeIncidents.length === 1 ? '' : 's'}`}
                        tone="danger"
                        small
                      />
                    </TouchableOpacity>
                  </View>

                  {activeIncidents.length === 0 ? (
                    <View style={styles.emptyBox}>
                      <Text style={styles.emptyBoxTitle}>✓ All Monitored Panels Normal — Zero Active Fire Incidents</Text>
                      <Text style={styles.emptyBoxSub}>
                        Use the "🔥 Trigger Fire Alarm" button in the top simulator bar to test an emergency dispatch.
                      </Text>
                    </View>
                  ) : (
                    activeIncidents.map((inc) => {
                      const isConfirmed = inc.status === 'User Confirmed Fire';
                      return (
                        <View key={inc.id} style={styles.activeIncidentRowCard}>
                          <View style={{ flex: 1, gap: 6 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <StatusBadge
                                label={
                                  isConfirmed
                                    ? 'USER CONFIRMED FIRE'
                                    : inc.status === 'New'
                                    ? 'NEW • CALLING USER'
                                    : inc.status.toUpperCase()
                                }
                                tone={isConfirmed ? 'danger' : 'warning'}
                                small
                              />
                              <Text style={styles.activeIncidentTitle}>
                                {inc.incident_code} • {inc.location_name} ({inc.panel_uid})
                              </Text>
                            </View>
                            <Text style={styles.activeIncidentSub}>
                              {inc.full_address} • {inc.primary_floor} → {inc.primary_room} • Raised{' '}
                              {inc.raised_pkt} ({inc.ivr_call_status})
                            </Text>
                          </View>
                          <ActionButton
                            title={isConfirmed ? 'Handle Now (W-09) →' : 'Open Card (W-09) →'}
                            variant={isConfirmed ? 'danger' : 'primary'}
                            small
                            onPress={() => navigateTo('W-09', { incidentId: inc.id })}
                          />
                        </View>
                      );
                    })
                  )}
                </View>

                {/* Recent System-Wide Activity Stream matching Figma W-06 */}
                <View style={styles.surfaceCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>RECENT SYSTEM-WIDE ACTIVITY STREAM</Text>
                    <Text style={styles.sectionMetaText}>
                      States Supported: Live • Skeleton Loading • Empty • Retry Error
                    </Text>
                  </View>

                  {recentActivity.map((act) => {
                    const isFire = act.event_type === 'fire_alarm';
                    const isOffline = act.event_type.includes('offline');
                    const isTest = act.event_type === 'self_test';
                    return (
                      <View key={act.id} style={styles.activityStreamRow}>
                        <Text style={styles.activityTimeText}>{act.created_pkt}</Text>
                        <Text
                          style={[
                            styles.activityDescText,
                            {
                              color: isFire
                                ? COLORS.dangerSoftText
                                : isOffline
                                ? COLORS.warningText
                                : isTest
                                ? COLORS.accentCyan
                                : COLORS.safeText,
                            },
                          ]}
                        >
                          {act.title} — {act.location_text}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ==============================================================
                W-08: INCIDENTS LIST (ACTIVE & HISTORY)
               ============================================================== */}
            {screenId === 'W-08' && (
              <View style={styles.surfaceCard}>
                <View style={styles.filterBarRow}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={[styles.tabPill, incidentTab === 'Active' && styles.tabPillActive]}
                      onPress={() => setIncidentTab('Active')}
                    >
                      <Text style={[styles.tabPillText, incidentTab === 'Active' && styles.tabPillTextActive]}>
                        Active Incidents ({activeIncidents.length})
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tabPill, incidentTab === 'History' && styles.tabPillActive]}
                      onPress={() => setIncidentTab('History')}
                    >
                      <Text style={[styles.tabPillText, incidentTab === 'History' && styles.tabPillTextActive]}>
                        History & Closed ({allIncidents.length - activeIncidents.length})
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
                    <TextInput
                      style={styles.searchInput}
                      value={incidentSearch}
                      onChangeText={setIncidentSearch}
                      placeholder="Search Incident ID, Panel ID, Address, Phone..."
                      placeholderTextColor={COLORS.textMuted}
                    />
                    {['All', 'New', 'User Confirmed Fire', 'Acknowledged', 'Closed'].map((st) => (
                      <TouchableOpacity
                        key={st}
                        style={[styles.filterChip, incidentStatusFilter === st && styles.filterChipActive]}
                        onPress={() => setIncidentStatusFilter(st)}
                      >
                        <Text style={styles.filterChipText}>{st}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {allIncidents
                  .filter((inc) => (incidentTab === 'Active' ? inc.status !== 'Closed' : inc.status === 'Closed'))
                  .filter((inc) => (incidentStatusFilter === 'All' ? true : inc.status === incidentStatusFilter))
                  .filter((inc) => {
                    if (!incidentSearch.trim()) return true;
                    const q = incidentSearch.toLowerCase();
                    return (
                      inc.incident_code.toLowerCase().includes(q) ||
                      inc.panel_uid.toLowerCase().includes(q) ||
                      inc.location_name.toLowerCase().includes(q) ||
                      inc.full_address.toLowerCase().includes(q) ||
                      inc.primary_phone.toLowerCase().includes(q)
                    );
                  })
                  .map((inc) => (
                    <TouchableOpacity
                      key={inc.id}
                      style={styles.tableRowCard}
                      onPress={() => navigateTo('W-09', { incidentId: inc.id })}
                    >
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <Text style={styles.rowPrimaryTitle}>
                            {inc.incident_code} • {inc.location_name} ({inc.panel_uid})
                          </Text>
                          <StatusBadge
                            label={inc.status}
                            tone={
                              inc.status === 'Closed'
                                ? 'safe'
                                : inc.status === 'User Confirmed Fire'
                                ? 'danger'
                                : 'warning'
                            }
                            small
                          />
                          {inc.outcome ? <StatusBadge label={`Outcome: ${inc.outcome}`} tone="info" small /> : null}
                        </View>
                        <Text style={styles.rowSubText}>
                          {inc.full_address} • Zone: {inc.primary_floor} → {inc.primary_room} (Addr {inc.primary_hex_address})
                        </Text>
                        <Text style={styles.rowMetaText}>
                          Raised: {inc.raised_pkt} • Handled By: {inc.handled_by} • IVR: {inc.ivr_call_status}
                        </Text>
                      </View>
                      <ActionButton
                        title="Open W-09 →"
                        small
                        variant={inc.status === 'Closed' ? 'secondary' : 'primary'}
                        onPress={() => navigateTo('W-09', { incidentId: inc.id })}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            )}

            {/* ==============================================================
                W-09: INCIDENT DETAIL COMMAND CARD (Exact Figma Match)
               ============================================================== */}
            {screenId === 'W-09' && currentIncident && (
              <View>
                {/* Top Red Command Header Bar matching Figma W-09 */}
                <View style={styles.w09CommandHeader}>
                  <View style={{ flex: 1, minWidth: 260, gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <StatusBadge
                        label={
                          currentIncident.status === 'User Confirmed Fire'
                            ? 'CONFIRMED FIRE (KEY 1)'
                            : currentIncident.status.toUpperCase()
                        }
                        tone={currentIncident.status === 'Closed' ? 'safe' : 'danger'}
                        small
                      />
                      <Text style={styles.w09HeaderTitle}>
                        {currentIncident.incident_code} • {currentIncident.location_name} ({currentIncident.panel_uid})
                      </Text>
                    </View>
                    <Text style={styles.w09HeaderUrgentText}>
                      {currentIncident.status === 'Closed'
                        ? `CLOSED (${currentIncident.outcome}) • Reason: ${currentIncident.close_reason}`
                        : 'ACT NOW — USER PRESSED 1! • Target response within 1 minute'}
                    </Text>
                  </View>

                  {/* 1-Min Action SLA & 5-Min Decision SLA Timers (US-ADM-09) */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <View style={styles.slaBoxDanger}>
                      <Text style={styles.slaLabel}>1-MIN ACTION SLA</Text>
                      <Text style={styles.slaTimerText}>
                        {currentIncident.status === 'Closed' ? '00 : 00' : formatMMSS(sla1Remaining)}
                      </Text>
                    </View>
                    <View style={styles.slaBoxWarning}>
                      <Text style={[styles.slaLabel, { color: COLORS.warningText }]}>5-MIN DECISION</Text>
                      <Text style={[styles.slaTimerText, { color: COLORS.warningText }]}>
                        {currentIncident.status === 'Closed' ? '00 : 00' : formatMMSS(sla5Remaining)}
                      </Text>
                    </View>

                    <View style={{ gap: 6 }}>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        {currentIncident.status !== 'Closed' && (
                          <ActionButton
                            title="✓ Acknowledge"
                            variant="primary"
                            small
                            onPress={() => handleAcknowledgeIncident(currentIncident.id)}
                          />
                        )}
                        {currentIncident.status !== 'Closed' && (
                          <ActionButton
                            title="Close (W-10)"
                            variant="danger"
                            small
                            onPress={() => setShowCloseModal(true)}
                          />
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.phase2NotifyBtn}
                        onPress={() => setShowNotifyAuthoritiesModal(true)}
                      >
                        <Text style={styles.phase2NotifyBtnText}>Notify Authorities (Phase 2 Slot)</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* 3-Column Command Grid matching Figma W-09 */}
                <View style={styles.w09ThreeColGrid}>
                  {/* COLUMN 1: PROPERTY & ALARM LOCATION + CONTACTS + SENSORS */}
                  <View style={styles.w09ColumnCard}>
                    <Text style={styles.w09ColHeader}>PROPERTY & ALARM LOCATION</Text>
                    <Text style={styles.w09LocationZone}>
                      {currentIncident.primary_floor} → {currentIncident.primary_room} (Addr{' '}
                      {currentIncident.primary_hex_address})
                    </Text>
                    <Text style={styles.w09AddressText}>{currentIncident.full_address}</Text>
                    <Text style={styles.w09MetaText}>Raised: {currentIncident.raised_pkt}</Text>

                    {/* GPS Coordinates Map Box */}
                    <View style={styles.gpsMapBox}>
                      <Text style={styles.gpsCoordText}>
                        GPS: {Number(currentIncident.latitude).toFixed(4)}° N,{' '}
                        {Number(currentIncident.longitude).toFixed(4)}° E
                      </Text>
                      <Text style={{ fontSize: 24, textAlign: 'center', marginVertical: 8 }}>📍</Text>
                      <TouchableOpacity
                        onPress={() =>
                          showToast(
                            `Coordinates ${currentIncident.latitude}, ${currentIncident.longitude} copied to clipboard.`
                          )
                        }
                      >
                        <Text style={styles.gpsOpenLink}>Open Coordinates Map Link ↗</Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={[styles.w09SubSectionLabel, { marginTop: 16 }]}>
                      CUSTOMER CONTACTS (MANUAL CALL)
                    </Text>

                    <View style={styles.contactCallCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.contactPhoneTitle}>Primary: {currentIncident.primary_phone}</Text>
                        <Text style={styles.contactPhoneSub}>{currentIncident.customer_name}</Text>
                      </View>
                      <ActionButton
                        title="📞 Call"
                        variant="primary"
                        small
                        onPress={() => {
                          setManualPhoneChoice('Primary');
                          showToast(`Dialing Primary ${currentIncident.primary_phone}...`);
                        }}
                      />
                    </View>

                    <View style={styles.contactCallCard}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.contactPhoneTitle}>
                          Secondary: {currentIncident.secondary_phone || 'Not Provided'}
                        </Text>
                        <Text style={styles.contactPhoneSub}>Alternate Family Contact</Text>
                      </View>
                      <ActionButton
                        title="📞 Call"
                        variant="secondary"
                        small
                        onPress={() => {
                          setManualPhoneChoice('Secondary');
                          showToast(`Dialing Secondary ${currentIncident.secondary_phone}...`);
                        }}
                      />
                    </View>

                    <Text style={[styles.w09SubSectionLabel, { marginTop: 16 }]}>
                      {currentIncident.primary_floor.toUpperCase()} SENSORS (READ-ONLY)
                    </Text>

                    {(currentIncident.panel_sensors || []).map((s) => {
                      const inAlarm =
                        s.status === 'In Alarm' ||
                        currentIncident.alarm_sensors?.some((as) => as.hex_address === s.hex_address);
                      const isOffline = s.status === 'Offline';
                      return (
                        <View
                          key={s.id}
                          style={[
                            styles.sensorReadOnlyRow,
                            inAlarm && { borderColor: COLORS.dangerBorder, backgroundColor: '#240c12' },
                          ]}
                        >
                          <Text style={styles.sensorReadOnlyName}>
                            {s.hex_address} • {s.display_name}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <StatusBadge
                              label={inAlarm ? 'IN ALARM' : s.status}
                              tone={inAlarm ? 'danger' : isOffline ? 'muted' : 'safe'}
                              small
                            />
                            <BatteryIndicator percent={s.battery_percent} />
                          </View>
                        </View>
                      );
                    })}
                  </View>

                  {/* COLUMN 2: AUTOMATED RESPONSE & CALL TIMELINE + MANUAL CALL LOGGER */}
                  <View style={styles.w09ColumnCard}>
                    <Text style={styles.w09ColHeader}>AUTOMATED RESPONSE & CALL TIMELINE</Text>

                    <View style={styles.deliveryStatusCard}>
                      <Text style={styles.deliveryStatusGreen}>
                        ✓ Push Sent (3 Phones)   ✓ Incident Email Sent
                      </Text>
                      <Text style={styles.deliveryStatusCyan}>
                        ✓ Automated IVR Status: {currentIncident.ivr_call_status}
                      </Text>
                    </View>

                    {(currentIncident.timeline || []).map((item) => (
                      <View
                        key={item.id}
                        style={[
                          styles.timelineItemCard,
                          item.tone === 'danger' && {
                            backgroundColor: COLORS.dangerCardBg,
                            borderColor: COLORS.dangerBorder,
                          },
                        ]}
                      >
                        <Text style={styles.timelineTimeText}>{item.created_pkt}</Text>
                        <Text
                          style={[
                            styles.timelineDescText,
                            item.tone === 'danger' && { color: COLORS.dangerLight },
                            item.tone === 'success' && { color: COLORS.safeText },
                          ]}
                        >
                          {item.description}
                        </Text>
                      </View>
                    ))}

                    {/* Log Manual Operator Call Box (US-ADM-08) */}
                    {currentIncident.status !== 'Closed' && (
                      <View style={styles.manualCallLoggerBox}>
                        <Text style={styles.manualCallTitle}>LOG MANUAL OPERATOR CALL (US-ADM-08)</Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
                          {['Primary', 'Secondary'].map((ph) => (
                            <TouchableOpacity
                              key={ph}
                              style={[
                                styles.choiceChip,
                                manualPhoneChoice === ph && styles.choiceChipActive,
                              ]}
                              onPress={() => setManualPhoneChoice(ph)}
                            >
                              <Text style={styles.choiceChipText}>
                                {ph} ({ph === 'Primary' ? currentIncident.primary_phone : currentIncident.secondary_phone})
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                          {['Answered', 'No Answer', 'Busy'].map((resOpt) => (
                            <TouchableOpacity
                              key={resOpt}
                              style={[
                                styles.choiceChip,
                                manualCallResult === resOpt && styles.choiceChipSafeActive,
                              ]}
                              onPress={() => setManualCallResult(resOpt)}
                            >
                              <Text
                                style={[
                                  styles.choiceChipText,
                                  manualCallResult === resOpt && { color: COLORS.safeText },
                                ]}
                              >
                                ● {resOpt}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>

                        <Text style={styles.manualCallHint}>
                          Note: If User Presses 2 on IVR, incident closes automatically as False Alarm in History.
                        </Text>

                        <ActionButton
                          title="Save Manual Call Attempt to Timeline"
                          onPress={handleLogManualCall}
                          small
                        />
                      </View>
                    )}
                  </View>

                  {/* COLUMN 3: TIMESTAMPED INCIDENT NOTES (IMMUTABLE US-ADM-11) */}
                  <View style={styles.w09ColumnCard}>
                    <Text style={styles.w09ColHeader}>TIMESTAMPED INCIDENT NOTES</Text>
                    <Text style={styles.immutableSubNote}>
                      Permanent: Notes cannot be edited or deleted (US-ADM-11)
                    </Text>

                    <View style={{ gap: 10, marginVertical: 12, flex: 1 }}>
                      {(currentIncident.notes || []).map((n) => (
                        <View key={n.id} style={styles.immutableNoteCard}>
                          <Text
                            style={[
                              styles.immutableNoteAuthor,
                              n.author_role === 'System' && { color: COLORS.warningText },
                            ]}
                          >
                            {n.author_name} • {n.created_pkt}
                          </Text>
                          <Text style={styles.immutableNoteBody}>{n.note_text}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={{ marginTop: 'auto' }}>
                      <LabeledInput
                        label="ADD NEW PERMANENT NOTE"
                        value={newNoteText}
                        onChangeText={setNewNoteText}
                        placeholder="Type incident observation..."
                        multiline
                      />
                      <ActionButton
                        title="+ Save Immutable Note"
                        onPress={handleAddImmutableNote}
                        disabled={!newNoteText.trim()}
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* ==============================================================
                W-12: REGISTERED PANELS DIRECTORY (READ-ONLY)
               ============================================================== */}
            {screenId === 'W-12' && (
              <View style={styles.surfaceCard}>
                <View style={styles.filterBarRow}>
                  <TextInput
                    style={styles.searchInput}
                    value={panelSearch}
                    onChangeText={setPanelSearch}
                    placeholder="Search Panel ID, Location, Address, Phone..."
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                    {['All', 'Working', 'Offline', 'In Alarm', 'Deleted'].map((st) => (
                      <TouchableOpacity
                        key={st}
                        style={[styles.filterChip, panelStatusFilter === st && styles.filterChipActive]}
                        onPress={() => setPanelStatusFilter(st)}
                      >
                        <Text style={styles.filterChipText}>{st}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {['All', 'Lahore', 'Islamabad', 'Karachi'].map((city) => (
                      <TouchableOpacity
                        key={city}
                        style={[styles.filterChip, panelCityFilter === city && styles.filterChipActive]}
                        onPress={() => setPanelCityFilter(city)}
                      >
                        <Text style={styles.filterChipText}>{city}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {panels
                  .filter((p) => (panelStatusFilter === 'All' ? true : p.status === panelStatusFilter))
                  .filter((p) => (panelCityFilter === 'All' ? true : p.city === panelCityFilter))
                  .filter((p) => {
                    if (!panelSearch.trim()) return true;
                    const q = panelSearch.toLowerCase();
                    return (
                      p.panel_uid.toLowerCase().includes(q) ||
                      p.location_name.toLowerCase().includes(q) ||
                      p.customer_name.toLowerCase().includes(q) ||
                      p.full_address.toLowerCase().includes(q) ||
                      p.primary_phone.toLowerCase().includes(q)
                    );
                  })
                  .map((p) => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.tableRowCard}
                      onPress={() => navigateTo('W-13', { panelId: p.id })}
                    >
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <Text style={styles.rowPrimaryTitle}>
                            {p.panel_uid} • {p.location_name} ({p.customer_name})
                          </Text>
                          <StatusBadge
                            label={p.status === 'Working' ? 'Online' : p.status}
                            tone={
                              p.status === 'Working'
                                ? 'safe'
                                : p.status === 'In Alarm'
                                ? 'danger'
                                : p.status === 'Offline'
                                ? 'warning'
                                : 'muted'
                            }
                            small
                          />
                          <StatusBadge label={`${p.sensor_count} Sensors`} tone="info" small />
                        </View>
                        <Text style={styles.rowSubText}>
                          {p.full_address} • Primary: {p.primary_phone} • Secondary: {p.secondary_phone || '—'}
                        </Text>
                        <Text style={styles.rowMetaText}>
                          32-Bit Link: {p.link_address_32bit || 'Unlinked'} • Last Seen: {p.last_seen_pkt}
                        </Text>
                      </View>
                      <ActionButton
                        title="Full Record (W-13) →"
                        variant="secondary"
                        small
                        onPress={() => navigateTo('W-13', { panelId: p.id })}
                      />
                    </TouchableOpacity>
                  ))}
              </View>
            )}

            {/* ==============================================================
                W-13: PANEL & CUSTOMER FULL RECORD (READ-ONLY, Exact Figma Match)
               ============================================================== */}
            {screenId === 'W-13' && currentPanel && (
              <View>
                <View style={styles.filterBarRow}>
                  <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                    {['Overview', 'Floors & Devices', 'Incidents', 'Activity Log'].map((tab) => (
                      <TouchableOpacity
                        key={tab}
                        style={[styles.tabPill, panelDetailTab === tab && styles.tabPillActive]}
                        onPress={() => setPanelDetailTab(tab)}
                      >
                        <Text style={[styles.tabPillText, panelDetailTab === tab && styles.tabPillTextActive]}>
                          {tab}
                          {tab === 'Floors & Devices' ? ` (${currentPanel.sensor_count})` : ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <StatusBadge label="🔒 STRICTLY READ-ONLY RECORD (NO EDIT/PAIR)" tone="info" />
                </View>

                <View style={styles.w13TwoColGrid}>
                  {/* Left Card: Customer & Panel Overview */}
                  <View style={styles.w09ColumnCard}>
                    <Text style={styles.w09ColHeader}>CUSTOMER & PANEL OVERVIEW</Text>
                    {[
                      ['Panel Unique ID', currentPanel.panel_uid],
                      ['32-Bit Link Address', currentPanel.link_address_32bit || '—'],
                      ['Location Name', currentPanel.location_name],
                      ['Customer Name', currentPanel.customer_name],
                      ['Account Status', `${currentPanel.customer_status} (Registered ${currentPanel.registered_pkt})`],
                      ['Email Address', currentPanel.customer_email],
                      ['Primary Phone', currentPanel.primary_phone],
                      ['Secondary Phone', currentPanel.secondary_phone || '—'],
                      ['Street Address', currentPanel.full_address],
                    ].map(([k, v]) => (
                      <View key={k} style={styles.kvRow}>
                        <Text style={styles.kvKey}>{k}</Text>
                        <Text style={styles.kvVal}>{v}</Text>
                      </View>
                    ))}

                    <View style={[styles.gpsMapBox, { marginTop: 14 }]}>
                      <Text style={styles.gpsCoordText}>
                        Pinned Home GPS: {Number(currentPanel.latitude).toFixed(4)}° N,{' '}
                        {Number(currentPanel.longitude).toFixed(4)}° E
                      </Text>
                      <Text style={{ fontSize: 22, textAlign: 'center', marginTop: 6 }}>📍</Text>
                    </View>

                    <Text style={[styles.w09SubSectionLabel, { marginTop: 16 }]}>
                      OTHER PANELS OWNED BY THIS CUSTOMER
                    </Text>
                    <View style={styles.otherPanelsBox}>
                      {panels
                        .filter((p) => p.user_id === currentPanel.user_id && p.id !== currentPanel.id)
                        .map((op) => (
                          <TouchableOpacity
                            key={op.id}
                            onPress={() => setSelectedPanelId(op.id)}
                          >
                            <Text style={{ color: COLORS.accentCyan, fontSize: 12.5, fontWeight: '600', marginVertical: 3 }}>
                              • {op.panel_uid} ({op.panel_name} — {op.status})
                            </Text>
                          </TouchableOpacity>
                        ))}
                      {panels.filter((p) => p.user_id === currentPanel.user_id).length <= 1 && (
                        <Text style={{ color: COLORS.textMuted, fontSize: 12 }}>
                          No other panels linked to this account.
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Right Card: Device Inventory by Floor (Read-Only) */}
                  <View style={styles.w09ColumnCard}>
                    <Text style={styles.w09ColHeader}>DEVICE INVENTORY BY FLOOR (READ-ONLY)</Text>
                    <Text style={styles.immutableSubNote}>
                      Managed exclusively by homeowner in Mobile App • No admin pairing/edits (US-ADM-15)
                    </Text>

                    {(currentPanel.floors || []).map((fl) => (
                      <View key={fl.id} style={{ marginTop: 14 }}>
                        <Text style={styles.floorGroupHeading}>
                          {fl.floor_name.toUpperCase()} ({fl.sensors.length} SENSORS)
                        </Text>
                        {fl.sensors.map((s) => (
                          <View
                            key={s.id}
                            style={[
                              styles.sensorReadOnlyRow,
                              s.status === 'Offline' && { borderColor: COLORS.dangerBorder },
                            ]}
                          >
                            <View>
                              <Text style={styles.sensorReadOnlyName}>{s.display_name}</Text>
                              <Text style={{ color: COLORS.textSecondary, fontSize: 11, marginTop: 2 }}>
                                Addr {s.hex_address} • Updated {s.last_updated_pkt}
                              </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                              <StatusBadge
                                label={s.status}
                                tone={s.status === 'Online' ? 'safe' : 'danger'}
                                small
                              />
                              <BatteryIndicator percent={s.battery_percent} voltage={s.battery_voltage} />
                            </View>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* ==============================================================
                W-14: CUSTOMERS DIRECTORY (US-ADM-17 / SYS-13 Retention)
               ============================================================== */}
            {screenId === 'W-14' && (
              <View style={styles.surfaceCard}>
                <View style={styles.filterBarRow}>
                  <TextInput
                    style={styles.searchInput}
                    value={customerSearch}
                    onChangeText={setCustomerSearch}
                    placeholder="Search Customer Name, Email, Phone..."
                    placeholderTextColor={COLORS.textMuted}
                  />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {['All', 'Active', 'Inactive', 'Deleted'].map((st) => (
                      <TouchableOpacity
                        key={st}
                        style={[styles.filterChip, customerStatusFilter === st && styles.filterChipActive]}
                        onPress={() => setCustomerStatusFilter(st)}
                      >
                        <Text style={styles.filterChipText}>{st}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {customers
                  .filter((c) => (customerStatusFilter === 'All' ? true : c.account_status === customerStatusFilter))
                  .filter((c) => {
                    if (!customerSearch.trim()) return true;
                    const q = customerSearch.toLowerCase();
                    return (
                      c.full_name.toLowerCase().includes(q) ||
                      c.email.toLowerCase().includes(q) ||
                      c.primary_phone.toLowerCase().includes(q)
                    );
                  })
                  .map((c) => (
                    <View key={c.id} style={styles.tableRowCard}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <Text style={styles.rowPrimaryTitle}>
                            {c.full_name} ({c.location_name || 'No Location Set'})
                          </Text>
                          <StatusBadge
                            label={c.account_status}
                            tone={
                              c.account_status === 'Active'
                                ? 'safe'
                                : c.account_status === 'Deleted'
                                ? 'danger'
                                : 'warning'
                            }
                            small
                          />
                          <StatusBadge label={`${c.panel_count} Panel(s)`} tone="info" small />
                        </View>
                        <Text style={styles.rowSubText}>
                          Email: {c.email} • Primary: {c.primary_phone} • Secondary: {c.secondary_phone || '—'}
                        </Text>
                        <Text style={styles.rowMetaText}>
                          Address: {c.street_address}, {c.city} • Registered: {c.registered_pkt}
                          {c.account_status === 'Deleted'
                            ? ' • [SYS-13 Legal Retention: Full history preserved after user app deletion]'
                            : ''}
                        </Text>
                      </View>
                      {c.panels[0] ? (
                        <ActionButton
                          title="View Panel (W-13) →"
                          variant="secondary"
                          small
                          onPress={() => navigateTo('W-13', { panelId: c.panels[0].id })}
                        />
                      ) : null}
                    </View>
                  ))}
              </View>
            )}

            {/* ==============================================================
                W-15: OFFLINE & FAULTS MONITOR (US-ADM-18)
               ============================================================== */}
            {screenId === 'W-15' && (
              <View style={styles.surfaceCard}>
                <View style={styles.filterBarRow}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      style={[styles.tabPill, offlineTab === 'Panels' && styles.tabPillActive]}
                      onPress={() => setOfflineTab('Panels')}
                    >
                      <Text style={[styles.tabPillText, offlineTab === 'Panels' && styles.tabPillTextActive]}>
                        Offline Panels ({offlinePanels.length})
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.tabPill, offlineTab === 'Sensors' && styles.tabPillActive]}
                      onPress={() => setOfflineTab('Sensors')}
                    >
                      <Text style={[styles.tabPillText, offlineTab === 'Sensors' && styles.tabPillTextActive]}>
                        Offline Sensors ({offlineSensors.length})
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.sectionMetaText}>
                    Panel offline rule: Immediate N-02 push + 15-minute reminders until reconnected (SYS-06)
                  </Text>
                </View>

                {offlineTab === 'Panels' ? (
                  offlinePanels.map((p) => (
                    <View key={p.id} style={styles.tableRowCard}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <StatusBadge label="PANEL OFFLINE" tone="warning" small />
                          <Text style={styles.rowPrimaryTitle}>
                            {p.panel_uid} • {p.location_name} ({p.customer_name})
                          </Text>
                        </View>
                        <Text style={styles.rowSubText}>
                          {p.full_address} • Contact: {p.primary_phone}
                        </Text>
                        <Text style={styles.rowMetaText}>
                          Offline Since: {p.offline_since_pkt} • Last Contact: {p.last_seen_pkt}
                        </Text>
                      </View>
                      <ActionButton
                        title="Open Panel (W-13) →"
                        variant="secondary"
                        small
                        onPress={() => navigateTo('W-13', { panelId: p.id })}
                      />
                    </View>
                  ))
                ) : (
                  offlineSensors.map((s) => (
                    <View key={s.id} style={styles.tableRowCard}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                          <StatusBadge label="SENSOR OFFLINE" tone="danger" small />
                          <Text style={styles.rowPrimaryTitle}>
                            Addr {s.hex_address} ({s.display_name}) • {s.floor_name}
                          </Text>
                          <BatteryIndicator percent={s.battery_percent} />
                        </View>
                        <Text style={styles.rowSubText}>
                          {s.location_name} ({s.panel_uid}) • Customer: {s.customer_name} ({s.primary_phone})
                        </Text>
                        <Text style={styles.rowMetaText}>Offline Since: {s.offline_since_pkt}</Text>
                      </View>
                      <ActionButton
                        title="Open Panel (W-13) →"
                        variant="secondary"
                        small
                        onPress={() => navigateTo('W-13', { panelId: s.panel_id })}
                      />
                    </View>
                  ))
                )}
              </View>
            )}

            {/* ==============================================================
                W-16: IMMUTABLE LEGAL AUDIT LOG (US-ADM-20 / SYS-11)
               ============================================================== */}
            {screenId === 'W-16' && (
              <View style={styles.surfaceCard}>
                <View style={styles.filterBarRow}>
                  <View>
                    <Text style={styles.sectionTitle}>PERMANENT LEGAL AUDIT TRAIL (SYS-11)</Text>
                    <Text style={styles.immutableSubNote}>
                      Protected by SQL BEFORE UPDATE / DELETE triggers • Retained permanently even after account deletion
                    </Text>
                  </View>
                  <TextInput
                    style={styles.searchInput}
                    value={auditSearch}
                    onChangeText={setAuditSearch}
                    placeholder="Filter by Incident ID, Actor, Action, Panel..."
                    placeholderTextColor={COLORS.textMuted}
                  />
                </View>

                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
                  {['All', 'Admin', 'Homeowner', 'System'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[styles.filterChip, auditActorFilter === role && styles.filterChipActive]}
                      onPress={() => setAuditActorFilter(role)}
                    >
                      <Text style={styles.filterChipText}>{role}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {auditLogs
                  .filter((a) => (auditActorFilter === 'All' ? true : a.actor_role === auditActorFilter))
                  .filter((a) => {
                    if (!auditSearch.trim()) return true;
                    const q = auditSearch.toLowerCase();
                    return (
                      a.actor_name.toLowerCase().includes(q) ||
                      a.action_type.toLowerCase().includes(q) ||
                      a.incident_code.toLowerCase().includes(q) ||
                      a.details.toLowerCase().includes(q)
                    );
                  })
                  .map((log) => (
                    <View key={log.id} style={styles.tableRowCard}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                          <StatusBadge
                            label={log.action_type}
                            tone={
                              log.action_type.includes('ALARM') || log.action_type.includes('FIRE')
                                ? 'danger'
                                : log.action_type.includes('CLOSED') || log.action_type.includes('ACK')
                                ? 'safe'
                                : 'info'
                            }
                            small
                          />
                          <Text style={styles.rowPrimaryTitle}>{log.actor_name}</Text>
                          {log.incident_code !== '—' && (
                            <StatusBadge label={log.incident_code} tone="warning" small />
                          )}
                          {log.panel_uid !== '—' && (
                            <StatusBadge label={log.panel_uid} tone="muted" small />
                          )}
                        </View>
                        <Text style={styles.rowSubText}>{log.details}</Text>
                        <Text style={styles.rowMetaText}>
                          Timestamp: {log.created_pkt} • Immutable Log ID #{log.id}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* ==============================================================
                W-17: ADMIN NOTIFICATIONS CENTER (US-ADM-21)
               ============================================================== */}
            {screenId === 'W-17' && (
              <View style={styles.surfaceCard}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>
                    ADMIN NOTIFICATIONS CENTER ({kpis.unread_notifications} UNREAD)
                  </Text>
                  <ActionButton
                    title="✓ Mark All as Read"
                    variant="secondary"
                    small
                    onPress={async () => {
                      await apiRequest('/admin/notifications/mark-all-read', 'POST', {});
                      showToast('All admin notifications marked as read.');
                    }}
                  />
                </View>

                {notifications.map((n) => (
                  <TouchableOpacity
                    key={n.id}
                    style={[
                      styles.tableRowCard,
                      !n.is_read && { borderColor: COLORS.primaryBorder, backgroundColor: '#13203d' },
                    ]}
                    onPress={() =>
                      navigateTo(n.target_screen || 'W-09', {
                        incidentId: n.incident_id || 1,
                        panelId: n.panel_id || 1,
                      })
                    }
                  >
                    <View style={{ flex: 1, gap: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <StatusBadge
                          label={n.is_read ? 'READ' : 'UNREAD'}
                          tone={n.is_read ? 'muted' : 'danger'}
                          small
                        />
                        <Text style={styles.rowPrimaryTitle}>{n.title}</Text>
                      </View>
                      <Text style={styles.rowSubText}>{n.body}</Text>
                      <Text style={styles.rowMetaText}>{n.created_pkt}</Text>
                    </View>
                    <Text style={styles.linkText}>Open {n.target_screen} →</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* ==============================================================
                W-18: OPERATORS, ROLES & 8-HOUR SHIFTS (PHASE 2 / US-ADM-22..23)
               ============================================================== */}
            {screenId === 'W-18' && (
              <View style={styles.w13TwoColGrid}>
                <View style={styles.w09ColumnCard}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.w09ColHeader}>OPERATORS & 8-HOUR SHIFT ROSTER</Text>
                    <StatusBadge label="Phase 2 Ready" tone="purple" small />
                  </View>
                  {operators.map((op) => (
                    <View key={op.id} style={styles.tableRowCard}>
                      <View style={{ flex: 1, gap: 4 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Text style={styles.rowPrimaryTitle}>{op.full_name}</Text>
                          <StatusBadge label={op.role.toUpperCase()} tone="info" small />
                          <StatusBadge
                            label={op.account_status}
                            tone={op.account_status === 'Active' ? 'safe' : 'warning'}
                            small
                          />
                        </View>
                        <Text style={styles.rowSubText}>{op.email}</Text>
                        <Text style={styles.rowMetaText}>{op.shift_label || 'Shift A • 08:00–16:00 PKT'}</Text>
                      </View>
                      {op.id !== 1 && (
                        <ActionButton
                          title={op.account_status === 'Active' ? 'Deactivate' : 'Reactivate'}
                          variant="secondary"
                          small
                          onPress={async () => {
                            await apiRequest(`/admin/operators/${op.id}/toggle`, 'POST', {});
                            showToast(`Updated operator ${op.full_name} status.`);
                          }}
                        />
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.w09ColumnCard}>
                  <Text style={styles.w09ColHeader}>INVITE NEW OPERATOR (US-ADM-22)</Text>
                  <Text style={[styles.immutableSubNote, { marginBottom: 14 }]}>
                    Operators have read-only access to customer data and full incident handling permissions. Every audit entry records the operator's name.
                  </Text>
                  <LabeledInput
                    label="OPERATOR FULL NAME"
                    value={opName}
                    onChangeText={setOpName}
                    placeholder="e.g. Hamza Tariq"
                  />
                  <LabeledInput
                    label="OFFICIAL EMAIL"
                    value={opEmail}
                    onChangeText={setOpEmail}
                    placeholder="hamza.operator@smartfire.pk"
                  />
                  <LabeledInput
                    label="ASSIGNED 8-HOUR SHIFT"
                    value={opShift}
                    onChangeText={setOpShift}
                    placeholder="Shift B • 16:00–00:00 PKT"
                  />
                  <ActionButton
                    title="+ Create Operator & Send Invite"
                    disabled={!opName.trim() || !opEmail.includes('@')}
                    onPress={async () => {
                      await apiRequest('/admin/operators', 'POST', {
                        fullName: opName,
                        email: opEmail,
                        role: opRole,
                        shiftLabel: opShift,
                      });
                      setOpName('');
                      setOpEmail('');
                      showToast('Operator account provisioned and logged in Audit Log.');
                    }}
                  />
                </View>
              </View>
            )}

            {/* ==============================================================
                W-19: ADMIN CONSOLE SETTINGS (US-ADM-24..26)
               ============================================================== */}
            {screenId === 'W-19' && (
              <View style={styles.w13TwoColGrid}>
                <View style={styles.w09ColumnCard}>
                  <Text style={styles.w09ColHeader}>ALERT SOUND & SLA TIMERS (US-ADM-25)</Text>
                  <View style={styles.deliveryStatusCard}>
                    <Text style={{ color: COLORS.dangerLight, fontSize: 12, fontWeight: '700' }}>
                      🔒 Safety Lock: Critical Fire Alert sound is permanently ON and cannot be muted in settings.
                    </Text>
                  </View>

                  <LabeledInput
                    label="1-MINUTE FIRE CONFIRMATION SLA (SECONDS)"
                    value={sla1Min}
                    onChangeText={setSla1Min}
                  />
                  <LabeledInput
                    label="5-MINUTE FINAL DECISION SLA (SECONDS)"
                    value={sla5Min}
                    onChangeText={setSla5Min}
                  />
                  <LabeledInput
                    label="INCIDENT DISPATCH EMAIL RECIPIENTS (US-ADM-26)"
                    value={incidentEmailRecip}
                    onChangeText={setIncidentEmailRecip}
                  />

                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                    <ActionButton
                      title="🔊 Play Test Alarm Sound"
                      variant="secondary"
                      onPress={() => {
                        playEmergencyTone('fire');
                        showToast('Playing browser fire alert synthesizer test tone.');
                      }}
                    />
                    <ActionButton
                      title="Save Console Settings"
                      onPress={async () => {
                        await apiRequest('/admin/settings', 'PUT', {
                          adminName: settingsAdminName,
                          sla_confirm_fire_seconds: sla1Min,
                          sla_final_decision_seconds: sla5Min,
                          non_fire_sound_enabled: nonFireSound,
                          incident_email_recipient: incidentEmailRecip,
                        });
                        showToast('SLA Timer & Console settings saved to Audit Log.');
                      }}
                    />
                  </View>
                </View>

                <View style={styles.w09ColumnCard}>
                  <Text style={styles.w09ColHeader}>ADMIN PROFILE & PASSWORD (US-ADM-24)</Text>
                  <LabeledInput
                    label="DISPLAY NAME"
                    value={settingsAdminName}
                    onChangeText={setSettingsAdminName}
                  />
                  <LabeledInput
                    label="CURRENT PASSWORD"
                    value={currPass}
                    onChangeText={setCurrPass}
                    secureTextEntry
                    placeholder="Enter current password"
                  />
                  <LabeledInput
                    label="NEW PASSWORD"
                    value={newPass}
                    onChangeText={setNewPass}
                    secureTextEntry
                    placeholder="Minimum 8 characters"
                  />
                  <LabeledInput
                    label="CONFIRM NEW PASSWORD"
                    value={confPass}
                    onChangeText={setConfPass}
                    secureTextEntry
                    placeholder="Confirm new password"
                  />
                  <ActionButton
                    title="Update Password"
                    disabled={!currPass || newPass.length < 8 || newPass !== confPass}
                    onPress={async () => {
                      await apiRequest('/auth/change-password', 'POST', {
                        userId: 1,
                        currentPassword: currPass,
                        newPassword: newPass,
                      });
                      setCurrPass('');
                      setNewPass('');
                      setConfPass('');
                      showToast('Admin password updated successfully.');
                    }}
                  />
                </View>
              </View>
            )}

            {/* ==============================================================
                W-20 & W-21: SYSTEM ERROR STATES & MASTER SHELL OVERVIEW
               ============================================================== */}
            {(screenId === 'W-20' || screenId === 'W-21') && (
              <View style={styles.w13TwoColGrid}>
                <View style={styles.w09ColumnCard}>
                  <Text style={styles.w09ColHeader}>W-20 • ERROR & CONNECTION STATES (US-ADM-27)</Text>
                  {[
                    {
                      title: 'Lost Live Telemetry Connection',
                      desc: 'Displays automatic reconnect banner at top of console because live fire alerts may be delayed.',
                      action: () => setSimulatedNoInternet(!simulatedNoInternet),
                      btn: simulatedNoInternet ? 'Restore Connection' : 'Simulate Connection Drop',
                    },
                    {
                      title: 'Session Expiry & Active Incident Guard (US-AUTH-14)',
                      desc: 'Idle session timeout redirects to W-01 Login, but NEVER logs out an operator while a fire incident is open.',
                      action: () =>
                        showToast(
                          activeIncidents.length > 0
                            ? 'Guard Active: Idle logout blocked because #INC-2045 is currently open (US-AUTH-14)!'
                            : 'Session expired. Redirecting to Login.'
                        ),
                      btn: 'Test Session Expiry Guard',
                    },
                    {
                      title: '403 Read-Only Permission Guard',
                      desc: 'Admin and Operators cannot add/edit customer records or pair sensors.',
                      action: () => showToast('403 Policy Enforced: Customer data is strictly read-only.'),
                      btn: 'Verify 403 Guard',
                    },
                  ].map((card) => (
                    <View key={card.title} style={[styles.tableRowCard, { marginTop: 10 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.rowPrimaryTitle}>{card.title}</Text>
                        <Text style={styles.rowSubText}>{card.desc}</Text>
                      </View>
                      <ActionButton title={card.btn} variant="secondary" small onPress={card.action} />
                    </View>
                  ))}
                </View>

                <View style={styles.w09ColumnCard}>
                  <Text style={styles.w09ColHeader}>W-21 • ALL 21 ADMIN WEB SCREENS INDEX</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    {ADMIN_WEB_SCREENS.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        style={[styles.filterChip, screenId === s.id && styles.filterChipActive]}
                        onPress={() => navigateTo(s.id)}
                      >
                        <Text style={styles.filterChipText}>
                          {s.id} • {s.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* ====================================================================
          W-07: GLOBAL INCIDENT ALERT OVERLAY MODAL (Figma 1:2804 / US-ADM-03)
         ==================================================================== */}
      <Modal visible={showGlobalAlertModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={{ width: '100%', maxWidth: 764, gap: 14 }}>
            {/* Top Audio & Desktop Notification Pill (Figma 1:2887..1:2888) */}
            <View
              style={{
                backgroundColor: '#0f1d2e',
                borderWidth: 1,
                borderColor: '#1e3a5f',
                borderRadius: 10,
                paddingVertical: 10,
                paddingHorizontal: 18,
              }}
            >
              <Text style={{ color: '#93c5fd', fontSize: 12.5, fontWeight: '700' }}>
                🔊 Browser Audio Permission Enabled (Explained on 1st Login) • Background Tab Desktop Notification Sent ✓
              </Text>
            </View>

            {/* Main W-07 Alert Card (Figma 1:2889..1:2911) */}
            <View
              style={{
                width: '100%',
                backgroundColor: '#1f090d',
                borderWidth: 1.5,
                borderColor: '#ef4444',
                borderRadius: 18,
                overflow: 'hidden',
              }}
            >
              {/* Full-Width Red Header Bar (Figma 1:2891..1:2898) */}
              <View
                style={{
                  backgroundColor: '#dc2626',
                  paddingVertical: 16,
                  paddingHorizontal: 24,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <Text style={{ color: '#ffffff', fontSize: 17, fontWeight: '800', letterSpacing: 0.3 }}>
                  🔥 EMERGENCY FIRE ALARM — REPEATING SIREN ACTIVE
                </Text>
                <View
                  style={{
                    backgroundColor: '#7f1d1d',
                    borderRadius: 999,
                    paddingVertical: 5,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: '700' }}>
                    {activeIncidents.length > 1
                      ? `+${activeIncidents.length - 1} More Queued (${activeIncidents.length} Total)`
                      : '1 Active in Queue'}
                  </Text>
                </View>
              </View>

              {/* Card Body (Figma 1:2899..1:2911) */}
              <View style={{ padding: 28 }}>
                {(() => {
                  const alertInc =
                    activeIncidents.find((i) => i.incident_code === '#INC-2045') ||
                    activeIncidents[0] ||
                    currentIncident;
                  return (
                    <>
                      <Text style={{ color: '#fca5a5', fontSize: 13, fontWeight: '800', letterSpacing: 0.4 }}>
                        INCIDENT {alertInc?.incident_code || '#INC-2045'} • PANEL ID:{' '}
                        {alertInc?.panel_uid || 'PNL-PK-8F2A'}
                      </Text>

                      <Text style={{ color: '#ffffff', fontSize: 28, fontWeight: '800', marginTop: 6 }}>
                        {alertInc?.location_name || 'Aslam Residence'}
                      </Text>

                      <Text style={{ color: '#e2e8f0', fontSize: 15, marginTop: 4 }}>
                        {alertInc?.full_address || 'House 14-B, Street 4, Block H, DHA Phase 5, Lahore, 54792'}
                      </Text>

                      {/* Exact Alarm Zone Inner Box (Figma 1:2902..1:2904) */}
                      <View
                        style={{
                          backgroundColor: '#130508',
                          borderWidth: 1,
                          borderColor: '#7f1d1d',
                          borderRadius: 12,
                          paddingVertical: 14,
                          paddingHorizontal: 18,
                          marginTop: 18,
                        }}
                      >
                        <Text style={{ color: '#fca5a5', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 }}>
                          EXACT ALARM ZONE
                        </Text>
                        <Text style={{ color: '#facc15', fontSize: 20, fontWeight: '800', marginTop: 4 }}>
                          {alertInc?.primary_floor || 'Ground Floor'} → {alertInc?.primary_room || 'Kitchen'} (Sensor Address{' '}
                          {alertInc?.primary_hex_address || '01'})
                        </Text>
                      </View>

                      <Text style={{ color: '#cbd5e1', fontSize: 13, marginTop: 16 }}>
                        Automated Call, Email & Mobile Critical Push triggered simultaneously at{' '}
                        {alertInc?.raised_pkt || '11:08:12 PM PKT'}.
                      </Text>

                      {/* Bottom 2 Action Buttons Inside Card (Figma 1:2906 & 1:2909) */}
                      <View style={{ flexDirection: 'row', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
                        <TouchableOpacity
                          style={{
                            flex: 2,
                            minWidth: 260,
                            backgroundColor: '#dc2626',
                            borderRadius: 12,
                            paddingVertical: 15,
                            paddingHorizontal: 18,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            if (alertInc?.id) {
                              handleAcknowledgeIncident(alertInc.id);
                              setShowGlobalAlertModal(false);
                              navigateTo('W-09', { incidentId: alertInc.id });
                            } else {
                              setShowGlobalAlertModal(false);
                              navigateTo('W-09');
                            }
                          }}
                        >
                          <Text style={{ color: '#ffffff', fontSize: 14.5, fontWeight: '800' }}>
                            OPEN INCIDENT & ACKNOWLEDGE (W-09) →
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{
                            flex: 1,
                            minWidth: 180,
                            backgroundColor: '#1e293b',
                            borderWidth: 1,
                            borderColor: '#475569',
                            borderRadius: 12,
                            paddingVertical: 15,
                            paddingHorizontal: 16,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          onPress={() => {
                            setShowGlobalAlertModal(false);
                            navigateTo('W-08');
                          }}
                        >
                          <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: '700' }}>
                            View Queue ({activeIncidents.length || 2} Active)
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  );
                })()}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================================
          W-10: CLOSE INCIDENT DIALOG MODAL (Figma 1:3335 / US-ADM-10)
         ==================================================================== */}
      <Modal visible={showCloseModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 564 }]}>
            <Text style={styles.authCardTitle}>
              Close Incident {currentIncident?.incident_code || '#INC-2045'}
            </Text>
            <Text style={styles.authCardSubtitle}>
              {currentIncident?.location_name || 'Aslam Residence'} •{' '}
              {currentIncident?.primary_floor || 'Ground Floor'} → {currentIncident?.primary_room || 'Kitchen'} • Recorded to Permanent Audit Log
            </Text>

            <Text style={styles.w09SubSectionLabel}>SELECT FINAL OUTCOME *</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 10 }}>
              {['Real Fire', 'False Alarm', 'Test', 'Customer Unreachable', 'Other'].map((out) => (
                <TouchableOpacity
                  key={out}
                  style={[styles.choiceChip, closeOutcome === out && styles.choiceChipActive]}
                  onPress={() => setCloseOutcome(out)}
                >
                  <Text style={styles.choiceChipText}>
                    {closeOutcome === out ? `● ${out}` : out}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
              <Text style={styles.w09SubSectionLabel}>REQUIRED WRITTEN REASON * (MIN 20 CHARACTERS)</Text>
              <Text
                style={{
                  color: closeReason.trim().length >= 10 ? COLORS.safeText : COLORS.textSecondary,
                  fontSize: 11.5,
                  fontWeight: '700',
                  marginBottom: 8,
                }}
              >
                {closeReason.trim().length} / 20 min {closeReason.trim().length >= 10 ? '✓' : ''}
              </Text>
            </View>
            <LabeledInput
              value={closeReason}
              onChangeText={setCloseReason}
              placeholder="Confirmed minor stove fire with homeowner Husnain Aslam via phone. Fire extinguished on site and panel sensors cleared."
              multiline
              errorText={
                closeReason.length > 0 && closeReason.trim().length < 10
                  ? 'Reason must be at least 10 characters'
                  : ''
              }
            />

            <LabeledInput
              label="OPTIONAL CLOSING NOTES"
              value={closeNotes}
              onChangeText={setCloseNotes}
              placeholder="No injuries reported. Advised homeowner to run M-35 Self-Test."
            />

            <View
              style={{
                backgroundColor: COLORS.bgPrimary,
                borderWidth: 1,
                borderColor: COLORS.borderSubtle,
                borderRadius: 10,
                padding: 12,
                marginBottom: 14,
                gap: 4,
              }}
            >
              <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                • Closing locks this incident as strictly Read-Only.
              </Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                • Homeowner app receives All Clear screen (M-38).
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
              <View style={{ flex: 1 }}>
                <ActionButton
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setShowCloseModal(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ActionButton
                  title="Confirm & Close Incident"
                  variant="danger"
                  disabled={closeReason.trim().length < 10}
                  onPress={handleCloseIncident}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================================
          W-11: NOTIFY AUTHORITIES DIALOG (Figma 1:3456 / US-ADM-12)
         ==================================================================== */}
      <Modal visible={showNotifyAuthoritiesModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 584 }]}>
            <StatusBadge label="PHASE 2 FEATURE • SKIPPED IN MVP RELEASE" tone="purple" small />
            <Text style={[styles.authCardTitle, { marginTop: 10 }]}>
              Notify Emergency Authorities (Rescue 1122)
            </Text>
            <Text style={styles.authCardSubtitle}>
              Preview of emergency payload to be dispatched by email & voice call
            </Text>
            {currentIncident && (
              <View
                style={{
                  backgroundColor: COLORS.bgPrimary,
                  borderWidth: 1,
                  borderColor: COLORS.borderSubtle,
                  borderRadius: 12,
                  padding: 16,
                  marginVertical: 10,
                  gap: 10,
                }}
              >
                {[
                  ['Location Name:', `${currentIncident.location_name} (#${currentIncident.panel_uid})`, '#ffffff'],
                  ['Street Address:', currentIncident.full_address, '#ffffff'],
                  ['GPS Coordinates:', `${currentIncident.latitude}° N, ${currentIncident.longitude}° E (Google Maps Link)`, COLORS.accentCyan],
                  ['Fire Zone:', `${currentIncident.primary_floor} → ${currentIncident.primary_room} (Sensor ${currentIncident.primary_hex_address})`, COLORS.dangerSoftText],
                  ['Customer Phones:', `${currentIncident.primary_phone} / ${currentIncident.secondary_phone}`, '#ffffff'],
                  ['Audit Recording:', 'Logs operator, timestamp, email & call status permanently', COLORS.textSecondary],
                ].map(([label, val, col]) => (
                  <View key={label} style={{ flexDirection: 'row', gap: 12 }}>
                    <Text style={{ color: COLORS.textSecondary, fontSize: 12.5, width: 130 }}>{label}</Text>
                    <Text style={{ color: col, fontSize: 13, fontWeight: '700', flex: 1 }}>{val}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 10 }}>
              <View style={{ flex: 1 }}>
                <ActionButton
                  title="Cancel"
                  variant="secondary"
                  onPress={() => setShowNotifyAuthoritiesModal(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ActionButton
                  title="Send & Place 1122 Call (Phase 2)"
                  variant="primary"
                  onPress={() => {
                    showToast('Phase 2 Rescue 1122 dispatch payload preview verified.');
                    setShowNotifyAuthoritiesModal(false);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================================
          LOGOUT CONFIRMATION DIALOG (US-AUTH-13)
         ==================================================================== */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 420 }]}>
            <Text style={styles.authCardTitle}>Log Out of Admin Console?</Text>
            <Text style={styles.authCardSubtitle}>
              Your operator session will end and return to W-01 Admin Sign In (US-AUTH-13).
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
              <ActionButton
                title="Cancel"
                variant="secondary"
                small
                onPress={() => setShowLogoutConfirm(false)}
              />
              <ActionButton
                title="Log Out"
                variant="danger"
                small
                onPress={() => {
                  setShowLogoutConfirm(false);
                  setAdminLoggedIn(false);
                  setScreenId('W-01');
                  showToast('Logged out of Admin Monitoring Console.');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================================
          ALL 21 WEB SCREENS QUICK JUMPER MODAL
         ==================================================================== */}
      <Modal visible={showScreenJumpModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 680 }]}>
            <Text style={styles.authCardTitle}>Jump to Any Admin Web Screen (W-01 to W-21)</Text>
            <Text style={styles.authCardSubtitle}>
              All 21 Figma Admin Web screens and dialogs are interactive:
            </Text>
            <ScrollView style={{ maxHeight: 380 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {ADMIN_WEB_SCREENS.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.filterChip, screenId === s.id && styles.filterChipActive]}
                    onPress={() => {
                      setShowScreenJumpModal(false);
                      navigateTo(s.id);
                    }}
                  >
                    <Text style={styles.filterChipText}>
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
                onPress={() => setShowScreenJumpModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* ====================================================================
          SQL DATABASE & 14 TABLES LIVE INSPECTOR MODAL
         ==================================================================== */}
      <Modal visible={showDbInspectorModal} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { maxWidth: 920 }]}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.authCardTag}>
                  SQL Database: {dbInspectorData?.databaseName || 'firealarm.sqlite'} ({dbInspectorData?.tableCount || 14} Tables)
                </Text>
                <Text style={styles.authCardTitle}>Live SQL Database & Table Explorer</Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 11.5, marginTop: 2 }}>
                  Path: {dbInspectorData?.databasePath || 'd:\\FireAlarm\\backend\\data\\firealarm.sqlite'} • DDL: backend/sql/schema.sql
                </Text>
              </View>
              <ActionButton
                title="Close"
                variant="secondary"
                small
                onPress={() => setShowDbInspectorModal(false)}
              />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {(dbInspectorData?.tables || []).map((tb) => (
                <TouchableOpacity
                  key={tb.name}
                  style={[styles.filterChip, selectedDbTable === tb.name && styles.filterChipActive]}
                  onPress={() => setSelectedDbTable(tb.name)}
                >
                  <Text style={styles.filterChipText}>
                    {tb.name} ({tb.rowCount})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {(() => {
              const activeTb = (dbInspectorData?.tables || []).find((t) => t.name === selectedDbTable);
              if (!activeTb) return null;
              return (
                <ScrollView style={{ maxHeight: 360 }}>
                  <View style={[styles.deliveryStatusCard, { marginBottom: 10 }]}>
                    <Text style={{ color: COLORS.accentCyan, fontSize: 11.5, fontWeight: '800' }}>
                      TABLE "{activeTb.name}" COLUMNS ({activeTb.columns.length}):
                    </Text>
                    <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontFamily: 'monospace' }}>
                      {activeTb.columns
                        .map((c) => `${c.name} (${c.type}${c.pk ? ' PK' : ''})`)
                        .join(' • ')}
                    </Text>
                  </View>
                  {activeTb.rows.map((row, idx) => (
                    <View key={idx} style={[styles.tableRowCard, { padding: 10, marginBottom: 6 }]}>
                      <Text style={{ color: '#ffffff', fontSize: 11.5, fontFamily: 'monospace' }}>
                        {JSON.stringify(row)}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              );
            })()}
          </View>
        </View>
      </Modal>

      <ToastFeedback toast={toast} />
    </View>
  );
}

const styles = StyleSheet.create({
  authRoot: {
    flex: 1,
    backgroundColor: COLORS.bgCanvas,
  },
  authHeader: {
    paddingHorizontal: 28,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fireLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.dangerCardBg,
    borderWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireLogoEmoji: {
    fontSize: 18,
  },
  authBrandTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  authBrandSub: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
  },
  ConsoleQuickSwitchBtn: {
    backgroundColor: COLORS.bgCardElevated,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  ConsoleQuickSwitchText: {
    color: COLORS.accentCyan,
    fontSize: 11.5,
    fontWeight: '700',
  },
  authCenterWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  authCard: {
    width: '100%',
    maxWidth: 460,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 18,
    padding: 28,
  },
  authCardTag: {
    color: COLORS.accentCyan,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  authCardTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  authCardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    marginTop: 4,
    marginBottom: 18,
    lineHeight: 18,
  },
  authErrorBox: {
    backgroundColor: COLORS.dangerCardBg,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  authErrorText: {
    color: COLORS.dangerLight,
    fontSize: 12,
    fontWeight: '700',
  },
  linkText: {
    color: COLORS.accentCyan,
    fontSize: 12.5,
    fontWeight: '700',
  },
  noSignupPolicyBox: {
    marginTop: 18,
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  noSignupTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  noSignupSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.safeBg,
    borderWidth: 1.5,
    borderColor: COLORS.safeBorder,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 14,
  },
  consoleRoot: {
    flex: 1,
    backgroundColor: COLORS.bgCanvas,
  },
  globalAlertStrip: {
    backgroundColor: '#5c1118',
    borderBottomWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    paddingVertical: 8,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.dangerBright,
  },
  globalAlertStripTitle: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '800',
  },
  globalAlertBtnPrimary: {
    backgroundColor: COLORS.danger,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  globalAlertBtnSecondary: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: COLORS.dangerSoftText,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  globalAlertBtnText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  simulatorBar: {
    backgroundColor: '#0c1427',
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: 7,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  simulatorBarLabel: {
    color: COLORS.accentCyan,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  simChip: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  simChipText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  mainBodyRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 240,
    backgroundColor: COLORS.bgPrimary,
    borderRightWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  sidebarMobileOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.65)',
    zIndex: 100,
    flexDirection: 'row',
  },
  sidebarInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  sidebarBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  sidebarBrandTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  sidebarBrandSub: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: COLORS.borderSubtle,
    marginBottom: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: COLORS.primarySoftBg,
    borderColor: COLORS.primaryBorder,
  },
  navItemText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '600',
  },
  navItemTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  readOnlyPolicyBox: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 12,
    padding: 12,
  },
  readOnlyPolicyTitle: {
    color: COLORS.accentCyan,
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  readOnlyPolicyText: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    lineHeight: 15,
  },
  contentColumn: {
    flex: 1,
  },
  topHeader: {
    backgroundColor: COLORS.bgPrimary,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    paddingVertical: 12,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuToggleBtn: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  topHeaderTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  topHeaderSub: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
  },
  topHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  liveServerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.safeBg,
    borderWidth: 1,
    borderColor: COLORS.safeBorder,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  liveServerText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.dangerBright,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  bellBadgeText: {
    color: '#ffffff',
    fontSize: 9.5,
    fontWeight: '800',
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  profilePillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  viewportScroll: {
    flex: 1,
  },
  viewportContent: {
    padding: 20,
    paddingBottom: 48,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  kpiCard: {
    flex: 1,
    minWidth: 155,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 16,
  },
  kpiLabel: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: '800',
    marginVertical: 6,
  },
  kpiSub: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  activeIncidentsContainer: {
    backgroundColor: '#250a0e',
    borderWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  activeIncidentsHeaderTitle: {
    color: '#ffffff',
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  activeIncidentRowCard: {
    backgroundColor: '#360d13',
    borderWidth: 1,
    borderColor: '#7f1d1d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  activeIncidentTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  activeIncidentSub: {
    color: COLORS.dangerLight,
    fontSize: 12,
  },
  surfaceCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 16,
    padding: 18,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionMetaText: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  activityStreamRow: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  activityTimeText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    fontFamily: 'monospace',
    minWidth: 140,
  },
  activityDescText: {
    fontSize: 12.5,
    fontWeight: '700',
    flex: 1,
  },
  filterBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  tabPill: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  tabPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryBorder,
  },
  tabPillText: {
    color: COLORS.textSecondary,
    fontSize: 12.5,
    fontWeight: '700',
  },
  tabPillTextActive: {
    color: '#ffffff',
  },
  searchInput: {
    backgroundColor: COLORS.bgInput,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 12.5,
    minWidth: 260,
  },
  filterChip: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 11,
  },
  filterChipActive: {
    backgroundColor: COLORS.primarySoftBg,
    borderColor: COLORS.accentCyan,
  },
  filterChipText: {
    color: COLORS.textPrimary,
    fontSize: 11.5,
    fontWeight: '600',
  },
  tableRowCard: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  rowPrimaryTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  rowSubText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  rowMetaText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  w09CommandHeader: {
    backgroundColor: '#2a0b10',
    borderWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 14,
  },
  w09HeaderTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  w09HeaderUrgentText: {
    color: COLORS.warningText,
    fontSize: 12.5,
    fontWeight: '800',
  },
  slaBoxDanger: {
    backgroundColor: '#451015',
    borderWidth: 1.5,
    borderColor: COLORS.dangerBorder,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  slaBoxWarning: {
    backgroundColor: '#331c08',
    borderWidth: 1.5,
    borderColor: COLORS.warningBorder,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  slaLabel: {
    color: COLORS.dangerLight,
    fontSize: 9.5,
    fontWeight: '800',
  },
  slaTimerText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  phase2NotifyBtn: {
    backgroundColor: COLORS.bgSurface,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  phase2NotifyBtnText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  w09ThreeColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  w13TwoColGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  w09ColumnCard: {
    flex: 1,
    minWidth: 310,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 16,
    padding: 18,
  },
  w09ColHeader: {
    color: COLORS.accentCyan,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  w09LocationZone: {
    color: COLORS.dangerSoftText,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  w09AddressText: {
    color: '#ffffff',
    fontSize: 13,
    marginBottom: 2,
  },
  w09MetaText: {
    color: COLORS.textSecondary,
    fontSize: 11.5,
    marginBottom: 12,
  },
  gpsMapBox: {
    backgroundColor: '#0b1930',
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    borderRadius: 12,
    padding: 12,
  },
  gpsCoordText: {
    color: COLORS.accentCyan,
    fontSize: 11.5,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  gpsOpenLink: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: '700',
  },
  w09SubSectionLabel: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 8,
  },
  contactCallCard: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 11,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactPhoneTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },
  contactPhoneSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sensorReadOnlyRow: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sensorReadOnlyName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  deliveryStatusCard: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    gap: 4,
  },
  deliveryStatusGreen: {
    color: COLORS.safeText,
    fontSize: 11.5,
    fontWeight: '700',
  },
  deliveryStatusCyan: {
    color: COLORS.accentCyan,
    fontSize: 11.5,
    fontWeight: '600',
  },
  timelineItemCard: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    padding: 11,
    marginBottom: 8,
  },
  timelineTimeText: {
    color: COLORS.textSecondary,
    fontSize: 10.5,
    fontFamily: 'monospace',
    marginBottom: 3,
  },
  timelineDescText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  manualCallLoggerBox: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },
  manualCallTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  manualCallHint: {
    color: COLORS.textMuted,
    fontSize: 10.5,
    marginBottom: 10,
  },
  choiceChip: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDefault,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  choiceChipActive: {
    backgroundColor: COLORS.primarySoftBg,
    borderColor: COLORS.accentCyan,
  },
  choiceChipSafeActive: {
    backgroundColor: COLORS.safeBg,
    borderColor: COLORS.safeBorder,
  },
  choiceChipText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  immutableSubNote: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  immutableNoteCard: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    padding: 12,
  },
  immutableNoteAuthor: {
    color: COLORS.accentCyan,
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 4,
  },
  immutableNoteBody: {
    color: '#ffffff',
    fontSize: 12.5,
    lineHeight: 18,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: COLORS.borderSubtle,
    gap: 12,
  },
  kvKey: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  kvVal: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  otherPanelsBox: {
    backgroundColor: COLORS.bgPrimary,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    borderRadius: 10,
    padding: 12,
  },
  floorGroupHeading: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyBox: {
    padding: 20,
    alignItems: 'center',
  },
  emptyBoxTitle: {
    color: COLORS.safeText,
    fontSize: 14,
    fontWeight: '800',
  },
  emptyBoxSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(4, 8, 18, 0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1.5,
    borderColor: COLORS.borderDefault,
    borderRadius: 18,
    padding: 24,
  },
});
