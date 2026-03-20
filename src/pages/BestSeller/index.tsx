import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  Star,
  Heart,
  ShoppingCart,
  ChevronRight,
  Grid3X3,
  LayoutList,
  ChevronDown,
  Eye,
  Trophy,
  Flame,
  TrendingUp,
  Crown,
  Award,
  Medal,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  SlidersHorizontal,
  Laptop,
  Shirt,
  Footprints,
  Watch,
  Headphones,
  Home,
} from "lucide-react";
import { allProducts, type Product } from "../Products/data/products";

// ─── Category map ───────────────────────────────────
const categoryMap: Record<string, { name: string; icon: React.ElementType }> = {
  all: { name: "All Categories", icon: Grid3X3 },
  electronics: { name: "Electronics", icon: Laptop },
  fashion: { name: "Fashion", icon: Shirt },
  footwear: { name: "Footwear", icon: Footprints },
  watches: { name: "Watches", icon: Watch },
  audio: { name: "Audio", icon: Headphones },
  home: { name: "Home & Garden", icon: Home },
};

// ─── Time Period Filter ─────────────────────────────
const timePeriods = [
  { value: "all-time", label: "All Time" },
  { value: "this-month", label: "This Month" },
  { value: "this-week", label: "This Week" },
];

// ─── Ranking badge ──────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="absolute top-3 left-3 z-10 w-9 h-9 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-200">
        <Crown className="w-4.5 h-4.5 text-white" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="absolute top-3 left-3 z-10 w-9 h-9 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center shadow-lg">
        <Medal className="w-4.5 h-4.5 text-white" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="absolute top-3 left-3 z-10 w-9 h-9 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
        <Award className="w-4.5 h-4.5 text-white" />
      </div>
    );
  return (
    <div className="absolute top-3 left-3 z-10 w-7 h-7 bg-slate-800/70 backdrop-blur-sm rounded-full flex items-center justify-center">
      <span className="text-white text-xs">#{rank}</span>
    </div>
  );
}

// ─── Hero Product Card (Top 3) ──────────────────────
function HeroProductCard({ product, rank }: { product: Product; rank: number }) {
  const [liked, setLiked] = useState(false);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const borderColors = ["ring-amber-400", "ring-slate-300", "ring-amber-600"];
  const bgGradients = [
    "from-amber-50 to-yellow-50",
    "from-slate-50 to-gray-50",
    "from-orange-50 to-amber-50",
  ];

  return (
    <Link
      to={`/product/${product.id}`}
      className={`group relative bg-gradient-to-br ${bgGradients[rank - 1]} rounded-2xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ring-2 ${borderColors[rank - 1]}`}
    >
      <RankBadge rank={rank} />

      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer z-10 ${
            liked ? "bg-red-500 text-white" : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        </button>

        {/* Hover actions */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => e.preventDefault()}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-xs flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="py-2.5 px-3 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg text-xs hover:bg-white transition cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full capitalize">{product.category}</span>
          {rank === 1 && (
            <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" /> #1 Best Seller
            </span>
          )}
        </div>
        <h3 className="text-foreground mb-2 text-sm">{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600 text-lg">${product.price}</span>
            <span className="text-sm text-muted-foreground line-through">${product.oldPrice}</span>
          </div>
          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-{discount}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
              style={{ width: `${Math.min((product.sold / 10000) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" /> {product.sold.toLocaleString()} sold
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Regular Product Card ───────────────────────────
function BestSellerCard({ product, rank }: { product: Product; rank: number }) {
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
        <RankBadge rank={rank} />
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.badge && (
          <span className={`absolute top-3 right-12 ${product.badgeColor} text-white text-[11px] px-2.5 py-1 rounded-full`}>
            {product.badge}
          </span>
        )}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            liked ? "bg-red-500 text-white" : "bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        </button>
        <div
          className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
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
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
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
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
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
function ListCard({ product, rank }: { product: Product; rank: number }) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <Link
      to={`/product/${product.id}`}
      className="bg-white rounded-xl border border-border p-4 flex gap-4 hover:shadow-md transition group"
    >
      <div className="w-32 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-50 relative">
        <RankBadge rank={rank} />
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-foreground text-sm">{product.name}</h4>
            {rank <= 3 && <Trophy className="w-3.5 h-3.5 text-amber-500" />}
          </div>
          <div className="flex items-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews.toLocaleString()})</span>
            <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-500" /> {product.sold.toLocaleString()} sold
            </span>
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

// ─── Main Page ──────────────────────────────────────
export function BestSellerPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [timePeriod, setTimePeriod] = useState("all-time");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const bestSellers = useMemo(() => {
    let products = [...allProducts];
    if (activeCategory !== "all") {
      products = products.filter((p) => p.category === activeCategory);
    }
    return products.sort((a, b) => b.sold - a.sold);
  }, [activeCategory]);

  const top3 = bestSellers.slice(0, 3);
  const rest = bestSellers.slice(3);

  // Stats
  const totalSold = allProducts.reduce((s, p) => s + p.sold, 0);
  const avgRating = (allProducts.reduce((s, p) => s + p.rating, 0) / allProducts.length).toFixed(1);
  const totalReviews = allProducts.reduce((s, p) => s + p.reviews, 0);

  const categories = Object.keys(categoryMap);

  return (
    <div className="pb-20">
      {/* ═══════ HERO BANNER ═══════ */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[300px] md:min-h-[380px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1760565030346-4b947220fe3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwdHJlbmRpbmclMjBwcm9kdWN0cyUyMHNob3BwaW5nJTIwYmFnc3xlbnwxfHx8fDE3NzM4OTQ0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt=""
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>
          {/* Decorative */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-14 flex items-center">
            <div className="w-full">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-6">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-white">Best Sellers</span>
              </nav>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl text-white !leading-tight">Best Sellers</h1>
                    </div>
                  </div>
                  <p className="text-white/70 mb-2">Top-Rated Products Loved by Thousands</p>
                  <p className="text-white/50 text-sm mb-6 max-w-lg">
                    Discover our most popular products, ranked by customer purchases and ratings.
                    These are the items everyone is talking about.
                  </p>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Flame className="w-3 h-3" /> {totalSold.toLocaleString()} Total Sold
                    </span>
                    <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-current" /> {avgRating} Avg Rating
                    </span>
                    <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3" /> {totalReviews.toLocaleString()} Reviews
                    </span>
                  </div>
                </div>

                {/* Trophy illustration */}
                <div className="hidden md:flex justify-end">
                  <div className="relative">
                    <div className="w-56 h-56 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                      <Trophy className="w-28 h-28 text-white/80" />
                    </div>
                    <div className="absolute -top-3 -right-3 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Customer Favorites
                    </div>
                    <div className="absolute -bottom-3 -left-3 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" /> Trending Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORY FILTER BAR ═══════ */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((catKey) => {
            const cat = categoryMap[catKey];
            const CatIcon = cat.icon;
            const isActive = catKey === activeCategory;
            const count = catKey === "all" ? allProducts.length : allProducts.filter((p) => p.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border whitespace-nowrap transition-all shrink-0 text-sm cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-lg"
                    : "bg-white text-foreground border-border hover:border-amber-300 hover:shadow-md"
                }`}
              >
                <CatIcon className="w-4 h-4" />
                {cat.name}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/25" : "bg-slate-100"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════ TOP 3 PODIUM ═══════ */}
      {activeCategory === "all" && top3.length >= 3 && (
        <section className="max-w-7xl mx-auto px-4 mt-10">
          <div className="flex items-center gap-2 mb-6">
            <Crown className="w-5 h-5 text-amber-500" />
            <h2 className="text-foreground">Top 3 Best Sellers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {top3.map((product, i) => (
              <HeroProductCard key={product.id} product={product} rank={i + 1} />
            ))}
          </div>
        </section>
      )}

      {/* ═══════ TOOLBAR ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-foreground">{activeCategory === "all" ? rest.length : bestSellers.length}</span> products
            </p>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Period */}
            <div className="hidden sm:flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="bg-slate-100 text-sm px-3 py-2 rounded-lg border-none outline-none cursor-pointer"
              >
                {timePeriods.map((tp) => (
                  <option key={tp.value} value={tp.value}>{tp.label}</option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="sm:hidden mb-6 bg-white rounded-xl border border-border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Filters</span>
              <button onClick={() => setShowMobileFilters(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Time Period</p>
              <div className="flex flex-wrap gap-2">
                {timePeriods.map((tp) => (
                  <button
                    key={tp.value}
                    onClick={() => setTimePeriod(tp.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition cursor-pointer ${
                      timePeriod === tp.value ? "bg-amber-500 text-white border-amber-500" : "border-border text-foreground"
                    }`}
                  >
                    {tp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════ PRODUCT GRID ═══════ */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(activeCategory === "all" ? rest : bestSellers).map((product, i) => (
              <BestSellerCard
                key={product.id}
                product={product}
                rank={activeCategory === "all" ? i + 4 : i + 1}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(activeCategory === "all" ? rest : bestSellers).map((product, i) => (
              <ListCard
                key={product.id}
                product={product}
                rank={activeCategory === "all" ? i + 4 : i + 1}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl md:text-2xl mb-2">Want to explore more?</h3>
              <p className="text-white/70 text-sm">Browse all categories or check out our latest deals on the homepage.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/"
                className="px-6 py-3 bg-white text-orange-600 rounded-xl hover:bg-white/90 transition flex items-center gap-2 text-sm"
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
