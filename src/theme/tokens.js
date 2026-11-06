// ============================================================================
// Smart Fire Alarm System — Exact Figma Design System Tokens
// Extracted from Figma File 8hW8RobkmjvMc9VpEF0L6W (All 77 UI Screens v0.1)
// ============================================================================

export const COLORS = {
  // Core Canvas & Surfaces
  bgCanvas: '#080d1a',
  bgPrimary: '#0b1120',
  bgSurface: '#0f172a',
  bgCard: '#131c31',
  bgCardElevated: '#17223b',
  bgInput: '#0d1526',

  // Borders & Dividers
  borderSubtle: '#1e293b',
  borderDefault: '#26354d',
  borderFocus: '#38bdf8',

  // Typography
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',

  // Brand & Interactive Blue
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primarySoftBg: '#172554',
  primaryBorder: '#3b82f6',
  accentCyan: '#38bdf8',

  // System Working / Safe / Online (Green)
  safe: '#10b981',
  safeText: '#34d399',
  safeLight: '#a7f3d0',
  safeBg: '#063e31',
  safeCardBg: '#08382c',
  safeBorder: '#10b981',

  // Fire Alarm / Emergency / Fault (Red)
  danger: '#dc2626',
  dangerBright: '#ef4444',
  dangerText: '#f87171',
  dangerLight: '#fecaca',
  dangerSoftText: '#fca5a5',
  dangerBg: '#2a0a0e',
  dangerCardBg: '#451015',
  dangerHeaderBg: '#7f1d1d',
  dangerBorder: '#ef4444',

  // Offline / SLA Warning / False Alarm (Amber)
  warning: '#d97706',
  warningText: '#fbbf24',
  warningLight: '#fde68a',
  warningBg: '#3b2106',
  warningBorder: '#f59e0b',

  // Phase 2 / Supervisor Accent (Violet)
  purpleText: '#c4b5fd',
  purpleBg: '#2e1065',
  purpleBorder: '#7c3aed',
};

export const MOBILE_SCREENS = [
  { id: 'M-01', title: 'Splash Screen', group: 'Auth', story: 'US-AUTH-01' },
  { id: 'M-02', title: 'Splash — Offline & Deleted', group: 'Auth', story: 'US-AUTH-01' },
  { id: 'M-03', title: 'Login Screen', group: 'Auth', story: 'US-AUTH-02..05' },
  { id: 'M-04', title: 'Sign Up Screen', group: 'Auth', story: 'US-AUTH-06' },
  { id: 'M-05', title: 'Verify OTP (Sign Up)', group: 'Auth', story: 'US-AUTH-07' },
  { id: 'M-06', title: 'Forgot Password', group: 'Auth', story: 'US-AUTH-08' },
  { id: 'M-07', title: 'Reset OTP Screen', group: 'Auth', story: 'US-AUTH-09' },
  { id: 'M-08', title: 'Reset Password', group: 'Auth', story: 'US-AUTH-10' },
  { id: 'M-09', title: 'Password Reset Success', group: 'Auth', story: 'US-AUTH-11' },
  { id: 'M-10', title: 'Welcome / Intro Slides', group: 'Onboarding', story: 'US-ONB-01' },
  { id: 'M-11', title: 'Profile Setup & Map Pin', group: 'Onboarding', story: 'US-ONB-02..03' },
  { id: 'M-12', title: 'App Permissions', group: 'Onboarding', story: 'US-ONB-04' },
  { id: 'M-13', title: 'Home — No Panel (Empty)', group: 'Onboarding', story: 'US-ONB-05' },
  { id: 'M-14', title: 'Add Panel — Instructions', group: 'Onboarding', story: 'US-PNL-01' },
  { id: 'M-15', title: 'Scan Booklet QR Code', group: 'Onboarding', story: 'US-PNL-02' },
  { id: 'M-16', title: 'Enter Panel ID Manually', group: 'Onboarding', story: 'US-PNL-03' },
  { id: 'M-17', title: 'Confirm & Name Panel', group: 'Onboarding', story: 'US-PNL-04' },
  { id: 'M-18', title: 'Linking Progress & Success', group: 'Onboarding', story: 'US-PNL-05' },
  { id: 'M-19', title: 'My Panels List', group: 'Onboarding', story: 'US-PNL-06' },
  { id: 'M-20', title: 'Panel Details', group: 'Onboarding', story: 'US-PNL-07' },
  { id: 'M-21', title: 'Remove Panel Confirmation', group: 'Onboarding', story: 'US-PNL-08' },
  { id: 'M-22', title: 'Add / Replace Alarm System', group: 'Onboarding', story: 'US-PNL-09' },
  { id: 'M-23', title: 'Dashboard (Home)', group: 'Dashboard', story: 'US-DSH-01..08' },
  { id: 'M-24', title: 'Floors List', group: 'Floors', story: 'US-FLR-01 / 05' },
  { id: 'M-25', title: 'Create Floor', group: 'Floors', story: 'US-FLR-02' },
  { id: 'M-26', title: 'Edit / Delete Floor', group: 'Floors', story: 'US-FLR-03..04' },
  { id: 'M-27', title: 'Floor Detail (Sensors)', group: 'Floors', story: 'US-FLR-06..07' },
  { id: 'M-28', title: 'Add Sensor — Start', group: 'Sensors', story: 'US-SNS-01' },
  { id: 'M-29', title: 'Pairing in Progress', group: 'Sensors', story: 'US-SNS-02' },
  { id: 'M-30', title: 'Sensor Found — Name & Place', group: 'Sensors', story: 'US-SNS-03..04' },
  { id: 'M-31', title: 'Pairing Failed / Timeout', group: 'Sensors', story: 'US-SNS-05' },
  { id: 'M-32', title: 'Pairing Success', group: 'Sensors', story: 'US-SNS-06..07' },
  { id: 'M-33', title: 'Sensor Details', group: 'Sensors', story: 'US-SNS-08..09' },
  { id: 'M-34', title: 'Delete Sensor Confirmation', group: 'Sensors', story: 'US-SNS-10' },
  { id: 'M-35', title: 'Run Self-Test', group: 'Sensors', story: 'US-TST-01' },
  { id: 'M-36', title: 'FIRE ALARM EMERGENCY', group: 'Alarm', story: 'US-ALR-01..05' },
  { id: 'M-37', title: 'Alarm Status (Siren Silenced)', group: 'Alarm', story: 'US-ALR-06' },
  { id: 'M-38', title: 'All Clear — Alarm Ended', group: 'Alarm', story: 'US-ALR-07' },
  { id: 'M-39', title: 'Panel Offline State', group: 'Alarm', story: 'US-OFF-01..02' },
  { id: 'M-40', title: 'History List', group: 'History', story: 'US-HIS-01' },
  { id: 'M-41', title: 'History Event Detail', group: 'History', story: 'US-HIS-02' },
  { id: 'M-42', title: 'Settings Home', group: 'Settings', story: 'US-SET-01' },
  { id: 'M-43', title: 'My Profile', group: 'Settings', story: 'US-SET-02' },
  { id: 'M-44', title: 'Change Password', group: 'Settings', story: 'US-AUTH-12' },
  { id: 'M-45', title: 'Notification & Alert Settings', group: 'Settings', story: 'US-SET-03' },
  { id: 'M-46', title: 'Logged-in Devices (P2)', group: 'Settings', story: 'US-SET-04' },
  { id: 'M-47', title: 'Delete Account', group: 'Settings', story: 'US-SET-05' },
  { id: 'M-48', title: 'Privacy Policy', group: 'Settings', story: 'US-SET-06' },
  { id: 'M-49', title: 'Terms of Use', group: 'Settings', story: 'US-SET-06' },
  { id: 'M-50', title: 'About & Support', group: 'Settings', story: 'US-SET-07' },
  { id: 'M-51', title: 'Global System States', group: 'Settings', story: 'US-SYS-01' },
];

export const ADMIN_WEB_SCREENS = [
  { id: 'W-01', title: 'Admin Console Login', group: 'Auth', story: 'US-AUTH-02..03' },
  { id: 'W-02', title: 'Admin Forgot Password', group: 'Auth', story: 'US-AUTH-08' },
  { id: 'W-03', title: 'Admin OTP Verification', group: 'Auth', story: 'US-AUTH-09' },
  { id: 'W-04', title: 'Admin Reset Password', group: 'Auth', story: 'US-AUTH-10' },
  { id: 'W-05', title: 'Password Reset Success', group: 'Auth', story: 'US-AUTH-11' },
  { id: 'W-06', title: 'Overview Dashboard', group: 'Console', story: 'US-ADM-02', navLabel: 'Dashboard' },
  { id: 'W-07', title: 'Global Incident Alert Overlay', group: 'Console', story: 'US-ADM-03' },
  { id: 'W-08', title: 'Incidents List (Active & History)', group: 'Console', story: 'US-ADM-04', navLabel: 'Incidents' },
  { id: 'W-09', title: 'Incident Detail Command Card', group: 'Console', story: 'US-ADM-05..09 / 11' },
  { id: 'W-10', title: 'Close Incident Modal Dialog', group: 'Console', story: 'US-ADM-10' },
  { id: 'W-11', title: 'Notify Authorities Dialog (Phase 2)', group: 'Console', story: 'US-ADM-12' },
  { id: 'W-12', title: 'Panels Directory (Read-Only)', group: 'Console', story: 'US-ADM-13', navLabel: 'Panels (Read-Only)' },
  { id: 'W-13', title: 'Panel & Customer Full Record', group: 'Console', story: 'US-ADM-14..16' },
  { id: 'W-14', title: 'Customers Directory', group: 'Console', story: 'US-ADM-17', navLabel: 'Customers' },
  { id: 'W-15', title: 'Offline & Faults Monitor', group: 'Console', story: 'US-ADM-18..19', navLabel: 'Offline & Faults' },
  { id: 'W-16', title: 'Immutable Legal Audit Log', group: 'Console', story: 'US-ADM-20', navLabel: 'Audit Log' },
  { id: 'W-17', title: 'Admin Notifications Center', group: 'Console', story: 'US-ADM-21', navLabel: 'Notifications' },
  { id: 'W-18', title: 'Operators, Roles & Shifts (P2)', group: 'Console', story: 'US-ADM-22..23', navLabel: 'Operators (P2)' },
  { id: 'W-19', title: 'Admin Console Settings', group: 'Console', story: 'US-ADM-24..26', navLabel: 'Settings' },
  { id: 'W-20', title: 'Error & Lost Connection States', group: 'Console', story: 'US-ADM-27' },
  { id: 'W-21', title: 'Master Layout Shell & States', group: 'Console', story: 'US-ADM-01' },
];
