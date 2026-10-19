"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import {
  Sprout,
  Sun,
  Bug,
  Droplets,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  MoreHorizontal,
  TestTube,
  Phone,
  X,
} from 'lucide-react';

export const BottomNav = React.memo(function BottomNav() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainTabs = [
    { href: '/', label: t.nav.home, icon: Sprout },
    { href: '/crop-advisor', label: (t.nav as any).cropAdvisor || 'Advisor', icon: TrendingUp },
    { href: '/crop-calendar', label: (t.nav as any).cropCalendar || 'Calendar', icon: Calendar },
    { href: '/water-table', label: (t.nav as any).waterTable || 'Water', icon: Droplets },
    { href: '/weather', label: t.nav.weather, icon: Sun },
    { href: '/pests', label: t.nav.pests, icon: Bug },
  ];

  const extraTabs = [
    { href: '/schemes', label: t.nav.schemes, icon: FileText, desc: 'PM-KISAN & Grants' },
    { href: '/soil-calculator', label: t.nav.soil, icon: TestTube, desc: 'NPK Fertilizer Dose' },
    { href: '/irrigation', label: t.nav.irrigation, icon: Droplets, desc: 'Drip Run-Time' },
    { href: '/community', label: t.nav.community, icon: Users, desc: 'Farmer Discussions' },
    { href: '/helpline', label: (t.nav as any).helpline || 'Helpline', icon: Phone, desc: '24/7 Kisan Helpline' },
  ];

  const isExtraActive = extraTabs.some((tab) => pathname === tab.href);

  return (
    <>
      {/* Mobile "More Tools" Slide-up Drawer */}
      {isMoreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-150"
          onClick={() => setIsMoreOpen(false)}
        >
          <div
            className="bg-slate-900 border-t border-emerald-500/40 rounded-t-3xl p-5 pb-8 space-y-4 max-w-md mx-auto w-full shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="font-extrabold text-sm text-white flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-400" />
                {language === 'ta' ? 'அனைத்து விவசாயக் கருவிகள்' : 'All Farming Tools & Services'}
              </span>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {extraTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    prefetch={true}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs transition ${
                      isActive
                        ? 'bg-[#2D572C] text-white border-emerald-400 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-200 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-sm">{tab.label}</span>
                      <span className="text-[11px] text-slate-400">{tab.desc}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/98 border-t border-emerald-500/40 z-40 shadow-xl pb-safe transform-gpu">
        <div className="flex justify-around items-center h-14 px-1 max-w-md mx-auto">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                prefetch={true}
                className={`flex flex-col items-center justify-center flex-1 h-full min-w-[40px] transition-all duration-150 active:scale-90 ${
                  isActive
                    ? 'text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-emerald-300'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[9px] min-[380px]:text-[10px] mt-0.5 truncate max-w-[50px] text-center leading-tight font-semibold tracking-tight">
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* "More" Tab */}
          <button
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`flex flex-col items-center justify-center flex-1 h-full min-w-[40px] transition-all duration-150 active:scale-90 ${
              isExtraActive || isMoreOpen
                ? 'text-emerald-300 font-bold'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-all ${
                isExtraActive || isMoreOpen
                  ? 'bg-emerald-500/20 text-emerald-400 scale-110 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                  : ''
              }`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </div>
            <span className="text-[9px] min-[380px]:text-[10px] mt-0.5 truncate max-w-[50px] text-center leading-tight font-semibold tracking-tight">
              {language === 'ta' ? 'கூடுதல்' : 'More'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
});
