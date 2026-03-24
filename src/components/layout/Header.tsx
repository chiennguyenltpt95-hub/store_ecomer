import {
  ArrowRight,
  ChevronDown,
  Footprints,
  Headphones,
  Heart,
  History,
  Home,
  Laptop,
  LogOut,
  Menu,
  Package,
  PercentCircle,
  Search,
  Settings,
  Shirt,
  ShoppingCart,
  Sparkles,
  Star,
  TruckIcon,
  User,
  Watch,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthTokens, getAccessToken, http } from '../../services/http';

type HeaderUser = {
  full_name?: string;
  name?: string;
  email?: string;
};

function extractCurrentUser(data: unknown): HeaderUser | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  if ('email' in record || 'full_name' in record || 'name' in record) {
    return record as HeaderUser;
  }

  if ('data' in record && record.data && typeof record.data === 'object') {
    return record.data as HeaderUser;
  }

  if ('user' in record && record.user && typeof record.user === 'object') {
    return record.user as HeaderUser;
  }

  return null;
}

const categories = [
  { name: 'Electronics', slug: 'electronics', icon: Laptop, subcategories: ['Phones & Tablets', 'Laptops', 'Cameras', 'Audio', 'Accessories'] },
  { name: 'Fashion', slug: 'fashion', icon: Shirt, subcategories: ["Men's Clothing", "Women's Clothing", 'Kids', 'Jewelry', 'Bags'] },
  { name: 'Footwear', slug: 'footwear', icon: Footprints, subcategories: ['Sneakers', 'Boots', 'Sandals', 'Sports Shoes', 'Formal'] },
  { name: 'Watches', slug: 'watches', icon: Watch, subcategories: ['Smart Watches', 'Analog', 'Digital', 'Luxury', 'Sports'] },
  { name: 'Audio', slug: 'audio', icon: Headphones, subcategories: ['Earbuds', 'Headphones', 'Speakers', 'Microphones', 'Soundbars'] },
  { name: 'Home & Garden', slug: 'home', icon: Home, subcategories: ['Furniture', 'Decor', 'Kitchen', 'Lighting', 'Garden Tools'] }
];

const trendingProducts = [
  {
    name: 'Wireless Earbuds Pro',
    price: '$29.99',
    oldPrice: '$59.99',
    image:
      'https://images.unsplash.com/photo-1755182529034-189a6051faae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBwcm9kdWN0JTIwd2hpdGV8ZW58MXx8fHwxNzczODE0NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Smart Watch Ultra',
    price: '$49.99',
    oldPrice: '$99.99',
    image:
      'https://images.unsplash.com/photo-1571126817476-92bf7da319c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwcHJvZHVjdCUyMG1pbmltYWx8ZW58MXx8fHwxNzczNzY4OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Running Sneakers V2',
    price: '$39.99',
    oldPrice: '$79.99',
    image:
      'https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzM4ODI0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

const cartItems = [
  {
    name: 'Travel Backpack',
    price: '$34.99',
    qty: 1,
    image:
      'https://images.unsplash.com/photo-1773309247439-dbdc845b3c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMHByb2R1Y3QlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzczODg5NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    name: 'Wireless Earbuds Pro',
    price: '$29.99',
    qty: 2,
    image:
      'https://images.unsplash.com/photo-1755182529034-189a6051faae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBwcm9kdWN0JTIwd2hpdGV8ZW58MXx8fHwxNzczODE0NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

export function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [headerUser, setHeaderUser] = useState<HeaderUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const megaMenuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setHeaderUser(null);
      return;
    }

    let cancelled = false;

    const loadUser = async () => {
      try {
        const response = await http.get('/v1/users/me');
        const user = extractCurrentUser(response.data);
        if (!cancelled) {
          setHeaderUser(user);
        }
      } catch {
        if (!cancelled) {
          setHeaderUser(null);
        }
      }
    };

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (userMenuRef.current.contains(event.target as Node)) return;
      setUserMenuOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleMegaMenuEnter = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuOpen(true);
  };

  const handleMegaMenuLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveCategory(null);
    }, 200);
  };

  const handleLogout = () => {
    clearAuthTokens();
    setHeaderUser(null);
    setUserMenuOpen(false);
    navigate('/auth');
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs tracking-wide">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-3 h-3" />
          <span>
            FREE SHIPPING on orders over $50 | Use code <span className="underline">DROP20</span> for 20% OFF
          </span>
          <Sparkles className="w-3 h-3" />
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo + hamburger */}
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl tracking-tight text-foreground">
                  Drop<span className="text-indigo-600">Store</span>
                </span>
              </Link>
            </div>

            {/* Center: Nav Links (desktop) */}
            <div className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm text-foreground hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition">
                Home
              </Link>

              {/* Shop with mega menu */}
              <div className="relative" onMouseEnter={handleMegaMenuEnter} onMouseLeave={handleMegaMenuLeave}>
                <button className="px-3 py-2 text-sm text-foreground hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1 cursor-pointer">
                  Shop <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <Link
                to="/products"
                className="px-3 py-2 text-sm text-foreground hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1"
              >
                <PercentCircle className="w-3.5 h-3.5" /> Deals
              </Link>
              <Link
                to="/best-sellers"
                className="px-3 py-2 text-sm text-foreground hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5" /> Best Sellers
              </Link>
              <Link
                to="/track-order"
                className="px-3 py-2 text-sm text-foreground hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition flex items-center gap-1"
              >
                <TruckIcon className="w-3.5 h-3.5" /> Track Order
              </Link>
            </div>

            {/* Right: Search, Wishlist, Cart, User */}
            <div className="flex items-center gap-1">
              {/* Search bar (desktop) */}
              <div className="hidden md:flex items-center relative">
                <div
                  className={`flex items-center bg-slate-100 rounded-full overflow-hidden transition-all duration-300 ${searchOpen ? 'w-64' : 'w-10'}`}
                >
                  <button onClick={() => setSearchOpen(!searchOpen)} className="p-2.5 hover:text-indigo-600 transition cursor-pointer shrink-0">
                    <Search className="w-4 h-4" />
                  </button>
                  {searchOpen && (
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent pr-3 py-2 text-sm outline-none w-full"
                    />
                  )}
                </div>
              </div>

              {/* Mobile search */}
              <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2.5 hover:bg-slate-100 rounded-lg transition cursor-pointer">
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button className="p-2.5 hover:bg-slate-100 rounded-lg transition cursor-pointer relative hidden sm:flex">
                <Heart className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Cart */}
              <div className="relative">
                <button onClick={() => setCartOpen(!cartOpen)} className="p-2.5 hover:bg-slate-100 rounded-lg transition cursor-pointer relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center">
                    {cartItems.reduce((s, i) => s + i.qty, 0)}
                  </span>
                </button>

                {/* Cart dropdown */}
                {cartOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setCartOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-border z-50 overflow-hidden">
                      <div className="p-4 border-b border-border flex items-center justify-between">
                        <span className="text-sm text-foreground">Shopping Cart ({cartItems.reduce((s, i) => s + i.qty, 0)})</span>
                        <button onClick={() => setCartOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {cartItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition">
                            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                              <p className="text-sm text-indigo-600">{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-border space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="text-foreground">$94.97</span>
                        </div>
                        <Link
                          to="/checkout"
                          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-2"
                        >
                          Checkout <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User */}
              {headerUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="hidden sm:block leading-tight max-w-[160px] text-left">
                      <p className="text-xs text-foreground truncate">{headerUser.full_name || headerUser.name || 'User'}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{headerUser.email || 'Signed in'}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                      <Link
                        to="/track-order"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-slate-50 transition"
                      >
                        <History className="w-4 h-4" /> History
                      </Link>
                      <Link
                        to="/auth"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-slate-50 transition"
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="p-2.5 hover:bg-slate-100 rounded-lg transition">
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mega Menu (desktop) */}
        {megaMenuOpen && (
          <div
            className="hidden lg:block absolute left-0 right-0 bg-white border-t border-border shadow-xl z-50"
            onMouseEnter={handleMegaMenuEnter}
            onMouseLeave={handleMegaMenuLeave}
          >
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-6">
              {/* Categories */}
              <div className="col-span-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Categories</p>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.name}
                      to={`/category/${cat.slug}`}
                      onMouseEnter={() => setActiveCategory(cat.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition cursor-pointer ${
                        activeCategory === cat.name ? 'bg-indigo-50 text-indigo-600' : 'text-foreground hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat.name}
                      <ChevronDown className="w-3 h-3 -rotate-90 ml-auto" />
                    </Link>
                  );
                })}
              </div>

              {/* Subcategories */}
              <div className="col-span-4 border-l border-border pl-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">{activeCategory || 'Select a category'}</p>
                {activeCategory && (
                  <div className="grid grid-cols-1 gap-1">
                    {categories
                      .find((c) => c.name === activeCategory)
                      ?.subcategories.map((sub) => (
                        <Link
                          key={sub}
                          to={`/category/${categories.find((c) => c.name === activeCategory)?.slug}`}
                          className="px-3 py-2 text-sm text-foreground hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition block"
                        >
                          {sub}
                        </Link>
                      ))}
                  </div>
                )}
              </div>

              {/* Trending products */}
              <div className="col-span-5 border-l border-border pl-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Trending Now</p>
                <div className="space-y-3">
                  {trendingProducts.map((product, i) => (
                    <Link key={i} to={`/products/${i + 1}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition group">
                      <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div>
                        <p className="text-sm text-foreground group-hover:text-indigo-600 transition">{product.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-indigo-600">{product.price}</span>
                          <span className="text-xs text-muted-foreground line-through">{product.oldPrice}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile search bar */}
        {searchOpen && (
          <div className="md:hidden border-t border-border p-3">
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-2.5 gap-2">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm outline-none w-full"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="cursor-pointer"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 overflow-y-auto shadow-2xl lg:hidden">
            {/* Mobile header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg tracking-tight">
                  Drop<span className="text-indigo-600">Store</span>
                </span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile nav links */}
            <div className="p-4 space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
              >
                <Home className="w-4 h-4" /> Home
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
              >
                <PercentCircle className="w-4 h-4" /> Deals
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
              >
                <Star className="w-4 h-4" /> Best Sellers
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
              >
                <Heart className="w-4 h-4" /> Wishlist
                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">3</span>
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition"
              >
                <TruckIcon className="w-4 h-4" /> Track Order
              </Link>
            </div>

            {/* Mobile categories */}
            <div className="px-4 pb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-2">Shop by Category</p>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.name}>
                      <button
                        onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-slate-50 rounded-lg transition cursor-pointer"
                      >
                        <Icon className="w-4 h-4" />
                        {cat.name}
                        <ChevronDown className={`w-3 h-3 ml-auto transition-transform ${activeCategory === cat.name ? 'rotate-180' : ''}`} />
                      </button>
                      {activeCategory === cat.name && (
                        <div className="ml-10 space-y-0.5 mt-1 mb-2">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub}
                              to={`/category/${cat.slug}`}
                              className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-indigo-600 transition"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile user actions */}
            <div className="p-4 border-t border-border">
              <Link
                to="/login"
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" /> Sign In / Register
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
