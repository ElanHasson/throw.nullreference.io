'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps as NextThemesProviderProps,
} from 'next-themes'

export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren<Omit<NextThemesProviderProps, 'children'>>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
