import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoldProduct, LiveMarketRates } from '../types';
import { calculateProductPrice, formatPriceToman, formatNumberFa } from '../mockData';
import { ProductImageVisual } from './ProductVisuals';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  CreditCard,
  FileCheck2,
  Truck,
  RotateCcw,
  CheckCircle2,
  ShoppingBag
} from 'lucide-react';

interface SingleProductViewProps {
  product: GoldProduct;
  rates: LiveMarketRates;
  onBack: () => void;
  onAddToCart: (product: GoldProduct) => void;
  onDirectInstallmentCheckout: (
    product: GoldProduct,
    months: 3 | 6 | 9 | 12,
    downPaymentPercent: number,
    guaranteeType: 'sayyadi_check' | 'gold_collateral'
  ) => void;
}

export const SingleProductView: React.FC<SingleProductViewProps> = ({
  product,
  rates,
  onBack,
  onAddToCart,
  onDirectInstallmentCheckout
}) => {
  const { rawGoldPrice, wageAmount, profitAmount, taxAmount, totalPrice } = calculateProductPrice(product, rates);

  const [purchaseMode, setPurchaseMode] = useState<'cash' | 'installment'>('cash');
  const [downPercent, setDownPercent] = useState<number>(30);
  const [months, setMonths] = useState<3 | 6 | 9 | 12>(6);
  const [guaranteeType, setGuaranteeType] = useState<'sayyadi_check' | 'gold_collateral'>('sayyadi_check');

  // Installment calculation
  const downPaymentAmount = Math.round(totalPrice * (downPercent / 100));
  const remainingPrincipal = totalPrice - downPaymentAmount;
  const monthlyInterestRate = 0.025; // 2.5% per month
  const totalInterest = Math.round(remainingPrincipal * monthlyInterestRate * months);
  const totalInstallmentPrice = totalPrice + totalInterest;
  const monthlyInstallment = Math.round((remainingPrincipal + totalInterest) / months);
  const requiredCollateralGrams = Number(((remainingPrincipal * 1.1) / rates.gold18kGram).toFixed(2));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 md:pb-14"
    >
      {/* Top Bar / Breadcrumb */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E8E1D1]">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm text-[#0B3B2E] font-bold hover:text-[#041E17] transition-colors cursor-pointer min-h-[42px]"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به ویترین محصولات</span>
        </motion.button>

        <div className="text-xs text-[#708077]">
          کد اصالت کالا: <span className="font-mono tabular-nums text-[#0B3B2E] font-bold">{product.hallmarkCode}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left/Sticky Gallery Column (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-[#E2D9C5] bg-white shadow-sm">
            <ProductImageVisual type={product.imageType} className="w-full h-full p-4" alt={product.title} />
            
            {product.badge && (
              <div className="absolute top-4 right-4 bg-[#FAF7F2]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#E2D8C3] text-xs font-bold text-[#0B3B2E]">
                {product.badge}
              </div>
            )}
          </div>

          {/* Trust & Craftsmanship Guarantees */}
          <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 space-y-3.5 text-xs text-[#4E5C55]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#11221C]">فاکتور رسمی و هولوگرام اتحادیه:</span> صدور فاکتور سیستمی معتبر با مهر برجسته خلیلاوی گلد و تضمین عیار آزمایشگاهی.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#11221C]">تحویل تشریفاتی و بیمه‌شده:</span> ارسال با پیک ویژه محافظت‌شده و پوشش بیمه ۱۰۰٪ ارزش روز یا تحویل حضوری.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#11221C]">تضمین بازخرید دائمی:</span> بازخرید نقدی و آنی به نرخ لحظه‌ای تابلو اتحادیه در تمامی روزهای کاری.
              </div>
            </div>
          </div>
        </div>

        {/* Right Purchase & Spec Breakdown Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#8A7A5D] mb-1.5">
              <span>{product.categoryName}</span>
              <span>·</span>
              <span>عیار {product.karat} ({product.purity})</span>
              <span>·</span>
              <span>موجود در خزانه</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B2E] leading-snug">
              {product.title}
            </h1>
            <p className="mt-2.5 text-sm text-[#4D5E55] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-[#E6DFCE] rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-[#7A8A80]">وزن خالص طلا</div>
              <div className="text-base font-extrabold text-[#0B3B2E] tabular-nums mt-1">
                {formatNumberFa(product.weightGrams)} <span className="text-xs font-normal">گرم</span>
              </div>
            </div>

            <div className="bg-white border border-[#E6DFCE] rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-[#7A8A80]">عیار استاندارد</div>
              <div className="text-base font-extrabold text-[#0B3B2E] tabular-nums mt-1">
                {product.karat} عیار ({product.purity})
              </div>
            </div>

            <div className="bg-white border border-[#E6DFCE] rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-[#7A8A80]">اجرت ساخت</div>
              <div className="text-base font-extrabold text-[#0B3B2E] tabular-nums mt-1">
                {product.wagePercent > 0 ? `${formatNumberFa(product.wagePercent)}٪` : 'بدون اجرت'}
              </div>
            </div>

            <div className="bg-white border border-[#E6DFCE] rounded-2xl p-3.5 text-center">
              <div className="text-[11px] text-[#7A8A80]">وضعیت تحویل</div>
              <div className="text-base font-extrabold text-emerald-700 mt-1">
                آماده تحویل
              </div>
            </div>
          </div>

          {/* TRANSPARENT GOLD PRICE BREAKDOWN TABLE */}
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-5 sm:p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#EDE7D8]">
              <span className="font-bold text-sm text-[#0B3B2E] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#C5A059]" />
                جدول شفاف محاسبه قیمت طلا
              </span>
              <span className="text-xs text-[#8A7A5D] tabular-nums">
                نرخ پایه هر گرم: {formatPriceToman(product.karat === 24 ? rates.gold24kGram : rates.gold18kGram)} تومان
              </span>
            </div>

            <div className="mt-4 space-y-3 text-xs text-[#3D4C44]">
              <div className="flex justify-between items-center py-1.5 border-b border-[#F3EFE6]">
                <span>ارزش طلای خام ({formatNumberFa(product.weightGrams)} گرم × نرخ لحظه‌ای):</span>
                <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(rawGoldPrice)} تومان</span>
              </div>

              {product.category !== 'coin' && (
                <>
                  <div className="flex justify-between items-center py-1.5 border-b border-[#F3EFE6]">
                    <span>اجرت ساخت و پرداخت ({formatNumberFa(product.wagePercent)}٪):</span>
                    <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(wageAmount)} تومان</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F3EFE6]">
                    <span>سود قانونی فروشنده ({formatNumberFa(product.profitPercent)}٪ مصوب اتحادیه):</span>
                    <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(profitAmount)} تومان</span>
                  </div>

                  <div className="flex justify-between items-center py-1.5 border-b border-[#F3EFE6]">
                    <span>مالیات بر ارزش افزوده ({formatNumberFa(product.taxPercent)}٪ صرفاً بر سود و اجرت):</span>
                    <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(taxAmount)} تومان</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-[#0B3B2E]">
                <span>قیمت نهایی نقدی:</span>
                <span className="text-lg sm:text-xl tabular-nums text-[#0B3B2E]">{formatPriceToman(totalPrice)} تومان</span>
              </div>
            </div>
          </div>

          {/* PURCHASE TYPE SELECTOR TABS: Cash vs Installment */}
          <div className="border border-[#E5DEC9] rounded-3xl overflow-hidden bg-white shadow-xs">
            <div className="grid grid-cols-2 bg-[#F3EFE6] border-b border-[#E5DEC9] p-1.5 gap-1.5">
              <button
                onClick={() => setPurchaseMode('cash')}
                className={`py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] ${
                  purchaseMode === 'cash'
                    ? 'bg-[#0B3B2E] text-white shadow-xs'
                    : 'text-[#5C6E65] hover:text-[#0B3B2E]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                خرید نقدی
              </button>

              <button
                onClick={() => setPurchaseMode('installment')}
                className={`py-3 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[44px] ${
                  purchaseMode === 'installment'
                    ? 'bg-[#0B3B2E] text-white shadow-xs'
                    : 'text-[#5C6E65] hover:text-[#0B3B2E]'
                }`}
              >
                <Award className="w-4 h-4 text-[#E6C987]" />
                خرید اقساطی (با چک صیادی یا طلا)
              </button>
            </div>

            <AnimatePresence mode="wait">
              {purchaseMode === 'cash' ? (
                <motion.div
                  key="cash-panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-xs text-[#7A8A80]">مبلغ قابل پرداخت در خرید نقدی:</div>
                    <div className="text-2xl font-black text-[#0B3B2E] tabular-nums mt-0.5">
                      {formatPriceToman(totalPrice)} <span className="text-xs font-normal text-[#5C6E65]">تومان</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 mt-1.5 flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      تحویل فوری همراه با گواهی اصالت و فاکتور رسمی
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onAddToCart(product)}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0B3B2E] text-white font-bold text-xs sm:text-sm hover:bg-[#072920] transition-colors cursor-pointer shadow-md whitespace-nowrap"
                  >
                    افزودن به سبد خرید
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="installment-panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="p-5 sm:p-6 space-y-5 bg-[#FAF7F2]/60"
                >
                  <div className="text-xs text-[#506359] leading-relaxed">
                    محاسبه‌گر هوشمند اقساط خلیلاوی گلد: درصد پیش‌پرداخت و تعداد اقساط را متناسب با بودجه خود تنظیم کنید.
                  </div>

                  {/* 1. Down Payment Ratio Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-bold text-[#11221C] mb-2">
                      <span>پیش‌پرداخت نقدی ({formatNumberFa(downPercent)}٪):</span>
                      <span className="text-[#0B3B2E] tabular-nums">{formatPriceToman(downPaymentAmount)} تومان</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="50"
                      step="5"
                      value={downPercent}
                      onChange={(e) => setDownPercent(Number(e.target.value))}
                      className="w-full accent-[#0B3B2E] cursor-pointer h-2 rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-[#8A7A5D] mt-1">
                      <span>۲۰٪</span>
                      <span>۳۵٪</span>
                      <span>۵۰٪</span>
                    </div>
                  </div>

                  {/* 2. Months Count Buttons */}
                  <div>
                    <div className="text-xs font-bold text-[#11221C] mb-2">مدت بازپرداخت اقساط:</div>
                    <div className="grid grid-cols-4 gap-2">
                      {([3, 6, 9, 12] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMonths(m)}
                          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[42px] ${
                            months === m
                              ? 'bg-[#0B3B2E] text-white border-[#0B3B2E] shadow-xs'
                              : 'bg-white text-[#4A5951] border-[#E5DEC9] hover:border-[#0B3B2E]'
                          }`}
                        >
                          {formatNumberFa(m)} ماهه
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Guarantee Type Selector */}
                  <div>
                    <div className="text-xs font-bold text-[#11221C] mb-2">نوع ضمانت اقساط:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        onClick={() => setGuaranteeType('sayyadi_check')}
                        className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                          guaranteeType === 'sayyadi_check'
                            ? 'border-[#0B3B2E] bg-[#F3EFE6] ring-1 ring-[#0B3B2E]'
                            : 'border-[#E5DEC9] bg-white hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#0B3B2E] flex items-center justify-between">
                          <span>چک صیادی بنفش</span>
                          {guaranteeType === 'sayyadi_check' && <CheckCircle2 className="w-4 h-4 text-[#0B3B2E]" />}
                        </div>
                        <div className="text-[11px] text-[#60736A] mt-1">
                          ارائه چک صیادی معتبر بدون نیاز به ضامن
                        </div>
                      </button>

                      <button
                        onClick={() => setGuaranteeType('gold_collateral')}
                        className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                          guaranteeType === 'gold_collateral'
                            ? 'border-[#0B3B2E] bg-[#F3EFE6] ring-1 ring-[#0B3B2E]'
                            : 'border-[#E5DEC9] bg-white hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="font-bold text-xs text-[#0B3B2E] flex items-center justify-between">
                          <span>ضمانت طلا در صندوق امانات</span>
                          {guaranteeType === 'gold_collateral' && <CheckCircle2 className="w-4 h-4 text-[#0B3B2E]" />}
                        </div>
                        <div className="text-[11px] text-[#60736A] mt-1">
                          امانت‌گذاری {formatNumberFa(requiredCollateralGrams)} گرم طلای ۱۸ عیار
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Installment Summary Banner */}
                  <div className="bg-[#EFEADF] border border-[#DDD5C3] rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[#2A3B33]">
                      <span>پیش‌پرداخت نقدی اولیه:</span>
                      <span className="font-bold tabular-nums text-[#0B3B2E]">{formatPriceToman(downPaymentAmount)} تومان</span>
                    </div>
                    <div className="flex justify-between items-center text-[#2A3B33]">
                      <span>مبلغ هر قسط ماهانه ({formatNumberFa(months)} قسط):</span>
                      <span className="font-extrabold text-sm tabular-nums text-[#0B3B2E]">{formatPriceToman(monthlyInstallment)} تومان</span>
                    </div>
                    <div className="flex justify-between items-center text-[#708077] text-[11px] pt-1.5 border-t border-[#DDD5C3]">
                      <span>مجموع کل پرداختی در پایان دوره:</span>
                      <span className="tabular-nums font-bold">{formatPriceToman(totalInstallmentPrice)} تومان</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onDirectInstallmentCheckout(product, months, downPercent, guaranteeType)}
                      className="flex-1 py-3.5 px-4 rounded-2xl bg-[#0B3B2E] text-white font-bold text-xs sm:text-sm hover:bg-[#072920] transition-colors cursor-pointer shadow-md text-center min-h-[46px]"
                    >
                      ثبت درخواست خرید اقساطی این محصول
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Highlights List */}
          <div className="bg-white border border-[#E6DFCE] rounded-2xl p-5">
            <h4 className="text-xs font-bold text-[#0B3B2E] mb-3">مشخصات فنی و شناسنامه اصالت:</h4>
            <div className="text-xs text-[#60736A] mb-3">ابعاد و مشخصات: {product.dimensions}</div>
            <ul className="space-y-2 text-xs text-[#42524A]">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

      {/* Mobile Native Sticky Action Bar (Above Bottom Nav) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-xl border-t border-[#E2D9C5] px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
        <div>
          <div className="text-[10px] text-[#7A8A80]">قیمت نهایی لحظه‌ای:</div>
          <div className="text-base font-black text-[#0B3B2E] tabular-nums">
            {formatPriceToman(totalPrice)} <span className="text-[10px] font-normal">تومان</span>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className="px-6 py-3 rounded-xl bg-[#0B3B2E] text-white text-xs font-bold flex items-center gap-2 shadow-sm min-h-[44px]"
        >
          <ShoppingBag className="w-4 h-4 text-[#E6C987]" />
          <span>افزودن به سبد خرید</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
