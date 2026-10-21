import React, { useState, useEffect } from 'react';
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
import { Luxury3DScrollHero } from './components/Luxury3DScrollHero';
import { ProductCard } from './components/ProductCard';
import { SingleProductView } from './components/SingleProductView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { BranchesModal } from './components/BranchesModal';
import { InstallmentGuideModal } from './components/InstallmentGuideModal';
import {
  ShieldCheck,
  MapPin,
  Award,
  CheckCircle2,
  Scale,
  Landmark,
  Instagram,
} from 'lucide-react';

export default function App() {
  const [rates, setRates] = useState<LiveMarketRates>(INITIAL_RATES);
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);
  const [products] = useState<GoldProduct[]>(INITIAL_PRODUCTS);
  
  // Navigation & View State
  const [currentView, setCurrentView] = useState<'home' | 'single_product' | 'checkout' | 'order_success'>('home');
  const [selectedProduct, setSelectedProduct] = useState<GoldProduct | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  
  // Track whether user is inside the 3D Hero Section (for transparent header)
  const [isOverHero, setIsOverHero] = useState<boolean>(true);

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

  // Monitor scroll position relative to the 3D Hero section
  useEffect(() => {
    const checkHeroOverlap = () => {
      if (currentView !== 'home') {
        setIsOverHero(false);
        return;
      }
      const heroEl = document.getElementById('hero-3d-section');
      if (!heroEl) {
        setIsOverHero(false);
        return;
      }
      const rect = heroEl.getBoundingClientRect();
      // Header + Ticker is ~110px tall. Keep transparent while hero fills the viewport behind header
      setIsOverHero(rect.bottom > 110);
    };

    checkHeroOverlap();
    window.addEventListener('scroll', checkHeroOverlap, { passive: true });
    window.addEventListener('resize', checkHeroOverlap);
    return () => {
      window.removeEventListener('scroll', checkHeroOverlap);
      window.removeEventListener('resize', checkHeroOverlap);
    };
  }, [currentView]);

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

  const handleExploreCatalog = (cat?: ProductCategory | 'all') => {
    if (cat) {
      setSelectedCategory(cat);
    }
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const catalog = document.getElementById('catalog-section');
      catalog?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const filteredProducts = products.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const totalCartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  const isHeaderTransparent = currentView === 'home' && isOverHero;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#11221C] selection:bg-[#0B3B2E] selection:text-[#E6C987]">
      {/* FIXED TOP WRAPPER: Transparent over 3D Hero, Green Ticker + White Header after Hero */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <LivePriceTicker
          rates={rates}
          onRefresh={handleRefreshRates}
          isUpdating={isUpdatingRates}
          isTransparent={isHeaderTransparent}
        />

        <Header
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            if (currentView !== 'home') {
              setCurrentView('home');
            }
            setTimeout(() => {
              const catalog = document.getElementById('catalog-section');
              catalog?.scrollIntoView({ behavior: 'smooth' });
            }, 50);
          }}
          onOpenBranchesModal={() => setIsBranchesModalOpen(true)}
          onOpenInstallmentGuide={() => setIsInstallmentGuideOpen(true)}
          onGoHome={() => {
            setCurrentView('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isTransparent={isHeaderTransparent}
        />
      </div>

      {/* MAIN VIEW ROUTER */}
      <main className={`flex-1 ${currentView !== 'home' ? 'pt-26 md:pt-30' : ''}`}>
        <AnimatePresence mode="wait">
          
          {/* VIEW A: HOME STOREFRONT WITH FULL-VIEWPORT 3D SCROLL EXPERIENCE */}
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="pb-24 md:pb-16"
            >
              {/* ZALORE-INSPIRED 3D SCROLL STORYTELLING STAGE */}
              <Luxury3DScrollHero
                rates={rates}
                onExploreCatalog={handleExploreCatalog}
                onOpenInstallmentGuide={() => setIsInstallmentGuideOpen(true)}
                onOpenBranchesModal={() => setIsBranchesModalOpen(true)}
              />

              {/* CATALOG SECTION ON WARM IVORY LUXURY CANVAS */}
              <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 space-y-6 sm:space-y-8 scroll-mt-28">
                
                {/* Category Segmented Filter Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E1D1]">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3B2E]">ویترین آنلاین طلا، شمش و مسکوکات</h2>
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

              {/* CRAFTSMANSHIP & ADDRESSES SECTION */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
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
                          <div className="font-bold text-sm text-[#0B3B2E] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                              <span>{branch.name}</span>
                            </div>
                            {branch.instagramHandle && (
                              <a
                                href={branch.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#E5DEC9] text-[#0B3B2E] text-[10px] font-bold hover:bg-[#E5DEC9] transition-colors"
                              >
                                <span className="text-[#C5A059]">@</span>
                                <span className="font-mono">{branch.instagramHandle}</span>
                              </a>
                            )}
                          </div>
                          <p className="text-xs text-[#425048] mt-2 pr-6 leading-relaxed">
                            {branch.address}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8E1D1] pr-6">
                          <span className="text-[#708077]">{branch.workingHours}</span>
                          <a href={`tel:${branch.phone}`} className="font-mono font-bold text-[#0B3B2E] hover:underline">
                            {branch.phone}
                          </a>
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

      {/* 6. GRAND LUXURY ATELIER FOOTER */}
      <footer className="relative border-t border-[#C5A059]/30 bg-radial-[at_top] from-[#07261E] via-[#041712] to-[#020B08] text-[#D8E4DE] overflow-hidden pb-24 md:pb-8 pt-16 sm:pt-24">
        {/* Decorative Golden Ambient Radiance */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-44 bg-gradient-to-b from-[#C5A059]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">

          {/* Main Content Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Grand Brand Identity Statement (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 text-[#E6C987] text-[11px] tracking-widest uppercase">
                  <span>خلیلاوی گلد · اهواز</span>
                  <span>·</span>
                  <span>تاسیس ۱۳۷۸</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl border-2 border-[#C5A059] overflow-hidden bg-[#051F18] shadow-lg shrink-0">
                    <img
                      src={`${import.meta.env.BASE_URL || './'}assets/khalilavi-logo.jpg`.replace('//', '/')}
                      alt="نشان رسمی گالری طلا رضا خلیلاوی"
                      className="w-full h-full object-cover scale-105"
                    />
                  </div>
                  <div>
                    <div className="font-brand text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5DC] via-[#E6C987] to-[#A37B2E] tracking-wider">
                      REZA KHALILAVI
                    </div>
                    <div className="font-bold text-sm text-[#F7E7C4]">
                      گالری طلا، شمش و سکه رضا خلیلاوی
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-[#A3B8B0] text-xs sm:text-sm leading-relaxed max-w-lg">
                گالری طلای رضا خلیلاوی با بیش از ربع قرن حضور مداوم در بازار نادری اهواز، ارائه‌دهنده نفیس‌ترین مصنوعات طلای ۱۸ عیار، النگو و سرویس‌های مجلسی و همچنین تامین مستقیم شمش‌های استاندارد سوئیسی و مسکوکات ضرب بانک مرکزی با استعلام معتبر ری‌گیری.
              </p>

              {/* Instagram Official Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://instagram.com/khalilavi.jewellery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#093226] border border-[#C5A059]/50 text-[#F5E2B3] text-xs font-bold hover:bg-[#C5A059] hover:text-[#051F18] transition-all cursor-pointer shadow-md group"
                >
                  <Instagram className="w-4 h-4 text-[#E6C987] group-hover:text-[#051F18] transition-colors shrink-0" />
                  <span>اینستاگرام طلا:</span>
                  <span className="font-mono dir-ltr">@khalilavi.jewellery</span>
                </a>

                <a
                  href="https://instagram.com/khalilavi.gold"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#093226] border border-[#C5A059]/50 text-[#F5E2B3] text-xs font-bold hover:bg-[#C5A059] hover:text-[#051F18] transition-all cursor-pointer shadow-md group"
                >
                  <Instagram className="w-4 h-4 text-[#E6C987] group-hover:text-[#051F18] transition-colors shrink-0" />
                  <span>اینستاگرام شمش و سکه:</span>
                  <span className="font-mono dir-ltr">@khalilavi.gold</span>
                </a>
              </div>
            </div>

            {/* Branch 1 Details (3 cols) */}
            <div className="lg:col-span-3 space-y-4 bg-[#06231B]/70 p-5 rounded-2xl border border-[#C5A059]/25 backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>{BRANCHES.branch_jewelry.name}</span>
                </h4>
              </div>

              <p className="text-xs text-[#C5D8CF] leading-relaxed">
                {BRANCHES.branch_jewelry.address}
              </p>

              <div className="space-y-2 text-xs pt-2 border-t border-[#133F32]">
                <div className="flex justify-between items-center text-[#9DB0A7]">
                  <span>ساعات کاری:</span>
                  <span className="text-[#E6C987] font-semibold">{BRANCHES.branch_jewelry.workingHours}</span>
                </div>
                <div className="flex justify-between items-center text-[#9DB0A7]">
                  <span>تلفن تماس:</span>
                  <a href={`tel:${BRANCHES.branch_jewelry.phone}`} className="font-mono text-sm font-bold text-white hover:text-[#E6C987] transition-colors">
                    {BRANCHES.branch_jewelry.phone}
                  </a>
                </div>
                <div className="flex justify-between items-center text-[#9DB0A7]">
                  <span>مدیریت:</span>
                  <span className="text-white font-medium">{BRANCHES.branch_jewelry.manager}</span>
                </div>
              </div>
            </div>

            {/* Branch 2 Details & Fast Access (4 cols) */}
            <div className="lg:col-span-4 space-y-4 bg-[#06231B]/70 p-5 rounded-2xl border border-[#C5A059]/25 backdrop-blur-xs">
              <div className="flex items-center justify-between border-b border-[#C5A059]/20 pb-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                  <span>{BRANCHES.branch_bullion.name}</span>
                </h4>
              </div>

              <p className="text-xs text-[#C5D8CF] leading-relaxed">
                {BRANCHES.branch_bullion.address}
              </p>

              <div className="space-y-2 text-xs pt-2 border-t border-[#133F32]">
                <div className="flex justify-between items-center text-[#9DB0A7]">
                  <span>ساعات کاری:</span>
                  <span className="text-[#E6C987] font-semibold">{BRANCHES.branch_bullion.workingHours}</span>
                </div>
                <div className="flex justify-between items-center text-[#9DB0A7]">
                  <span>تلفن سفارشات:</span>
                  <a href={`tel:${BRANCHES.branch_bullion.phone}`} className="font-mono text-sm font-bold text-white hover:text-[#E6C987] transition-colors">
                    {BRANCHES.branch_bullion.phone}
                  </a>
                </div>
                <div className="flex justify-between items-center text-[#9DB0A7]">
                  <span>فعالیت:</span>
                  <span className="text-white font-medium">معاملات عمده و تک شمش و سکه</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#133F32]">
                <button
                  onClick={() => setIsInstallmentGuideOpen(true)}
                  className="py-2.5 px-3 rounded-xl bg-[#0D4032] hover:bg-[#C5A059] hover:text-[#051F18] text-[#E6C987] font-bold text-[11px] transition-all cursor-pointer text-center"
                >
                  راهنمای خرید اقساطی
                </button>
                <button
                  onClick={() => setIsBranchesModalOpen(true)}
                  className="py-2.5 px-3 rounded-xl border border-[#C5A059]/60 hover:bg-[#C5A059] hover:text-[#051F18] text-white font-bold text-[11px] transition-all cursor-pointer text-center"
                >
                  لوکیشن شعب روی نقشه
                </button>
              </div>
            </div>

          </div>

          {/* Infinite Sliding Looped Marquee of KHALILAVI GOLD */}
          <div className="relative py-10 sm:py-14 border-t border-b border-[#C5A059]/15 overflow-hidden select-none">
            {/* Gradient Fades on edges for seamless infinity look */}
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-r from-[#03110D] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-44 bg-gradient-to-l from-[#03110D] to-transparent z-10 pointer-events-none" />

            <div dir="ltr" style={{ direction: 'ltr' }} className="w-full overflow-hidden flex select-none">
              {/* Track 1 */}
              <div dir="ltr" style={{ direction: 'ltr' }} className="flex shrink-0 items-center animate-footer-marquee">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-10 sm:gap-14 shrink-0 pr-10 sm:pr-14">
                    <span className="font-brand font-black text-5xl sm:text-7xl lg:text-8xl tracking-[0.25em] text-[#E6C987]/12 whitespace-nowrap uppercase">
                      KHALILAVI GOLD
                    </span>
                    <span className="text-[#C5A059]/25 text-2xl sm:text-3xl font-brand">✦</span>
                    <span className="font-brand font-black text-5xl sm:text-7xl lg:text-8xl tracking-[0.25em] text-white/[0.07] whitespace-nowrap uppercase">
                      REZA KHALILAVI
                    </span>
                    <span className="text-[#C5A059]/25 text-2xl sm:text-3xl font-brand">✦</span>
                  </div>
                ))}
              </div>

              {/* Track 2 (Clone for infinite seamless loop) */}
              <div dir="ltr" style={{ direction: 'ltr' }} className="flex shrink-0 items-center animate-footer-marquee" aria-hidden="true">
                {[1, 2, 3, 4].map((item) => (
                  <div key={`clone-${item}`} className="flex items-center gap-10 sm:gap-14 shrink-0 pr-10 sm:pr-14">
                    <span className="font-brand font-black text-5xl sm:text-7xl lg:text-8xl tracking-[0.25em] text-[#E6C987]/12 whitespace-nowrap uppercase">
                      KHALILAVI GOLD
                    </span>
                    <span className="text-[#C5A059]/25 text-2xl sm:text-3xl font-brand">✦</span>
                    <span className="font-brand font-black text-5xl sm:text-7xl lg:text-8xl tracking-[0.25em] text-white/[0.07] whitespace-nowrap uppercase">
                      REZA KHALILAVI
                    </span>
                    <span className="text-[#C5A059]/25 text-2xl sm:text-3xl font-brand">✦</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Trust Seals */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A9388]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>کلیه حقوق این سامانه متعلق به گالری خلیلاوی گلد (اهواز) می‌باشد.</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span>دارای جواز کسب رسمی از اتحادیه طلا و جواهر اهواز</span>
              <span>·</span>
              <span>کد عیارسنجی ری‌گیری: استاندارد ۷۵۰ و ۹۹۹.۹</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
