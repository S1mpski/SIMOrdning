import type { Metadata } from 'next';

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
      <body>{children}</body>
    </html>
  );
}
