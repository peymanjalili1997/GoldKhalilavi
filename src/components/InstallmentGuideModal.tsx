import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, FileText } from 'lucide-react';

interface InstallmentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallmentGuideModal: React.FC<InstallmentGuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative w-full max-w-2xl bg-[#FAF7F2] border-t sm:border border-[#E5DEC9] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden z-10 max-h-[88vh] overflow-y-auto"
          >
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1.5 bg-[#D8D0C0] rounded-full mx-auto mb-4 sm:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D1] mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B3B2E]">راهنمای خرید اقساطی خلیلاوی گلد</h2>
                <p className="text-xs text-[#708077] mt-1">
                  شرایط ویژه خرید اعتباری طلا، سکه و شمش با تحویل فوری
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#708077] hover:text-[#0B3B2E] hover:bg-[#F3EFE6] transition-colors cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3 Step Guide */}
            <div className="space-y-4 text-xs text-[#3E4E45]">
              
              <div className="bg-white border border-[#E8E1D1] rounded-2xl p-4 sm:p-5 space-y-2">
                <h3 className="font-bold text-sm text-[#0B3B2E] flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0B3B2E] text-[#E6C987] flex items-center justify-center text-xs font-bold">۱</span>
                  انتخاب کالا و پرداخت ۲۰٪ تا ۵۰٪ پیش‌پرداخت
                </h3>
                <p className="leading-relaxed">
                  شما می‌توانید هر یک از محصولات طلای ۱۸ عیار، شمش‌های ۲۴ عیار یا سکه‌های بانکی را انتخاب کرده و با پرداخت ۲۰٪ الی ۵۰٪ مبلغ به عنوان پیش‌پرداخت، مابقی را در اقساط ۳، ۶، ۹ یا ۱۲ ماهه تسویه نمایید.
                </p>
              </div>

              <div className="bg-white border border-[#E8E1D1] rounded-2xl p-4 sm:p-5 space-y-3">
                <h3 className="font-bold text-sm text-[#0B3B2E] flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0B3B2E] text-[#E6C987] flex items-center justify-center text-xs font-bold">۲</span>
                  انتخاب یکی از دو روش ضمانت معتبر
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E5DEC9]">
                    <div className="font-bold text-[#0B3B2E] flex items-center gap-1.5 mb-1">
                      <FileText className="w-4 h-4 text-[#C5A059]" />
                      روش اول: چک صیادی بنفش
                    </div>
                    <div className="text-[11px] leading-relaxed text-[#60736A]">
                      ارائه چک صیادی ثبتی با وضعیت اعتباری سفید در سامانه صیاد بانک مرکزی بدون نیاز به ضامن.
                    </div>
                  </div>

                  <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E5DEC9]">
                    <div className="font-bold text-[#0B3B2E] flex items-center gap-1.5 mb-1">
                      <Scale className="w-4 h-4 text-[#C5A059]" />
                      روش دوم: امانت‌گذاری طلا
                    </div>
                    <div className="text-[11px] leading-relaxed text-[#60736A]">
                      امانت گذاشتن طلا به میزان ۱۱۰٪ مانده بدهی در صندوق امانات خلیلاوی گلد با صدور رسید رسمی امانت.
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#E8E1D1] rounded-2xl p-4 sm:p-5 space-y-2">
                <h3 className="font-bold text-sm text-[#0B3B2E] flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0B3B2E] text-[#E6C987] flex items-center justify-center text-xs font-bold">۳</span>
                  تحویل فوری سفارش همراه با فاکتور رسمی
                </h3>
                <p className="leading-relaxed">
                  پس از تایید ضمانت، قطعه طلای خریداری‌شده بلافاصله به همراه فاکتور رسمی اتحادیه به شما تحویل می‌گردد.
                </p>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E1D1] text-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0B3B2E] text-white text-xs font-bold hover:bg-[#072920] transition-colors cursor-pointer min-h-[44px]"
              >
                متوجه شدم
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
