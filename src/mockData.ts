import { GoldProduct, LiveMarketRates, BranchInfo } from './types';

export const BRANCHES: Record<string, BranchInfo> = {
  branch_jewelry: {
    id: 'branch_jewelry',
    name: 'شعبه ۱: طلا رضا خلیلاوی (طلا و جواهرات)',
    subTitle: 'طراحی، ساخت و عرضه جدیدترین مصنوعات و کالکشن‌های طلای ۱۸ عیار لوکس',
    address: 'اهواز، خیابان نادری، بین دو درب کارون، پاساژ حسنی',
    phone: '۰۹۰۳۱۵۱۱۸۱۶',
    workingHours: 'صبح: ۰۹:۳۰ الی ۱۳:۳۰ | عصر: ۱۷:۰۰ الی ۲۲:۰۰',
    specialty: 'عرضه حضوری و آنلاین جدیدترین طلا و جواهرات ۱۸ عیار، سرویس‌های عروس و النگو با تاییدیه عیار اتحادیه',
    instagramHandle: 'khalilavi.jewellery',
    instagramUrl: 'https://instagram.com/khalilavi.jewellery',
    manager: 'رضا خلیلاوی (@rezakhalilavi_69)'
  },
  branch_bullion: {
    id: 'branch_bullion',
    name: 'شعبه ۲: شمش رضا خلیلاوی (شمش و سکه آینور)',
    subTitle: 'مرکز تخصصی معاملات شمش و سکه، تحلیل قیمت و نبض بازار طلا',
    address: 'اهواز، اول نادری، به سمت سی‌متری، پشت کیوسک بانک شهر',
    phone: '۰۹۰۳۱۵۱۱۸۱۶',
    workingHours: 'صبح: ۰۹:۳۰ الی ۱۳:۳۰ | عصر: ۱۷:۰۰ الی ۲۲:۰۰',
    specialty: 'معاملات عمده و تک شمش‌های ۲۴ عیار استاندارد و مسکوکات بانکی به صورت حضوری و آنلاین با تحویل آنی',
    instagramHandle: 'khalilavi.gold',
    instagramUrl: 'https://instagram.com/khalilavi.gold',
    manager: 'رضا خلیلاوی'
  }
};

export const INITIAL_RATES: LiveMarketRates = {
  gold18kGram: 4645000, // ۴,۶۴۵,۰۰۰ تومان
  gold24kGram: 6193000, // ۶,۱۹۳,۰۰۰ تومان
  goldOunceUSD: 2748.8,
  usdTomans: 68650, // ۶۸,۶۵۰ تومان
  emamiCoin: 54100000, // ۵۴,۱۰۰,۰۰۰ تومان
  halfCoin: 29100000,
  quarterCoin: 18600000,
  lastUpdate: 'به‌روزرسانی لحظه‌ای اتحادیه',
  changes: {
    gold18k: +0.54,
    gold24k: +0.58,
    usd: +0.22,
    emamiCoin: +0.76
  }
};

/**
 * Persian Gold Price Calculation based on Union Rules:
 * قیمت کل طلا = قیمت طلای خام + اجرت ساخت + سود فروشنده (۷٪) + مالیات ارزش افزوده (۱۰٪ بر سود و اجرت)
 */
export function calculateProductPrice(product: GoldProduct, rates: LiveMarketRates): {
  rawGoldPrice: number;
  wageAmount: number;
  profitAmount: number;
  taxAmount: number;
  totalPrice: number;
  perGramFinal: number;
} {
  const baseGramRate = product.karat === 24 ? rates.gold24kGram : rates.gold18kGram;
  const rawGoldPrice = Math.round(product.weightGrams * baseGramRate);

  if (product.category === 'coin') {
    const baseCoinPrice = product.id === 'p-coin-1' 
      ? rates.emamiCoin 
      : product.id === 'p-coin-2' 
      ? rates.halfCoin 
      : rates.quarterCoin;
    
    return {
      rawGoldPrice: Math.round(product.weightGrams * baseGramRate),
      wageAmount: 0,
      profitAmount: Math.round(baseCoinPrice * 0.01),
      taxAmount: 0,
      totalPrice: baseCoinPrice,
      perGramFinal: Math.round(baseCoinPrice / product.weightGrams)
    };
  }

  const wageAmount = Math.round(rawGoldPrice * (product.wagePercent / 100));
  const profitAmount = Math.round((rawGoldPrice + wageAmount) * (product.profitPercent / 100));
  const taxAmount = Math.round((wageAmount + profitAmount) * (product.taxPercent / 100));
  const totalPrice = rawGoldPrice + wageAmount + profitAmount + taxAmount;
  const perGramFinal = Math.round(totalPrice / product.weightGrams);

  return {
    rawGoldPrice,
    wageAmount,
    profitAmount,
    taxAmount,
    totalPrice,
    perGramFinal
  };
}

export function formatPriceToman(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount);
}

export function formatNumberFa(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(num);
}

export const INITIAL_PRODUCTS: GoldProduct[] = [
  {
    id: 'p-jwl-1',
    title: 'گردنبند رویال کارتیه طلای ۱۸ عیار',
    branchId: 'branch_jewelry',
    category: 'jewelry_18k',
    categoryName: 'طلا و جواهر ۱۸ عیار',
    weightGrams: 16.45,
    karat: 18,
    purity: '750',
    wagePercent: 12.5,
    taxPercent: 10,
    profitPercent: 7,
    inStock: true,
    stockCount: 5,
    badge: 'کالکشن رویال',
    description: 'گردنبند بافت زنجیری دست‌ساز کارتیه ۱۸ عیار با قفل مخفی دوقفل ایمن. صیقل آینه‌ای و تراش الماسی توسط استادکاران ارشد خلیلاوی گلد.',
    features: ['طلای زرد ۱۸ عیار استاندارد ۷۵۰', 'دارای کد رهگیری و هولوگرام رسمی اتحادیه', 'قفل دوطرفه ضد بازشدن با حک لیزری برند', 'جعبه مخملی سلطنتی همراه با سرتیفیکیت اصالت'],
    dimensions: 'طول: ۵۰ سانتی‌متر | عرض زنجیر: ۵.۲ میلی‌متر',
    hallmarkCode: 'KG-T750-1082',
    imageType: 'necklace'
  },
  {
    id: 'p-jwl-2',
    title: 'دستبند النگویی امپریال زمرد و طلا',
    branchId: 'branch_jewelry',
    category: 'jewelry_18k',
    categoryName: 'طلا و جواهر ۱۸ عیار',
    weightGrams: 24.80,
    karat: 18,
    purity: '750',
    wagePercent: 14.0,
    taxPercent: 10,
    profitPercent: 7,
    inStock: true,
    stockCount: 3,
    badge: 'ساخت محدود',
    description: 'دستبند النگویی فریم سخت با تراش‌های الماسی و پرداخت مات ابریشمی و براق ترکیبی. الهام‌گرفته از جواهرات سلطنتی مدرن.',
    features: ['طلای ۱۸ عیار خالص با آلیاژ ضدحساسیت', 'استحکام بالا در برابر تغییر فرم', 'تاییدیه رسمی آزمایشگاه ری‌گیری تهران'],
    dimensions: 'قطر داخلی: ۶۰ میلی‌متر (سایز ۲ استاندارد)',
    hallmarkCode: 'KG-T750-2094',
    imageType: 'bangle'
  },
  {
    id: 'p-bar-1',
    title: 'شمش ۱۰۰ گرمی طلای ۲۴ عیار والکامبی سوئیس',
    branchId: 'branch_bullion',
    category: 'bullion_24k',
    categoryName: 'شمش طلای ۲۴ عیار',
    weightGrams: 100.00,
    karat: 24,
    purity: '999.9',
    wagePercent: 2.0,
    taxPercent: 0,
    profitPercent: 1.5,
    inStock: true,
    stockCount: 4,
    badge: 'پلمپ سوئیسی LBMA',
    description: 'شمش ۱۰۰ گرمی طلای ناب سوئیسی Valcambi با خلوص ۹۹۹.۹ دارای سرتیفیکیت معتبر بین‌المللی، بارکد اسکن اصالت و شماره سریال جهانی.',
    features: ['بالاترین خلوص طلای جهانی (۹۹۹.۹)', 'دارای تاییدیه رسمی LBMA لندن', 'وکیوم امنیتی ضد دستکاری با شماره سریال منطبق', 'تضمین بازخرید آنی به نرخ روز در تمامی شعب'],
    dimensions: '۵۵ × ۳۱ × ۳.۲ میلی‌متر',
    hallmarkCode: 'VC-CH-9999-88102',
    imageType: 'bullion_100g'
  },
  {
    id: 'p-coin-1',
    title: 'سکه تمام بهار آزادی طرح جدید (امامی ۸۶)',
    branchId: 'branch_bullion',
    category: 'coin',
    categoryName: 'سکه بانکی',
    weightGrams: 8.133,
    karat: 24,
    purity: '900',
    wagePercent: 0,
    taxPercent: 0,
    profitPercent: 1.0,
    inStock: true,
    stockCount: 15,
    badge: 'وکیوم هولوگرام‌دار',
    description: 'سکه تمام بهار آزادی طرح جدید ضرب ۱۳۸۶ بانک مرکزی ج.ا.ا بدون کوچک‌ترین خط و خش در وکیوم امنیتی ضدجعل خلیلاوی گلد.',
    features: ['ضرب رسمی بانک مرکزی سال ۱۳۸۶', 'وکیوم امنیتی هولوگرام‌دار خلیلاوی گلد', 'تضمین بازخرید نقدی به قیمت لحظه‌ای تابلو'],
    dimensions: 'قطر: ۲۲ میلی‌متر | عیار بانکی: ۹۰۰ در هزار',
    hallmarkCode: 'CBI-EMAMI-86',
    imageType: 'coin_emami'
  },
  {
    id: 'p-jwl-3',
    title: 'انگشتر سولیتر پرنسس طلای ۱۸ عیار',
    branchId: 'branch_jewelry',
    category: 'jewelry_18k',
    categoryName: 'طلا و جواهر ۱۸ عیار',
    weightGrams: 6.75,
    karat: 18,
    purity: '750',
    wagePercent: 11.0,
    taxPercent: 10,
    profitPercent: 7,
    inStock: true,
    stockCount: 8,
    badge: 'پرفروش‌ترین',
    description: 'انگشتر با رکاب تراش‌خورده مینیمال و نگین برلیان اتمی سواروسکی درجه یک؛ وزن سنگ از وزن نهایی طلا کسر گردیده است.',
    features: ['طلای خالص ۱۸ عیار استاندارد', 'کسر کامل وزن نگین در فاکتور رسمی', 'قابلیت تغییر سایز رایگان پیش از ارسال'],
    dimensions: 'سایز: ۵۴ (قابل سفارش از سایز ۵۰ تا ۶۰)',
    hallmarkCode: 'KG-T750-3112',
    imageType: 'ring'
  },
  {
    id: 'p-bar-2',
    title: 'شمش ۱۰ گرمی طلای ۲۴ عیار خلیلاوی رویال',
    branchId: 'branch_bullion',
    category: 'bullion_24k',
    categoryName: 'شمش طلای ۲۴ عیار',
    weightGrams: 10.00,
    karat: 24,
    purity: '999.9',
    wagePercent: 3.2,
    taxPercent: 0,
    profitPercent: 2.0,
    inStock: true,
    stockCount: 12,
    badge: 'مناسب سرمایه‌گذاری',
    description: 'شمش ۱۰ گرمی استاندارد ۲۴ عیار با خلوص ۹۹۹.۹، دارای کد استعلام اصالت، پلمب امنیتی لیزری و معاف از مالیات بر ارزش افزوده.',
    features: ['معاف از ۹٪ مالیات بر ارزش افزوده طلا', 'پلمپ امنیتی بانکی با QR کد اصالت', 'بهترین گزینه جهت حفظ ارزش سرمایه خرد و کلان'],
    dimensions: '۳۰ × ۱۸ × ۱.۱ میلی‌متر',
    hallmarkCode: 'KG-BAR24-1090',
    imageType: 'bullion_10g'
  },
  {
    id: 'p-jwl-4',
    title: 'گوشواره آویز هندسی ورساچه طلای ۱۸ عیار',
    branchId: 'branch_jewelry',
    category: 'jewelry_18k',
    categoryName: 'طلا و جواهر ۱۸ عیار',
    weightGrams: 9.40,
    karat: 18,
    purity: '750',
    wagePercent: 13.5,
    taxPercent: 10,
    profitPercent: 7,
    inStock: true,
    stockCount: 6,
    badge: 'طراحی ایتالیایی',
    description: 'گوشواره آویز با فرم هندسی مدرن و برش لیزری دقیق با درخشش خیره‌کننده در نور و قفل عصایی تقویت‌شده.',
    features: ['قفل عصایی فنری بسیار ایمن', 'پرداخت ترکیبی سندبلاست و آینه‌ای', 'سبک و متوازن روی گوش'],
    dimensions: 'ارتفاع آویز: ۴۴ میلی‌متر',
    hallmarkCode: 'KG-T750-4180',
    imageType: 'earrings'
  },
  {
    id: 'p-coin-2',
    title: 'نیم سکه بهار آزادی ضرب بانک مرکزی',
    branchId: 'branch_bullion',
    category: 'coin',
    categoryName: 'سکه بانکی',
    weightGrams: 4.066,
    karat: 24,
    purity: '900',
    wagePercent: 0,
    taxPercent: 0,
    profitPercent: 1.0,
    inStock: true,
    stockCount: 10,
    badge: 'تضمین اصالت',
    description: 'نیم سکه بهار آزادی بانکی با وزن دقیق ۴.۰۶۶ گرم، پلمپ هولوگرام‌دار با کد استعلام آنلاین و بسته‌بندی کادویی لوکس.',
    features: ['ضرب رسمی بانک مرکزی سال ۱۳۸۶', 'بسته‌بندی ضدخش با پلمپ امنیتی', 'نقدشوندگی آنی در سراسر کشور'],
    dimensions: 'قطر: ۱۹ میلی‌متر | وزن: ۴.۰۶۶ گرم',
    hallmarkCode: 'CBI-HALF-86',
    imageType: 'coin_bahar'
  }
];
