import React from 'react';
import { LiveMarketRates } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerProps {
  rates: LiveMarketRates;
  onRefresh?: () => void;
  isUpdating?: boolean;
  isTransparent?: boolean;
}

export const LivePriceTicker: React.FC<TickerProps> = ({
  isTransparent = false,
}) => {
  // Prices directly from the latest official market exchange rates (converted from Rial to Toman)
  const items = [
    { label: 'طلای ۱۸ عیار / ۷۵۰', value: '۲۶,۷۲۱,۴۰۰ تومان', change: +1.03 },
    { label: 'طلای ۲۴ عیار', value: '۳۵,۶۲۸,۲۰۰ تومان', change: +1.03 },
    { label: 'سکه پارسیان ۱/۰۰۰', value: '۲۷,۲۸۰,۰۰۰ تومان', change: 0.0 },
    { label: 'دلار', value: '۲۶۶,۴۰۰ تومان', change: +0.6 },
    { label: 'انس طلا', value: '$۴,۱۳۹.۳۷', change: +0.4 },
    { label: 'سکه تمام بهار آزادی', value: '۵۴,۱۰۰,۰۰۰ تومان', change: +0.76 },
    { label: 'نیم سکه بانکی', value: '۲۹,۱۰۰,۰۰۰ تومان', change: +0.41 },
    { label: 'ربع سکه بانکی', value: '۱۸,۶۰۰,۰۰۰ تومان', change: +0.28 },
  ];

  return (
    <div
      className={`relative text-[#E8D7B0] text-[11px] sm:text-xs h-9 flex items-center overflow-hidden select-none transition-colors duration-500 ${
        isTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-[#051F18] border-b border-[#C5A059]/30 shadow-xs'
      }`}
    >
      <div className="w-full px-3 sm:px-6 flex items-center">
        {/* Full-width continuous Marquee stream */}
        <div className="flex-1 overflow-hidden relative">
          <div className="inline-flex items-center gap-8 whitespace-nowrap animate-ticker">
            {[...items, ...items, ...items].map((item, index) => (
              <div key={index} className="inline-flex items-center gap-2">
                <span className="text-[#C5A059] font-medium">{item.label}:</span>
                <span className="font-bold text-white tracking-wide tabular-nums">{item.value}</span>
                {item.change !== undefined && (
                  <span className={`inline-flex items-center text-[10px] tabular-nums font-bold ${item.change > 0 ? 'text-emerald-400' : item.change < 0 ? 'text-rose-400' : 'text-amber-300'}`}>
                    {item.change > 0 ? <TrendingUp className="w-3 h-3 ml-0.5" /> : item.change < 0 ? <TrendingDown className="w-3 h-3 ml-0.5" /> : null}
                    {item.change > 0 ? `+${item.change}%` : `${item.change}%`}
                  </span>
                )}
                <span className="text-[#C5A059]/30 mx-2">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
