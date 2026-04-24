import React, { createContext, useContext, ReactNode } from 'react';

export const theme = {
  colors: {
    primary: '#FF8FAB',
    primaryDark: '#E8778A',
    primaryLight: '#FFB6C8',
    secondary: '#FFD1DC',
    accent: '#FF7B9C',
    warm: '#FF6B8A',
    white: '#FFFFFF',
    background: '#FFF5F7',
    card: '#FFFFFF',
    text: '#4A3728',
    textSecondary: '#8B7355',
    textLight: '#B8A090',
    border: '#FFE4E8',
    success: '#FF8FAB',
    shadow: 'rgba(255, 126, 158, 0.15)',
    overlay: 'rgba(0,0,0,0.3)',
    inputBg: '#FFF0F3',
    tabBarBg: '#FFFFFF',
    tabBarBorder: '#FFE4E8',
  },
  shadows: {
    card: {
      shadowColor: '#FFB6C8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
    button: {
      shadowColor: '#FF8FAB',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
  },
  borderRadius: {
    sm: 12, md: 16, lg: 24, xl: 32, full: 9999,
  },
};

export type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return React.createElement(ThemeContext.Provider, { value: theme }, children);
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
