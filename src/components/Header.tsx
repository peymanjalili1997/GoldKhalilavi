import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onOpenBranchesModal: () => void;
  onGoHome: () => void;
  onOpenInstallmentGuide: () => void;
  isTransparent?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  selectedCategory,
  onSelectCategory,
  onOpenBranchesModal,
  onGoHome,
  onOpenInstallmentGuide,
  isTransparent = false,
}) => {
  const navItems: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'ویترین کلکسیون‌ها' },
    { id: 'jewelry_18k', label: 'طلا و جواهر ۱۸ عیار' },
    { id: 'bullion_24k', label: 'شمش طلا ۲۴ عیار' },
    { id: 'coin', label: 'سکه بانکی' },
  ];

  return (
    <header
      className={`transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-white border-b border-[#E5DEC9] shadow-[0_8px_30px_rgba(11,59,46,0.06)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Title (1 Line, Luxury Wordmark) */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onGoHome}
          className="flex items-center gap-3 shrink-0 cursor-pointer text-right focus:outline-hidden"
        >
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border overflow-hidden flex items-center justify-center transition-colors duration-500 shrink-0 ${
              isTransparent
                ? 'border-[#E6C987]/70 bg-[#051F18]/80 shadow-[0_0_15px_rgba(197,160,89,0.3)]'
                : 'border-[#C5A059] bg-[#0B3B2E] shadow-sm'
            }`}
          >
            <img
              src={`${import.meta.env.BASE_URL || './'}assets/khalilavi-logo.jpg`.replace('//', '/')}
              alt="لوگو گالری طلا رضا خلیلاوی"
              className="w-full h-full object-cover scale-110"
            />
          </div>
          <span
            className={`font-bold text-lg sm:text-xl tracking-tight whitespace-nowrap transition-colors duration-500 ${
              isTransparent ? 'text-[#F7E7C4]' : 'text-[#0B3B2E]'
            }`}
          >
            خلیلاوی گلد
          </span>
        </motion.button>

        {/* Zone 2: Clean Single-Line Nav Links */}
        <nav
          className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-500 ${
            isTransparent ? 'text-[#D0DDD7]' : 'text-[#4A5D54]'
          }`}
        >
          {navItems.map((item) => {
            const isActive = selectedCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectCategory(item.id)}
                className={`relative py-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? isTransparent
                      ? 'text-[#E6C987] font-bold'
                      : 'text-[#0B3B2E] font-bold'
                    : isTransparent
                    ? 'hover:text-white'
                    : 'hover:text-[#0B3B2E]'
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
            className={`py-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isTransparent ? 'hover:text-white' : 'hover:text-[#0B3B2E]'
            }`}
          >
            شرایط اقساط
          </button>

          <button
            onClick={onOpenBranchesModal}
            className={`py-2 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isTransparent ? 'hover:text-white' : 'hover:text-[#0B3B2E]'
            }`}
          >
            نشانی شعب
          </button>
        </nav>

        {/* Zone 3: Primary Action - Minimal Icon-only Luxury Cart */}
        <div className="flex items-center gap-3 shrink-0">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={onOpenCart}
            className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 cursor-pointer ${
              isTransparent
                ? 'bg-white/10 hover:bg-[#C5A059] text-[#F7E7C4] hover:text-[#051F18] border border-[#E6C987]/40 shadow-sm backdrop-blur-xs'
                : 'bg-[#FAF7F2] hover:bg-[#0B3B2E] text-[#0B3B2E] hover:text-[#E6C987] border border-[#E5DEC9] shadow-xs'
            }`}
            aria-label="سبد خرید"
            title="سبد خرید"
          >
            <ShoppingBag className="w-5 h-5 transition-transform" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C5A059] text-[#051F18] text-[10px] font-black flex items-center justify-center shadow-md font-mono border-2 border-[#051F18]"
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
