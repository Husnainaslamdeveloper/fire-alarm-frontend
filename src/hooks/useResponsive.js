// ============================================================================
// Smart Fire Alarm System — Cross-Platform Responsive Hook
// Supports Android/iOS Phones, iPads & Android Tablets, Laptops & Desktops
// ============================================================================

import { useWindowDimensions, Platform } from 'react-native';

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  const isPhone = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isLaptop = width >= 1024 && width < 1280;
  const isDesktop = width >= 1280;
  const isTabletOrLarger = width >= 768;
  const isDesktopOrLaptop = width >= 1024;
  const isLandscape = width > height;

  return {
    width,
    height,
    platform: Platform.OS,
    isWeb: Platform.OS === 'web',
    isPhone,
    isTablet,
    isLaptop,
    isDesktop,
    isTabletOrLarger,
    isDesktopOrLaptop,
    isLandscape,
    // Mobile/Tablet User App adaptive values
    mobileContainerMaxWidth: isTabletOrLarger ? 920 : 480,
    mobileGridColumns: isTabletOrLarger ? 2 : 1,
    mobilePadding: isTabletOrLarger ? 24 : 16,
    // Web Admin Console adaptive values
    adminSidebarCompact: width < 1080,
    adminKpiColumns: isDesktop ? 6 : isLaptop ? 3 : 2,
    adminDetailColumns: isDesktop ? 3 : isTabletOrLarger ? 2 : 1,
  };
}
