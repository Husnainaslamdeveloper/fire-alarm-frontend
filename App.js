// ============================================================================
// Smart Fire Alarm System — Universal Cross-Platform Root Entry (App.js)
// • Web View (Platform.OS === 'web', http://localhost:8081):
//     Renders ONLY the Admin Monitoring Console (W-01..W-21)
// • Mobile & Tablet App (Android / iOS via Expo Go):
//     Renders ONLY the Homeowner User App (M-01..M-51, N-01..N-05)
// ============================================================================

import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Platform } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import AdminConsoleApp from './src/admin/AdminConsoleApp';
import MobileUserApp from './src/mobile/MobileUserApp';
import { COLORS } from './src/theme/tokens';

export default function App() {
  const isWeb = Platform.OS === 'web';

  return (
    <AppProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.bgCanvas} />
        {isWeb ? <AdminConsoleApp /> : <MobileUserApp />}
      </SafeAreaView>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bgCanvas,
  },
});
