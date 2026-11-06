# fire-alarm-frontend

**Smart Fire Alarm System — Unified React Native (Expo SDK 58) & React Native Web Frontend**

This repository implements all **77 Figma UI screens** for the **Smart Fire Alarm System (`v0.1`)** across Web, Android, iOS, and Tablet form factors:
- **Web View (`http://localhost:8081`)**: Renders the **24/7 Central Admin Monitoring Console (`W-01`–`W-21`)**.
- **Mobile & Tablet App (Expo Go on Android & iOS)**: Renders the **Homeowner User Application (`M-01`–`M-51`)** and **Push Notification States (`N-01`–`N-05`)** with adaptive phone (`1-column`) and tablet (`2-column`) layouts.

---

## 🚀 Quick Start

> **Prerequisite**: Ensure the SQL Backend (`fire-alarm-backend`) is running on `http://localhost:4000`.

```bash
# 1. Install dependencies (Expo SDK 58 / React Native 0.88 / React 19)
npm install

# 2. Start Expo Metro Bundler (Web + Android + iOS)
npx expo start
```

- **Open Web Admin Console**: Visit **`http://localhost:8081`** in your desktop browser (or press `w` in the Expo terminal).
- **Open Mobile Homeowner App**: Scan the QR code in the terminal using **Expo Go (SDK 58)** on your Android or iOS phone/tablet.

---

## 🖥️ Platform Separation & Screen Coverage (All 77 Screens)

### 1. Web Admin Monitoring Console (`W-01`–`W-21`) — [`src/admin/AdminConsoleApp.js`](./src/admin/AdminConsoleApp.js)
- **Authentication (`W-01`–`W-05`)**:
  - `W-01`: Operator & Admin Sign In (`admin@smartfire.pk` / `Admin@123`) with 5-attempt lockout & no self-registration policy (`US-AUTH-02`, `US-AUTH-03`)
  - `W-02`–`W-05`: Forgot Password, 6-Digit OTP Verification, Reset Password, and Reset Complete
- **Dashboard & Live Incident Response (`W-06`–`W-11`)**:
  - `W-06`: System Monitoring Dashboard (6 KPI cards, Live Active Fire Incidents queue, and Real-Time Activity Stream)
  - `W-07`: Global Incident Alert Overlay Modal (`764px` emergency modal with repeating siren, exact alarm zone, and instant acknowledge)
  - `W-08`: Incidents Management List (`Active Incidents` & `Incident History` tabs with search & status filters)
  - `W-09`: Incident Detail Command Card (Live `1-Min Action SLA` & `5-Min Decision` timers, GPS coordinates, manual call logger, read-only floor sensors, and permanent immutable notes)
  - `W-10`: Close Incident Confirmation Modal (Outcome selector + mandatory written reason counter)
  - `W-11`: Notify Emergency Authorities (Rescue 1122 Phase 2 payload preview)
- **Panels, Customers, Faults, Audit & Settings (`W-12`–`W-21`)**:
  - `W-12` & `W-13`: Registered Panels Directory & Read-Only Panel/Customer Full Record
  - `W-14`: Customers Directory (including retained anonymized deleted records)
  - `W-15`: Offline Panels & Sensor Faults Monitor
  - `W-16`: Immutable Legal Audit Log
  - `W-17`: Admin Notifications Center
  - `W-18`: Operators, Roles & 8-Hour Shifts (Phase 2)
  - `W-19`: Admin Console & SLA Timer Settings
  - `W-20` & `W-21`: System Error / Connection Recovery States & Master Layout Shell

### 2. Mobile & Tablet Homeowner App (`M-01`–`M-51` + `N-01`–`N-05`) — [`src/mobile/MobileUserApp.js`](./src/mobile/MobileUserApp.js)
- **Launch & Authentication (`M-01`–`M-10`)**:
  - `M-01` & `M-02`: Splash Screen (with automatic session routing) & 3-Slide Onboarding Carousel
  - `M-03`–`M-10`: Login (`husnain.aslam@gmail.com` / `Password123`), Sign Up, 6-Digit OTP Verification, Forgot/Reset Password, and Account Lockout
- **Onboarding, Panel Pairing & Wi-Fi Provisioning (`M-11`–`M-22`)**:
  - Profile setup, Location & GPS pin confirmation, QR Code Scanner / Manual Panel ID entry, SoftAP Wi-Fi provisioning, and Onboarding Summary
- **Home Dashboard, Floors, Sensors & Self-Test (`M-23`–`M-35`)**:
  - `M-23`: Protected / Fire Alarm Active Home Dashboard with multi-location switcher
  - `M-24`–`M-29`: Household Floors list, Add/Rename/Delete Floor, and Floor Detail sensor inventory
  - `M-30`–`M-34`: Pair New Sensor, Name & Assign Floor, Sensor Detail, Move Sensor, and Remove Sensor
  - `M-35`: System Diagnostic Self-Test Progress & Per-Sensor Results
- **Full-Screen Emergency Fire Alert & History (`M-36`–`M-41`)**:
  - `M-36`–`M-38`: Full-Screen Red Fire Alarm Alert, Silence Panel Siren Confirmation, and All Clear Screen
  - `M-39`–`M-41`: Notification Center, Event History Timeline (with filters), and Event Detail
- **Settings, Privacy & Push Previews (`M-42`–`M-51`, `N-01`–`N-05`)**:
  - Account Settings, Edit Profile, Change Password, Notification Preferences, Panel Wi-Fi Update, Delete Account (`DELETE` confirmation), Privacy Policy, Terms of Use, Offline Reconnect States, and Push Notification Banners (`N-01`–`N-05`).

---

## 🔗 Live Backend Connection (`src/context/AppContext.js`)

- **Web Browser**: Automatically connects to `http://<hostname>:4000/api` and listens to `/api/stream` (SSE) for sub-second updates.
- **Physical Phone / Tablet (Expo Go)**: Connects over Wi-Fi LAN (`http://192.168.10.31:4000/api`) with automatic polling fallback so actions on the Mobile App immediately reflect on the Web Admin Console and vice versa.
