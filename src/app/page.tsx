"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { useLocation } from '@/components/LocationContext';
import { Badge } from '@/components/ui/Badge';
import { getLiveWeather, RealTimeWeather } from '@/lib/api';
import { LiveAgriTicker } from '@/components/LiveAgriTicker';
import {
  Sun,
  Bug,
  FileText,
  Users,
  ShieldCheck,
  TestTube,
  Droplets,
  Calendar,
  MapPin,
  CloudRain,
  Wind,
  TrendingUp,
} from 'lucide-react';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function HomePage() {
  const { t } = useLanguage();
  const { location } = useLocation();
  const [liveWeather, setLiveWeather] = useState<RealTimeWeather | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      const data = await getLiveWeather(location.lat, location.lng, location.name, location.district);
      setLiveWeather(data);
    }
    fetchWeather();
  }, [location]);

  return (
    <div className="space-y-5">
      {/* 1. HOME HERO: Farmer Intelligence Dashboard Layered Composition */}
      <AuroraBackground className="p-4 sm:p-7 border border-[#2D572C]/40 rounded-2xl shadow-md">
        <div className="space-y-4">
          {/* Header Metadata & Location */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-300" />
                ICAR & TNAU Verified Advisory
              </Badge>
              <span className="text-xs font-semibold text-emerald-200/90 flex items-center gap-1 bg-[#1B431C]/80 px-2 py-0.5 rounded border border-emerald-400/20">
                <MapPin className="w-3 h-3 text-amber-300" />
                {liveWeather ? `${liveWeather.locationName} (${liveWeather.district})` : `${location.name} (${location.district})`}
              </span>
            </div>
            <span className="text-[11px] font-medium text-emerald-200/70">
              Updated Today • Real-Time Agriculture Intelligence
            </span>
          </div>

          {/* Title & Short Farming Message */}
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              {t.home.title}
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed font-medium">
              Real-time weather radar, AI crop profitability advisor, disease scanner & live government subsidies.
            </p>
          </div>

          {/* Primary & Secondary Action Controls */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/crop-advisor"
              prefetch={true}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm min-h-[44px]"
            >
              <TrendingUp className="w-4 h-4 text-slate-950" />
              <span>AI Crop Advisor</span>
            </Link>

            <Link
              href="/water-table"
              prefetch={true}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition flex items-center gap-2 text-sm min-h-[44px]"
            >
              <Droplets className="w-4 h-4 text-cyan-200" />
              <span>Groundwater Radar</span>
            </Link>

            <Link
              href="/pests"
              prefetch={true}
              className="bg-[#1B431C]/90 hover:bg-[#2D572C] text-white font-semibold px-4 py-2.5 rounded-xl border border-emerald-400/30 transition flex items-center gap-2 text-sm min-h-[44px]"
            >
              <Bug className="w-4 h-4 text-amber-300" />
              <span>{t.home.pestScanBtn}</span>
            </Link>
          </div>
        </div>
      </AuroraBackground>

      {/* 2. REAL-TIME LIVE AGRI NEWS & MANDI MARKET TICKER */}
      <LiveAgriTicker />

      {/* 3. REAL-TIME LIVE WEATHER INFORMATION STRIP */}
      <section className="bg-slate-900 border border-stone-800 text-white rounded-xl p-3.5 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs pb-1 border-b border-stone-800">
          <span className="font-bold text-amber-400 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-300" />
            Live Weather Intelligence Strip (Real-Time Open-Meteo API)
          </span>
          <span className="text-[11px] text-slate-400">
            {liveWeather ? `${liveWeather.locationName} Weather Station` : `${location.name} Weather Station`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs pt-1">
          {/* Temperature */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-medium text-slate-400 block uppercase">Temperature</span>
            <div className="text-lg font-bold text-amber-400">
              {liveWeather ? `${liveWeather.temp}°C` : '32°C'}
            </div>
            <span className="text-[10px] text-slate-400 block">
              Feels like {liveWeather ? `${liveWeather.feelsLike}°C` : '34°C'}
            </span>
          </div>

          {/* Rain Probability */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-medium text-slate-400 block uppercase">Rain Chance</span>
            <div className="text-lg font-bold text-cyan-400 flex items-center justify-center gap-1">
              <CloudRain className="w-3.5 h-3.5" /> {liveWeather ? `${liveWeather.rainProbability}%` : '12%'}
            </div>
            <span className="text-[10px] text-emerald-400 block font-medium">
              {liveWeather && liveWeather.rainProbability > 30 ? 'Rain Expected' : 'Low Rain Risk'}
            </span>
          </div>

          {/* Humidity */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-medium text-slate-400 block uppercase">Humidity</span>
            <div className="text-lg font-bold text-teal-400">
              {liveWeather ? `${liveWeather.humidity}%` : '68%'}
            </div>
            <span className="text-[10px] text-slate-400 block">Optimal Soil Moisture</span>
          </div>

          {/* Wind Speed */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-stone-800 space-y-0.5">
            <span className="text-[10px] font-medium text-slate-400 block uppercase">Wind Speed</span>
            <div className="text-lg font-bold text-slate-200 flex items-center justify-center gap-1">
              <Wind className="w-3.5 h-3.5 text-teal-400" /> {liveWeather ? `${liveWeather.windSpeed} km/h` : '10 km/h'}
            </div>
            <span className="text-[10px] text-slate-400 block">Gentle Breeze</span>
          </div>

          {/* Spray Advisory */}
          <div className="bg-slate-950/80 p-2.5 rounded-lg border border-stone-800 space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-medium text-slate-400 block uppercase">Spray Status</span>
            <div className="text-lg font-bold text-emerald-400">
              {liveWeather ? liveWeather.sprayAdvisory : 'SAFE'}
            </div>
            <span className="text-[10px] text-emerald-400 block font-medium">Verified Window</span>
          </div>
        </div>
      </section>

      {/* 4. QUICK FARMING TOOLS GRID */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-base text-white tracking-tight">Quick Farming Tools</h2>
          <span className="text-xs text-slate-400 font-medium">ICAR & TNAU Standard Rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {/* AI Crop Recommendation & Profitability Predictor */}
          <Link
            href="/crop-advisor"
            prefetch={true}
            className="bg-white border border-amber-300 hover:border-amber-500 p-4 rounded-xl shadow-sm hover:shadow transition group flex flex-col justify-between min-h-[110px] space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase tracking-wider bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                AI PROFIT ENGINE
              </span>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-800">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-800 transition">
                {(t.home as any).cropAdvisorBtn || 'AI Crop Recommendation'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Top 3 profitable crops & yield predictor</p>
            </div>
          </Link>

          {/* Interactive Crop Calendar & Task Reminder */}
          <Link
            href="/crop-calendar"
            prefetch={true}
            className="bg-white border border-emerald-300 hover:border-emerald-500 p-4 rounded-xl shadow-sm hover:shadow transition group flex flex-col justify-between min-h-[110px] space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                DAY-BY-DAY TASK REMINDER
              </span>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-emerald-800">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#2D572C] transition">
                {(t.nav as any).cropCalendar || 'Interactive Crop Calendar'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Sowing-to-harvest day-by-day task schedule</p>
            </div>
          </Link>

          {/* Groundwater Level & Borewell Radar */}
          <Link
            href="/water-table"
            prefetch={true}
            className="bg-white border border-cyan-300 hover:border-cyan-500 p-4 rounded-xl shadow-sm hover:shadow transition group flex flex-col justify-between min-h-[110px] space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-cyan-900 uppercase tracking-wider bg-cyan-100 border border-cyan-300 px-2 py-0.5 rounded">
                HYDRO RADAR
              </span>
              <div className="bg-cyan-50 p-2 rounded-lg border border-cyan-200 text-cyan-800">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-800 transition">
                {(t.home as any).waterTableBtn || 'Groundwater & Borewell Radar'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Water table depth & farm pond calculator</p>
            </div>
          </Link>

          {/* Soil & Fertilizer Calculator */}
          <Link
            href="/soil-calculator"
            prefetch={true}
            className="bg-white border border-stone-200/80 hover:border-emerald-600/60 p-4 rounded-xl shadow-sm hover:shadow transition group flex flex-col justify-between min-h-[110px] space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                ICAR RDF
              </span>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200/60 text-emerald-800">
                <TestTube className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#2D572C] transition">
                {t.home.soilBtn}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Exact Urea, DAP & MOP calculator</p>
            </div>
          </Link>

          {/* Smart Irrigation */}
          <Link
            href="/irrigation"
            prefetch={true}
            className="bg-white border border-stone-200/80 hover:border-cyan-600/60 p-4 rounded-xl shadow-sm hover:shadow transition group flex flex-col justify-between min-h-[110px] space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-cyan-800 uppercase tracking-wider bg-cyan-50 border border-cyan-200/60 px-2 py-0.5 rounded">
                FAO-56 Water Guide
              </span>
              <div className="bg-cyan-50 p-2 rounded-lg border border-cyan-200/60 text-cyan-800">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-800 transition">
                {t.home.irrigationBtn}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Drip run time & rain warning</p>
            </div>
          </Link>

          {/* Government Schemes */}
          <Link
            href="/schemes"
            prefetch={true}
            className="bg-white border border-stone-200/80 hover:border-emerald-600/60 p-4 rounded-xl shadow-sm hover:shadow transition group flex flex-col justify-between min-h-[110px] space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                Live Grants
              </span>
              <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200/60 text-emerald-800">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#2D572C] transition">
                {t.home.schemesBtn}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">PM-KISAN, PM-KUSUM & Grants</p>
            </div>
          </Link>

          {/* Farmer Community */}
          <Link
            href="/community"
            prefetch={true}
            className="bg-white border border-stone-200/80 hover:border-indigo-600/60 p-4 rounded-xl shadow-sm hover:shadow transition group flex flex-col justify-between min-h-[110px] space-y-2"
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded">
                Discussions
              </span>
              <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200/60 text-indigo-800">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-800 transition">
                {t.home.communityBtn}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Farmer-to-farmer Q&A</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
