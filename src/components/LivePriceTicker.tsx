import React from 'react';
import { LiveMarketRates } from '../types';
import { formatPriceToman } from '../mockData';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface TickerProps {
  rates: LiveMarketRates;
  onRefresh: () => void;
  isUpdating: boolean;
}

export const LivePriceTicker: React.FC<TickerProps> = ({ rates, onRefresh, isUpdating }) => {
  const items = [
    { label: 'طلای ۱۸ عیار (هر گرم)', value: `${formatPriceToman(rates.gold18kGram)} تومان`, change: rates.changes.gold18k },
    { label: 'طلای ۲۴ عیار (هر گرم)', value: `${formatPriceToman(rates.gold24kGram)} تومان`, change: rates.changes.gold24k },
    { label: 'دلار آزاد', value: `${formatPriceToman(rates.usdTomans)} تومان`, change: rates.changes.usd },
    { label: 'انس جهانی طلا', value: `$${rates.goldOunceUSD.toFixed(1)}`, change: +0.32 },
    { label: 'سکه تمام امامی', value: `${formatPriceToman(rates.emamiCoin)} تومان`, change: rates.changes.emamiCoin },
    { label: 'نیم سکه بانکی', value: `${formatPriceToman(rates.halfCoin)} تومان`, change: +0.41 },
    { label: 'ربع سکه بانکی', value: `${formatPriceToman(rates.quarterCoin)} تومان`, change: +0.28 },
  ];

  return (
    <div className="relative bg-[#051F18] text-[#E8D7B0] text-[11px] sm:text-xs h-9 flex items-center border-b border-[#C5A059]/30 overflow-hidden select-none z-50">
      <div className="max-w-7xl w-full mx-auto px-3 sm:px-6 flex items-center justify-between">
        
        {/* Marquee stream */}
        <div className="flex-1 overflow-hidden relative">
          <div className="inline-flex items-center gap-8 whitespace-nowrap animate-ticker">
            {[...items, ...items].map((item, index) => (
              <div key={index} className="inline-flex items-center gap-2">
                <span className="text-[#C5A059] font-medium">{item.label}:</span>
                <span className="font-bold text-white tracking-wide tabular-nums">{item.value}</span>
                {item.change !== undefined && (
                  <span className={`inline-flex items-center text-[10px] tabular-nums font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.change >= 0 ? <TrendingUp className="w-3 h-3 ml-0.5" /> : <TrendingDown className="w-3 h-3 ml-0.5" />}
                    {Math.abs(item.change)}%
                  </span>
                )}
                <span className="text-[#164A3B] mx-2">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Refresh trigger */}
        <div className="flex items-center gap-2 shrink-0 pr-3 border-r border-[#164A3B]">
          <span className="hidden sm:inline-block text-[10px] text-[#9CB5AB]">نرخ اتحادیه</span>
          <button
            onClick={onRefresh}
            title="به‌روزرسانی لحظه‌ای نرخ‌ها"
            disabled={isUpdating}
            className="p-1 text-[#C5A059] hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>
    </div>
  );
};
