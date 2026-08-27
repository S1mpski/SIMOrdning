import type { Metadata } from 'next';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import AppThemeProvider from '@/components/providers/theme-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'SIMOrdning',
  description: 'Bokföringsprogram för SIMOrdning',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='sv'>
      <body>
        <AppRouterCacheProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
