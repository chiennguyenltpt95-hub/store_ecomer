import {
  ArrowRight,
  BadgePercent,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Flame,
  Footprints,
  Grid3X3,
  Headphones,
  Heart,
  Home,
  Laptop,
  LayoutList,
  Package,
  RefreshCw,
  ShieldCheck,
  Shirt,
  ShoppingCart,
  SlidersHorizontal,
  Star,
  Timer,
  TruckIcon,
  Watch,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Images ─────────────────────────────────────────
const images = {
  earbuds:
    'https://images.unsplash.com/photo-1755182529034-189a6051faae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGVhcmJ1ZHMlMjBwcm9kdWN0JTIwd2hpdGV8ZW58MXx8fHwxNzczODE0NjM2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  smartwatch:
    'https://images.unsplash.com/photo-1571126817476-92bf7da319c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHdhdGNoJTIwcHJvZHVjdCUyMG1pbmltYWx8ZW58MXx8fHwxNzczNzY4OTc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  sneakers:
    'https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzM4ODI0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  backpack:
    'https://images.unsplash.com/photo-1773309247439-dbdc845b3c24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMHByb2R1Y3QlMjBsaWZlc3R5bGV8ZW58MXx8fHwxNzczODg5NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  phone:
    'https://images.unsplash.com/photo-1569144157591-c60f3f82f137?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwcHJvZHVjdCUyMGRhcmslMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Mzg5MDI3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  laptop:
    'https://images.unsplash.com/photo-1765805912423-903c9505c105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBwcm9kdWN0JTIwbW9kZXJuJTIwZGVza3xlbnwxfHx8fDE3NzM4OTAyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  jacket:
    'https://images.unsplash.com/photo-1771310961705-c8b34eddbe9e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwamFja2V0JTIwbWVuJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzM4OTAyNzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  handbag:
    'https://images.unsplash.com/photo-1574271143443-3a7b2e7a36bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGhhbmRiYWclMjBsdXh1cnklMjBwcm9kdWN0fGVufDF8fHx8MTc3Mzg5MDI3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
  speaker:
    'https://images.unsplash.com/photo-1768618506508-2575a80f4461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVldG9vdGglMjBzcGVha2VyJTIwcG9ydGFibGUlMjBwcm9kdWN0fGVufDF8fHx8MTc3MzgzOTA0MXww&ixlib=rb-4.1.0&q=80&w=1080',
  sunglasses:
    'https://images.unsplash.com/photo-1764333327297-0ebfd9fda541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbiUyMGFjY2Vzc29yeXxlbnwxfHx8fDE3NzM4MDc2NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
  keyboard:
    'https://images.unsplash.com/photo-1570944887446-890d62d87293?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYiUyMHByb2R1Y3R8ZW58MXx8fHwxNzczODkwMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  lamp: 'https://images.unsplash.com/photo-1759668358492-927c1a1062b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZGVzayUyMGxhbXAlMjBtb2Rlcm58ZW58MXx8fHwxNzczODkwMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  drone:
    'https://images.unsplash.com/photo-1605205236197-fa807b14f2f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMGNhbWVyYSUyMGFlcmlhbCUyMHByb2R1Y3R8ZW58MXx8fHwxNzczODkwMjc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  fitnessBand:
    'https://images.unsplash.com/photo-1758348844319-6ca57f0a8ea0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhY2tlciUyMGJhbmQlMjBwcm9kdWN0fGVufDF8fHx8MTc3Mzg5MDI3OXww&ixlib=rb-4.1.0&q=80&w=1080',
  whiteShoes:
    'https://images.unsplash.com/photo-1663151860122-4890a08dc22b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW52YXMlMjBzbmVha2VycyUyMHdoaXRlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzM4OTAyODB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  plantPot:
    'https://images.unsplash.com/photo-1765497178307-c843343ac313?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwZGVjb3IlMjBwbGFudCUyMHBvdCUyMGNlcmFtaWN8ZW58MXx8fHwxNzczODkwMjgwfDA&ixlib=rb-4.1.0&q=80&w=1080'
};

// ─── Categories ─────────────────────────────────────
const categoryFilters = [
  {
    id: 'all',
    name: 'All Products',
    icon: Grid3X3,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Laptop,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: Shirt,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'footwear',
    name: 'Footwear',
    icon: Footprints,
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'watches',
    name: 'Watches',
    icon: Watch,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'audio',
    name: 'Audio',
    icon: Headphones,
    color: 'from-violet-500 to-purple-500'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: Home,
    color: 'from-lime-500 to-green-500'
  }
];

// ─── Products ───────────────────────────────────────
type Product = {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  sold: number;
};

const allProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Earbuds Pro Max',
    price: 29.99,
    oldPrice: 59.99,
    image: images.earbuds,
    category: 'audio',
    rating: 4.8,
    reviews: 2341,
    badge: 'Best Seller',
    badgeColor: 'bg-indigo-600',
    sold: 5200
  },
  {
    id: 2,
    name: 'Smart Watch Ultra Series',
    price: 49.99,
    oldPrice: 99.99,
    image: images.smartwatch,
    category: 'watches',
    rating: 4.7,
    reviews: 1892,
    badge: '-50%',
    badgeColor: 'bg-red-500',
    sold: 3800
  },
  {
    id: 3,
    name: 'Running Sneakers V2',
    price: 39.99,
    oldPrice: 79.99,
    image: images.sneakers,
    category: 'footwear',
    rating: 4.6,
    reviews: 956,
    badge: 'Hot',
    badgeColor: 'bg-orange-500',
    sold: 2100
  },
  {
    id: 4,
    name: 'Pro Laptop Stand & Dock',
    price: 89.99,
    oldPrice: 149.99,
    image: images.laptop,
    category: 'electronics',
    rating: 4.9,
    reviews: 743,
    badge: 'New',
    badgeColor: 'bg-emerald-500',
    sold: 890
  },
  {
    id: 5,
    name: 'Streetwear Bomber Jacket',
    price: 45.99,
    oldPrice: 89.99,
    image: images.jacket,
    category: 'fashion',
    rating: 4.5,
    reviews: 1203,
    sold: 3400
  },
  {
    id: 6,
    name: 'Luxury Leather Handbag',
    price: 34.99,
    oldPrice: 69.99,
    image: images.handbag,
    category: 'fashion',
    rating: 4.7,
    reviews: 876,
    badge: '-50%',
    badgeColor: 'bg-red-500',
    sold: 1560
  },
  {
    id: 7,
    name: 'Portable Bluetooth Speaker',
    price: 24.99,
    oldPrice: 49.99,
    image: images.speaker,
    category: 'audio',
    rating: 4.4,
    reviews: 2105,
    sold: 4300
  },
  {
    id: 8,
    name: 'Polarized Sunglasses UV400',
    price: 15.99,
    oldPrice: 35.99,
    image: images.sunglasses,
    category: 'fashion',
    rating: 4.3,
    reviews: 1543,
    badge: 'Popular',
    badgeColor: 'bg-purple-500',
    sold: 6700
  },
  {
    id: 9,
    name: 'RGB Mechanical Keyboard',
    price: 59.99,
    oldPrice: 119.99,
    image: images.keyboard,
    category: 'electronics',
    rating: 4.8,
    reviews: 634,
    badge: '-50%',
    badgeColor: 'bg-red-500',
    sold: 1200
  },
  {
    id: 10,
    name: 'Modern LED Desk Lamp',
    price: 22.99,
    oldPrice: 44.99,
    image: images.lamp,
    category: 'home',
    rating: 4.6,
    reviews: 423,
    badge: 'New',
    badgeColor: 'bg-emerald-500',
    sold: 780
  },
  {
    id: 11,
    name: '4K Camera Drone Pro',
    price: 129.99,
    oldPrice: 259.99,
    image: images.drone,
    category: 'electronics',
    rating: 4.9,
    reviews: 312,
    badge: '-50%',
    badgeColor: 'bg-red-500',
    sold: 450
  },
  {
    id: 12,
    name: 'Fitness Tracker Band',
    price: 19.99,
    oldPrice: 39.99,
    image: images.fitnessBand,
    category: 'watches',
    rating: 4.3,
    reviews: 1876,
    sold: 5100
  },
  {
    id: 13,
    name: 'Canvas Sneakers Classic',
    price: 27.99,
    oldPrice: 55.99,
    image: images.whiteShoes,
    category: 'footwear',
    rating: 4.5,
    reviews: 987,
    sold: 2900
  },
  {
    id: 14,
    name: 'Ceramic Plant Pot Set',
    price: 18.99,
    oldPrice: 37.99,
    image: images.plantPot,
    category: 'home',
    rating: 4.4,
    reviews: 543,
    sold: 1340
  },
  {
    id: 15,
    name: 'Smartphone Pro Max 15',
    price: 199.99,
    oldPrice: 399.99,
    image: images.phone,
    category: 'electronics',
    rating: 4.8,
    reviews: 4231,
    badge: 'Best Seller',
    badgeColor: 'bg-indigo-600',
    sold: 8900
  },
  {
    id: 16,
    name: 'Urban Travel Backpack',
    price: 34.99,
    oldPrice: 69.99,
    image: images.backpack,
    category: 'fashion',
    rating: 4.6,
    reviews: 1102,
    sold: 2700
  }
];

// ─── Sort Options ───────────────────────────────────
const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

// ─── Price Ranges ───────────────────────────────────
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 - $50', min: 25, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: 'Over $100', min: 100, max: Infinity }
];

// ─── Flash Deal Countdown ───────────────────────────
function useCountdown() {
  const [time, setTime] = useState({ h: 5, m: 23, s: 47 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

// ─── Product Card ───────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-[11px] px-2.5 py-1 rounded-full`}>{product.badge}</span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            liked ? 'bg-red-500 text-white' : 'bg-white/80 backdrop-blur-sm text-slate-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick actions */}
        <div
          className={`absolute bottom-3 left-3 right-3 flex gap-2 transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs flex items-center justify-center gap-1 hover:bg-indigo-700 transition cursor-pointer">
            <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
          </button>
          <button className="py-2 px-3 bg-white/90 backdrop-blur-sm text-slate-700 rounded-lg text-xs hover:bg-white transition cursor-pointer">
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-sm text-muted-foreground capitalize mb-1">{product.category}</p>
        <h4 className="text-foreground truncate mb-2 text-sm">{product.name}</h4>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">${product.price}</span>
            <span className="text-sm text-muted-foreground line-through">${product.oldPrice}</span>
          </div>
          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-{discount}%</span>
        </div>

        {/* Sold count */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              style={{
                width: `${Math.min((product.sold / 10000) * 100, 100)}%`
              }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground whitespace-nowrap">{product.sold.toLocaleString()} sold</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Hero Banner Slides ─────────────────────────────
const heroSlides = [
  {
    title: 'Summer Collection 2026',
    subtitle: 'Up to 70% Off on Electronics & Fashion',
    cta: 'Shop Now',
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    image: images.earbuds
  },
  {
    title: 'New Arrivals',
    subtitle: 'Explore the latest tech gadgets and accessories',
    cta: 'Discover',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    image: images.drone
  },
  {
    title: 'Flash Sale Today',
    subtitle: "Limited time deals on best sellers — Don't miss out!",
    cta: 'Grab Deals',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    image: images.smartwatch
  }
];

// ─── Main Component ─────────────────────────────────
export function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const countdown = useCountdown();

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Filter & Sort products
  const filteredProducts = allProducts
    .filter((p) => activeCategory === 'all' || p.category === activeCategory)
    .filter((p) => p.price >= priceRanges[priceRange].min && p.price < priceRanges[priceRange].max)
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

  const flashDeals = allProducts.filter((p) => p.badge === '-50%').slice(0, 4);

  return (
    <div className="pb-20">
      {/* ═══════ HERO BANNER ═══════ */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[480px]">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-700 ${i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
              </div>
              <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="grid md:grid-cols-2 gap-8 items-center w-full">
                  <div className="text-white">
                    <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full mb-4">
                      <Zap className="w-3 h-3" /> Limited Time Offer
                    </span>
                    <h1 className="text-4xl md:text-5xl text-white mb-4 !leading-tight">{slide.title}</h1>
                    <p className="text-white/80 text-lg mb-8 max-w-md">{slide.subtitle}</p>
                    <div className="flex gap-3">
                      <button className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl hover:bg-white/90 transition flex items-center gap-2 cursor-pointer">
                        {slide.cta} <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="px-8 py-3.5 border-2 border-white/30 text-white rounded-xl hover:bg-white/10 transition cursor-pointer">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:flex justify-end">
                    <div className="w-80 h-80 rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                      <img src={slide.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>

        {/* Slide arrows */}
        <button
          onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </section>

      {/* ═══════ TRUST BADGES ═══════ */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              icon: TruckIcon,
              title: 'Free Shipping',
              desc: 'On orders over $50',
              color: 'text-blue-600 bg-blue-50'
            },
            {
              icon: ShieldCheck,
              title: 'Secure Payment',
              desc: '100% secure checkout',
              color: 'text-emerald-600 bg-emerald-50'
            },
            {
              icon: RefreshCw,
              title: 'Easy Returns',
              desc: '30-day return policy',
              color: 'text-orange-600 bg-orange-50'
            },
            {
              icon: Headphones,
              title: '24/7 Support',
              desc: 'Dedicated support',
              color: 'text-purple-600 bg-purple-50'
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FLASH DEALS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white">Flash Deals</h2>
                <p className="text-white/70 text-sm">Hurry up! Limited time offers</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">Ends in:</span>
              {[
                { val: countdown.h, label: 'Hrs' },
                { val: countdown.m, label: 'Min' },
                { val: countdown.s, label: 'Sec' }
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-center min-w-[48px]">
                    <span className="text-white text-lg tabular-nums">{String(t.val).padStart(2, '0')}</span>
                    <p className="text-white/60 text-[10px]">{t.label}</p>
                  </div>
                  {i < 2 && <span className="text-white/50">:</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {flashDeals.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="bg-white rounded-xl overflow-hidden group hover:shadow-lg transition cursor-pointer block"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">-50%</span>
                </div>
                <div className="p-3">
                  <p className="text-sm text-foreground truncate mb-1">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">${product.price}</span>
                    <span className="text-xs text-muted-foreground line-through">${product.oldPrice}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CATEGORY FILTERS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-foreground">Shop by Category</h2>
            <p className="text-sm text-muted-foreground mt-1">Browse our curated collections</p>
          </div>
        </div>

        {/* Category pills - scrollable */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categoryFilters.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? `bg-gradient-to-r ${cat.color} text-white border-transparent shadow-lg`
                    : 'bg-white text-foreground border-border hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{cat.name}</span>
                {isActive && <span className="bg-white/25 text-[11px] px-2 py-0.5 rounded-full">{filteredProducts.length}</span>}
              </button>
            );
          })}
        </div>
      </section>

      {/* ═══════ PRODUCT TOOLBAR ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-foreground">{filteredProducts.length}</span> products
            </p>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-sm cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Price filter */}
            <div className="hidden sm:flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="bg-slate-100 text-sm px-3 py-2 rounded-lg border-none outline-none cursor-pointer"
              >
                {priceRanges.map((range, i) => (
                  <option key={i} value={i}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

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
        {showFilters && (
          <div className="sm:hidden mt-3 bg-white rounded-xl border border-border p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Filters</span>
              <button onClick={() => setShowFilters(false)} className="cursor-pointer">
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
          </div>
        )}
      </section>

      {/* ═══════ PRODUCT GRID ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-border">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-foreground mb-2">No products found</h3>
            <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or browse another category.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setPriceRange(0);
              }}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <Link
                to={`/products/${product.id}`}
                key={product.id}
                className="bg-white rounded-xl border border-border p-4 flex gap-4 hover:shadow-md transition group"
              >
                <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-slate-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                      <h4 className="text-foreground text-sm mb-1">{product.name}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({product.reviews.toLocaleString()})</span>
                      </div>
                    </div>
                    {product.badge && (
                      <span className={`${product.badgeColor} text-white text-[11px] px-2 py-0.5 rounded-full shrink-0`}>{product.badge}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600">${product.price}</span>
                      <span className="text-sm text-muted-foreground line-through">${product.oldPrice}</span>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition flex items-center gap-1.5 cursor-pointer">
                      <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ═══════ PROMO BANNERS ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 p-8 flex items-center min-h-[200px]">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-white rounded-full blur-2xl" />
            </div>
            <div className="relative z-10">
              <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full">New Collection</span>
              <h3 className="text-white text-2xl mt-3 mb-2">Tech Gadgets 2026</h3>
              <p className="text-white/70 text-sm mb-4">Discover cutting-edge electronics at incredible prices</p>
              <button className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg text-sm hover:bg-white/90 transition flex items-center gap-2 cursor-pointer">
                Explore <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <img
              src={images.drone}
              alt=""
              className="absolute right-4 bottom-4 w-36 h-36 object-cover rounded-2xl rotate-6 shadow-2xl hidden sm:block"
            />
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 p-8 flex items-center min-h-[200px]">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white rounded-full blur-2xl" />
            </div>
            <div className="relative z-10">
              <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                <BadgePercent className="w-3 h-3" /> Special Offer
              </span>
              <h3 className="text-white text-2xl mt-3 mb-2">Fashion Week Sale</h3>
              <p className="text-white/70 text-sm mb-4">Up to 60% off on trending styles and accessories</p>
              <button className="px-5 py-2.5 bg-white text-rose-600 rounded-lg text-sm hover:bg-white/90 transition flex items-center gap-2 cursor-pointer">
                Shop Sale <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <img
              src={images.handbag}
              alt=""
              className="absolute right-4 bottom-4 w-36 h-36 object-cover rounded-2xl -rotate-6 shadow-2xl hidden sm:block"
            />
          </div>
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-white mb-2">Stay in the Loop</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and insider-only discounts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer shrink-0">
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="max-w-7xl mx-auto px-4 mt-12 border-t border-border pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg tracking-tight">
                Drop
                <span className="text-indigo-600">Store</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Your trusted dropshipping partner since 2024.</p>
          </div>
          {[
            {
              title: 'Shop',
              links: ['Electronics', 'Fashion', 'Footwear', 'Watches', 'Audio']
            },
            {
              title: 'Support',
              links: ['Help Center', 'Track Order', 'Returns', 'FAQs', 'Contact Us']
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Blog', 'Privacy Policy', 'Terms of Service']
            }
          ].map((col, i) => (
            <div key={i}>
              <p className="text-sm text-foreground mb-3">{col.title}</p>
              <div className="space-y-2">
                {col.links.map((link) => (
                  <a key={link} href="#" className="block text-sm text-muted-foreground hover:text-indigo-600 transition">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">&copy; 2026 DropStore. All rights reserved.</div>
      </footer>
    </div>
  );
}
