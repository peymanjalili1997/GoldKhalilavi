import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRANCHES } from '../mockData';
import { X, MapPin, Phone, Clock, Award } from 'lucide-react';

interface BranchesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BranchesModal: React.FC<BranchesModalProps> = ({ isOpen, onClose }) => {
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
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B3B2E]">نشانی شعب حضوری خلیلاوی گلد</h2>
                <p className="text-xs text-[#708077] mt-1">
                  مراجعه حضوری جهت تحویل سفارش، امانت‌گذاری طلا و مشاوره تخصصی
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#708077] hover:text-[#0B3B2E] hover:bg-[#F3EFE6] transition-colors cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Branches List */}
            <div className="space-y-5">
              {Object.values(BRANCHES).map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white border border-[#E8E1D1] rounded-2xl p-5 shadow-xs space-y-3"
                >
                  <div>
                    <h3 className="font-bold text-base text-[#0B3B2E]">{branch.name}</h3>
                    <div className="text-xs text-[#8A7A5D] font-medium mt-0.5">{branch.subTitle}</div>
                  </div>

                  <div className="space-y-2.5 text-xs text-[#425048] pt-3 border-t border-[#F0EBE0]">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <span className="font-medium text-[#11221C]">{branch.address}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span className="font-mono text-sm tracking-wide text-[#0B3B2E] font-bold">{branch.phone}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                      <span>{branch.workingHours}</span>
                    </div>

                    <div className="flex items-start gap-2.5 pt-1 text-[#60736A]">
                      <Award className="w-4 h-4 text-[#0B3B2E] shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-relaxed">{branch.specialty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#E8E1D1] text-center">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#0B3B2E] text-white text-xs font-bold hover:bg-[#072920] transition-colors cursor-pointer min-h-[44px]"
              >
                بستن پنجره
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
