"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { useLocation, PRESET_LOCATIONS, LocationData } from './LocationContext';
import {
  Sprout,
  Sun,
  Bug,
  FileText,
  Users,
  Globe,
  TrendingUp,
  Droplets,
  Calendar,
  MapPin,
  Search,
  Crosshair,
  Check,
  X,
  TestTube,
  Phone,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { location, setLocation, isDetecting, detectLocation } = useLocation();
  const pathname = usePathname();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Primary desktop navigation links
  const primaryNavLinks = [
    { href: '/', label: t.nav.home, icon: Sprout },
    { href: '/crop-advisor', label: (t.nav as any).cropAdvisor || 'Crop Advisor', icon: TrendingUp },
    { href: '/crop-calendar', label: (t.nav as any).cropCalendar || 'Calendar', icon: Calendar },
    { href: '/water-table', label: (t.nav as any).waterTable || 'Groundwater', icon: Droplets },
    { href: '/weather', label: t.nav.weather, icon: Sun },
    { href: '/pests', label: t.nav.pests, icon: Bug },
    { href: '/schemes', label: t.nav.schemes, icon: FileText },
  ];

  // Secondary "More Tools" navigation links
  const moreNavLinks = [
    { href: '/soil-calculator', label: t.nav.soil, icon: TestTube, desc: 'ICAR NPK Fertilizer Dosage' },
    { href: '/irrigation', label: t.nav.irrigation, icon: Droplets, desc: 'Smart Drip Run-Time' },
    { href: '/community', label: t.nav.community, icon: Users, desc: 'Farmer Q&A Discussion' },
    { href: '/helpline', label: (t.nav as any).helpline || 'Helpline', icon: Phone, desc: 'Kisan & KVK Support' },
  ];

  const isMoreActive = moreNavLinks.some((l) => pathname === l.href);

  // Debounced location search to eliminate unnecessary network latency
  const handleSearchLocation = (query: string) => {
    setSearchQuery(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=6&language=en&format=json`
        );
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const formatted: LocationData[] = data.results.map((item: any) => ({
            id: item.id || `${item.name}-${item.latitude}`,
            name: item.name,
            district: item.admin2 || item.admin1 || '',
            admin1: item.admin1 || '',
            country: item.country || 'India',
            lat: item.latitude,
            lng: item.longitude,
          }));
          setSearchResults(formatted);
        } else {
          const q = query.toLowerCase();
          setSearchResults(
            PRESET_LOCATIONS.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.district.toLowerCase().includes(q)
            )
          );
        }
      } catch (e) {
        const q = query.toLowerCase();
        setSearchResults(
          PRESET_LOCATIONS.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.district.toLowerCase().includes(q)
          )
        );
      } finally {
        setIsSearching(false);
      }
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const selectAndClose = (loc: LocationData) => {
    setLocation(loc);
    setIsLocationModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <header className="bg-slate-950/98 border-b border-[#2D572C]/40 text-white sticky top-0 z-50 shadow-md transform-gpu">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base sm:text-lg tracking-tight flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-md"
          >
            <div className="bg-[#2D572C] p-1.5 rounded-lg text-white shadow-sm border border-emerald-400/20 group-hover:bg-[#38761D] transition">
              <Sprout className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="text-white font-extrabold tracking-tight hidden min-[360px]:inline">
              Kisan Mitra <span className="text-[10px] sm:text-xs font-semibold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 ml-0.5">AGRI-AI</span>
            </span>
          </Link>

          {/* Desktop Product Navigation */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-0.5">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={true}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition duration-150 ${
                    isActive
                      ? 'bg-[#2D572C]/40 text-emerald-300 font-bold border-b-2 border-emerald-400'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* "More Tools" Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                onBlur={() => setTimeout(() => setIsMoreOpen(false), 200)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition duration-150 ${
                  isMoreActive
                    ? 'bg-[#2D572C]/40 text-emerald-300 font-bold border-b-2 border-emerald-400'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{language === 'ta' ? 'கூடுதல்' : 'More Tools'}</span>
                <ChevronDown className={`w-3 h-3 text-emerald-400 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-slate-900 border border-emerald-500/40 rounded-xl shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in duration-150">
                  {moreNavLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        prefetch={true}
                        onClick={() => setIsMoreOpen(false)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg text-xs transition ${
                          isActive
                            ? 'bg-[#2D572C] text-white font-bold'
                            : 'text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="block font-bold">{link.label}</span>
                          <span className="text-[10px] text-slate-400 block">{link.desc}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Section: Dynamic Location Chip + Language Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Location Selector Button */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 rounded-lg px-2.5 py-1 text-xs font-semibold text-emerald-300 transition shadow-sm active:scale-95"
              title="Change your village or location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
              <span className="truncate max-w-[90px] sm:max-w-[140px] text-white">
                {location.name.split(' ')[0]}
              </span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-slate-900 border border-stone-800 rounded-lg p-0.5 flex-shrink-0 text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-400 ml-1 hidden sm:inline" />
              <button
                onClick={() => setLanguage('en')}
                aria-label="Switch language to English"
                className={`px-2 py-1 text-[11px] font-bold rounded transition duration-150 ${
                  language === 'en'
                    ? 'bg-[#2D572C] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={() => setLanguage('ta')}
                aria-label="Switch language to Tamil"
                className={`px-2 py-1 text-[11px] font-bold rounded transition duration-150 ${
                  language === 'ta'
                    ? 'bg-[#2D572C] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Global Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 max-w-md w-full shadow-2xl text-white space-y-4 relative">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-base text-white">
                  {language === 'ta' ? 'உங்கள் இடத்தை மாற்றவும்' : 'Select Your Village or City'}
                </h3>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* GPS Auto-Detect Button */}
            <button
              onClick={() => {
                detectLocation();
                setIsLocationModalOpen(false);
              }}
              disabled={isDetecting}
              className="w-full bg-[#1B431C] hover:bg-[#2D572C] text-emerald-300 font-bold py-2.5 px-3 rounded-xl border border-emerald-500/40 transition flex items-center justify-center gap-2 text-xs"
            >
              <Crosshair className={`w-4 h-4 text-emerald-400 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting GPS Location...' : 'Use My GPS Current Location'}</span>
            </button>

            {/* Open Search Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchLocation(e.target.value)}
                placeholder="Type any village, town, or district in TN..."
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
              />
              <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
              {isSearching && (
                <div className="absolute right-3 top-3 w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {/* Search Results / Suggestions */}
            {searchResults.length > 0 ? (
              <div className="space-y-1 max-h-48 overflow-y-auto divide-y divide-slate-800 bg-slate-950 rounded-xl p-2 border border-slate-800">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => selectAndClose(item)}
                    className="w-full text-left p-2 hover:bg-slate-900 rounded-lg transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.district || item.admin1}</span>
                    </div>
                    {location.lat === item.lat && location.lng === item.lng && (
                      <Check className="w-4 h-4 text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              /* Preset Locations Grid */
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Popular Agricultural Centers:
                </span>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {PRESET_LOCATIONS.map((preset) => {
                    const isSelected = location.lat === preset.lat && location.lng === preset.lng;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => selectAndClose(preset)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#2D572C] text-white border-emerald-400 font-bold shadow-md'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <span className="font-bold block text-xs">{preset.name.split(' ')[0]}</span>
                          <span className="text-[10px] text-slate-400">{preset.district}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
