// ============================================================================
// Smart Fire Alarm System — Live Application & Telemetry Context
// Connects React Native (Expo Go Android/iOS, Tablet, Web) to Node.js + SQL Backend
// ============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

function resolveApiBaseUrl() {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:4000/api`;
  }
  // Physical phone on Expo Go over Wi-Fi LAN (PC IP: 192.168.10.31)
  return 'http://192.168.10.31:4000/api';
}

const DEFAULT_API_BASE = resolveApiBaseUrl();

const AppContext = createContext(null);

// Synthesize emergency fire alarm beep on Web / Browser (US-ADM-03, US-SET-03, US-ADM-25)
export function playEmergencyTone(type = 'fire') {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type === 'fire' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(type === 'fire' ? 880 : 587, ctx.currentTime);
    if (type === 'fire') {
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.18);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.35);
    }
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.42);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
  } catch {
    // Browser audio may require initial user interaction
  }
}

export function AppProvider({ children }) {
  const [apiBase] = useState(DEFAULT_API_BASE);
  const [serverConnected, setServerConnected] = useState(true);
  const [simulatedNoInternet, setSimulatedNoInternet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Selected User ID & Panel ID for Homeowner App
  const [currentUserId, setCurrentUserId] = useState(2);
  const [selectedPanelId, setSelectedPanelId] = useState(1);

  // Bootstrapped SQL Data
  const [mobileData, setMobileData] = useState(null);
  const [adminData, setAdminData] = useState(null);

  // Active Push Notification Banner on Mobile (N-01..N-05)
  const [activePushBanner, setActivePushBanner] = useState(null);

  const showToast = useCallback((message, tone = 'success') => {
    setToast({ message, tone, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 3200 ? null : prev));
    }, 3400);
  }, []);

  const fetchAllData = useCallback(async (uid = currentUserId, pid = selectedPanelId) => {
    if (simulatedNoInternet) {
      setServerConnected(false);
      return;
    }
    try {
      const [mobRes, admRes] = await Promise.all([
        fetch(`${apiBase}/mobile/bootstrap?userId=${uid}${pid ? `&panelId=${pid}` : ''}`),
        fetch(`${apiBase}/admin/bootstrap`),
      ]);
      if (mobRes.ok) {
        const mJson = await mobRes.json();
        setMobileData(mJson);
      }
      if (admRes.ok) {
        const aJson = await admRes.json();
        setAdminData(aJson);
      }
      setServerConnected(true);
    } catch {
      setServerConnected(false);
    }
  }, [apiBase, currentUserId, selectedPanelId, simulatedNoInternet]);

  useEffect(() => {
    fetchAllData(currentUserId, selectedPanelId);
    const interval = setInterval(() => {
      fetchAllData(currentUserId, selectedPanelId);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchAllData, currentUserId, selectedPanelId]);

  // Connect to SSE stream on Web for instant sub-second telemetry updates (SYS-15)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined' || !window.EventSource) return;
    let es;
    try {
      es = new window.EventSource(`${apiBase}/stream`);
      es.onmessage = () => {
        fetchAllData(currentUserId, selectedPanelId);
      };
      es.onerror = () => {
        // Polling fallback handles reconnect seamlessly
      };
    } catch {
      // Ignore if SSE unsupported
    }
    return () => {
      if (es) es.close();
    };
  }, [apiBase, currentUserId, selectedPanelId, fetchAllData]);

  // Generic API helper
  const apiRequest = useCallback(async (endpoint, method = 'POST', body = {}) => {
    if (simulatedNoInternet) {
      showToast('No internet connection. Check Wi-Fi or mobile data.', 'danger');
      throw new Error('No internet connection');
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'GET' ? undefined : JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Request failed', 'danger');
        throw new Error(data.error || 'Request failed');
      }
      if (data.bootstrap) setMobileData(data.bootstrap);
      if (data.mobileBootstrap) setMobileData(data.mobileBootstrap);
      if (data.adminBootstrap) setAdminData(data.adminBootstrap);
      await fetchAllData(currentUserId, selectedPanelId);
      return data;
    } finally {
      setLoading(false);
    }
  }, [apiBase, simulatedNoInternet, showToast, fetchAllData, currentUserId, selectedPanelId]);

  const value = {
    apiBase,
    serverConnected: serverConnected && !simulatedNoInternet,
    simulatedNoInternet,
    setSimulatedNoInternet,
    loading,
    toast,
    showToast,
    currentUserId,
    setCurrentUserId,
    selectedPanelId,
    setSelectedPanelId,
    mobileData,
    adminData,
    activePushBanner,
    setActivePushBanner,
    refreshData: () => fetchAllData(currentUserId, selectedPanelId),
    apiRequest,
    playEmergencyTone,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
