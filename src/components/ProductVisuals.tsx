import React from 'react';
import { motion } from 'motion/react';

interface ProductImageProps {
  type: string;
  className?: string;
  alt?: string;
}

export const ProductImageVisual: React.FC<ProductImageProps> = ({ type, className = '', alt }) => {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FBF9F4] via-[#F4EFE4] to-[#E8DEC8] select-none ${className}`}>
      {/* Subtle luxury radial light aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,250,235,0.85),transparent_70%)] pointer-events-none" />
      
      {/* Fine architectural grid lines */}
      <div className="absolute inset-4 border border-[#C5A059]/20 rounded-xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {type === 'necklace' && (
          <svg viewBox="0 0 360 360" className="w-full h-full p-6 drop-shadow-[0_14px_24px_rgba(140,105,30,0.18)]" fill="none">
            <defs>
              <linearGradient id="luxGold1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4DFAA" />
                <stop offset="25%" stopColor="#FFF7E2" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="78%" stopColor="#9A721C" />
                <stop offset="100%" stopColor="#E6C677" />
              </linearGradient>
              <linearGradient id="luxEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#146B52" />
                <stop offset="50%" stopColor="#0B3B2E" />
                <stop offset="100%" stopColor="#051F18" />
              </linearGradient>
            </defs>
            <circle cx="180" cy="180" r="126" fill="#FCFBF8" stroke="#E2D7C1" strokeWidth="1" />
            <circle cx="180" cy="180" r="116" stroke="#C5A059" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
            {/* Double layered royal chain */}
            <path d="M 88,92 C 88,225 272,225 272,92" stroke="url(#luxGold1)" strokeWidth="10" strokeLinecap="round" strokeDasharray="16 5" />
            <path d="M 104,85 C 104,205 256,205 256,85" stroke="url(#luxGold1)" strokeWidth="3.5" opacity="0.85" />
            {/* Imperial Pendant */}
            <g transform="translate(180, 218)">
              <polygon points="0,-28 26,0 0,28 -26,0" fill="url(#luxGold1)" />
              <polygon points="0,-20 18,0 0,20 -18,0" fill="url(#luxEmerald)" />
              <circle cx="0" cy="0" r="5" fill="#FFF7DF" />
            </g>
          </svg>
        )}

        {type === 'bangle' && (
          <svg viewBox="0 0 360 360" className="w-full h-full p-6 drop-shadow-[0_14px_24px_rgba(140,105,30,0.18)]" fill="none">
            <defs>
              <linearGradient id="luxBangle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9E8B2" />
                <stop offset="30%" stopColor="#FFF8E6" />
                <stop offset="55%" stopColor="#D4AF37" />
                <stop offset="80%" stopColor="#8E6614" />
                <stop offset="100%" stopColor="#E5C168" />
              </linearGradient>
            </defs>
            <circle cx="180" cy="180" r="124" fill="#FCFBF8" stroke="#E2D7C1" strokeWidth="1" />
            <g transform="rotate(-18 180 180)">
              <ellipse cx="180" cy="180" rx="98" ry="74" stroke="url(#luxBangle)" strokeWidth="22" />
              <ellipse cx="180" cy="180" rx="98" ry="74" stroke="#FFF9EB" strokeWidth="2" strokeDasharray="8 10" />
              {/* Emerald Clasp Accents */}
              <rect x="74" y="172" width="12" height="16" rx="3" fill="#0B3B2E" stroke="#F9E8B2" strokeWidth="1.5" />
              <rect x="274" y="172" width="12" height="16" rx="3" fill="#0B3B2E" stroke="#F9E8B2" strokeWidth="1.5" />
            </g>
          </svg>
        )}

        {type === 'ring' && (
          <svg viewBox="0 0 360 360" className="w-full h-full p-6 drop-shadow-[0_14px_24px_rgba(140,105,30,0.18)]" fill="none">
            <defs>
              <linearGradient id="luxRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F3DC99" />
                <stop offset="40%" stopColor="#FFF7E4" />
                <stop offset="70%" stopColor="#C89D32" />
                <stop offset="100%" stopColor="#926A12" />
              </linearGradient>
            </defs>
            <circle cx="180" cy="180" r="124" fill="#FCFBF8" stroke="#E2D7C1" strokeWidth="1" />
            <ellipse cx="180" cy="198" rx="70" ry="52" stroke="url(#luxRing)" strokeWidth="16" />
            <ellipse cx="180" cy="198" rx="66" ry="48" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.65" />
            {/* Solitaire Diamond & Prongs */}
            <g transform="translate(180, 136)">
              <path d="M -20,12 L -28,-8 L -10,-4 L 0,-22 L 10,-4 L 28,-8 L 20,12 Z" fill="url(#luxRing)" />
              <polygon points="0,-20 20,-5 14,10 -14,10 -20,-5" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1.5" />
              <polygon points="0,-20 8,-5 0,10 -8,-5" fill="#FFFFFF" opacity="0.9" />
            </g>
          </svg>
        )}

        {type === 'earrings' && (
          <svg viewBox="0 0 360 360" className="w-full h-full p-6 drop-shadow-[0_14px_24px_rgba(140,105,30,0.18)]" fill="none">
            <defs>
              <linearGradient id="luxEar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F6E2A4" />
                <stop offset="50%" stopColor="#CFA53E" />
                <stop offset="100%" stopColor="#855E0D" />
              </linearGradient>
            </defs>
            <circle cx="180" cy="180" r="124" fill="#FCFBF8" stroke="#E2D7C1" strokeWidth="1" />
            <g transform="translate(132, 96)">
              <circle cx="0" cy="0" r="8" fill="url(#luxEar)" />
              <line x1="0" y1="8" x2="0" y2="56" stroke="url(#luxEar)" strokeWidth="4" />
              <polygon points="0,56 22,96 0,136 -22,96" stroke="url(#luxEar)" strokeWidth="5" fill="#0B3B2E" />
              <circle cx="0" cy="96" r="5" fill="#FFF3CC" />
            </g>
            <g transform="translate(228, 96)">
              <circle cx="0" cy="0" r="8" fill="url(#luxEar)" />
              <line x1="0" y1="8" x2="0" y2="56" stroke="url(#luxEar)" strokeWidth="4" />
              <polygon points="0,56 22,96 0,136 -22,96" stroke="url(#luxEar)" strokeWidth="5" fill="#0B3B2E" />
              <circle cx="0" cy="96" r="5" fill="#FFF3CC" />
            </g>
          </svg>
        )}

        {(type === 'bullion_100g' || type === 'bullion_10g') && (
          <svg viewBox="0 0 360 360" className="w-full h-full p-5 drop-shadow-[0_18px_28px_rgba(11,59,46,0.18)]" fill="none">
            <defs>
              <linearGradient id="luxBar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF8DE" />
                <stop offset="28%" stopColor="#EBC974" />
                <stop offset="55%" stopColor="#CEA135" />
                <stop offset="85%" stopColor="#8A6210" />
                <stop offset="100%" stopColor="#DFBA60" />
              </linearGradient>
            </defs>
            {/* Certicard Security Case */}
            <rect x="82" y="42" width="196" height="276" rx="18" fill="#0B3B2E" stroke="#C5A059" strokeWidth="2" />
            <rect x="92" y="52" width="176" height="256" rx="12" stroke="#C5A059" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
            <text x="180" y="74" textAnchor="middle" fill="#E6C987" fontSize="9" fontWeight="bold" letterSpacing="2">KHALILAVI BULLION VAULT</text>
            {/* Gold Ingot */}
            <rect x="114" y="90" width="132" height="176" rx="10" fill="url(#luxBar)" stroke="#FFF3C4" strokeWidth="1.5" />
            <rect x="120" y="96" width="120" height="164" rx="7" stroke="#5E4208" strokeWidth="1" opacity="0.3" />
            <text x="180" y="128" textAnchor="middle" fill="#3D2900" fontSize="13" fontWeight="bold" letterSpacing="1.5">VALCAMBI</text>
            <text x="180" y="144" textAnchor="middle" fill="#3D2900" fontSize="9" letterSpacing="2">SUISSE</text>
            <line x1="138" y1="154" x2="222" y2="154" stroke="#3D2900" strokeWidth="1" opacity="0.35" />
            <text x="180" y="182" textAnchor="middle" fill="#2A1B00" fontSize="22" fontWeight="bold">
              {type === 'bullion_100g' ? '100 g' : '10 g'}
            </text>
            <text x="180" y="202" textAnchor="middle" fill="#3D2900" fontSize="10" fontWeight="bold" letterSpacing="1">FINE GOLD</text>
            <text x="180" y="220" textAnchor="middle" fill="#3D2900" fontSize="13" fontWeight="bold">999,9</text>
            <rect x="148" y="232" width="64" height="16" rx="3" stroke="#3D2900" strokeWidth="0.8" opacity="0.6" />
            <text x="180" y="243" textAnchor="middle" fill="#3D2900" fontSize="8" fontFamily="monospace" fontWeight="bold">AA849201</text>
            <text x="180" y="290" textAnchor="middle" fill="#C5A059" fontSize="9" letterSpacing="1">CERTIFIED ASSAY GUARANTEED</text>
          </svg>
        )}

        {(type === 'coin_emami' || type === 'coin_bahar') && (
          <svg viewBox="0 0 360 360" className="w-full h-full p-6 drop-shadow-[0_16px_26px_rgba(140,105,30,0.22)]" fill="none">
            <defs>
              <linearGradient id="luxCoin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF7DC" />
                <stop offset="25%" stopColor="#E8C56B" />
                <stop offset="55%" stopColor="#CC9E33" />
                <stop offset="85%" stopColor="#875F0D" />
                <stop offset="100%" stopColor="#E4C065" />
              </linearGradient>
            </defs>
            {/* Royal Vacuum Frame */}
            <rect x="56" y="56" width="248" height="248" rx="24" fill="#0B3B2E" stroke="#C5A059" strokeWidth="2" />
            <rect x="66" y="66" width="228" height="228" rx="18" stroke="#C5A059" strokeWidth="0.75" opacity="0.4" />
            <text x="180" y="88" textAnchor="middle" fill="#E6C987" fontSize="10" fontWeight="bold">وکیوم امنیتی ضدجعل خلیلاوی گلد</text>
            {/* Gold Coin */}
            <circle cx="180" cy="182" r="76" fill="url(#luxCoin)" stroke="#FFF2BA" strokeWidth="2" />
            <circle cx="180" cy="182" r="71" stroke="#5E4208" strokeWidth="3" strokeDasharray="3 2" opacity="0.6" />
            <circle cx="180" cy="182" r="62" stroke="#FFF2BA" strokeWidth="1" opacity="0.8" />
            {/* Shrine / Arch Motif */}
            <g transform="translate(180, 182)" stroke="#3D2900" strokeWidth="1.5" fill="none">
              <path d="M -32,18 C -32,-28 32,-28 32,18 Z" fill="#C29329" fillOpacity="0.25" />
              <line x1="-40" y1="22" x2="40" y2="22" strokeWidth="2" />
              <line x1="-28" y1="28" x2="28" y2="28" strokeWidth="1.5" />
              <circle cx="0" cy="-30" r="4" fill="#3D2900" />
            </g>
            <text x="180" y="280" textAnchor="middle" fill="#C5A059" fontSize="9.5" fontWeight="bold">بانک مرکزی جمهوری اسلامی ایران · ضرب ۱۳۸۶</text>
          </svg>
        )}
      </motion.div>
      <span className="sr-only">{alt}</span>
    </div>
  );
};
