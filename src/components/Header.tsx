import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, MapPin, HelpCircle } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onOpenBranchesModal: () => void;
  onGoHome: () => void;
  onOpenInstallmentGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  onOpenBranchesModal,
  onGoHome,
  onOpenInstallmentGuide
}) => {
  const navItems: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'ویترین کلکسیون‌ها' },
    { id: 'jewelry_18k', label: 'طلا و جواهر ۱۸ عیار' },
    { id: 'bullion_24k', label: 'شمش طلا ۲۴ عیار' },
    { id: 'coin', label: 'سکه بانکی' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-xl border-b border-[#E5DEC9]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Title (1 Line, Luxury Wordmark) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onGoHome}
          className="flex items-center gap-3 shrink-0 cursor-pointer text-right focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-full border border-[#C5A059] flex items-center justify-center bg-[#0B3B2E] shadow-xs">
            <span className="font-brand font-bold text-lg tracking-wider text-[#E6C987]">KG</span>
          </div>
          <span className="font-bold text-lg sm:text-xl text-[#0B3B2E] tracking-tight whitespace-nowrap">
            خلیلاوی گلد
          </span>
        </motion.button>

        {/* Zone 2: Clean Single-Line Nav Links (No Branch Mentions) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4A5D54]">
          {navItems.map((item) => {
            const isActive = selectedCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id)}
                className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive ? 'text-[#0B3B2E] font-bold' : 'hover:text-[#0B3B2E]'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeDesktopNav"
                    className="absolute bottom-0 right-0 left-0 h-0.5 bg-[#C5A059] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}

          <button
            onClick={onOpenInstallmentGuide}
            className="py-2 hover:text-[#0B3B2E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            شرایط اقساط
          </button>

          <button
            onClick={onOpenBranchesModal}
            className="py-2 hover:text-[#0B3B2E] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            نشانی شعب
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenCart}
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#0B3B2E] text-white hover:bg-[#072920] transition-colors cursor-pointer shadow-xs text-xs font-semibold whitespace-nowrap shrink-0 min-h-[42px]"
            aria-label="سبد خرید"
          >
            <ShoppingBag className="w-4 h-4 text-[#E6C987]" />
            <span>سبد خرید</span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.6 }}
                animate={{ scale: 1 }}
                className="px-1.5 py-0.5 rounded-full bg-[#C5A059] text-[#051F18] text-[11px] font-extrabold tabular-nums"
              >
                {cartCount}
              </motion.span>
            )}
          </motion.button>
        </div>

      </div>
    </header>
  );
};
