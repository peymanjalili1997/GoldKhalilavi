import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, LiveMarketRates } from '../types';
import { formatPriceToman, formatNumberFa } from '../mockData';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  FileText,
  AlertCircle
} from 'lucide-react';

interface CheckoutViewProps {
  items: CartItem[];
  rates: LiveMarketRates;
  initialMode?: 'cash' | 'installment';
  initialInstallmentPlan?: {
    months: 3 | 6 | 9 | 12;
    downPercent: number;
    guaranteeType: 'sayyadi_check' | 'gold_collateral';
  };
  onBack: () => void;
  onOrderSuccess: (orderData: any) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  rates,
  initialMode = 'cash',
  initialInstallmentPlan,
  onBack,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNationalId, setCustomerNationalId] = useState('');
  const [deliveryType, setDeliveryType] = useState<'insured_delivery' | 'pickup_branch_1' | 'pickup_branch_2'>('insured_delivery');
  const [postalAddress, setPostalAddress] = useState('');

  // Payment Mode
  const [paymentMode, setPaymentMode] = useState<'cash' | 'installment'>(initialMode);
  
  // Installment Config
  const [downPercent, setDownPercent] = useState<number>(initialInstallmentPlan?.downPercent || 30);
  const [months, setMonths] = useState<3 | 6 | 9 | 12>(initialInstallmentPlan?.months || 6);
  const [guaranteeType, setGuaranteeType] = useState<'sayyadi_check' | 'gold_collateral'>(initialInstallmentPlan?.guaranteeType || 'sayyadi_check');
  const [sayyadiCheckId, setSayyadiCheckId] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalRawPrice = items.reduce((sum, item) => sum + item.calculatedPrice * item.quantity, 0);
  const totalWeight = items.reduce((sum, item) => sum + item.product.weightGrams * item.quantity, 0);

  // Installment computations
  const downPaymentAmount = Math.round(totalRawPrice * (downPercent / 100));
  const remainingPrincipal = totalRawPrice - downPaymentAmount;
  const monthlyInterestRate = 0.025; // 2.5%
  const totalInterest = Math.round(remainingPrincipal * monthlyInterestRate * months);
  const totalInstallmentPrice = totalRawPrice + totalInterest;
  const monthlyInstallment = Math.round((remainingPrincipal + totalInterest) / months);
  const requiredCollateralGrams = Number(((remainingPrincipal * 1.1) / rates.gold18kGram).toFixed(2));

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('لطفاً نام و نام‌خانوادگی و شماره همراه معتبر خود را جهت صدور فاکتور رسمی وارد فرمایید.');
      return;
    }

    if (deliveryType === 'insured_delivery' && !postalAddress.trim()) {
      setErrorMessage('لطفاً نشانی دقیق پستی جهت ارسال مرسوله بیمه‌شده طلا را وارد نمایید.');
      return;
    }

    if (paymentMode === 'installment' && guaranteeType === 'sayyadi_check' && !sayyadiCheckId.trim()) {
      setErrorMessage('لطفاً شناسه ۱۶ رقمی چک صیادی را جهت استعلام سامانه صیاد ثبت نمایید.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOrderSuccess({
        orderId: `KG-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName,
        customerPhone,
        deliveryType,
        paymentMode,
        totalRawPrice,
        totalInstallmentPrice: paymentMode === 'installment' ? totalInstallmentPrice : totalRawPrice,
        downPaymentAmount: paymentMode === 'installment' ? downPaymentAmount : totalRawPrice,
        monthlyInstallment: paymentMode === 'installment' ? monthlyInstallment : 0,
        months: paymentMode === 'installment' ? months : 0,
        guaranteeType: paymentMode === 'installment' ? guaranteeType : null,
        totalWeight,
        itemsCount: items.length
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 md:pb-14"
    >
      {/* Top back action */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E8E1D1]">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0B3B2E] hover:text-[#041E17] transition-colors cursor-pointer min-h-[42px]"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت و ویرایش سفارش</span>
        </motion.button>

        <div className="text-xs text-[#708077]">
          سامانه ثبت فاکتور رسمی خلیلاوی گلد
        </div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center gap-3 text-xs font-medium"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Details (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Customer Profile */}
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0B3B2E] flex items-center gap-2 mb-4 pb-3 border-b border-[#EDE7D8]">
              <FileText className="w-4 h-4 text-[#C5A059]" />
              ۱. مشخصات خریدار (جهت درج در فاکتور رسمی اتحادیه)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2D3C34] mb-1.5">
                  نام و نام خانوادگی خریدار *
                </label>
                <input
                  type="text"
                  placeholder="نام کامل طبق کارت ملی"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD4C2] bg-[#FAF7F2]/50 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#0B3B2E] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2D3C34] mb-1.5">
                  شماره همراه جهت هماهنگی تحویل *
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="0912xxxxxxx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD4C2] bg-[#FAF7F2]/50 text-xs text-right focus:outline-hidden focus:ring-1 focus:ring-[#0B3B2E] focus:bg-white transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2D3C34] mb-1.5">
                  کد ملی (جهت ثبت سند مالکیت طلا و شمش)
                </label>
                <input
                  type="text"
                  dir="ltr"
                  maxLength={10}
                  placeholder="کد ملی ۱۰ رقمی"
                  value={customerNationalId}
                  onChange={(e) => setCustomerNationalId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD4C2] bg-[#FAF7F2]/50 text-xs text-right focus:outline-hidden focus:ring-1 focus:ring-[#0B3B2E] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery or Branch Pickup (Branch Addresses kept here as requested) */}
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0B3B2E] flex items-center gap-2 mb-4 pb-3 border-b border-[#EDE7D8]">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              ۲. انتخاب نحوه تحویل یا مراجعه به شعب
            </h3>

            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${deliveryType === 'insured_delivery' ? 'border-[#0B3B2E] bg-[#FAF7F2] ring-1 ring-[#0B3B2E]' : 'border-[#E5DEC9] bg-white hover:bg-[#FAF7F2]/40'}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === 'insured_delivery'}
                  onChange={() => setDeliveryType('insured_delivery')}
                  className="mt-1 accent-[#0B3B2E]"
                />
                <div className="text-xs">
                  <div className="font-bold text-[#11221C]">ارسال تشریفاتی با مامور ویژه و بیمه ۱۰۰٪ ارزش محموله</div>
                  <div className="text-[#65786E] text-[11px] mt-1">تحویل امن در بسته‌بندی پلمب‌شده درب نشانی شما</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${deliveryType === 'pickup_branch_1' ? 'border-[#0B3B2E] bg-[#FAF7F2] ring-1 ring-[#0B3B2E]' : 'border-[#E5DEC9] bg-white hover:bg-[#FAF7F2]/40'}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === 'pickup_branch_1'}
                  onChange={() => setDeliveryType('pickup_branch_1')}
                  className="mt-1 accent-[#0B3B2E]"
                />
                <div className="text-xs">
                  <div className="font-bold text-[#11221C]">تحویل حضوری در شعبه ۱: طلا رضا خلیلاوی</div>
                  <div className="text-[#65786E] text-[11px] mt-1">نشانی: اهواز، خیابان نادری، بین دو درب کارون، پاساژ حسنی</div>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${deliveryType === 'pickup_branch_2' ? 'border-[#0B3B2E] bg-[#FAF7F2] ring-1 ring-[#0B3B2E]' : 'border-[#E5DEC9] bg-white hover:bg-[#FAF7F2]/40'}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryType === 'pickup_branch_2'}
                  onChange={() => setDeliveryType('pickup_branch_2')}
                  className="mt-1 accent-[#0B3B2E]"
                />
                <div className="text-xs">
                  <div className="font-bold text-[#11221C]">تحویل حضوری در شعبه ۲: شمش رضا خلیلاوی (شمش و سکه آینور)</div>
                  <div className="text-[#65786E] text-[11px] mt-1">نشانی: اهواز، اول نادری، به سمت سی‌متری، پشت کیوسک بانک شهر</div>
                </div>
              </label>
            </div>

            {deliveryType === 'insured_delivery' && (
              <div className="mt-4 pt-4 border-t border-[#EDE7D8]">
                <label className="block text-xs font-bold text-[#2D3C34] mb-1.5">
                  نشانی کامل پستی و کد پستی گیرنده *
                </label>
                <textarea
                  rows={2}
                  placeholder="استان، شهر، خیابان، پلاک، واحد و کد پستی ۱۰ رقمی"
                  value={postalAddress}
                  onChange={(e) => setPostalAddress(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#DCD4C2] bg-[#FAF7F2]/50 text-xs focus:outline-hidden focus:ring-1 focus:ring-[#0B3B2E] focus:bg-white transition-all"
                />
              </div>
            )}
          </div>

          {/* Step 3: Payment Type - CASH vs INSTALLMENT */}
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-5 sm:p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#0B3B2E] flex items-center gap-2 mb-4 pb-3 border-b border-[#EDE7D8]">
              <CreditCard className="w-4 h-4 text-[#C5A059]" />
              ۳. روش تسویه‌حساب (نقدی یا اقساطی)
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMode('cash')}
                className={`py-3.5 px-4 rounded-2xl border text-center transition-all cursor-pointer min-h-[48px] ${
                  paymentMode === 'cash'
                    ? 'border-[#0B3B2E] bg-[#0B3B2E] text-white font-bold shadow-xs'
                    : 'border-[#E5DEC9] bg-[#FAF7F2] text-[#55675E]'
                }`}
              >
                <div className="text-xs">پرداخت نقدی آنلاین</div>
                <div className={`text-[10px] mt-0.5 ${paymentMode === 'cash' ? 'text-[#E6C987]' : 'text-[#708077]'}`}>
                  درگاه امن شاپرک
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMode('installment')}
                className={`py-3.5 px-4 rounded-2xl border text-center transition-all cursor-pointer min-h-[48px] ${
                  paymentMode === 'installment'
                    ? 'border-[#0B3B2E] bg-[#0B3B2E] text-white font-bold shadow-xs'
                    : 'border-[#E5DEC9] bg-[#FAF7F2] text-[#55675E]'
                }`}
              >
                <div className="text-xs">طرح اقساطی خلیلاوی</div>
                <div className={`text-[10px] mt-0.5 ${paymentMode === 'installment' ? 'text-[#E6C987]' : 'text-[#708077]'}`}>
                  با چک صیادی یا ضمانت طلا
                </div>
              </button>
            </div>

            {paymentMode === 'installment' && (
              <div className="bg-[#FAF7F2] border border-[#E3DAC7] rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="text-xs font-bold text-[#0B3B2E]">
                  تنظیم شرایط اقساط فاکتور:
                </div>

                {/* Down payment ratio */}
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-[#11221C] mb-1.5">
                    <span>درصد پیش‌پرداخت: {formatNumberFa(downPercent)}٪</span>
                    <span className="text-[#0B3B2E] tabular-nums">{formatPriceToman(downPaymentAmount)} تومان</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="5"
                    value={downPercent}
                    onChange={(e) => setDownPercent(Number(e.target.value))}
                    className="w-full accent-[#0B3B2E] cursor-pointer"
                  />
                </div>

                {/* Months selection */}
                <div>
                  <label className="block text-xs font-bold text-[#11221C] mb-2">مدت بازپرداخت:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {([3, 6, 9, 12] as const).map((m) => (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMonths(m)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[42px] ${
                          months === m
                            ? 'bg-[#0B3B2E] text-white border-[#0B3B2E]'
                            : 'bg-white text-[#4A5951] border-[#E5DEC9]'
                        }`}
                      >
                        {formatNumberFa(m)} ماه
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guarantee Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#11221C] mb-2">نوع ضمانت اقساط: *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGuaranteeType('sayyadi_check')}
                      className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                        guaranteeType === 'sayyadi_check'
                          ? 'border-[#0B3B2E] bg-white font-bold text-[#0B3B2E] ring-1 ring-[#0B3B2E]'
                          : 'border-[#E5DEC9] bg-white/70 text-[#506359]'
                      }`}
                    >
                      <div className="text-xs">چک صیادی بنفش (ثبتی)</div>
                      <div className="text-[10px] text-[#708077] font-normal mt-0.5">ثبت در سامانه صیاد بانک مرکزی</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGuaranteeType('gold_collateral')}
                      className={`p-3.5 rounded-xl border text-right transition-all cursor-pointer ${
                        guaranteeType === 'gold_collateral'
                          ? 'border-[#0B3B2E] bg-white font-bold text-[#0B3B2E] ring-1 ring-[#0B3B2E]'
                          : 'border-[#E5DEC9] bg-white/70 text-[#506359]'
                      }`}
                    >
                      <div className="text-xs">امانت طلا در صندوق امانات</div>
                      <div className="text-[10px] text-[#708077] font-normal mt-0.5">امانت‌گذاری معادل بدهی در شعبه</div>
                    </button>
                  </div>
                </div>

                {guaranteeType === 'sayyadi_check' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#2D3C34] mb-1.5">
                      شناسه ۱۶ رقمی صیادی چک *
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      maxLength={16}
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      value={sayyadiCheckId}
                      onChange={(e) => setSayyadiCheckId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#DCD4C2] bg-white text-xs text-center font-mono focus:outline-hidden focus:ring-1 focus:ring-[#0B3B2E]"
                    />
                  </div>
                ) : (
                  <div className="p-3.5 bg-white border border-[#E3DAC7] rounded-xl text-xs space-y-1 text-[#425048]">
                    <div className="font-bold text-[#0B3B2E]">میزان طلای ضمانتی مورد نیاز:</div>
                    <div>جهت پوشش مانده اقساط، میزان <span className="font-bold text-[#0B3B2E] tabular-nums">{formatNumberFa(requiredCollateralGrams)} گرم</span> طلای ۱۸ عیار در صندوق امانات خلیلاوی گلد تا پایان اقساط به امانت قرار می‌گیرد.</div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Summary & Invoice (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
          <div className="bg-white border border-[#E5DEC9] rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#0B3B2E] pb-3 border-b border-[#EDE7D8]">
              خلاصه پیش‌فاکتور رسمی خلیلاوی گلد
            </h3>

            {/* Mini Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start text-xs border-b border-[#F3EFE6] pb-2.5">
                  <div className="flex-1 pl-2">
                    <div className="font-bold text-[#11221C] truncate">{item.product.title}</div>
                    <div className="text-[11px] text-[#708077] mt-0.5 tabular-nums">
                      {formatNumberFa(item.quantity)} عدد · {formatNumberFa(Number((item.product.weightGrams * item.quantity).toFixed(2)))} گرم
                    </div>
                  </div>
                  <div className="font-bold text-[#0B3B2E] tabular-nums shrink-0">
                    {formatPriceToman(item.calculatedPrice * item.quantity)} ت
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 text-xs text-[#3E4E45] pt-2">
              <div className="flex justify-between items-center">
                <span>وزن کل طلای سفارش:</span>
                <span className="font-bold tabular-nums text-[#11221C]">{formatNumberFa(Number(totalWeight.toFixed(2)))} گرم</span>
              </div>

              <div className="flex justify-between items-center">
                <span>مبلغ پایه نقدی:</span>
                <span className="font-bold tabular-nums text-[#11221C]">{formatPriceToman(totalRawPrice)} تومان</span>
              </div>

              {paymentMode === 'installment' && (
                <>
                  <div className="flex justify-between items-center text-emerald-800">
                    <span>پیش‌پرداخت نقدی هم‌اکنون:</span>
                    <span className="font-bold tabular-nums">{formatPriceToman(downPaymentAmount)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center text-[#0B3B2E]">
                    <span>مبلغ هر قسط ({formatNumberFa(months)} ماه):</span>
                    <span className="font-extrabold tabular-nums">{formatPriceToman(monthlyInstallment)} تومان</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-[#708077]">
                    <span>کل مبلغ فاکتور اقساطی:</span>
                    <span className="tabular-nums font-semibold">{formatPriceToman(totalInstallmentPrice)} تومان</span>
                  </div>
                </>
              )}
            </div>

            {/* Final Pay Action */}
            <div className="pt-4 border-t border-[#EDE7D8]">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-4 rounded-2xl bg-[#0B3B2E] text-white font-bold text-xs sm:text-sm hover:bg-[#072920] transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 disabled:opacity-50 min-h-[48px]"
              >
                {isSubmitting ? (
                  <span>در حال ثبت رسمی سفارش...</span>
                ) : paymentMode === 'cash' ? (
                  <span>پرداخت و صدور فاکتور ({formatPriceToman(totalRawPrice)} تومان)</span>
                ) : (
                  <span>ثبت نهایی قرارداد اقساطی ({formatPriceToman(downPaymentAmount)} ت پیش‌پرداخت)</span>
                )}
              </motion.button>

              <div className="mt-3 text-[10px] text-center text-[#708077] flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>تضمین اصالت و بازخرید رسمی اتحادیه طلا و جواهر</span>
              </div>
            </div>

          </div>
        </div>

      </form>
    </motion.div>
  );
};
