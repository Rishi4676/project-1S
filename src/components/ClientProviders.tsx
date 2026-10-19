"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { LanguageProvider } from '@/components/LanguageContext';
import { LocationProvider } from '@/components/LocationContext';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { PageTransition } from '@/components/PageTransition';

const DynamicAgriChatbot = dynamic(
  () => import('@/components/AgriChatbot').then((mod) => mod.AgriChatbot),
  { ssr: false }
);

export const ClientProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <LocationProvider>
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 flex-1 w-full pb-20 md:pb-8">
            <PageTransition>{children}</PageTransition>
          </main>
          <BottomNav />
          <DynamicAgriChatbot />
        </div>
      </LocationProvider>
    </LanguageProvider>
  );
};
