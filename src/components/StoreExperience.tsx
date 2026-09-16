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
  Cookie
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
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>(['Chocolate']);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Todas las marcas']);
  const [maxPrice, setMaxPrice] = useState<number>(20.0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');
  const [displayCount, setDisplayCount] = useState<number>(12);
  const [isNavSearchOpen, setIsNavSearchOpen] = useState<boolean>(false);

  // Accordion open/close state for filters
  const [openCategory, setOpenCategory] = useState(true);
  const [openFlavor, setOpenFlavor] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openBrand, setOpenBrand] = useState(true);

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

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return STORE_COOKIES.filter((item) => {
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
  }, [selectedCategory, selectedFlavors, selectedBrands, maxPrice, searchQuery, sortBy]);

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
    <div className="w-full min-h-screen bg-[#FAF6F0] text-[#382015] font-sans selection:bg-[#F3D1DC] selection:text-[#382015] pb-0">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#382015] text-white px-5 py-3 rounded-xl shadow-2xl animate-fade-in border border-[#523324]">
          <Check className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* -------------------------------------------------------------
          TOP BAR NAVIGATION (Cream Navbar - Full Width & Centered)
         ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 w-full bg-[#FAF6F0] backdrop-blur-md border-b border-[#EAE0D5] transition-all shadow-xs">
        <div className="w-full px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo (Izquierda): Alineado completamente a la izquierda */}
          <div className="flex-1 flex items-center justify-start">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 group cursor-pointer select-none bg-transparent border-none p-0 focus:outline-none transition-transform active:scale-98 shrink-0"
              title="Cookie Planet ♥ - Volver al Inicio"
            >
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#5A3828]/10 flex items-center justify-center text-[#5A3828] group-hover:bg-[#BA2A5D]/10 group-hover:text-[#BA2A5D] transition-colors">
                <Cookie className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-[#5A3828]/15 text-[#5A3828] group-hover:text-[#BA2A5D] transition-colors" />
              </span>
              <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#382015] flex items-center gap-1">
                Cookie Planet <span className="text-[#BA2A5D] text-base sm:text-lg">♥</span>
              </span>
            </button>
          </div>

          {/* Menú Central: Inicio, About, Top Cookies, Merch, Store (Centrado en la pantalla) */}
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-8 text-xs sm:text-sm font-semibold text-[#5A3828] shrink-0">
            <button
              onClick={onBackToHome}
              className="hover:text-[#BA2A5D] transition-colors cursor-pointer py-1"
            >
              Inicio
            </button>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#about';
              }}
              className="hover:text-[#BA2A5D] transition-colors cursor-pointer py-1"
            >
              About
            </a>
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#projects';
              }}
              className="hover:text-[#BA2A5D] transition-colors cursor-pointer py-1"
            >
              Top Cookies
            </a>
            <a
              href="#hola"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '#hola';
              }}
              className="hover:text-[#BA2A5D] transition-colors cursor-pointer py-1"
            >
              Merch
            </a>
            {/* Store (Activo con indicador/subrayado rosa-magenta) */}
            <div className="relative inline-flex flex-col items-center py-1">
              <span className="text-[#BA2A5D] font-bold cursor-default">
                Store
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#BA2A5D] rounded-full" />
            </div>
          </nav>

          {/* Herramientas (Derecha): Pegadas totalmente a la derecha */}
          <div className="flex-1 flex items-center justify-end gap-2.5 sm:gap-3.5 shrink-0">
            {/* Icono de Lupa (Búsqueda) */}
            <button
              onClick={() => {
                setIsNavSearchOpen(!isNavSearchOpen);
                handleScrollToGrid();
              }}
              className="p-2 rounded-full hover:bg-[#EFE5D8] text-[#5A3828] hover:text-[#BA2A5D] transition-colors cursor-pointer"
              title="Buscar galletas"
              aria-label="Buscar galletas"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Icono de Corazón con badge/contador en rosa (2) */}
            <button
              onClick={() => {
                showToast(`Tienes ${favorites.size > 0 ? favorites.size : 2} galletas guardadas`);
              }}
              className="relative p-2 rounded-full hover:bg-[#EFE5D8] text-[#5A3828] hover:text-[#BA2A5D] transition-colors cursor-pointer"
              title="Mis Favoritos (2)"
              aria-label="Mis Favoritos"
            >
              <Heart className="w-5 h-5 fill-[#BA2A5D] text-[#BA2A5D]" />
              <span className="absolute -top-0.5 -right-0.5 bg-[#BA2A5D] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {favorites.size > 0 ? favorites.size : 2}
              </span>
            </button>

            {/* Botón de Carrito Magenta redondeado tipo píldora con 🛒 Carrito 1 */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#BA2A5D] hover:bg-[#A32350] active:scale-95 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-rose-900/20 cursor-pointer"
              aria-label="Abrir Carrito"
            >
              <span className="text-sm">🛒</span>
              <span>Carrito {totalCartCount > 0 ? totalCartCount : 1}</span>
            </button>
          </div>
        </div>

        {/* Input desplegable de búsqueda rápida si se activa la lupa */}
        {isNavSearchOpen && (
          <div className="w-full bg-[#FAF6F0] border-t border-[#EAE0D5] px-4 py-2.5 sm:hidden transition-all">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-[#8C7667] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar galletas por nombre, sabor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-white border border-[#DFD3C6] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#382015] placeholder-[#9B8779] focus:outline-none focus:border-[#BA2A5D]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------
          HERO BANNER (Full-width banner across the screen)
         ------------------------------------------------------------- */}
      <section className="relative w-full overflow-hidden bg-[#F8EFE4] border-b border-[#E8DDD0]">
        <div className="relative w-full group">
          <img
            src="https://res.cloudinary.com/yxbhso8s/image/upload/v1789532304/ChatGPT_Image_15_sept_2026_11_17_45_p.m.png"
            alt="Diferentes sabores, la misma felicidad - Galletas artesanales"
            className="w-full h-auto block object-cover"
            referrerPolicy="no-referrer"
            loading="eager"
          />
          {/* Clickable CTA overlay positioned right over or accessible for users */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              onClick={handleScrollToGrid}
              aria-label="Comprar ahora galletas artesanales"
              className="pointer-events-auto opacity-0 hover:opacity-10 focus:opacity-100 transition-opacity absolute bottom-[18%] sm:bottom-[20%] md:bottom-[22%] bg-[#BA2A5D] text-white text-xs sm:text-sm md:text-base font-bold uppercase tracking-wider px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 md:py-3.5 rounded-full shadow-lg cursor-pointer"
            >
              COMPRAR AHORA
            </button>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------
          MAIN STORE AREA: FILTERS (LEFT) + PRODUCTS (RIGHT)
         ------------------------------------------------------------- */}
      <div id="storeProductsGrid" className="max-w-[1400px] mx-auto px-6 sm:px-10 py-8">
        {/* Mobile filter button & count bar */}
        <div className="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-[#EAE0D5]">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 bg-white border border-[#DED2C5] px-4 py-2 rounded-xl text-xs font-bold text-[#382015] shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#BA2A5D]" />
            <span>FILTRAR POR</span>
          </button>
          <span className="text-xs font-medium text-[#7A6456]">
            {filteredProducts.length} productos encontrados
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
          {/* =========================================================
              LEFT SIDEBAR: FILTERS PANEL
             ========================================================= */}
          <aside className="hidden lg:block w-64 shrink-0 bg-white border border-[#EAE0D5] rounded-2xl p-5 shadow-xs sticky top-20">
            <div className="border-b border-[#EAE0D5] pb-3 mb-4 flex items-center justify-between">
              <h2 className="text-sm font-extrabold tracking-wider text-[#382015] uppercase">
                FILTRAR POR
              </h2>
              {(selectedCategory !== 'Todas las galletas' ||
                selectedFlavors.length > 0 ||
                !selectedBrands.includes('Todas las marcas') ||
                maxPrice < 20 ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory('Todas las galletas');
                    setSelectedFlavors([]);
                    setSelectedBrands(['Todas las marcas']);
                    setMaxPrice(20.0);
                    setSearchQuery('');
                  }}
                  className="text-[11px] text-[#BA2A5D] font-bold hover:underline"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Filter 1: Categoría */}
            <div className="border-b border-[#F0E6DC] pb-4 mb-4">
              <button
                type="button"
                onClick={() => setOpenCategory(!openCategory)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-[#382015] uppercase tracking-wider py-1 hover:text-[#BA2A5D]"
              >
                <span>Categoría</span>
                {openCategory ? <ChevronUp className="w-4 h-4 text-[#8C7667]" /> : <ChevronDown className="w-4 h-4 text-[#8C7667]" />}
              </button>

              {openCategory && (
                <div className="mt-2.5 space-y-2 text-xs">
                  {CATEGORIES_LIST.map((cat) => {
                    const isChecked = selectedCategory === cat;
                    return (
                      <label
                        key={cat}
                        className="flex items-center gap-2.5 cursor-pointer text-[#4A3225] hover:text-[#BA2A5D] transition-colors"
                      >
                        <input
                          type="radio"
                          name="categoryFilter"
                          checked={isChecked}
                          onChange={() => setSelectedCategory(cat)}
                          className="w-4 h-4 accent-[#BA2A5D] rounded cursor-pointer"
                        />
                        <span className={isChecked ? 'font-bold text-[#BA2A5D]' : 'font-normal'}>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter 2: Sabor */}
            <div className="border-b border-[#F0E6DC] pb-4 mb-4">
              <button
                type="button"
                onClick={() => setOpenFlavor(!openFlavor)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-[#382015] uppercase tracking-wider py-1 hover:text-[#BA2A5D]"
              >
                <span>Sabor</span>
                {openFlavor ? <ChevronUp className="w-4 h-4 text-[#8C7667]" /> : <ChevronDown className="w-4 h-4 text-[#8C7667]" />}
              </button>

              {openFlavor && (
                <div className="mt-2.5 space-y-2 text-xs max-h-48 overflow-y-auto pr-1">
                  {/* Opción 'Todos los sabores' ubicada arriba de Chocolate */}
                  <label className="flex items-center gap-2.5 cursor-pointer text-[#4A3225] hover:text-[#BA2A5D] transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedFlavors.length === 0}
                      onChange={() => setSelectedFlavors([])}
                      className="w-4 h-4 accent-[#BA2A5D] rounded cursor-pointer"
                    />
                    <span className={selectedFlavors.length === 0 ? 'font-bold text-[#BA2A5D]' : 'font-normal'}>
                      Todos los sabores
                    </span>
                  </label>

                  {FLAVORS_LIST.map((flav) => {
                    const isChecked = selectedFlavors.includes(flav);
                    return (
                      <label
                        key={flav}
                        className="flex items-center gap-2.5 cursor-pointer text-[#4A3225] hover:text-[#BA2A5D] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleFlavorToggle(flav)}
                          className="w-4 h-4 accent-[#BA2A5D] rounded cursor-pointer"
                        />
                        <span className={isChecked ? 'font-bold text-[#BA2A5D]' : 'font-normal'}>{flav}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filter 3: Precio */}
            <div className="border-b border-[#F0E6DC] pb-4 mb-4">
              <button
                type="button"
                onClick={() => setOpenPrice(!openPrice)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-[#382015] uppercase tracking-wider py-1 hover:text-[#BA2A5D]"
              >
                <span>Precio</span>
                {openPrice ? <ChevronUp className="w-4 h-4 text-[#8C7667]" /> : <ChevronDown className="w-4 h-4 text-[#8C7667]" />}
              </button>

              {openPrice && (
                <div className="mt-3">
                  {/* Slider bar */}
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-[#EAE0D5] rounded-lg appearance-none cursor-pointer accent-[#BA2A5D]"
                  />
                  <div className="flex items-center justify-between text-xs font-bold text-[#5A3828] mt-2">
                    <span>S/ 0.00</span>
                    <span className="text-[#BA2A5D]">Hasta S/ {maxPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filter 4: Marca */}
            <div className="pb-2 mb-4">
              <button
                type="button"
                onClick={() => setOpenBrand(!openBrand)}
                className="w-full flex items-center justify-between text-xs font-extrabold text-[#382015] uppercase tracking-wider py-1 hover:text-[#BA2A5D]"
              >
                <span>Marca</span>
                {openBrand ? <ChevronUp className="w-4 h-4 text-[#8C7667]" /> : <ChevronDown className="w-4 h-4 text-[#8C7667]" />}
              </button>

              {openBrand && (
                <div className="mt-2.5 space-y-2 text-xs">
                  {BRANDS_LIST.map((brand) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label
                        key={brand}
                        className="flex items-center gap-2.5 cursor-pointer text-[#4A3225] hover:text-[#BA2A5D] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleBrandToggle(brand)}
                          className="w-4 h-4 accent-[#BA2A5D] rounded cursor-pointer"
                        />
                        <span className={isChecked ? 'font-bold text-[#BA2A5D]' : 'font-normal'}>{brand}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom cute doodle box: "Elige tu favorita ♥" */}
            <div className="mt-6 pt-5 border-t border-dashed border-[#DFD3C6] text-center flex flex-col items-center">
              <div className="text-3xl mb-1">🍪</div>
              <p className="font-handwriting text-xl text-[#382015] font-bold leading-tight">
                Elige tu
                <br />
                favorita ♥
              </p>
            </div>
          </aside>

          {/* =========================================================
              RIGHT PRODUCTS COLUMN (Expands to fill all available space)
             ========================================================= */}
          <main className="flex-1 min-w-0 w-full">
            {/* Top Toolbar (Search Bar + Results count + sorting dropdowns) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-3 border-b border-[#EAE0D5]">
              {/* Search input in products grid */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-[#8C7667] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Buscar galletas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#DED2C5] rounded-full pl-9 pr-8 py-1.5 text-xs text-[#382015] placeholder-[#9B8779] focus:outline-none focus:border-[#BA2A5D] focus:ring-1 focus:ring-[#BA2A5D] transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 text-xs font-medium text-[#4A3225]">
                <div className="text-xs font-bold text-[#7A6456] tracking-wider uppercase mr-auto sm:mr-0">
                  {displayedProducts.length} de {filteredProducts.length} galletas
                </div>

                {/* ORDENAR POR */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8C7667] font-semibold uppercase text-[11px]">ORDENAR</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-white border border-[#DED2C5] rounded-md px-2.5 py-1 text-xs text-[#382015] font-medium focus:outline-none focus:border-[#BA2A5D] cursor-pointer"
                  >
                    <option value="popular">Más populares</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                    <option value="rating">Mejor valoradas</option>
                  </select>
                </div>

                {/* MOSTRAR */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8C7667] font-semibold text-[11px]">Mostrar</span>
                  <select
                    value={displayCount}
                    onChange={(e) => setDisplayCount(parseInt(e.target.value))}
                    className="bg-white border border-[#DED2C5] rounded-md px-2.5 py-1 text-xs text-[#382015] font-medium focus:outline-none focus:border-[#BA2A5D] cursor-pointer"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Product Cards Grid (Spans horizontally across all remaining width) */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#EAE0D5] p-12 text-center my-6">
                <div className="text-5xl mb-3">🍪</div>
                <h3 className="text-lg font-bold text-[#382015] mb-1">No se encontraron galletas con estos filtros</h3>
                <p className="text-sm text-[#7A6456] max-w-md mx-auto mb-5">
                  Prueba seleccionando otras categorías, sabores o ajustando el rango de precio para ver más opciones.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('Todas las galletas');
                    setSelectedFlavors([]);
                    setSelectedBrands(['Todas las marcas']);
                    setMaxPrice(20.0);
                    setSearchQuery('');
                  }}
                  className="bg-[#BA2A5D] text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#A32350] transition-colors"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 min-[1300px]:grid-cols-5 2xl:grid-cols-5 gap-3.5 sm:gap-4 w-full">
                {displayedProducts.map((cookie) => {
                  const isFav = favorites.has(cookie.id);
                  const isBestSeller = cookie.badge === 'Más vendido';
                  const isNew = cookie.badge === 'Nuevo';

                  return (
                    <article
                      key={cookie.id}
                      className="bg-white rounded-xl border border-[#EDE4DB] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                    >
                      {/* Top Image area with badges and heart */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF6F0]">
                        <img
                          src={cookie.image}
                          alt={cookie.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80";
                          }}
                        />

                        {/* Top Badges */}
                        {isBestSeller && (
                          <div className="absolute top-2.5 left-2.5 bg-[#BA2A5D] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            Más vendido
                          </div>
                        )}
                        {isNew && (
                          <div className="absolute top-2.5 left-2.5 bg-[#2A9D8F] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                            Nuevo
                          </div>
                        )}

                        {/* Favorite Heart Outline */}
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(cookie.id, e)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-gray-500 hover:text-[#BA2A5D] hover:scale-110 transition-all shadow-xs"
                          title={isFav ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          aria-label={`Favorito ${cookie.name}`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-[#BA2A5D] text-[#BA2A5D]' : 'text-gray-600 stroke-[2]'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between gap-2.5">
                        <div>
                          {/* Title */}
                          <h3 className="text-xs sm:text-[13px] font-bold text-[#2E180D] leading-snug line-clamp-2 min-h-[34px]">
                            {cookie.name}
                          </h3>

                          {/* Price */}
                          <div className="mt-1 text-sm font-extrabold text-[#2E180D]">
                            S/ {cookie.price.toFixed(2)}
                          </div>

                          {/* Rating stars */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= Math.round(cookie.rating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] font-medium text-[#7A6456]">
                              {cookie.rating.toFixed(1)}/5
                            </span>
                          </div>
                        </div>

                        {/* AGREGAR AL CARRITO button */}
                        <button
                          type="button"
                          onClick={(e) => addToCart(cookie.id, e)}
                          className="w-full bg-[#4A2E1F] hover:bg-[#382015] active:scale-98 text-white rounded-md py-2 px-2 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>AGREGAR AL CARRITO</span>
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* =============================================================
            COLECCIONES DESTACADAS (As shown in bottom of IMAGENNNN.png)
           ============================================================= */}
        <section className="mt-16 sm:mt-20 pt-8 border-t border-[#EAE0D5]">
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
          BOTTOM WAVE & CHOCOLATE FOOTER BANNER (from IMAGENNNN.png)
         ============================================================= */}
      <footer className="mt-20 relative bg-[#382015] text-[#F5EDE6] pt-12 pb-14 overflow-hidden">
        {/* Decorative Wave Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-[#FAF6F0] rounded-b-[40px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Main Footer quote from image */}
          <div className="inline-flex items-center justify-center gap-3 sm:gap-6 text-sm sm:text-lg font-serif italic text-[#FDF9F5] tracking-wide">
            <span className="text-rose-300 text-base">♥</span>
            <span className="border-t border-[#6E4B38] w-8 sm:w-16"></span>
            <span className="font-medium">Galletas que hacen la vida más dulce</span>
            <span className="border-t border-[#6E4B38] w-8 sm:w-16"></span>
            <span className="text-rose-300 text-base">♥</span>
          </div>

          <p className="mt-4 text-xs text-[#BAA393] max-w-lg mx-auto">
            Horneadas artesanalmente a diario en lotes pequeños con ingredientes de calidad premium. Envíos y entregas en el día.
          </p>

          <div className="mt-8 pt-6 border-t border-[#4E3123] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A89182] gap-4">
            <div>
              © 2026 Cookie Planet — Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToHome}
                className="hover:text-white underline underline-offset-4 cursor-pointer"
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
          <div className="w-4/5 max-w-xs bg-white h-full p-5 overflow-y-auto flex flex-col justify-between">
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
