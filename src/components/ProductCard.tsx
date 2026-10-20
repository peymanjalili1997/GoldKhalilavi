import React from 'react';
import { motion } from 'motion/react';
import { GoldProduct, LiveMarketRates } from '../types';
import { calculateProductPrice, formatPriceToman, formatNumberFa } from '../mockData';
import { ProductImageVisual } from './ProductVisuals';
import { Plus, ArrowUpLeft } from 'lucide-react';

interface ProductCardProps {
  product: GoldProduct;
  rates: LiveMarketRates;
  onSelect: (product: GoldProduct) => void;
  onAddToCart: (product: GoldProduct) => void;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  rates,
  onSelect,
  onAddToCart,
  index = 0
}) => {
  const { totalPrice, perGramFinal } = calculateProductPrice(product, rates);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.45,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -4 }}
      onClick={() => onSelect(product)}
      className="group bg-white border border-[#E6DFCE] rounded-3xl overflow-hidden hover:border-[#C5A059] hover:shadow-[0_20px_40px_rgba(11,59,46,0.08)] transition-colors duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Slot (65-75% prominence) */}
      <div className="relative w-full aspect-[4/3] bg-[#F6F1E6] overflow-hidden">
        <ProductImageVisual
          type={product.imageType}
          className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
          alt={product.title}
        />

        {/* Subtle Luxury Kicker Text (Max 1 subtle tag) */}
        {product.badge && (
          <div className="absolute top-3.5 right-3.5 text-[11px] font-semibold text-[#0B3B2E] bg-[#FAF7F2]/90 backdrop-blur-md px-3 py-1 rounded-lg border border-[#E2D8C3]">
            {product.badge}
          </div>
        )}

        <div className="absolute bottom-3 left-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-[#0B3B2E] opacity-0 group-hover:opacity-100 transition-opacity border border-[#E2D8C3]">
          <ArrowUpLeft className="w-4 h-4" />
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata with Middle Dot Separators (Zero-Pill Rule) */}
          <div className="flex items-center gap-2 text-xs text-[#6E7F76] mb-2 font-medium">
            <span>{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums font-semibold text-[#0B3B2E]">
              {formatNumberFa(product.weightGrams)} گرم
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{product.karat} عیار</span>
          </div>

          {/* Product Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#11221C] group-hover:text-[#0B3B2E] transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="mt-1.5 text-xs text-[#5B6D64] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Quick Add */}
        <div className="mt-5 pt-4 border-t border-[#EFE9DC] flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-[#8A7A5D] font-medium">قیمت لحظه‌ای با محاسبه کامل:</div>
            <div className="text-lg sm:text-xl font-extrabold text-[#0B3B2E] tabular-nums mt-0.5">
              {formatPriceToman(totalPrice)} <span className="text-xs font-normal text-[#5C6E65]">تومان</span>
            </div>
            {product.category !== 'coin' && (
              <div className="text-[10px] text-[#7A8A80] tabular-nums mt-0.5">
                پایه هر گرم تمام‌شده: {formatPriceToman(perGramFinal)} ت
              </div>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-[#0B3B2E] text-white hover:bg-[#072920] transition-colors text-xs font-semibold cursor-pointer shadow-xs whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#E6C987]" />
            <span>افزودن</span>
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
};
