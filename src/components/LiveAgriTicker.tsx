"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import { getLiveAgriNews, getLiveMandiPrices, AgriNewsItem, MandiPriceItem } from '@/lib/api';
import { Newspaper, TrendingUp, Sparkles, AlertCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const LiveAgriTicker = () => {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  const [news, setNews] = useState<AgriNewsItem[]>([]);
  const [prices, setPrices] = useState<MandiPriceItem[]>([]);
  const [activeTab, setActiveTab] = useState<'news' | 'prices'>('news');

  useEffect(() => {
    async function loadData() {
      const [n, p] = await Promise.all([getLiveAgriNews(), getLiveMandiPrices()]);
      setNews(n);
      setPrices(p);
    }
    loadData();
  }, []);

  return (
    <div className="bg-slate-900/95 border border-emerald-500/30 rounded-xl p-3 shadow-md text-xs text-white space-y-2">
      {/* Header controls */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
              activeTab === 'news'
                ? 'bg-[#2D572C] text-emerald-300 border border-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>{isTa ? 'நேரலை விவசாய செய்திகள்' : 'Live Agri News'}</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
              activeTab === 'prices'
                ? 'bg-[#2D572C] text-emerald-300 border border-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span>{isTa ? 'மண்டை சந்தை விலை' : 'Live Mandi Prices'}</span>
          </button>
        </div>

        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
          ● REAL-TIME FEED
        </span>
      </div>

      {/* Content Area */}
      {activeTab === 'news' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-950/80 p-2.5 rounded-lg border border-stone-800 hover:border-emerald-500/40 transition flex items-start gap-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1 min-w-0">
                <p className="font-semibold text-slate-200 group-hover:text-emerald-300 transition truncate">
                  {isTa ? item.titleTa : item.title}
                </p>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{item.source}</span>
                  <span className="text-amber-400 font-medium">{item.timestamp}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {prices.map((p) => (
            <div key={p.id} className="bg-slate-950 p-2.5 rounded-lg border border-stone-800 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span className="truncate">{p.mandiLocation}</span>
                <span className="text-emerald-400 font-semibold">{p.lastUpdated}</span>
              </div>
              <div className="font-bold text-white truncate">
                {isTa ? p.commodityTa : p.commodityEn}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-extrabold text-sm">
                  ₹{p.modalPrice.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-400">/Qtl</span>
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center font-bold">
                  {p.trend === 'UP' ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400 inline" />
                  ) : p.trend === 'DOWN' ? (
                    <ArrowDownRight className="w-3 h-3 text-red-400 inline" />
                  ) : (
                    <Minus className="w-3 h-3 text-slate-400 inline" />
                  )}
                  {p.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
