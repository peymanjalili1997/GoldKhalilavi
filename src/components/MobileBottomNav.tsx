import React from 'react';
import { motion } from 'motion/react';
import { Home, Sparkles, Scale, ShoppingBag, MapPin } from 'lucide-react';
import { ProductCategory } from '../types';

interface MobileBottomNavProps {
  currentView: 'home' | 'single_product' | 'checkout' | 'order_success';
  selectedCategory: ProductCategory | 'all';
  cartCount: number;
  onNavigateHome: () => void;
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  onOpenCart: () => void;
  onOpenBranches: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  selectedCategory,
  cartCount,
  onNavigateHome,
  onSelectCategory,
  onOpenCart,
  onOpenBranches,
}) => {
  const tabs = [
    {
      id: 'home',
      label: 'ویترین',
      icon: Home,
      isActive: currentView === 'home' && selectedCategory === 'all',
      onClick: () => {
        onSelectCategory('all');
        onNavigateHome();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'jewelry',
      label: 'طلا ۱۸ عیار',
      icon: Sparkles,
      isActive: currentView === 'home' && selectedCategory === 'jewelry_18k',
      onClick: () => {
        onSelectCategory('jewelry_18k');
        onNavigateHome();
        const el = document.getElementById('catalog-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'bullion',
      label: 'شمش و سکه',
      icon: Scale,
      isActive: currentView === 'home' && (selectedCategory === 'bullion_24k' || selectedCategory === 'coin'),
      onClick: () => {
        onSelectCategory('bullion_24k');
        onNavigateHome();
        const el = document.getElementById('catalog-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'cart',
      label: 'سبد خرید',
      icon: ShoppingBag,
      isActive: currentView === 'checkout',
      badge: cartCount,
      onClick: onOpenCart,
    },
    {
      id: 'branches',
      label: 'نشانی شعب',
      icon: MapPin,
      isActive: false,
      onClick: onOpenBranches,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E2D9C5] shadow-[0_-8px_24px_rgba(11,59,46,0.08)] select-none">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={tab.onClick}
              className="relative flex flex-col items-center justify-center min-h-[48px] min-w-[48px] cursor-pointer focus:outline-hidden"
            >
              {tab.isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute top-0 w-8 h-0.5 bg-[#0B3B2E] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}

              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-colors ${
                    tab.isActive ? 'text-[#0B3B2E] stroke-[2.2px]' : 'text-[#75857C]'
                  }`}
                />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -left-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C5A059] text-[#051F18] text-[10px] font-extrabold flex items-center justify-center tabular-nums shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 tracking-tight whitespace-nowrap transition-colors ${
                  tab.isActive ? 'font-bold text-[#0B3B2E]' : 'font-medium text-[#6C7C73]'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
