import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RM Retraining | Urban Company',
  description: 'Sales consultation training platform for Urban Company Relationship Managers',
  robots: 'noindex, nofollow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
