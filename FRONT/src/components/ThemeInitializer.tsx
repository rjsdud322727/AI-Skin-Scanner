'use client';
import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';

const ThemeInitializer = () => {
  const { theme } = useThemeStore();
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  return null;
};

export default ThemeInitializer; 