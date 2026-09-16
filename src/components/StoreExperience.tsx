import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  SlidersHorizontal,
  Search,
  Cookie,
  User
} from 'lucide-react';
import {
  STORE_COOKIES,
  CookieProduct,
  CATEGORIES_LIST,
  FLAVORS_LIST,
  BRANDS_LIST
} from '../data/storeProducts';

interface StoreExperienceProps {
  onBackToHome: () => void;
}

export default function StoreExperience({ onBackToHome }: StoreExperienceProps) {
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas las galletas');
  const [selectedQuickTab, setSelectedQuickTab] = useState<string>('Todo');
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Todas las marcas']);
  const [maxPrice, setMaxPrice] = useState<number>(20.0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [displayCount, setDisplayCount] = useState<number>(20);
  const [isNavSearchOpen, setIsNavSearchOpen] = useState<boolean>(false);

  // Accordion open/close state for filters
  const [openCategory, setOpenCategory] = useState(true);
  const [openFlavor, setOpenFlavor] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);

  // Mobile filters drawer
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Cart and Wishlist state with localStorage persistence
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('cp_store_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { 'cookie-1': 1 };
  });

  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('cp_store_favs');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set(['cookie-1', 'cookie-3']);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toggle favorite
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      try {
        localStorage.setItem('cp_store_favs', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Cart operations
  const addToCart = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 };
      try {
        localStorage.setItem('cp_store_cart', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    const product = STORE_COOKIES.find((p) => p.id === id);
    if (product) {
      showToast(`¡"${product.name}" agregada al carrito!`);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const nextCount = current + delta;
      const updated = { ...prev };
      if (nextCount <= 0) {
        delete updated[id];
      } else {
        updated[id] = nextCount;
      }
      try {
        localStorage.setItem('cp_store_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      try {
        localStorage.setItem('cp_store_cart', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce<number>((sum, count) => sum + Number(count || 0), 0);
  }, [cart]);

  const cartTotalAmount = useMemo(() => {
    return Object.entries(cart).reduce<number>((sum, [id, qty]) => {
      const item = STORE_COOKIES.find((p) => p.id === id);
      return sum + (item ? item.price * Number(qty || 0) : 0);
    }, 0);
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2400);
  };

  // Filter handlers
  const handleFlavorToggle = (flavor: string) => {
    setSelectedFlavors((prev) => {
      if (prev.includes(flavor)) {
        return prev.filter((f) => f !== flavor);
      } else {
        return [...prev, flavor];
      }
    });
  };

  const handleBrandToggle = (brand: string) => {
    if (brand === 'Todas las marcas') {
      setSelectedBrands(['Todas las marcas']);
      return;
    }
    setSelectedBrands((prev) => {
      const filtered = prev.filter((b) => b !== 'Todas las marcas');
      if (filtered.includes(brand)) {
        const next = filtered.filter((b) => b !== brand);
        return next.length === 0 ? ['Todas las marcas'] : next;
      } else {
        return [...filtered, brand];
      }
    });
  };

  // Handle Quick Category Pill selection
  const handleQuickTabSelect = (tab: string) => {
    setSelectedQuickTab(tab);
    if (tab === 'Todo') {
      setSelectedCategory('Todas las galletas');
    } else if (tab === 'Galletas') {
      setSelectedCategory('Clásicas');
    } else if (tab === 'Postres') {
      setSelectedCategory('Postres');
    } else if (tab === 'Bebidas') {
      setSelectedCategory('Bebidas');
    } else if (tab === 'Promociones') {
      setSelectedCategory('Todas las galletas');
    }
  };

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return STORE_COOKIES.filter((item) => {
      // Quick tab Promotions check
      if (selectedQuickTab === 'Promociones') {
        if (!item.badge && item.price > 3.0) return false;
      }

      // Category filter
      if (selectedCategory !== 'Todas las galletas') {
        if (selectedCategory === 'Sin azúcar' && !item.sugarFree && item.category !== 'Sin azúcar') {
          return false;
        } else if (item.category !== selectedCategory) {
          return false;
        }
      }

      // Flavor filter: if any flavors selected (other than empty)
      if (selectedFlavors.length > 0) {
        if (!selectedFlavors.includes(item.flavor)) {
          // If Chocolate is selected, allow chocolate related
          const matches = selectedFlavors.some(
            (f) => item.flavor.toLowerCase().includes(f.toLowerCase()) ||
                   item.name.toLowerCase().includes(f.toLowerCase())
          );
          if (!matches) return false;
        }
      }

      // Price filter
      if (item.price > maxPrice) return false;

      // Brand filter
      if (!selectedBrands.includes('Todas las marcas') && !selectedBrands.includes(item.brand)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          item.name.toLowerCase().includes(q) ||
          item.flavor.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: popular (by ratingCount or badge)
      const aScore = (a.badge ? 100 : 0) + (a.ratingCount || 0);
      const bScore = (b.badge ? 100 : 0) + (b.ratingCount || 0);
      return bScore - aScore;
    });
  }, [selectedCategory, selectedQuickTab, selectedFlavors, selectedBrands, maxPrice, searchQuery, sortBy]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayCount);
  }, [filteredProducts, displayCount]);

  const handleScrollToGrid = () => {
    const gridEl = document.getElementById('storeProductsGrid');
    if (gridEl) {
      gridEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F6F4EE] text-[#2C1810] font-sans selection:bg-[#EAE4DC] selection:text-[#2C1810] pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#24140D] text-white px-5 py-3 rounded-xl shadow-2xl animate-fade-in border border-[#3A2216]">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          TOP BAR NAVIGATION (Matches exact reference header)
         ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-[#F6F4EE] backdrop-blur-md border-b border-[#EAE4DC] transition-all">
        <div className="w-full max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo (Izquierda) */}
          <div className="flex items-center">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 group cursor-pointer select-none bg-transparent border-none p-0 focus:outline-none transition-transform active:scale-98 shrink-0"
              title="Cookie Planet"
            >
              <div className="w-7 h-7 rounded-full border border-[#2C1810] flex items-center justify-center text-[#2C1810]">
                <Cookie className="w-4 h-4 text-[#2C1810]" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2C1810] font-sans">
                Cookie Planet
              </span>
            </button>
          </div>

          {/* Menú Central: Inicio, About, Top Cookies, March, Store */}
          <nav className="hidden md:flex items-center justify-center gap-7 lg:gap-10 text-xs sm:text-[13px] font-medium text-[#4A3225] shrink-0">
            <button
              onClick={onBackToHome}
              className="hover:text-[#2C1810] transition-colors cursor-pointer py-1"
            >
              Inicio
            </button>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#about';
              }}
              className="hover:text-[#2C1810] transition-colors cursor-pointer py-1"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#projects';
              }}
              className="hover:text-[#2C1810] transition-colors cursor-pointer py-1"
            >
              Top Cookies
            </a>
            <a
              href="#march"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#march';
              }}
              className="hover:text-[#2C1810] transition-colors cursor-pointer py-1"
            >
              March
            </a>
            {/* Store (Activo con subrayado sobrio) */}
            <div className="relative inline-flex flex-col items-center py-1">
              <span className="text-[#2C1810] font-semibold cursor-default">
                Store
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#2C1810]" />
            </div>
          </nav>

          {/* Herramientas (Derecha): Lupa, Usuario, Favoritos (con badge 2), Carrito */}
          <div className="flex items-center gap-3.5 sm:gap-4 shrink-0 text-[#2C1810]">
            {/* Lupa */}
            <button
              onClick={() => {
                setIsNavSearchOpen(!isNavSearchOpen);
                handleScrollToGrid();
              }}
              className="p-1 text-[#2C1810] hover:text-black transition-colors cursor-pointer"
              title="Buscar"
              aria-label="Buscar"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Usuario */}
            <button
              onClick={() => showToast('Perfil de usuario')}
              className="p-1 text-[#2C1810] hover:text-black transition-colors cursor-pointer"
              title="Mi Cuenta"
              aria-label="Mi Cuenta"
            >
              <User className="w-4.5 h-4.5" />
            </button>

            {/* Corazón Favoritos con badge 2 */}
            <button
              onClick={() => {
                showToast(`Tienes ${favorites.size > 0 ? favorites.size : 2} favoritos guardados`);
              }}
              className="relative p-1 text-[#2C1810] hover:text-black transition-colors cursor-pointer"
              title="Favoritos"
              aria-label="Favoritos"
            >
              <Heart className="w-4.5 h-4.5" />
              <span className="absolute -top-1.5 -right-2 bg-[#DDA15E] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favorites.size > 0 ? favorites.size : 2}
              </span>
            </button>

            {/* Bolsa / Carrito */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 text-[#2C1810] hover:text-black transition-colors cursor-pointer"
              title="Carrito de compras"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#2C1810] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Input desplegable de búsqueda rápida */}
        {isNavSearchOpen && (
          <div className="w-full bg-[#F6F4EE] border-t border-[#EAE4DC] px-6 py-2.5 transition-all">
            <div className="max-w-[1400px] mx-auto relative">
              <Search className="w-4 h-4 text-[#8C7667] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar galletas o postres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white border border-[#DFD3C6] rounded-full pl-9 pr-8 py-2 text-xs text-[#2C1810] placeholder-[#9B8779] focus:outline-none focus:border-[#2C1810]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------
          MAIN STORE AREA: FILTERS (LEFT) + PRODUCTS (RIGHT)
         ------------------------------------------------------------- */}
      <div id="storeProductsGrid" className="w-full max-w-[1400px] mx-auto px-6 py-8">
        {/* Mobile filter button & count bar */}
        <div className="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-[#EAE4DC] w-full">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 bg-[#F8F6F2] border border-[#EAE4DC] px-4 py-2 rounded-xl text-xs font-bold text-[#2C1810]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2C1810]" />
            <span>FILTRAR POR</span>
          </button>
          <span className="text-xs font-medium text-[#7A6456]">
            {filteredProducts.length} productos
          </span>
        </div>

        <div className="flex gap-8 items-start">
          {/* =========================================================
              LEFT SIDEBAR: FILTERS PANEL (Exact Reference Layout)
             ========================================================= */}
          <aside className="w-[280px] shrink-0 bg-[#F8F6F2] p-6 rounded-2xl border border-[#EAE4DC] space-y-6">
            <div className="pb-3 mb-3 border-b border-[#EAE4DC]/60 flex items-center justify-between">
              <h2 className="text-xs font-black tracking-wider text-[#2C1810] uppercase">
                FILTRAR POR
              </h2>
              {(selectedCategory !== 'Todas las galletas' ||
                selectedQuickTab !== 'Todo' ||
                selectedFlavors.length > 0 ||
                !selectedBrands.includes('Todas las marcas') ||
                maxPrice < 20 ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('Todas las galletas');
                    setSelectedQuickTab('Todo');
                    setSelectedFlavors([]);
                    setSelectedBrands(['Todas las marcas']);
                    setMaxPrice(20.0);
                    setSearchQuery('');
                  }}
                  className="text-[10px] text-[#7A6456] font-bold hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Filter 1: Categoría */}
            <div className="border-b border-[#EAE4DC]/60 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setOpenCategory(!openCategory)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#2C1810] py-1 cursor-pointer"
              >
                <span>Categoría</span>
                {openCategory ? <ChevronUp className="w-3.5 h-3.5 text-[#5A4235]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#5A4235]" />}
              </button>

              {openCategory && (
                <div className="mt-2 space-y-2 text-xs">
                  {CATEGORIES_LIST.map((cat) => {
                    const isChecked = selectedCategory === cat;
                    return (
                      <label
                        key={cat}
                        className="flex items-center gap-2.5 cursor-pointer text-[#4A3225] hover:text-[#2C1810] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedCategory(cat);
                            if (cat === 'Todas las galletas') setSelectedQuickTab('Todo');
                            else if (cat === 'Clásicas') setSelectedQuickTab('Galletas');
                            else if (cat === 'Postres') setSelectedQuickTab('Postres');
                            else if (cat === 'Bebidas') setSelectedQuickTab('Bebidas');
                          }}
                          className="w-3.5 h-3.5 accent-[#2C1810] rounded cursor-pointer"
                        />
                        <span className={`text-[12px] ${isChecked ? 'font-bold text-[#2C1810]' : 'font-normal text-[#5A4438]'}`}>
                          {cat}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter 2: Sabor */}
            <div className="border-b border-[#EAE4DC]/60 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setOpenFlavor(!openFlavor)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#2C1810] py-1 cursor-pointer"
              >
                <span>Sabor</span>
                {openFlavor ? <ChevronUp className="w-3.5 h-3.5 text-[#5A4235]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#5A4235]" />}
              </button>

              {openFlavor && (
                <div className="mt-2 space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                  {FLAVORS_LIST.map((flav) => {
                    const isChecked = selectedFlavors.includes(flav);
                    return (
                      <label
                        key={flav}
                        className="flex items-center gap-2 cursor-pointer text-[#5A4438] hover:text-[#2C1810]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFlavorToggle(flav)}
                          className="w-3.5 h-3.5 accent-[#2C1810] rounded cursor-pointer"
                        />
                        <span className="text-[12px]">{flav}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter 3: Precio */}
            <div className="border-b border-[#EAE4DC]/60 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setOpenPrice(!openPrice)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#2C1810] py-1 cursor-pointer"
              >
                <span>Precio</span>
                {openPrice ? <ChevronUp className="w-3.5 h-3.5 text-[#5A4235]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#5A4235]" />}
              </button>

              {openPrice && (
                <div className="mt-2.5">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#DFD8CE] rounded-lg appearance-none cursor-pointer accent-[#2C1810]"
                  />
                  <div className="flex items-center justify-between text-[11px] text-[#5A4438] mt-1.5 font-medium">
                    <span>$0.00</span>
                    <span>$20.00</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter 4: Marca */}
            <div className="pb-3 mb-3 border-b border-[#EAE4DC]/60">
              <button
                type="button"
                onClick={() => setOpenBrand(!openBrand)}
                className="w-full flex items-center justify-between text-xs font-bold text-[#2C1810] py-1 cursor-pointer"
              >
                <span>Marca</span>
                {openBrand ? <ChevronUp className="w-3.5 h-3.5 text-[#5A4235]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#5A4235]" />}
              </button>

              {openBrand && (
                <div className="mt-2 space-y-1.5 text-xs">
                  {BRANDS_LIST.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2 cursor-pointer text-[#5A4438] hover:text-[#2C1810]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(brand)}
                          className="w-3.5 h-3.5 accent-[#2C1810] rounded cursor-pointer"
                        />
                        <span className="text-[12px]">{brand}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom cute cookie doodle illustration: "Elige tu favorita" */}
            <div className="mt-5 pt-3 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#8C7667] flex items-center justify-center text-[#2C1810] mb-1">
                <Cookie className="w-6 h-6 text-[#5A3828]" />
              </div>
              <p className="font-serif italic text-sm text-[#382015] font-bold leading-tight mt-1">
                Elige tu
                <br />
                favorita <span className="font-sans not-italic text-xs">♡</span>
              </p>
            </div>
          </aside>

          {/* =========================================================
              RIGHT COLUMN: BANNER + QUICK PILLS + 5-COLUMN GRID
             ========================================================= */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            
            {/* 1. TOP HERO BANNER */}
            <div className="w-full bg-[#F3EFEA] rounded-2xl overflow-hidden flex justify-between items-center min-h-[220px]">
              {/* Left text content */}
              <div className="p-6 sm:p-8 md:p-10 z-10 max-w-xl">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#7A6456] block mb-2">
                  GALLETAS &amp; POSTRES
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#2C1810] leading-tight font-serif tracking-tight">
                  Dulces momentos,
                  <br />
                  en cada bocado
                </h1>
                <p className="mt-2.5 text-xs sm:text-sm text-[#7A6456] max-w-md">
                  Descubre nuestras galletas artesanales y postres hechos con ingredientes de la mejor calidad.
                </p>
                <button
                  onClick={handleScrollToGrid}
                  className="mt-5 inline-flex items-center gap-2 bg-[#2C1810] hover:bg-[#1C0F0A] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                >
                  <span>Ver colección</span>
                  <span>→</span>
                </button>
              </div>

              {/* Right image display (cookies stack & chocolate) */}
              <div className="w-full md:w-1/2 h-full flex items-center justify-end">
                <img
                  src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1000&q=80"
                  alt="Dulces momentos en cada bocado"
                  className="h-full max-h-[220px] object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1000&q=80";
                  }}
                />
              </div>
            </div>

            {/* 2. Pestañas superiores (Pills) */}
            <div className="flex gap-2 mb-6 flex-wrap items-center">
              {[
                { name: 'Todo', value: 'Todo' },
                { name: 'Galletas', value: 'Galletas' },
                { name: 'Postres', value: 'Postres' },
                { name: 'Bebidas', value: 'Bebidas' },
                { name: 'Promociones', value: 'Promociones' }
              ].map((tab) => {
                const isActive = selectedQuickTab === tab.value;
                if (isActive) {
                  return (
                    <button
                      key={tab.value}
                      onClick={() => handleQuickTabSelect(tab.value)}
                      className="px-5 py-2 bg-[#222222] text-white rounded-full text-sm font-medium cursor-pointer"
                    >
                      {tab.name}
                    </button>
                  );
                }
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleQuickTabSelect(tab.value)}
                    className="px-5 py-2 bg-white text-gray-700 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* 3. PRODUCTS GRID (EXACT 5 COLUMNS ON LARGE SCREENS) */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EAE4DC] p-12 text-center my-6">
                <div className="text-5xl mb-3">🍪</div>
                <h3 className="text-base font-bold text-[#2C1810] mb-1">No se encontraron productos</h3>
                <p className="text-xs text-[#7A6456] max-w-md mx-auto mb-4">
                  Prueba cambiando la categoría o restableciendo los filtros para ver todas las galletas y postres disponibles.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todas las galletas');
                    setSelectedQuickTab('Todo');
                    setSelectedFlavors([]);
                    setSelectedBrands(['Todas las marcas']);
                    setMaxPrice(20.0);
                    setSearchQuery('');
                  }}
                  className="bg-[#2C1810] text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Restablecer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                {displayedProducts.map((product) => {
                  const isFav = favorites.has(product.id);

                  return (
                    <article
                      key={product.id}
                      className="bg-white rounded-xl border border-[#EAE4DC]/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                    >
                      {/* Top Image container */}
                      <div className="relative w-full overflow-hidden bg-white">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-t-xl"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80";
                          }}
                        />

                        {/* Favorite Heart Outline (Top Right) */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-400 hover:text-rose-600 hover:scale-110 transition-all shadow-2xs cursor-pointer"
                          title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          aria-label={`Favorito ${product.name}`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-500 stroke-[1.8]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                        <div>
                          {/* Title */}
                          <h3 className="text-xs font-semibold text-[#2C1810] truncate">
                            {product.name}
                          </h3>

                          {/* Price */}
                          <div className="mt-0.5 text-xs font-bold text-[#2C1810]">
                            ${product.price.toFixed(2)}
                          </div>

                          {/* Rating stars */}
                          <div className="flex items-center gap-1 mt-1">
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-2.5 h-2.5 ${
                                    star <= Math.round(product.rating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-[#7A6456]">
                              {product.rating.toFixed(1)} {product.ratingCount ? `(${product.ratingCount})` : ''}
                            </span>
                          </div>
                        </div>

                        {/* Agregar al carrito button (Dark full rounded button) */}
                        <button
                          type="button"
                          onClick={(e) => addToCart(product.id, e)}
                          className="w-full bg-[#2C1810] hover:bg-[#1A0E08] active:scale-98 text-white rounded-lg py-1.5 px-2 flex items-center justify-center gap-1.5 text-[11px] font-medium transition-colors shadow-2xs mt-1 cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          <span>Agregar al carrito</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =============================================================
          COLECCIONES DESTACADAS (Centered with the same max-w and margins)
         ============================================================= */}
      <div className="w-full max-w-[1400px] mx-auto px-6">
        <section className="w-full mt-10 sm:mt-14 pt-8 border-t border-[#EAE4DC]">
          {/* Header with decorative double arrows */}
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#382015] tracking-tight font-serif inline-flex items-center gap-3">
              <span className="text-[#8C7667] text-lg font-sans">⇶</span>
              <span>Colecciones destacadas</span>
              <span className="text-[#8C7667] text-lg font-sans">⇶</span>
            </h2>
          </div>

          {/* 4 Pastel Banners with cookie images and arrow buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* 1. Clásicas (Peach #FCEAD2) */}
            <div
              onClick={() => {
                setSelectedCategory('Clásicas');
                handleScrollToGrid();
              }}
              className="bg-[#FCEAD2] hover:bg-[#F9E2C5] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md group border border-[#F5DCBD]"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-3 rounded-full overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80"
                  alt="Colección Clásicas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[#382015]">Clásicas</span>
                <span className="w-6 h-6 rounded-full border border-[#382015] flex items-center justify-center text-xs group-hover:bg-[#382015] group-hover:text-white transition-colors">
                  →
                </span>
              </div>
            </div>

            {/* 2. Rellenas (Soft Pink #FCE1E7) */}
            <div
              onClick={() => {
                setSelectedCategory('Rellenas');
                handleScrollToGrid();
              }}
              className="bg-[#FCE1E7] hover:bg-[#FAD5DD] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md group border border-[#F7CFD8]"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-3 rounded-full overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80"
                  alt="Colección Rellenas"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[#382015]">Rellenas</span>
                <span className="w-6 h-6 rounded-full border border-[#382015] flex items-center justify-center text-xs group-hover:bg-[#382015] group-hover:text-white transition-colors">
                  →
                </span>
              </div>
            </div>

            {/* 3. Sin azúcar (Soft Lavender #E8DFF8) */}
            <div
              onClick={() => {
                setSelectedCategory('Sin azúcar');
                handleScrollToGrid();
              }}
              className="bg-[#E8DFF8] hover:bg-[#DECFF5] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md group border border-[#D8C7F2]"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-3 rounded-full overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80"
                  alt="Colección Sin Azúcar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[#382015]">Sin azúcar</span>
                <span className="w-6 h-6 rounded-full border border-[#382015] flex items-center justify-center text-xs group-hover:bg-[#382015] group-hover:text-white transition-colors">
                  →
                </span>
              </div>
            </div>

            {/* 4. Integrales (Soft Sage Green #D9E8D4) */}
            <div
              onClick={() => {
                setSelectedCategory('Integrales');
                handleScrollToGrid();
              }}
              className="bg-[#D9E8D4] hover:bg-[#CBDEC5] rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md group border border-[#C5D9BE]"
            >
              <div className="w-28 h-28 sm:w-32 sm:h-32 mb-3 rounded-full overflow-hidden shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1597528662465-55ece5734101?auto=format&fit=crop&w=600&q=80"
                  alt="Colección Integrales"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[#382015]">Integrales</span>
                <span className="w-6 h-6 rounded-full border border-[#382015] flex items-center justify-center text-xs group-hover:bg-[#382015] group-hover:text-white transition-colors">
                  →
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* =============================================================
          SOFT CREAM FOOTER (Harmonious with Store palette)
         ============================================================= */}
      <footer className="mt-20 border-t border-[#EAE0D5] bg-[#FAF5EF] text-[#382015] pt-12 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Footer quote */}
          <div className="inline-flex items-center justify-center gap-3 sm:gap-6 text-sm sm:text-lg font-serif italic text-[#382015] tracking-wide">
            <span className="text-[#BA2A5D] text-base">♥</span>
            <span className="border-t border-[#DED2C5] w-8 sm:w-16"></span>
            <span className="font-semibold">Galletas que hacen la vida más dulce</span>
            <span className="border-t border-[#DED2C5] w-8 sm:w-16"></span>
            <span className="text-[#BA2A5D] text-base">♥</span>
          </div>

          <p className="mt-4 text-xs text-[#7A6456] max-w-lg mx-auto">
            Horneadas artesanalmente a diario en lotes pequeños con ingredientes de calidad premium. Envíos y entregas en el día.
          </p>

          <div className="mt-8 pt-6 border-t border-[#EAE0D5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7A6456] gap-4">
            <div>
              © 2026 Cookie Planet — Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToHome}
                className="hover:text-[#BA2A5D] text-[#382015] font-semibold underline underline-offset-4 cursor-pointer transition-colors"
              >
                Volver a la Página Principal
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =============================================================
          SLIDE-OVER CART DRAWER
         ============================================================= */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#FAF6F0] shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-4 sm:p-5 bg-white border-b border-[#EAE0D5] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#BA2A5D]" />
                  <h2 className="font-bold text-base text-[#382015]">Tu Carrito de Galletas</h2>
                  <span className="bg-[#BA2A5D] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalCartCount}
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-3">🛒</div>
                    <p className="font-bold text-[#382015] text-base">Tu carrito está vacío</p>
                    <p className="text-xs text-[#7A6456] mt-1 mb-5">
                      ¡Explora nuestra variedad de galletas y agrega tus favoritas!
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="bg-[#382015] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#4E2E1F]"
                    >
                      Ver Galletas
                    </button>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const product = STORE_COOKIES.find((p) => p.id === id);
                    if (!product) return null;

                    return (
                      <div
                        key={id}
                        className="bg-white rounded-xl p-3 border border-[#EAE0D5] flex items-center gap-3 shadow-xs"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-amber-50"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-[#382015] truncate">
                            {product.name}
                          </h4>
                          <div className="text-xs font-extrabold text-[#BA2A5D] mt-0.5">
                            S/ {(product.price * Number(qty)).toFixed(2)}
                            <span className="text-[10px] text-gray-500 font-normal ml-1">
                              (S/ {product.price.toFixed(2)} c/u)
                            </span>
                          </div>

                          {/* Quantity selector */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="inline-flex items-center border border-[#DED2C5] rounded-md bg-[#FAF6F0]">
                              <button
                                onClick={() => updateQuantity(id, -1)}
                                className="p-1 text-gray-600 hover:text-black"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-2 text-xs font-bold text-[#382015]">{qty}</span>
                              <button
                                onClick={() => updateQuantity(id, 1)}
                                className="p-1 text-gray-600 hover:text-black"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {Object.keys(cart).length > 0 && (
                <div className="p-4 sm:p-5 bg-white border-t border-[#EAE0D5] space-y-3">
                  <div className="flex items-center justify-between text-sm font-bold text-[#382015]">
                    <span>Total Estimado:</span>
                    <span className="text-base text-[#BA2A5D]">S/ {cartTotalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      showToast('¡Pedido completado con éxito! Gracias por tu compra.');
                      setCart({});
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-[#BA2A5D] hover:bg-[#A32350] text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  >
                    PROCESAR COMPRA (S/ {cartTotalAmount.toFixed(2)})
                  </button>
                  <p className="text-[11px] text-center text-[#8C7667]">
                    Envío seguro garantizado y entrega express el mismo día.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =============================================================
          MOBILE FILTERS MODAL
         ============================================================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-4/5 max-w-xs bg-[#FFF9F3] border-l border-[#F2E8DC] h-full p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D5] mb-4">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#382015]">
                  FILTRAR POR
                </h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Categorías */}
              <div className="mb-4">
                <div className="text-xs font-bold uppercase text-[#382015] mb-2">Categoría</div>
                <div className="space-y-2 text-xs">
                  {CATEGORIES_LIST.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-[#4A3225]">
                      <input
                        type="radio"
                        name="mobCat"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-[#BA2A5D]"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sabor */}
              <div className="mb-4">
                <div className="text-xs font-bold uppercase text-[#382015] mb-2">Sabor</div>
                <div className="space-y-2 text-xs max-h-36 overflow-y-auto">
                  {/* Opción 'Todos los sabores' arriba de Chocolate */}
                  <label className="flex items-center gap-2 text-[#4A3225] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFlavors.length === 0}
                      onChange={() => setSelectedFlavors([])}
                      className="accent-[#BA2A5D]"
                    />
                    <span className={selectedFlavors.length === 0 ? 'font-bold text-[#BA2A5D]' : 'font-normal'}>
                      Todos los sabores
                    </span>
                  </label>
                  {FLAVORS_LIST.map((flav) => (
                    <label key={flav} className="flex items-center gap-2 text-[#4A3225] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFlavors.includes(flav)}
                        onChange={() => handleFlavorToggle(flav)}
                        className="accent-[#BA2A5D]"
                      />
                      <span className={selectedFlavors.includes(flav) ? 'font-bold text-[#BA2A5D]' : 'font-normal'}>{flav}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Precio */}
              <div className="mb-4">
                <div className="text-xs font-bold uppercase text-[#382015] mb-2">
                  Precio (Hasta S/ {maxPrice.toFixed(2)})
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#EAE0D5] rounded-lg accent-[#BA2A5D]"
                />
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#BA2A5D] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Aplicar Filtros ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
