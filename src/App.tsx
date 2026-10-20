import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BRANCHES,
  INITIAL_RATES,
  INITIAL_PRODUCTS,
  formatPriceToman,
  formatNumberFa,
  calculateProductPrice
} from './mockData';
import { GoldProduct, ProductCategory, CartItem, LiveMarketRates } from './types';
import { LivePriceTicker } from './components/LivePriceTicker';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ProductCard } from './components/ProductCard';
import { SingleProductView } from './components/SingleProductView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { BranchesModal } from './components/BranchesModal';
import { InstallmentGuideModal } from './components/InstallmentGuideModal';
import { ProductImageVisual } from './components/ProductVisuals';
import {
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  MapPin,
  Award,
  CheckCircle2,
  Scale,
  ArrowLeft
} from 'lucide-react';

export default function App() {
  const [rates, setRates] = useState<LiveMarketRates>(INITIAL_RATES);
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);
  const [products] = useState<GoldProduct[]>(INITIAL_PRODUCTS);
  
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'single_product' | 'checkout' | 'order_success'>('home');
  const [selectedProduct, setSelectedProduct] = useState<GoldProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [isBranchesModalOpen, setIsBranchesModalOpen] = useState(false);
  const [isInstallmentGuideOpen, setIsInstallmentGuideOpen] = useState(false);

  // Checkout Params & Success Data
  const [checkoutInitialMode, setCheckoutInitialMode] = useState<'cash' | 'installment'>('cash');
  const [directInstallmentPlan, setDirectInstallmentPlan] = useState<{
    months: 3 | 6 | 9 | 12;
    downPercent: number;
    guaranteeType: 'sayyadi_check' | 'gold_collateral';
  } | undefined>(undefined);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Simulation of live price refresh
  const handleRefreshRates = () => {
    setIsUpdatingRates(true);
    setTimeout(() => {
      setRates(prev => {
        const deltaFactor18 = 1 + (Math.random() * 0.008 - 0.004);
        const deltaFactorUSD = 1 + (Math.random() * 0.004 - 0.002);
        const newGold18 = Math.round(prev.gold18kGram * deltaFactor18);
        const newGold24 = Math.round(newGold18 * 1.3333);
        const newUSD = Math.round(prev.usdTomans * deltaFactorUSD);
        const newCoin = Math.round(prev.emamiCoin * deltaFactor18);

        return {
          ...prev,
          gold18kGram: newGold18,
          gold24kGram: newGold24,
          usdTomans: newUSD,
          emamiCoin: newCoin,
          lastUpdate: 'به‌روزرسانی لحظه‌ای اتحادیه',
          changes: {
            gold18k: Number(((deltaFactor18 - 1) * 100).toFixed(2)),
            gold24k: Number(((deltaFactor18 - 1) * 100).toFixed(2)),
            usd: Number(((deltaFactorUSD - 1) * 100).toFixed(2)),
            emamiCoin: Number(((deltaFactor18 - 1) * 100).toFixed(2))
          }
        };
      });
      setIsUpdatingRates(false);
    }, 500);
  };

  // Cart operations
  const handleAddToCart = (product: GoldProduct) => {
    const { totalPrice } = calculateProductPrice(product, rates);
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, calculatedPrice: totalPrice }
            : item
        );
      }
      return [...prev, { product, quantity: 1, calculatedPrice: totalPrice }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  // View Transitions
  const handleSelectProduct = (product: GoldProduct) => {
    setSelectedProduct(product);
    setCurrentView('single_product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDirectInstallmentCheckout = (
    product: GoldProduct,
    months: 3 | 6 | 9 | 12,
    downPaymentPercent: number,
    guaranteeType: 'sayyadi_check' | 'gold_collateral'
  ) => {
    const { totalPrice } = calculateProductPrice(product, rates);
    setCartItems([{ product, quantity: 1, calculatedPrice: totalPrice }]);
    setCheckoutInitialMode('installment');
    setDirectInstallmentPlan({
      months,
      downPercent: downPaymentPercent,
      guaranteeType
    });
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckoutFromCart = () => {
    setCheckoutInitialMode('cash');
    setDirectInstallmentPlan(undefined);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (orderData: any) => {
    setCompletedOrder(orderData);
    setCartItems([]);
    setCurrentView('order_success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#11221C] selection:bg-[#0B3B2E] selection:text-[#E6C987]">
      {/* 1. TOP LIVE TICKER (18K, 24K, USD scrolling news ticker above header) */}
      <LivePriceTicker
        rates={rates}
        onRefresh={handleRefreshRates}
        isUpdating={isUpdatingRates}
      />

      {/* 2. MINIMALIST LUXURY HEADER */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (currentView !== 'home') setCurrentView('home');
        }}
        onOpenBranchesModal={() => setIsBranchesModalOpen(true)}
        onOpenInstallmentGuide={() => setIsInstallmentGuideOpen(true)}
        onGoHome={() => setCurrentView('home')}
      />

      {/* MAIN VIEW ROUTER WITH SMOOTH MOTION */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* VIEW A: HOME STOREFRONT */}
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-10 sm:space-y-16 pb-24 md:pb-16"
            >
              {/* HERO CAMPAIGN SECTION */}
              <section className="relative border-b border-[#E8E1D1] bg-gradient-to-b from-[#F5EFE2] via-[#FAF7F2] to-[#FAF7F2] overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-18">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    
                    {/* Left/Right Editorial Copy (7 cols) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="lg:col-span-7 flex flex-col justify-between space-y-6"
                    >
                      <div className="space-y-4 sm:space-y-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#8A7A5D]">
                          <span>بوتیک طلا، شمش و مسکوکات</span>
                          <span>·</span>
                          <span className="text-[#0B3B2E]">اصالت تضمین‌شده اتحادیه</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3B2E] tracking-tight leading-[1.22] text-balance">
                          خلیلاوی گلد؛ اصالت طلا و شکوه سرمایه‌گذاری ماندگار
                        </h1>

                        <p className="text-sm sm:text-base text-[#4A5B52] leading-relaxed max-w-xl">
                          کلکسیونی منتخب از طلای دست‌ساز ۱۸ عیار، شمش‌های سوئیسی ۲۴ عیار و مسکوکات بانکی با محاسبه شفاف لحظه‌ای و شرایط ویژه خرید اقساطی.
                        </p>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              const catalog = document.getElementById('catalog-section');
                              catalog?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-6 py-3.5 rounded-2xl bg-[#0B3B2E] text-white font-bold text-xs sm:text-sm hover:bg-[#072920] transition-colors cursor-pointer shadow-md flex items-center gap-2 min-h-[46px]"
                          >
                            <span>مشاهده کلکسیون و خرید آنلاین</span>
                            <ArrowLeft className="w-4 h-4 text-[#E6C987]" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setIsInstallmentGuideOpen(true)}
                            className="px-5 py-3.5 rounded-2xl border border-[#0B3B2E] text-[#0B3B2E] font-bold text-xs sm:text-sm hover:bg-[#F3EFE6] transition-colors cursor-pointer min-h-[46px]"
                          >
                            شرایط خرید اقساطی
                          </motion.button>
                        </div>
                      </div>

                      {/* Live Market Board Widget (2x2 Clean Grid for Mobile & Desktop) */}
                      <div className="pt-4">
                        <div className="bg-white border border-[#E5DEC9] rounded-3xl p-4 sm:p-5 shadow-xs">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#EFE9DC]">
                            <span className="text-xs font-bold text-[#0B3B2E]">تابلو نرخ لحظه‌ای بازار طلا و ارز</span>
                            <span className="text-[11px] text-[#8A7A5D]">{rates.lastUpdate}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D4]">
                              <div className="text-[10px] text-[#708077]">طلای ۱۸ عیار (گرم)</div>
                              <div className="text-sm sm:text-base font-black text-[#0B3B2E] tabular-nums mt-0.5">
                                {formatPriceToman(rates.gold18kGram)} <span className="text-[10px] font-normal">ت</span>
                              </div>
                            </div>
                            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D4]">
                              <div className="text-[10px] text-[#708077]">شمش ۲۴ عیار (گرم)</div>
                              <div className="text-sm sm:text-base font-black text-[#0B3B2E] tabular-nums mt-0.5">
                                {formatPriceToman(rates.gold24kGram)} <span className="text-[10px] font-normal">ت</span>
                              </div>
                            </div>
                            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D4]">
                              <div className="text-[10px] text-[#708077]">سکه تمام امامی</div>
                              <div className="text-sm sm:text-base font-black text-[#0B3B2E] tabular-nums mt-0.5">
                                {formatPriceToman(rates.emamiCoin)} <span className="text-[10px] font-normal">ت</span>
                              </div>
                            </div>
                            <div className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-[#EDE5D4]">
                              <div className="text-[10px] text-[#708077]">دلار بازار آزاد</div>
                              <div className="text-sm sm:text-base font-black text-[#0B3B2E] tabular-nums mt-0.5">
                                {formatPriceToman(rates.usdTomans)} <span className="text-[10px] font-normal">ت</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Hero Visual Showcase Card (5 cols) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => handleSelectProduct(products[0])}
                      className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#DECFA8] bg-[#0B3B2E] p-6 sm:p-8 flex flex-col justify-between cursor-pointer group shadow-xl"
                    >
                      <div className="flex items-center justify-between text-xs text-[#E6C987]">
                        <span className="font-semibold">پیشنهاد ویژه گالری</span>
                        <span className="font-brand tracking-widest uppercase">KHALILAVI ROYAL</span>
                      </div>

                      <div className="my-4 aspect-[4/3] rounded-2xl overflow-hidden border border-[#C5A059]/30">
                        <ProductImageVisual
                          type="necklace"
                          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                          alt="گردنبند رویال کارتیه"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs text-[#C5A059]">طلای ۱۸ عیار دست‌ساز · وزن ۱۶.۴۵ گرم</div>
                        <div className="flex items-end justify-between gap-2">
                          <h3 className="text-lg font-bold text-white">گردنبند رویال کارتیه ۱۸ عیار</h3>
                          <span className="text-xs font-semibold text-[#E6C987] group-hover:translate-x-[-4px] transition-transform whitespace-nowrap">
                            مشاهده جزئیات ←
                          </span>
                        </div>
                      </div>
                    </motion.div>

                  </div>
                </div>
              </section>

              {/* CATALOG SECTION */}
              <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
                
                {/* Category Segmented Filter Bar (No Branch Mentions) */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D1]">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3B2E]">کلکسیون طلا، شمش و مسکوکات</h2>
                    <p className="text-xs text-[#708077] mt-1">
                      تمامی قیمت‌ها به صورت زنده بر اساس نرخ لحظه‌ای تابلو محاسبه شده‌اند
                    </p>
                  </div>

                  {/* Mobile-friendly horizontal scrollable segmented tabs */}
                  <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    <div className="inline-flex items-center gap-1.5 p-1.5 bg-[#EFEADF] rounded-2xl border border-[#E2D9C5] text-xs font-medium min-w-max">
                      {(
                        [
                          { id: 'all', label: `همه آثار (${formatNumberFa(products.length)})` },
                          { id: 'jewelry_18k', label: 'طلا و جواهر ۱۸ عیار' },
                          { id: 'bullion_24k', label: 'شمش طلا ۲۴ عیار' },
                          { id: 'coin', label: 'سکه بانکی' },
                        ] as const
                      ).map((tab) => {
                        const active = selectedCategory === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSelectedCategory(tab.id)}
                            className={`relative px-4 py-2.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap min-h-[40px] ${
                              active ? 'text-white font-bold' : 'text-[#52635B] hover:text-[#0B3B2E]'
                            }`}
                          >
                            {active && (
                              <motion.div
                                layoutId="categoryFilterPill"
                                className="absolute inset-0 bg-[#0B3B2E] rounded-xl shadow-xs"
                                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                              />
                            )}
                            <span className="relative z-10">{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Product Grid with layout animations */}
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, idx) => (
                      <ProductCard
                        key={product.id}
                        index={idx}
                        product={product}
                        rates={rates}
                        onSelect={handleSelectProduct}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

              </section>

              {/* CRAFTSMANSHIP & ADDRESSES SECTION (Branch names only in addresses) */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-8 border-b border-[#EFE9DC]">
                    <div className="space-y-2">
                      <div className="w-11 h-11 rounded-2xl bg-[#0B3B2E] text-[#E6C987] flex items-center justify-center mb-3">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-[#0B3B2E]">اصالت و فاکتور رسمی اتحادیه</h3>
                      <p className="text-xs text-[#52635B] leading-relaxed">
                        تمامی مصنوعات طلای ۱۸ عیار دارای کد استاندارد ری‌گیری و شمش‌های ۲۴ عیار دارای سرتیفیکیت بین‌المللی والکامبی سوئیس و پلمپ امنیتی هستند.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="w-11 h-11 rounded-2xl bg-[#0B3B2E] text-[#E6C987] flex items-center justify-center mb-3">
                        <Scale className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-[#0B3B2E]">خرید اقساطی با چک صیادی یا طلا</h3>
                      <p className="text-xs text-[#52635B] leading-relaxed">
                        امکان خرید اقساطی ۳ تا ۱۲ ماهه با پیش‌پرداخت منعطف و ارائه چک صیادی بنفش یا امانت‌گذاری طلا در صندوق امانات بدون نیاز به ضامن.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="w-11 h-11 rounded-2xl bg-[#0B3B2E] text-[#E6C987] flex items-center justify-center mb-3">
                        <Award className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-base text-[#0B3B2E]">تضمین بازخرید به نرخ روز</h3>
                      <p className="text-xs text-[#52635B] leading-relaxed">
                        تعهد کتبی بازخرید کلیه قطعات طلا، سکه و شمش به قیمت لحظه‌ای تابلو اتحادیه با تسویه آنی ریالی.
                      </p>
                    </div>
                  </div>

                  {/* Branch Addresses Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {Object.values(BRANCHES).map((branch) => (
                      <div
                        key={branch.id}
                        className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DEC9] flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#0B3B2E] flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                            <span>{branch.name}</span>
                          </div>
                          <p className="text-xs text-[#425048] mt-1.5 pr-6">
                            {branch.address}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8E1D1] pr-6">
                          <span className="text-[#708077]">{branch.workingHours}</span>
                          <span className="font-mono font-bold text-[#0B3B2E]">{branch.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

            </motion.div>
          )}

          {/* VIEW B: SINGLE PRODUCT (PDP) */}
          {currentView === 'single_product' && selectedProduct && (
            <SingleProductView
              key={`pdp-${selectedProduct.id}`}
              product={selectedProduct}
              rates={rates}
              onBack={() => setCurrentView('home')}
              onAddToCart={handleAddToCart}
              onDirectInstallmentCheckout={handleDirectInstallmentCheckout}
            />
          )}

          {/* VIEW C: CHECKOUT & FACTOR */}
          {currentView === 'checkout' && (
            <CheckoutView
              key="checkout-view"
              items={cartItems}
              rates={rates}
              initialMode={checkoutInitialMode}
              initialInstallmentPlan={directInstallmentPlan}
              onBack={() => {
                if (selectedProduct) {
                  setCurrentView('single_product');
                } else {
                  setCurrentView('home');
                }
              }}
              onOrderSuccess={handleOrderSuccess}
            />
          )}

          {/* VIEW D: ORDER SUCCESS FACTOR */}
          {currentView === 'order_success' && completedOrder && (
            <motion.div
              key="order-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-4 py-12 sm:py-16 pb-28 text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs text-[#8A7A5D] font-bold">ثبت نهایی در سامانه خلیلاوی گلد</span>
                <h2 className="text-2xl font-black text-[#0B3B2E]">
                  فاکتور رسمی سفارش شما صادر گردید
                </h2>
                <div className="font-mono text-sm text-[#0B3B2E] font-bold">
                  کد رهگیری اتحادیه: {completedOrder.orderId}
                </div>
              </div>

              {/* Invoice Card */}
              <div className="bg-white border border-[#E5DEC9] rounded-3xl p-6 text-right space-y-3 text-xs text-[#3E4E45] shadow-xs">
                <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                  <span>نام خریدار:</span>
                  <span className="font-bold text-[#11221C]">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                  <span>شماره همراه:</span>
                  <span className="font-mono text-xs">{completedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                  <span>نحوه پرداخت:</span>
                  <span className="font-bold text-[#0B3B2E]">
                    {completedOrder.paymentMode === 'cash' ? 'تسویه نقدی کامل' : 'طرح اقساطی خلیلاوی'}
                  </span>
                </div>

                {completedOrder.paymentMode === 'installment' && (
                  <>
                    <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                      <span>نوع ضمانت انتخابی:</span>
                      <span className="font-bold">
                        {completedOrder.guaranteeType === 'sayyadi_check' ? 'چک صیادی بنفش' : 'امانت طلا در صندوق امانات'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                      <span>پیش‌پرداخت نقدی:</span>
                      <span className="font-bold text-emerald-800 tabular-nums">
                        {formatPriceToman(completedOrder.downPaymentAmount)} تومان
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-[#F3EFE6]">
                      <span>اقساط ماهانه:</span>
                      <span className="font-bold tabular-nums">
                        {formatNumberFa(completedOrder.months)} قسط ماهانه {formatPriceToman(completedOrder.monthlyInstallment)} تومان
                      </span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-[#0B3B2E]">
                  <span>مبلغ کل فاکتور:</span>
                  <span className="text-base sm:text-lg tabular-nums">
                    {formatPriceToman(completedOrder.totalInstallmentPrice)} تومان
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  setCompletedOrder(null);
                  setCurrentView('home');
                }}
                className="px-8 py-4 rounded-2xl bg-[#0B3B2E] text-white text-xs sm:text-sm font-bold hover:bg-[#072920] transition-colors cursor-pointer shadow-md min-h-[48px]"
              >
                بازگشت به ویترین اصلی
              </motion.button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* 3. NATIVE APP-LIKE MOBILE BOTTOM TAB BAR */}
      <MobileBottomNav
        currentView={currentView}
        selectedCategory={selectedCategory}
        cartCount={totalCartCount}
        onNavigateHome={() => setCurrentView('home')}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenBranches={() => setIsBranchesModalOpen(true)}
      />

      {/* 4. SLIDE-OVER CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      {/* 5. MODALS */}
      <BranchesModal
        isOpen={isBranchesModalOpen}
        onClose={() => setIsBranchesModalOpen(false)}
      />

      <InstallmentGuideModal
        isOpen={isInstallmentGuideOpen}
        onClose={() => setIsInstallmentGuideOpen(false)}
      />

      {/* 6. MINIMALIST LUXURY FOOTER (Branch names appear cleanly in the address blocks) */}
      <footer className="border-t border-[#E8E1D1] bg-[#051F18] text-[#D8E4DE] text-xs pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Brand column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full border border-[#C5A059] flex items-center justify-center bg-[#0B3B2E]">
                  <span className="font-brand font-bold text-sm text-[#E6C987]">KG</span>
                </div>
                <span className="font-brand font-bold text-lg text-[#E6C987] tracking-wider">KHALILAVI GOLD</span>
              </div>
              <p className="text-[#9DB0A7] text-xs leading-relaxed">
                گالری طلا، شمش و مسکوکات خلیلاوی گلد؛ عرضه مستقیم مصنوعات طلای ۱۸ عیار، شمش‌های سوئیسی ۲۴ عیار و مسکوکات بانکی با فاکتور رسمی.
              </p>
            </div>

            {/* Address 1 */}
            <div className="space-y-2 text-[#9DB0A7]">
              <h4 className="font-bold text-white text-xs">{BRANCHES.branch_jewelry.name}</h4>
              <p className="leading-relaxed">{BRANCHES.branch_jewelry.address}</p>
              <p className="font-mono text-[#E6C987]">{BRANCHES.branch_jewelry.phone}</p>
            </div>

            {/* Address 2 */}
            <div className="space-y-2 text-[#9DB0A7]">
              <h4 className="font-bold text-white text-xs">{BRANCHES.branch_bullion.name}</h4>
              <p className="leading-relaxed">{BRANCHES.branch_bullion.address}</p>
              <p className="font-mono text-[#E6C987]">{BRANCHES.branch_bullion.phone}</p>
            </div>

            {/* Quick Links */}
            <div className="space-y-2 text-[#9DB0A7]">
              <h4 className="font-bold text-white text-xs">خدمات مشتریان</h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setIsInstallmentGuideOpen(true)} className="hover:text-white cursor-pointer transition-colors">
                    شرایط خرید اقساطی طلا و شمش
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsBranchesModalOpen(true)} className="hover:text-white cursor-pointer transition-colors">
                    نشانی و ساعات کاری شعب
                  </button>
                </li>
                <li>
                  <button onClick={handleRefreshRates} className="hover:text-white cursor-pointer transition-colors">
                    بروزرسانی نرخ لحظه‌ای اتحادیه
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-[#123E32] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7A9388]">
            <div>
              © کلیه حقوق برای خلیلاوی گلد (Khalilavi Gold) محفوظ است.
            </div>
            <div className="flex items-center gap-4">
              <span>عضو رسمی اتحادیه طلا و جواهر</span>
              <span>·</span>
              <span>کد استاندارد: KG-750</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
