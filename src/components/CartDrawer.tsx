import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { formatPriceToman, formatNumberFa } from '../mockData';
import { ProductImageVisual } from './ProductVisuals';
import { X, Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const totalGrams = items.reduce((acc, curr) => acc + curr.product.weightGrams * curr.quantity, 0);
  const totalAmount = items.reduce((acc, curr) => acc + curr.calculatedPrice * curr.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="w-screen max-w-md bg-[#FAF7F2] border-r border-[#E5DEC9] shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-5 border-b border-[#E8E1D1] flex items-center justify-between bg-white/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0B3B2E] flex items-center justify-center text-[#E6C987]">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm sm:text-base text-[#0B3B2E]">سبد خرید خلیلاوی گلد</h2>
                    <span className="text-[11px] text-[#8A7A5D] font-medium">
                      {items.length > 0 ? `${formatNumberFa(items.length)} قطعه انتخاب‌شده` : 'آماده ثبت سفارش'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[#708077] hover:text-[#0B3B2E] hover:bg-[#F3EFE6] transition-colors cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4"
                  >
                    <div className="w-18 h-18 rounded-3xl bg-[#F3EFE6] border border-[#E5DEC9] flex items-center justify-center text-[#B5A893]">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div className="font-bold text-base text-[#0B3B2E]">سبد خرید شما خالی است</div>
                    <p className="text-xs text-[#7A8A80] max-w-xs leading-relaxed">
                      از میان کلکسیون طلای ۱۸ عیار، شمش‌های ۲۴ عیار سوئیسی و سکه‌های بانکی، قطعه دلخواه خود را انتخاب فرمایید.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-2 px-6 py-3 rounded-xl bg-[#0B3B2E] text-white text-xs font-bold hover:bg-[#072920] transition-colors cursor-pointer min-h-[44px]"
                    >
                      مشاهده کلکسیون‌ها
                    </button>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        className="bg-white border border-[#E6DFCE] rounded-2xl p-3.5 flex gap-3.5 items-center shadow-xs"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#ECE5D6] bg-[#FAF7F2]">
                          <ProductImageVisual type={item.product.imageType} className="w-full h-full" alt={item.product.title} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-[#8A7A5D] font-medium">
                            {item.product.categoryName} · {item.product.karat} عیار
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#11221C] truncate mt-0.5">
                            {item.product.title}
                          </h4>
                          <div className="text-[11px] text-[#708077] mt-0.5 tabular-nums">
                            وزن: {formatNumberFa(item.product.weightGrams)} گرم
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-[#0B3B2E] tabular-nums mt-1.5">
                            {formatPriceToman(item.calculatedPrice * item.quantity)} تومان
                          </div>
                        </div>

                        {/* Quantity Stepper & Delete */}
                        <div className="flex flex-col items-end gap-2.5 shrink-0">
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-[#9EAEA5] hover:text-rose-600 transition-colors p-1.5 cursor-pointer"
                            title="حذف از سبد"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex items-center gap-1.5 bg-[#F6F2E8] border border-[#E0D8C5] rounded-xl p-1 text-xs font-bold">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-[#0B3B2E] hover:bg-[#EAE2CE] rounded-lg cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center tabular-nums text-xs">{formatNumberFa(item.quantity)}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#0B3B2E] hover:bg-[#EAE2CE] rounded-lg cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer Summary & Checkout */}
              {items.length > 0 && (
                <div className="p-5 bg-white border-t border-[#E5DEC9] space-y-3.5 shadow-[0_-10px_25px_rgba(0,0,0,0.03)]">
                  <div className="space-y-2 text-xs text-[#4A5A52]">
                    <div className="flex justify-between items-center">
                      <span>مجموع وزن خالص طلا:</span>
                      <span className="font-bold text-[#0B3B2E] tabular-nums">{formatNumberFa(Number(totalGrams.toFixed(2)))} گرم</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black text-[#0B3B2E] pt-2 border-t border-[#EFE9DC]">
                      <span>جمع کل فاکتور:</span>
                      <span className="text-base sm:text-lg tabular-nums">{formatPriceToman(totalAmount)} تومان</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#60736A] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>امکان تسویه نقدی یا پرداخت اقساطی در مرحله بعد</span>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      onClose();
                      onProceedToCheckout();
                    }}
                    className="w-full py-4 px-4 rounded-2xl bg-[#0B3B2E] text-white font-bold text-xs sm:text-sm hover:bg-[#072920] transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 min-h-[48px]"
                  >
                    <span>تکمیل سفارش و انتخاب روش پرداخت</span>
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
