import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Eye,
  Filter,
  Footprints,
  Grid3X3,
  Headphones,
  Heart,
  Home,
  Laptop,
  LayoutList,
  Package,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tag,
  TruckIcon,
  Watch,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { allProducts, type Product } from '../Products/data/products';

// ─── Category Config ────────────────────────────────
const categoryConfig: Record<
  string,
  {
    name: string;
    description: string;
    icon: React.ElementType;
    gradient: string;
    textColor: string;
    accentBg: string;
    banner: string;
    tagline: string;
  }
> = {
  electronics: {
    name: 'Electronics',
    description: "Explore the latest tech gadgets, smart devices, and innovative accessories. From laptops to drones, we've got you covered.",
    icon: Laptop,
    gradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    textColor: 'text-blue-600',
    accentBg: 'bg-blue-50',
    banner:
      'https://images.unsplash.com/photo-1757946518453-41e2ff3a320c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljcyUyMGdhZGdldHMlMjBjb2xsZWN0aW9uJTIwZmxhdCUyMGxheXxlbnwxfHx8fDE3NzM4OTIxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tagline: 'Cutting-edge Tech at Unbeatable Prices'
  },
  fashion: {
    name: 'Fashion',
    description: 'Stay ahead of the trends with our curated fashion collection. From streetwear to luxury accessories, find your perfect style.',
    icon: Shirt,
    gradient: 'from-pink-500 via-rose-500 to-fuchsia-500',
    textColor: 'text-pink-600',
    accentBg: 'bg-pink-50',
    banner:
      'https://images.unsplash.com/photo-1770226415002-dbbd40327ec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZSUyMGRpc3BsYXl8ZW58MXx8fHwxNzczODkxMDE4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tagline: 'Trending Styles for Every Occasion'
  },
  footwear: {
    name: 'Footwear',
    description: 'Step up your shoe game with our premium footwear collection. Performance runners, classic sneakers, and everyday essentials.',
    icon: Footprints,
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    textColor: 'text-orange-600',
    accentBg: 'bg-orange-50',
    banner:
      'https://images.unsplash.com/photo-1771874621249-e188866fe1d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwY29sbGVjdGlvbiUyMGRpc3BsYXl8ZW58MXx8fHwxNzczODkyMTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tagline: 'Walk in Style & Comfort'
  },
  watches: {
    name: 'Watches',
    description: 'From smartwatches to fitness trackers, find the perfect wearable to complement your lifestyle and track your goals.',
    icon: Watch,
    gradient: 'from-emerald-500 via-teal-500 to-green-500',
    textColor: 'text-emerald-600',
    accentBg: 'bg-emerald-50',
    banner:
      'https://images.unsplash.com/photo-1764860753654-ee65d97be642?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3YXRjaGVzJTIwY29sbGVjdGlvbiUyMGRhcmt8ZW58MXx8fHwxNzczODkyMTA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tagline: 'Smart Time, Smart Life'
  },
  audio: {
    name: 'Audio',
    description: 'Immerse yourself in superior sound quality. Wireless earbuds, Bluetooth speakers, and studio-grade audio equipment.',
    icon: Headphones,
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
    textColor: 'text-violet-600',
    accentBg: 'bg-violet-50',
    banner:
      'https://images.unsplash.com/photo-1737885197946-6d9d79dade89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwYXVkaW8lMjBlcXVpcG1lbnQlMjBzdHVkaW98ZW58MXx8fHwxNzczODkyMTA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    tagline: 'Sound That Moves You'
  },
  home: {
    name: 'Home & Garden',
    description: 'Transform your living space with modern decor, smart lighting, and beautiful accessories. Make every room feel like home.',
    icon: Home,
    gradient: 'from-lime-500 via-green-500 to-emerald-500',
    textColor: 'text-lime-600',
    accentBg: 'bg-lime-50',
    banner:
      'https://images.unsplash.com/photo-1520106392146-ef585c111254?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwZGVjb3IlMjBpbnRlcmlvciUyMHBsYW50c3xlbnwxfHx8fDE3NzM4OTIxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    tagline: 'Elevate Your Living Space'
  }
};

const allCategories = Object.keys(categoryConfig);

// ─── Sort & Price ───────────────────────────────────
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity }
];

const ratingFilters = [
  { label: 'All Ratings', value: 0 },
  { label: '4 Stars & Up', value: 4 },
  { label: '4.5 Stars & Up', value: 4.5 },
  { label: '4.7 Stars & Up', value: 4.7 }
];

// ─── Product Card ───────────────────────────────────
function CategoryProductCard({ product, config }: { product: Product; config: typeof categoryConfig.electronics }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {product.badge && (
          <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-[11px] px-2.5 py-1 rounded-full`}>{product.badge}</span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked(!liked);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            liked ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>
        <div
          className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-indigo-700 transition cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="py-2 px-3 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg text-xs hover:bg-white transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-foreground truncate mb-2 text-sm">{product.name}</h4>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">${product.price}</span>
            <span className="text-sm text-muted-foreground line-through">${product.oldPrice}</span>
          </div>
          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-{discount}%</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{ width: `${Math.min((product.sold / 10000) * 100, 100)}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">{product.sold.toLocaleString()} sold</span>
        </div>
      </div>
    </Link>
  );
}

// ─── List View Card ─────────────────────────────────
function ListProductCard({ product }: { product: Product }) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <Link to={`/product/${product.id}`} className="bg-white rounded-xl border border-border p-4 flex gap-4 hover:shadow-md transition group">
      <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-50 relative">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {product.badge && (
          <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-[10px] px-2 py-0.5 rounded-full`}>{product.badge}</span>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h4 className="text-foreground text-sm mb-1">{product.name}</h4>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews.toLocaleString()})</span>
            <span className="text-xs text-muted-foreground ml-2">{product.sold.toLocaleString()} sold</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">${product.price}</span>
            <span className="text-sm text-muted-foreground line-through">${product.oldPrice}</span>
            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-{discount}%</span>
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Category Page ─────────────────────────────
export function CategoryPage() {
  const { slug } = useParams();
  const config = slug ? categoryConfig[slug] : null;

  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Products
  const products = useMemo(() => {
    if (!slug) return [];
    return allProducts
      .filter((p) => p.category === slug)
      .filter((p) => p.price >= priceRanges[priceRange].min && p.price < priceRanges[priceRange].max)
      .filter((p) => p.rating >= minRating)
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.id - a.id;
          default:
            return b.sold - a.sold;
        }
      });
  }, [slug, sortBy, priceRange, minRating]);

  // Stats
  const stats = useMemo(() => {
    const catProducts = allProducts.filter((p) => p.category === slug);
    if (catProducts.length === 0) return { avg: 0, min: 0, max: 0, total: 0 };
    return {
      avg: (catProducts.reduce((s, p) => s + p.rating, 0) / catProducts.length).toFixed(1),
      min: Math.min(...catProducts.map((p) => p.price)),
      max: Math.max(...catProducts.map((p) => p.price)),
      total: catProducts.length
    };
  }, [slug]);

  const resetFilters = () => {
    setPriceRange(0);
    setMinRating(0);
    setSortBy('popular');
  };

  // 404
  if (!config || !slug) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-foreground mb-2">Category Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
        <Link to="/" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const Icon = config.icon;

  return (
    <div className="pb-20">
      {/* ═══════ HERO BANNER ═══════ */}
      <section className="relative overflow-hidden">
        <div className={`relative min-h-[280px] md:min-h-[340px] bg-gradient-to-r ${config.gradient}`}>
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img src={config.banner} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </div>
          {/* Decorative blurs */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center py-12">
            <div className="grid md:grid-cols-2 gap-8 items-center w-full">
              <div className="text-white">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-6">
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-white">{config.name}</span>
                </nav>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl text-white !leading-tight">{config.name}</h1>
                  </div>
                </div>

                <p className="text-white/70 mb-2">{config.tagline}</p>
                <p className="text-white/50 text-sm mb-6 max-w-lg">{config.description}</p>

                {/* Stats pills */}
                <div className="flex flex-wrap gap-3">
                  <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Package className="w-3 h-3" /> {stats.total} Products
                  </span>
                  <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Star className="w-3 h-3 fill-current" /> {stats.avg} Avg Rating
                  </span>
                  <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> ${stats.min} – ${stats.max}
                  </span>
                </div>
              </div>

              {/* Banner image card */}
              <div className="hidden md:flex justify-end">
                <div className="w-72 h-72 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/20">
                  <img src={config.banner} alt={config.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORY NAVIGATION ═══════ */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allCategories.map((catKey) => {
            const cat = categoryConfig[catKey];
            const CatIcon = cat.icon;
            const isActive = catKey === slug;
            return (
              <Link
                key={catKey}
                to={`/category/${catKey}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all shrink-0 text-sm ${
                  isActive
                    ? `bg-gradient-to-r ${cat.gradient} text-white border-transparent shadow-lg`
                    : 'bg-white text-foreground border-border hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <CatIcon className="w-4 h-4" />
                {cat.name}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══════ MAIN CONTENT ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* ── SIDEBAR FILTERS (desktop) ── */}
          <aside className="hidden lg:block space-y-6">
            {/* Price Range */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h4 className="text-sm text-foreground mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Price Range
              </h4>
              <div className="space-y-2">
                {priceRanges.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => setPriceRange(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                      priceRange === i ? 'bg-indigo-600 text-white' : 'text-muted-foreground hover:bg-slate-50'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h4 className="text-sm text-foreground mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" /> Customer Rating
              </h4>
              <div className="space-y-2">
                {ratingFilters.map((rf) => (
                  <button
                    key={rf.value}
                    onClick={() => setMinRating(rf.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer flex items-center gap-2 ${
                      minRating === rf.value ? 'bg-indigo-600 text-white' : 'text-muted-foreground hover:bg-slate-50'
                    }`}
                  >
                    {rf.value > 0 && (
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(rf.value)
                                ? minRating === rf.value
                                  ? 'text-white fill-white'
                                  : 'text-amber-400 fill-amber-400'
                                : minRating === rf.value
                                  ? 'text-white/40'
                                  : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    {rf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div className="bg-white rounded-xl border border-border p-5 space-y-3">
              {[
                { icon: TruckIcon, text: 'Free shipping over $50', color: 'text-blue-600' },
                { icon: ShieldCheck, text: 'Secure checkout', color: 'text-emerald-600' },
                { icon: Sparkles, text: 'Quality guaranteed', color: 'text-purple-600' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
                  {item.text}
                </div>
              ))}
            </div>

            {/* Other categories */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h4 className="text-sm text-foreground mb-3">Browse Other Categories</h4>
              <div className="space-y-1">
                {allCategories
                  .filter((c) => c !== slug)
                  .map((catKey) => {
                    const cat = categoryConfig[catKey];
                    const CatIcon = cat.icon;
                    const count = allProducts.filter((p) => p.category === catKey).length;
                    return (
                      <Link
                        key={catKey}
                        to={`/category/${catKey}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-slate-50 hover:text-foreground transition"
                      >
                        <span className="flex items-center gap-2">
                          <CatIcon className="w-3.5 h-3.5" /> {cat.name}
                        </span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
                      </Link>
                    );
                  })}
              </div>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border border-border p-4 mb-6">
              <div className="flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="text-foreground">{products.length}</span> products
                </p>
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-100 text-sm px-3 py-2 rounded-lg border-none outline-none cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View toggle */}
                <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition cursor-pointer ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition cursor-pointer ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile filters panel */}
            {showMobileFilters && (
              <div className="lg:hidden mb-6 bg-white rounded-xl border border-border p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Filters</span>
                  <button onClick={() => setShowMobileFilters(false)} className="cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range, i) => (
                      <button
                        key={i}
                        onClick={() => setPriceRange(i)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer ${
                          priceRange === i ? 'bg-indigo-600 text-white border-indigo-600' : 'border-border text-foreground'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Customer Rating</p>
                  <div className="flex flex-wrap gap-2">
                    {ratingFilters.map((rf) => (
                      <button
                        key={rf.value}
                        onClick={() => setMinRating(rf.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer ${
                          minRating === rf.value ? 'bg-indigo-600 text-white border-indigo-600' : 'border-border text-foreground'
                        }`}
                      >
                        {rf.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={resetFilters} className="text-xs text-indigo-600 hover:underline cursor-pointer">
                  Reset all filters
                </button>
              </div>
            )}

            {/* Active filter pills */}
            {(priceRange > 0 || minRating > 0) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Active filters:</span>
                {priceRange > 0 && (
                  <button
                    onClick={() => setPriceRange(0)}
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full hover:bg-indigo-100 transition cursor-pointer"
                  >
                    {priceRanges[priceRange].label} <X className="w-3 h-3" />
                  </button>
                )}
                {minRating > 0 && (
                  <button
                    onClick={() => setMinRating(0)}
                    className="flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full hover:bg-indigo-100 transition cursor-pointer"
                  >
                    {minRating}+ Stars <X className="w-3 h-3" />
                  </button>
                )}
                <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer ml-1">
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid / List */}
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-foreground mb-2">No products found</h3>
                <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or browse another category.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <CategoryProductCard key={product.id} product={product} config={config} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <ListProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className={`rounded-2xl bg-gradient-to-r ${config.gradient} p-8 md:p-10 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl md:text-2xl mb-2">Can't find what you're looking for?</h3>
              <p className="text-white/70 text-sm">Browse all categories or check out our homepage for the best deals across all products.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/"
                className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-white/90 transition flex items-center gap-2 text-sm cursor-pointer"
              >
                Browse All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
