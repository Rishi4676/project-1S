import type { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import { BackgroundVideo } from '@/components/BackgroundVideo';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kisan Mitra — Farmer Advisory & AI Agri Portal',
  description: 'Real-time weather radar, AI crop recommendation, disease scanner & live government subsidies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="text-slate-900 min-h-screen font-sans antialiased relative bg-slate-900 overflow-x-hidden">
        {/* Memoized Hardware-Accelerated Background Video Layer */}
        <BackgroundVideo />

        {/* Client Providers & Main Shell */}
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
