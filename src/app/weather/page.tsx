"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { useLocation, LocationData, PRESET_LOCATIONS } from '@/components/LocationContext';
import { Badge } from '@/components/ui/Badge';
import { getLiveWeather } from '@/lib/api';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  MapPin,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Satellite,
  Loader2,
} from 'lucide-react';

export default function WeatherPage() {
  const { t } = useLanguage();
  const { location, setLocation } = useLocation();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<LocationData>(location);
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [mapMode, setMapMode] = useState<'k' | 'm'>('k');
  const [zoomLevel] = useState<number>(13);
  const [isMapMounted, setIsMapMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMapMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [weatherData, setWeatherData] = useState<{
    temp: number;
    humidity: number;
    wind: number;
    rainProb: number;
    condition: string;
    forecast: { day: string; temp: number; rainProb: number }[];
  }>({
    temp: 32,
    humidity: 68,
    wind: 10,
    rainProb: 12,
    condition: 'Sunny & Clear Skies',
    forecast: [
      { day: 'Today', temp: 32, rainProb: 12 },
      { day: 'Tomorrow', temp: 33, rainProb: 15 },
      { day: 'Day 3', temp: 31, rainProb: 20 },
      { day: 'Day 4', temp: 30, rainProb: 25 },
      { day: 'Day 5', temp: 32, rainProb: 10 },
      { day: 'Day 6', temp: 34, rainProb: 5 },
      { day: 'Day 7', temp: 33, rainProb: 10 },
    ],
  });

  useEffect(() => {
    setSelectedPlace(location);
  }, [location]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            searchQuery
          )}&count=8&language=en&format=json`
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
          setSuggestions(formatted);
        } else {
          const q = searchQuery.toLowerCase();
          setSuggestions(
            PRESET_LOCATIONS.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.district.toLowerCase().includes(q)
            )
          );
        }
      } catch (err) {
        const q = searchQuery.toLowerCase();
        setSuggestions(
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

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function fetchLiveWeather() {
      try {
        const data = await getLiveWeather(
          selectedPlace.lat,
          selectedPlace.lng,
          selectedPlace.name,
          selectedPlace.district || selectedPlace.admin1 || ''
        );
        setWeatherData({
          temp: data.temp,
          humidity: data.humidity,
          wind: data.windSpeed,
          rainProb: data.rainProbability,
          condition: data.condition,
          forecast: data.forecast.map((f) => ({
            day: f.day,
            temp: f.tempMax,
            rainProb: f.rainProb,
          })),
        });
      } catch (err) {
        // Fallback
      }
    }
    fetchLiveWeather();
  }, [selectedPlace]);

  const handleSelectPlace = (place: LocationData) => {
    setSelectedPlace(place);
    setLocation(place);
    setSearchQuery('');
    setSuggestions([]);
  };

  const isSafeToSpray = weatherData.rainProb < 20 && weatherData.wind < 15;
  const isClearOrSunny = weatherData.condition.toLowerCase().includes('sunny') || weatherData.condition.toLowerCase().includes('clear');
  const googleMapEmbedUrl = `https://maps.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}&t=${mapMode}&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="space-y-5">
      {/* 1. PRIMARY: Large Current Weather Hero Intelligence Display */}
      <section
        className={`text-white rounded-2xl p-5 sm:p-7 shadow-md transition-all duration-500 space-y-4 ${
          isClearOrSunny
            ? 'bg-gradient-to-r from-amber-950 via-yellow-950/80 to-amber-900/90 border border-amber-500/50 shadow-amber-950/30'
            : 'bg-gradient-to-r from-slate-950 via-[#1B431C] to-slate-900 border border-[#2D572C]/40'
        }`}
      >
        {/* Location Header & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="verified">
              <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-300" />
              Live Village Weather Radar
            </Badge>
            <span className="text-xs font-semibold text-emerald-200 flex items-center gap-1 bg-[#1B431C]/90 px-2.5 py-0.5 rounded border border-emerald-400/30">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              {selectedPlace.name} {selectedPlace.district ? `(${selectedPlace.district})` : ''}
            </span>
          </div>
          <span className="text-[11px] text-emerald-200/70 font-medium">
            Lat: {selectedPlace.lat.toFixed(4)}°, Lng: {selectedPlace.lng.toFixed(4)}°
          </span>
        </div>

        {/* Primary Temperature & Meteorological Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-2">
          {/* Main Temperature Gauge */}
          <div className="space-y-1">
            <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider block">Current Temperature</span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-300 tracking-tight">{weatherData.temp}°C</h1>
              <span className="text-sm text-slate-300 font-medium">Feels like {weatherData.temp + 2}°C</span>
            </div>
            <p className="text-xs text-emerald-100 font-semibold flex items-center gap-1.5 pt-1">
              <Sun className="w-4 h-4 text-amber-400" />
              {weatherData.condition}
            </p>
          </div>

          {/* Key Meteorological Parameters Strip */}
          <div className="grid grid-cols-3 gap-2 col-span-2 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Rain Chance</span>
              <div className="text-base font-extrabold text-cyan-400 flex items-center justify-center gap-1">
                <CloudRain className="w-4 h-4" /> {weatherData.rainProb}%
              </div>
              <span className="text-[10px] text-emerald-300 block">Low Rain Risk</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Humidity</span>
              <div className="text-base font-extrabold text-teal-400 flex items-center justify-center gap-1">
                <Droplets className="w-4 h-4" /> {weatherData.humidity}%
              </div>
              <span className="text-[10px] text-slate-300 block">Soil Moisture</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-500/20 text-center space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Wind Speed</span>
              <div className="text-base font-extrabold text-slate-200 flex items-center justify-center gap-1">
                <Wind className="w-4 h-4 text-teal-400" /> {weatherData.wind} km/h
              </div>
              <span className="text-[10px] text-slate-300 block">Gentle Breeze</span>
            </div>
          </div>
        </div>

        {/* Location Search Bar */}
        <div className="relative pt-2">
          <div className="flex items-center gap-2 border border-emerald-400/40 rounded-xl px-3.5 py-2.5 bg-slate-900/90 text-white">
            <Search className="w-4 h-4 text-emerald-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any village, town, or district in Tamil Nadu..."
              className="w-full text-xs bg-transparent focus:outline-none text-white font-medium placeholder-slate-400"
            />
            {isSearching && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />}
          </div>

          {/* Quick Select Presets */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs pt-2">
            <span className="font-bold text-emerald-300 text-[10px] uppercase">Quick Select:</span>
            {PRESET_LOCATIONS.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectPlace(v)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                  selectedPlace.lat === v.lat && selectedPlace.lng === v.lng
                    ? 'bg-[#2D572C] text-white border-emerald-400'
                    : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {v.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Autocomplete Dropdown */}
          {(suggestions.length > 0 || isSearching) && (
            <div className="absolute top-14 left-0 right-0 bg-slate-950 border border-emerald-500/40 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-800">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPlace(p)}
                  className="w-full text-left p-3 hover:bg-slate-900 transition flex justify-between items-center text-xs"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">{p.name}</span>
                      <span className="text-slate-400 text-[10px]">{[p.district, p.admin1, p.country].filter(Boolean).join(', ')}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">{p.lat.toFixed(2)}°, {p.lng.toFixed(2)}°</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. IMPORTANT: Agricultural Spray Advisory & Farming Impact */}
      <section className={`border rounded-xl p-4 shadow-sm space-y-2.5 ${isSafeToSpray ? 'bg-emerald-50/90 border-emerald-300/80' : 'bg-amber-50/90 border-amber-300/80'}`}>
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {isSafeToSpray ? <CheckCircle2 className="w-5 h-5 text-[#2D572C]" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-950">
                Farming Impact & Spray Advisory — {selectedPlace.name}
              </h2>
              <p className="text-[11px] text-slate-600 font-medium">ICAR & TNAU Micro-Climate Advisory</p>
            </div>
          </div>
          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${isSafeToSpray ? 'text-[#2D572C] bg-emerald-100 border-emerald-300/80' : 'text-amber-900 bg-amber-100 border-amber-300/80'}`}>
            {isSafeToSpray ? 'STATUS: SAFE TO SPRAY' : 'STATUS: CAUTION ADVISED'}
          </span>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-lg p-3 space-y-1 text-xs">
          <p className="text-slate-800 leading-relaxed font-medium">
            <strong>Impact on Spraying:</strong> {isSafeToSpray ? 'Optimal wind & humidity conditions. Pesticides and liquid fertilizers applied now will absorb effectively without wind drift or rain wash-off.' : 'High humidity or rain risk detected. Delay chemical spraying to prevent pesticide runoff into soil.'}
          </p>
          <p className="text-slate-700 font-medium pt-1 border-t border-stone-100">
            <strong>Irrigation Recommendation:</strong> {weatherData.rainProb > 30 ? 'Pause drip irrigation for next 24 hours to prevent root rot.' : 'Standard drip schedule recommended (Morning 6:00 - 8:00 AM).'}
          </p>
        </div>
      </section>

      {/* 3. SECONDARY: 7-Day Forecast & Integrated Data Visualization */}
      <section className="bg-white border border-stone-200/80 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-stone-200/60 pb-2 flex-wrap gap-2">
          <h2 className="font-bold text-base text-slate-900">7-Day Weather & Rain Probability Chart — {selectedPlace.name}</h2>
          <span className="text-xs text-slate-500 font-medium">Integrated Micro-Climate Telemetry</span>
        </div>

        {/* Integrated Data Visualization */}
        <div className="bg-stone-50/80 border border-stone-200/70 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-600 font-bold border-b border-stone-200 pb-1.5">
            <span>Temperature Trend (°C)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> High Temp (°C)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span> Rain Probability (%)</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-32 pt-4 px-2 border-b border-stone-200/60">
            {weatherData.forecast.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1 py-0.5 rounded group-hover:scale-105 transition">{item.temp}°</span>
                
                {/* Visual Bar Stack */}
                <div className="w-full max-w-[28px] bg-stone-200 rounded-t-md relative flex flex-col justify-end h-20 overflow-hidden">
                  <div
                    style={{ height: `${(item.rainProb / 50) * 100}%` }}
                    className="w-full bg-gradient-to-t from-cyan-600 to-sky-400 rounded-t-md transition-all duration-300"
                    title={`Rain Probability: ${item.rainProb}%`}
                  ></div>
                </div>

                <span className="text-[10px] text-slate-600 font-bold truncate w-full text-center">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 7-Day Forecast Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-xs">
          {weatherData.forecast.map((item, idx) => (
            <div key={idx} className="bg-slate-50/80 border border-stone-200/80 p-2.5 rounded-lg space-y-1 hover:border-slate-300 transition">
              <span className="font-bold text-slate-800 block text-[11px]">{item.day}</span>
              <Sun className="w-4 h-4 text-amber-500 mx-auto" />
              <span className="font-extrabold text-slate-900 block text-sm">{item.temp}°C</span>
              <span className="text-[10px] text-slate-500 block">{item.rainProb}% Rain</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SUPPORTING: Google Maps HD Satellite View Embed */}
      <section className="bg-white border border-stone-200/80 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-stone-200/60 pb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-[#2D572C]" />
            <h2 className="font-bold text-base text-slate-900">Google Maps Satellite Radar — {selectedPlace.name}</h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setMapMode(mapMode === 'k' ? 'm' : 'k')}
              className="bg-stone-100 hover:bg-stone-200 text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-stone-300 transition flex items-center gap-1"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>{mapMode === 'k' ? 'Satellite View' : 'Roadmap View'}</span>
            </button>
            <a
              href={`https://www.google.com/maps/@${selectedPlace.lat},${selectedPlace.lng},15z`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-50 text-[#2D572C] font-bold px-2.5 py-1 rounded-lg border border-emerald-300 transition flex items-center gap-1"
            >
              <span>Open Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="w-full h-80 rounded-lg overflow-hidden border border-stone-300 shadow-sm relative bg-slate-900">
          {isMapMounted ? (
            <iframe
              title="Google Maps Satellite Weather Radar"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              src={googleMapEmbedUrl}
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-xs gap-2">
              <Satellite className="w-6 h-6 text-emerald-400 animate-pulse" />
              <span>Loading Satellite Radar View...</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
