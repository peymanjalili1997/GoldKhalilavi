import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoldProduct, LiveMarketRates } from '../types';
import { BRANCHES, calculateProductPrice, formatPriceToman, formatNumberFa } from '../mockData';
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
  ShoppingBag,
  Scale,
  Sparkles,
  MapPin,
  Phone,
  Instagram,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Copy,
  Check,
  Lock,
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
  onDirectInstallmentCheckout,
}) => {
  const { rawGoldPrice, wageAmount, profitAmount, taxAmount, totalPrice, perGramFinal } =
    calculateProductPrice(product, rates);

  const branchInfo = BRANCHES[product.branchId] || BRANCHES.branch_jewelry;

  const [purchaseMode, setPurchaseMode] = useState<'cash' | 'installment'>('cash');
  const [downPercent, setDownPercent] = useState<number>(30);
  const [months, setMonths] = useState<3 | 6 | 9 | 12>(6);
  const [guaranteeType, setGuaranteeType] = useState<'sayyadi_check' | 'gold_collateral'>('sayyadi_check');

  // Interactive Luxury Gallery Controls
  const [studioTheme, setStudioTheme] = useState<'obsidian' | 'ivory'>('obsidian');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Intrinsic raw gold percentage for investment transparency bar
  const intrinsicGoldRatio = Math.min(99, Math.max(72, Math.round((rawGoldPrice / totalPrice) * 100)));

  // Installment calculation
  const downPaymentAmount = Math.round(totalPrice * (downPercent / 100));
  const remainingPrincipal = totalPrice - downPaymentAmount;
  const monthlyInterestRate = 0.025; // 2.5% per month
  const totalInterest = Math.round(remainingPrincipal * monthlyInterestRate * months);
  const totalInstallmentPrice = totalPrice + totalInterest;
  const monthlyInstallment = Math.round((remainingPrincipal + totalInterest) / months);
  const requiredCollateralGrams = Number(((remainingPrincipal * 1.1) / rates.gold18kGram).toFixed(2));

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(product.hallmarkCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-32 md:pb-16"
    >
      {/* 1. TOP ROYAL ATELIER BREADCRUMB & SERIAL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2D9C5]">
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#E2D9C5] text-xs sm:text-sm text-[#0B3B2E] font-bold hover:border-[#C5A059] hover:bg-[#FAF7F2] transition-all cursor-pointer shadow-2xs min-h-[42px]"
        >
          <ArrowRight className="w-4 h-4 text-[#C5A059]" />
          <span>بازگشت به ویترین کلکسیون‌ها</span>
        </motion.button>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/5 border border-emerald-800/20 text-[11px] text-[#0B3B2E] font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>محاسبه زنده بر اساس نرخ لحظه‌ای بازار اهواز</span>
          </div>

          <button
            onClick={handleCopyCode}
            title="کپی کد شناسنامه اصالت"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2D9C5] hover:border-[#C5A059] text-xs text-[#5E6E66] transition-all cursor-pointer"
          >
            <span>کد شناسنامه:</span>
            <span className="font-mono font-bold text-[#0B3B2E] tabular-nums">{product.hallmarkCode}</span>
            {copiedCode ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-[#C5A059]" />
            )}
          </button>
        </div>
      </div>

      {/* 2. MAIN TWO-COLUMN ROYAL SHOWCASE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* ================================================================= */}
        {/* RIGHT/STICKY VISUAL STAGE & CERTIFICATE COLUMN (5 cols)           */}
        {/* ================================================================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          
          {/* Luxury Interactive Exhibition Frame */}
          <div
            className={`relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all duration-500 shadow-[0_24px_60px_rgba(5,31,24,0.12)] ${
              studioTheme === 'obsidian'
                ? 'bg-radial-[at_center] from-[#0D382B] via-[#062119] to-[#03120D] border-[#C5A059]/45'
                : 'bg-radial-[at_center] from-[#FFFFFF] via-[#FAF7F2] to-[#EFE9DC] border-[#E2D9C5]'
            }`}
          >
            {/* Corner Luxury Filigree Accents */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#C5A059]/40 rounded-tl-lg pointer-events-none z-20" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#C5A059]/40 rounded-tr-lg pointer-events-none z-20" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#C5A059]/40 rounded-bl-lg pointer-events-none z-20" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#C5A059]/40 rounded-br-lg pointer-events-none z-20" />

            {/* Top Overlay Badges */}
            <div className="absolute top-5 inset-x-5 flex items-center justify-between z-20 pointer-events-none">
              {product.badge ? (
                <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#DFBF76] via-[#C5A059] to-[#A67F32] text-[#051F18] text-[11px] font-extrabold shadow-md">
                  {product.badge}
                </div>
              ) : (
                <div />
              )}

              <div
                className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${
                  studioTheme === 'obsidian'
                    ? 'bg-[#051F18]/80 border-[#C5A059]/40 text-[#E6C987]'
                    : 'bg-white/90 border-[#E2D9C5] text-[#0B3B2E]'
                }`}
              >
                عیار {formatNumberFa(product.karat)} · {product.purity}
              </div>
            </div>

            {/* Product Visual with Smooth Zoom Inspection */}
            <div
              onClick={() => setIsZoomed(!isZoomed)}
              className="w-full h-full flex items-center justify-center cursor-zoom-in overflow-hidden"
            >
              <motion.div
                animate={{ scale: isZoomed ? 1.28 : 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 24 }}
                className="w-full h-full p-6 sm:p-8 flex items-center justify-center"
              >
                <ProductImageVisual
                  type={product.imageType}
                  className="w-full h-full rounded-2xl"
                  alt={product.title}
                />
              </motion.div>
            </div>

            {/* Bottom Interactive Studio Lighting & Zoom Controls */}
            <div className="absolute bottom-4 inset-x-5 flex items-center justify-between z-20">
              <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[#051F18]/80 backdrop-blur-md border border-[#C5A059]/35">
                <button
                  onClick={() => setStudioTheme('obsidian')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    studioTheme === 'obsidian'
                      ? 'bg-[#C5A059] text-[#051F18]'
                      : 'text-[#D8E4DE] hover:text-white'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                  <span>خزانه تیره</span>
                </button>
                <button
                  onClick={() => setStudioTheme('ivory')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    studioTheme === 'ivory'
                      ? 'bg-[#C5A059] text-[#051F18]'
                      : 'text-[#D8E4DE] hover:text-white'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                  <span>آتلیه روشن</span>
                </button>
              </div>

              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#051F18]/80 backdrop-blur-md border border-[#C5A059]/35 text-[#E6C987] hover:text-white text-[10px] font-bold transition-all cursor-pointer"
              >
                {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span>{isZoomed ? 'حالت عادی' : 'بزرگ‌نمایی'}</span>
              </button>
            </div>
          </div>

          {/* OFFICIAL DIGITAL ASSAY & AUTHENTICITY CERTIFICATE CARD */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07261E] via-[#051F18] to-[#020E0A] text-[#FAF7F2] p-6 border border-[#C5A059]/40 shadow-xl">
            <div className="absolute -top-12 -left-12 w-36 h-36 rounded-full bg-[#C5A059]/10 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-[#C5A059]/20">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl border border-[#C5A059] overflow-hidden bg-[#051F18] shrink-0">
                  <img
                    src={`${import.meta.env.BASE_URL || './'}assets/khalilavi-logo.jpg`.replace('//', '/')}
                    alt="نشان خلیلاوی گلد"
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div>
                  <div className="text-[10px] tracking-widest text-[#C5A059] uppercase font-brand">
                    OFFICIAL ASSAY CERTIFICATE
                  </div>
                  <div className="text-sm font-extrabold text-[#F7E7C4]">
                    شناسنامه دیجیتال اصالت و عیارسنجی
                  </div>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-[#E6C987] shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-3 py-4 text-xs border-b border-[#C5A059]/15">
              <div className="bg-[#092E24]/80 rounded-xl p-3 border border-[#C5A059]/15">
                <div className="text-[10px] text-[#9DB0A7]">کد استاندارد ری‌گیری</div>
                <div className="font-mono font-bold text-[#E6C987] mt-1">{product.hallmarkCode}</div>
              </div>
              <div className="bg-[#092E24]/80 rounded-xl p-3 border border-[#C5A059]/15">
                <div className="text-[10px] text-[#9DB0A7]">استاندارد خلوص</div>
                <div className="font-bold text-white mt-1">
                  طلای {formatNumberFa(product.karat)} عیار ({product.purity})
                </div>
              </div>
            </div>

            <div className="pt-3.5 space-y-2.5 text-[11px] text-[#C2D1CA]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>صدور فاکتور رسمی کاغذی و دیجیتال با مهر برجسته خلیلاوی گلد</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>تحویل حضوری در اهواز یا ارسال تشریفاتی با بیمه ۱۰۰٪ ارزش روز</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>تضمین بازخرید نقدی دائمی به نرخ روز تابلو اتحادیه</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================================================================= */}
        {/* LEFT COLUMN: EDITORIAL SPECS, PRICE BREAKDOWN & VIP CHECKOUT (7c) */}
        {/* ================================================================= */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* Product Header & Story */}
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E5DEC9] text-xs font-bold text-[#8A7A5D]">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{product.categoryName}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>موجود در خزانه ({formatNumberFa(product.stockCount)} عدد آماده تحویل)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B3B2E] leading-snug">
              {product.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#4D5E55] leading-relaxed">
              {product.description}
            </p>

            {/* Branch Custody Pill */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-[#60736A]">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span className="font-bold text-[#0B3B2E]">{branchInfo.name}:</span>
              <span>{branchInfo.address}</span>
            </div>
          </div>

          {/* 4-Card Luxury Technical Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white border border-[#E5DEC9] hover:border-[#C5A059] transition-colors rounded-2xl p-4 text-center space-y-1 shadow-2xs">
              <Scale className="w-4 h-4 text-[#C5A059] mx-auto" />
              <div className="text-[11px] text-[#7A8A80]">وزن خالص طلا</div>
              <div className="text-base sm:text-lg font-black text-[#0B3B2E] tabular-nums">
                {formatNumberFa(product.weightGrams)} <span className="text-xs font-medium">گرم</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5DEC9] hover:border-[#C5A059] transition-colors rounded-2xl p-4 text-center space-y-1 shadow-2xs">
              <Award className="w-4 h-4 text-[#C5A059] mx-auto" />
              <div className="text-[11px] text-[#7A8A80]">عیار و خلوص</div>
              <div className="text-base sm:text-lg font-black text-[#0B3B2E] tabular-nums">
                {formatNumberFa(product.karat)} عیار <span className="text-xs font-medium">({product.purity})</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5DEC9] hover:border-[#C5A059] transition-colors rounded-2xl p-4 text-center space-y-1 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#C5A059] mx-auto" />
              <div className="text-[11px] text-[#7A8A80]">اجرت ساخت</div>
              <div className="text-base sm:text-lg font-black text-[#0B3B2E] tabular-nums">
                {product.wagePercent > 0 ? `${formatNumberFa(product.wagePercent)}٪` : 'بدون اجرت'}
              </div>
            </div>

            <div className="bg-white border border-[#E5DEC9] hover:border-[#C5A059] transition-colors rounded-2xl p-4 text-center space-y-1 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mx-auto" />
              <div className="text-[11px] text-[#7A8A80]">ارزش ذاتی طلا</div>
              <div className="text-base sm:text-lg font-black text-emerald-700 tabular-nums">
                {formatNumberFa(intrinsicGoldRatio)}٪ کل مبلغ
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* PURCHASE TERMINAL: CASH VS VIP INSTALLMENT                      */}
          {/* =============================================================== */}
          <div className="border-2 border-[#C5A059]/45 rounded-3xl overflow-hidden bg-white shadow-[0_16px_40px_rgba(11,59,46,0.07)]">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 bg-[#F3EFE6] border-b border-[#E5DEC9] p-1.5 gap-1.5">
              <button
                onClick={() => setPurchaseMode('cash')}
                className={`py-3.5 text-xs sm:text-sm font-extrabold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[46px] ${
                  purchaseMode === 'cash'
                    ? 'bg-[#0B3B2E] text-[#F7E7C4] shadow-sm'
                    : 'text-[#5C6E65] hover:text-[#0B3B2E]'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#C5A059]" />
                <span>خرید نقدی به نرخ لحظه‌ای</span>
              </button>

              <button
                onClick={() => setPurchaseMode('installment')}
                className={`py-3.5 text-xs sm:text-sm font-extrabold rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[46px] ${
                  purchaseMode === 'installment'
                    ? 'bg-[#0B3B2E] text-[#F7E7C4] shadow-sm'
                    : 'text-[#5C6E65] hover:text-[#0B3B2E]'
                }`}
              >
                <Award className="w-4 h-4 text-[#C5A059]" />
                <span>خرید اقساطی VIP (۳ تا ۱۲ ماهه)</span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {purchaseMode === 'cash' ? (
                <motion.div
                  key="cash-panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 sm:p-8 bg-gradient-to-br from-[#07261E] via-[#0B3B2E] to-[#041712] text-white space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#C5A059]/25">
                    <div>
                      <div className="text-xs text-[#C5D8CF] mb-1">مبلغ قابل پرداخت در خرید نقدی:</div>
                      <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8E7] via-[#E6C987] to-[#C5A059] tabular-nums">
                        {formatPriceToman(totalPrice)}{' '}
                        <span className="text-sm font-bold text-[#E6C987]">تومان</span>
                      </div>
                    </div>

                    <div className="bg-[#051F18]/90 border border-[#C5A059]/30 rounded-2xl px-4 py-2.5 text-right shrink-0">
                      <div className="text-[10px] text-[#9DB0A7]">قیمت تمام‌شده هر گرم:</div>
                      <div className="text-sm font-extrabold text-[#E6C987] tabular-nums mt-0.5">
                        {formatPriceToman(perGramFinal)} تومان
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 text-xs text-[#C5D8CF]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#E6C987] shrink-0" />
                        <span>آماده تحویل آنی در اهواز یا ارسال بیمه‌شده به سراسر کشور</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#E6C987] shrink-0" />
                        <span>تضمین کتبی اصالت و عیار در فاکتور رسمی اتحادیه</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => onAddToCart(product)}
                      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#DFBF76] via-[#C5A059] to-[#A67F32] text-[#051F18] font-black text-sm hover:brightness-110 transition-all cursor-pointer shadow-[0_10px_25px_rgba(197,160,89,0.35)] flex items-center justify-center gap-2.5 whitespace-nowrap min-h-[52px]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>افزودن به سبد خرید و صدور فاکتور</span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="installment-panel"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                  className="p-6 sm:p-7 space-y-6 bg-[#FAF7F2]/80"
                >
                  <div className="text-xs text-[#506359] leading-relaxed">
                    شرایط ویژه اقساطی گالری رضا خلیلاوی: درصد پیش‌پرداخت و مدت بازپرداخت را متناسب با برنامه مالی خود انتخاب نمایید.
                  </div>

                  {/* 1. Down Payment Ratio Slider */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E5DEC9]">
                    <div className="flex justify-between items-center text-xs font-bold text-[#11221C] mb-2.5">
                      <span>پیش‌پرداخت نقدی ({formatNumberFa(downPercent)}٪):</span>
                      <span className="text-sm font-black text-[#0B3B2E] tabular-nums">
                        {formatPriceToman(downPaymentAmount)} تومان
                      </span>
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
                    <div className="flex justify-between text-[10px] text-[#8A7A5D] mt-1.5 font-medium">
                      <span>۲۰٪ (حداقل پیش‌پرداخت)</span>
                      <span>۳۵٪</span>
                      <span>۵۰٪</span>
                    </div>
                  </div>

                  {/* 2. Months Count Buttons */}
                  <div>
                    <div className="text-xs font-bold text-[#11221C] mb-2.5">مدت بازپرداخت اقساط:</div>
                    <div className="grid grid-cols-4 gap-2.5">
                      {([3, 6, 9, 12] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMonths(m)}
                          className={`py-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer border min-h-[44px] ${
                            months === m
                              ? 'bg-[#0B3B2E] text-[#E6C987] border-[#0B3B2E] shadow-xs'
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
                    <div className="text-xs font-bold text-[#11221C] mb-2.5">نوع ضمانت بازپرداخت:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setGuaranteeType('sayyadi_check')}
                        className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                          guaranteeType === 'sayyadi_check'
                            ? 'border-[#0B3B2E] bg-white ring-2 ring-[#0B3B2E]/15 shadow-xs'
                            : 'border-[#E5DEC9] bg-white/60 hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="font-extrabold text-xs text-[#0B3B2E] flex items-center justify-between">
                          <span>چک صیادی بنفش</span>
                          {guaranteeType === 'sayyadi_check' && <CheckCircle2 className="w-4 h-4 text-[#0B3B2E]" />}
                        </div>
                        <div className="text-[11px] text-[#60736A] mt-1">
                          ثبت رسمی در سامانه صیاد بدون نیاز به ضامن
                        </div>
                      </button>

                      <button
                        onClick={() => setGuaranteeType('gold_collateral')}
                        className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                          guaranteeType === 'gold_collateral'
                            ? 'border-[#0B3B2E] bg-white ring-2 ring-[#0B3B2E]/15 shadow-xs'
                            : 'border-[#E5DEC9] bg-white/60 hover:border-[#C5A059]'
                        }`}
                      >
                        <div className="font-extrabold text-xs text-[#0B3B2E] flex items-center justify-between">
                          <span>ضمانت طلا در صندوق امانات</span>
                          {guaranteeType === 'gold_collateral' && <CheckCircle2 className="w-4 h-4 text-[#0B3B2E]" />}
                        </div>
                        <div className="text-[11px] text-[#60736A] mt-1">
                          امانت‌گذاری {formatNumberFa(requiredCollateralGrams)} گرم طلا تا پایان اقساط
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Installment Summary Luxury Dark Ticket */}
                  <div className="bg-gradient-to-br from-[#07261E] to-[#041712] text-white border border-[#C5A059]/40 rounded-2xl p-5 space-y-3 text-xs shadow-lg">
                    <div className="flex justify-between items-center text-[#C5D8CF]">
                      <span>پیش‌پرداخت نقدی هنگام تحویل:</span>
                      <span className="font-bold tabular-nums text-white">{formatPriceToman(downPaymentAmount)} تومان</span>
                    </div>
                    <div className="flex justify-between items-center text-[#E6C987]">
                      <span>مبلغ هر قسط ماهانه ({formatNumberFa(months)} قسط):</span>
                      <span className="font-black text-base sm:text-lg tabular-nums text-[#E6C987]">
                        {formatPriceToman(monthlyInstallment)} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[#9DB0A7] text-[11px] pt-2 border-t border-[#C5A059]/20">
                      <span>مجموع کل پرداختی در پایان دوره:</span>
                      <span className="tabular-nums font-bold text-white">{formatPriceToman(totalInstallmentPrice)} تومان</span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onDirectInstallmentCheckout(product, months, downPercent, guaranteeType)}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#DFBF76] via-[#C5A059] to-[#A67F32] text-[#051F18] font-black text-xs sm:text-sm hover:brightness-110 transition-all cursor-pointer shadow-md text-center min-h-[50px]"
                  >
                    ثبت درخواست خرید اقساطی و رزرو این محصول ←
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =============================================================== */}
          {/* TRANSPARENT UNION GOLD PRICE BREAKDOWN                          */}
          {/* =============================================================== */}
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#EDE7D8]">
              <span className="font-extrabold text-sm sm:text-base text-[#0B3B2E] flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#C5A059]" />
                <span>جدول شفاف آنالیز قیمت روز اتحادیه</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E5DEC9] text-xs font-bold text-[#8A7A5D] tabular-nums">
                نرخ پایه هر گرم: {formatPriceToman(product.karat === 24 ? rates.gold24kGram : rates.gold18kGram)} تومان
              </span>
            </div>

            {/* Visual Gold Asset Composition Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-[#0B3B2E]">سهم طلای خالص خام: {formatNumberFa(intrinsicGoldRatio)}٪</span>
                <span className="text-[#8A7A5D]">سهم ساخت و تعرفه قانونی: {formatNumberFa(100 - intrinsicGoldRatio)}٪</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#EFEADF] overflow-hidden flex">
                <div
                  style={{ width: `${intrinsicGoldRatio}%` }}
                  className="h-full bg-gradient-to-r from-[#0B3B2E] via-[#135A46] to-[#C5A059] rounded-r-full"
                />
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#3D4C44] pt-1">
              <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                <span>ارزش طلای خام ({formatNumberFa(product.weightGrams)} گرم × نرخ روز):</span>
                <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(rawGoldPrice)} تومان</span>
              </div>

              {product.category !== 'coin' && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                    <span>اجرت ساخت و تراش تخصصی ({formatNumberFa(product.wagePercent)}٪):</span>
                    <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(wageAmount)} تومان</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                    <span>سود قانونی فروشنده ({formatNumberFa(product.profitPercent)}٪ مصوب اتحادیه):</span>
                    <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(profitAmount)} تومان</span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                    <span>مالیات بر ارزش افزوده ({formatNumberFa(product.taxPercent)}٪ صرفاً بر سود و اجرت):</span>
                    <span className="font-bold text-[#11221C] tabular-nums">{formatPriceToman(taxAmount)} تومان</span>
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-2 text-sm font-black text-[#0B3B2E]">
                <span>جمع کل فاکتور رسمی نقدی:</span>
                <span className="text-lg sm:text-xl tabular-nums text-[#0B3B2E]">{formatPriceToman(totalPrice)} تومان</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications & VIP Consultation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E6DFCE] rounded-3xl p-5 space-y-3">
              <h4 className="text-xs font-extrabold text-[#0B3B2E] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C5A059]" />
                <span>مشخصات فنی و شناسنامه قطعه</span>
              </h4>
              <div className="text-xs text-[#60736A] bg-[#FAF7F2] px-3 py-2 rounded-xl border border-[#EDE7D8]">
                ابعاد و استاندارد: <span className="font-bold text-[#11221C]">{product.dimensions}</span>
              </div>
              <ul className="space-y-2 text-xs text-[#42524A]">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E2D8C3] rounded-3xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#0B3B2E] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C5A059]" />
                  <span>مشاوره مستقیم و استعلام موجودی شعبه</span>
                </h4>
                <p className="text-xs text-[#5E6E66] leading-relaxed">
                  جهت دریافت ویدیوی نزدیک از این قطعه در گالری اهواز یا هماهنگی مراجعه حضوری، با کارشناسان خلیلاوی در ارتباط باشید.
                </p>
              </div>

              <div className="space-y-2">
                <a
                  href={`tel:${branchInfo.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#0B3B2E] text-white text-xs font-bold flex items-center justify-between hover:bg-[#072920] transition-colors"
                >
                  <span>تماس مستقیم با گالری:</span>
                  <span className="font-mono text-sm text-[#E6C987]">{branchInfo.phone}</span>
                </a>
                {branchInfo.instagramUrl && (
                  <a
                    href={branchInfo.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-white border border-[#E2D8C3] text-[#0B3B2E] text-xs font-bold flex items-center justify-between hover:border-[#C5A059] transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>دایرکت اینستاگرام شعبه:</span>
                    </span>
                    <span className="font-mono text-[11px]">@{branchInfo.instagramHandle}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Native Sticky Action Bar (Above Bottom Nav) */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-[#051F18]/95 backdrop-blur-xl border-t border-[#C5A059]/35 px-4 py-3 flex items-center justify-between gap-4 shadow-[0_-8px_25px_rgba(0,0,0,0.2)]">
        <div>
          <div className="text-[10px] text-[#A3B8B0]">قیمت نهایی لحظه‌ای:</div>
          <div className="text-base font-black text-[#E6C987] tabular-nums">
            {formatPriceToman(totalPrice)} <span className="text-[10px] font-normal text-white">تومان</span>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(product)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#DFBF76] via-[#C5A059] to-[#A67F32] text-[#051F18] text-xs font-black flex items-center gap-2 shadow-md min-h-[44px]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>افزودن به سبد خرید</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
