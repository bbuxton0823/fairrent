'use client';

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from 'next-themes';
import { ReactNode } from 'react';

export function ThemeProvider({ children, ...props }: { children: ReactNode } & Omit<ThemeProviderProps, 'children'>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 