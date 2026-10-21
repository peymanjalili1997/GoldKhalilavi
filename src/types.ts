export type ProductCategory = 'jewelry_18k' | 'bullion_24k' | 'coin';

export type BranchId = 'branch_jewelry' | 'branch_bullion';

export interface BranchInfo {
  id: BranchId;
  name: string;
  subTitle: string;
  address: string;
  phone: string;
  workingHours: string;
  specialty: string;
  instagramHandle?: string;
  instagramUrl?: string;
  manager?: string;
}

export interface LiveMarketRates {
  gold18kGram: number; // Toman per gram
  gold24kGram: number; // Toman per gram
  goldOunceUSD: number; // USD
  usdTomans: number; // Toman
  emamiCoin: number; // Toman
  halfCoin: number; // Toman
  quarterCoin: number; // Toman
  lastUpdate: string;
  changes: {
    gold18k: number; // percentage (+0.45 or -0.2)
    gold24k: number;
    usd: number;
    emamiCoin: number;
  };
}

export interface GoldProduct {
  id: string;
  title: string;
  branchId: BranchId;
  category: ProductCategory;
  categoryName: string;
  weightGrams: number;
  karat: 18 | 24;
  purity: string; // e.g., '750' or '999.9'
  wagePercent: number; // اجرت ساخت درصد
  taxPercent: number; // 9% بر اجرت و سود
  profitPercent: number; // 7% سود متعارف
  fixedBonusFee?: number; // حق ضرب یا حباب سکه و شمش در صورت وجود
  inStock: boolean;
  stockCount: number;
  badge?: string;
  description: string;
  features: string[];
  dimensions: string;
  hallmarkCode: string; // کد استاندارد اتحادیه / شماره سریال
  imageType: 'necklace' | 'bangle' | 'ring' | 'bullion_100g' | 'bullion_10g' | 'coin_emami' | 'coin_bahar' | 'earrings';
}

export interface CartItem {
  product: GoldProduct;
  quantity: number;
  calculatedPrice: number;
}

export interface InstallmentPlan {
  downPaymentPercent: number; // e.g. 30%
  monthsCount: 3 | 6 | 9 | 12;
  monthlyInterestRate: number; // 2.5% per month
  guaranteeType: 'sayyadi_check' | 'gold_collateral';
  sayyadiId?: string;
}
