import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  ImageIcon,
  MessageSquare,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  ThumbsUp,
  TruckIcon,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { allProducts, categorySpecs, getGalleryImages, reviewTemplates, type Review } from './data/products';

// ─── Rating Distribution ────────────────────────────
function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground w-6 text-right">{star}</span>
      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-muted-foreground w-8">{count}</span>
    </div>
  );
}

// ─── Single Review Card ─────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  return (
    <div className="border-b border-border py-6 last:border-b-0">
      <div className="flex items-start gap-3">
        <img src={review.avatar} alt={review.user} className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-foreground">{review.user}</span>
            {review.verified && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" /> Verified Purchase
              </span>
            )}
            <span className="text-xs text-muted-foreground ml-auto">{review.date}</span>
          </div>

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
            ))}
          </div>

          <h5 className="text-sm text-foreground mt-2">{review.title}</h5>
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{review.body}</p>

          {/* Review images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.images.map((img, i) => (
                <div key={i} className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Helpful */}
          <button
            onClick={() => setHelpfulClicked(!helpfulClicked)}
            className={`mt-3 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition cursor-pointer ${
              helpfulClicked ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'border-border text-muted-foreground hover:border-indigo-200'
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            Helpful ({helpfulClicked ? review.helpful + 1 : review.helpful})
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Write Review Modal ─────────────────────────────
function WriteReviewModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (r: { rating: number; title: string; body: string }) => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-foreground mb-4">Write a Review</h3>

        {/* Star select */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="cursor-pointer"
              >
                <Star className={`w-7 h-7 transition ${(hoverRating || rating) >= s ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm text-muted-foreground block mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            className="w-full px-4 py-2.5 border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="text-sm text-muted-foreground block mb-1">Your Review</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What did you like or dislike? How do you use the product?"
            rows={4}
            className="w-full px-4 py-2.5 border border-border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm resize-none"
          />
        </div>

        <button
          onClick={() => {
            if (rating && title && body) onSubmit({ rating, title, body });
          }}
          disabled={!rating || !title || !body}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}

// ─── Main Product Detail ──────���─────────────────────
export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === Number(id));

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reviewFilter, setReviewFilter] = useState(0); // 0 = all
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  const galleryImages = product ? getGalleryImages(product) : [];
  const specs = product ? categorySpecs[product.category] || [] : [];
  const discount = product ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  // Related products
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  // All reviews (templates + user)
  const allReviews = useMemo(() => [...userReviews, ...reviewTemplates], [userReviews]);
  const filteredReviews = reviewFilter === 0 ? allReviews : allReviews.filter((r) => r.rating === reviewFilter);

  // Rating distribution
  const ratingDist = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    allReviews.forEach((r) => {
      dist[r.rating - 1]++;
    });
    return dist;
  }, [allReviews]);
  const avgRating = useMemo(() => {
    if (allReviews.length === 0) return 0;
    return allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  }, [allReviews]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-foreground mb-2">Product Not Found</h2>
        <p className="text-sm text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Link to="/" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleSubmitReview = (r: { rating: number; title: string; body: string }) => {
    const newReview: Review = {
      id: Date.now(),
      user: 'You',
      avatar:
        'https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGNhc3VhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mzc4NzUzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      rating: r.rating,
      date: 'Just now',
      title: r.title,
      body: r.body,
      helpful: 0,
      verified: true
    };
    setUserReviews((prev) => [newReview, ...prev]);
    setShowWriteReview(false);
  };

  return (
    <div className="pb-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize hover:text-indigo-600 transition cursor-pointer">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* ═══════ PRODUCT INFO ═══════ */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── Image Gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-border mb-3">
              <img src={galleryImages[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className={`absolute top-4 left-4 ${product.badgeColor} text-white text-xs px-3 py-1.5 rounded-full`}>{product.badge}</span>
              )}

              {/* Image nav arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((selectedImage + 1) % galleryImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition cursor-pointer shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm text-xs px-2 py-1 rounded-lg text-muted-foreground flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> {selectedImage + 1}/{galleryImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    i === selectedImage ? 'border-indigo-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Product Info ── */}
          <div>
            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full capitalize">{product.category}</span>
              {product.badge && <span className={`${product.badgeColor} text-white text-xs px-2.5 py-1 rounded-full`}>{product.badge}</span>}
            </div>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl text-foreground mb-3">{product.name}</h1>

            {/* Rating summary */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                ))}
              </div>
              <span className="text-sm text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews.toLocaleString()} reviews)</span>
              <span className="text-sm text-muted-foreground">|</span>
              <span className="text-sm text-emerald-600">{product.sold.toLocaleString()} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              <span className="text-3xl text-indigo-600">${product.price}</span>
              <span className="text-lg text-muted-foreground line-through">${product.oldPrice}</span>
              <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full">-{discount}% OFF</span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

            {/* Quick specs preview (top 3) */}
            {specs.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-2.5">
                {specs.slice(0, 3).map((spec) => (
                  <div key={spec.label} className="flex items-center text-sm">
                    <span className="text-muted-foreground w-36 shrink-0">{spec.label}</span>
                    <span className="text-foreground">{spec.values[product.id] || '—'}</span>
                  </div>
                ))}
                {specs.length > 3 && (
                  <button onClick={() => setActiveTab('specs')} className="text-xs text-indigo-600 hover:underline cursor-pointer mt-1">
                    View all specifications →
                  </button>
                )}
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer">
                <ShoppingCart className="w-4 h-4" /> Add to Cart — ${(product.price * quantity).toFixed(2)}
              </button>

              <button
                onClick={() => setLiked(!liked)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition cursor-pointer ${
                  liked ? 'bg-red-50 border-red-200 text-red-500' : 'border-border text-muted-foreground hover:border-indigo-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              </button>

              <button className="w-12 h-12 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:border-indigo-200 transition cursor-pointer">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Buy Now */}
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition cursor-pointer mb-6">Buy Now</button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: TruckIcon, label: 'Free Shipping', color: 'text-blue-600' },
                { icon: ShieldCheck, label: 'Secure Payment', color: 'text-emerald-600' },
                { icon: RefreshCw, label: '30-Day Returns', color: 'text-orange-600' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 py-3 bg-slate-50 rounded-xl">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ TABS: Description / Specs / Reviews ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        {/* Tab headers */}
        <div className="flex border-b border-border">
          {(['description', 'specs', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm transition border-b-2 cursor-pointer capitalize ${
                activeTab === tab ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'reviews' ? `Reviews (${allReviews.length})` : tab === 'specs' ? 'Specifications' : 'Description'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-b-2xl border border-t-0 border-border p-6 md:p-8">
          {/* ── Description ── */}
          {activeTab === 'description' && (
            <div className="max-w-3xl">
              <h3 className="text-foreground mb-4">About this product</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>

              <h4 className="text-foreground mb-3">Key Features</h4>
              <ul className="space-y-2">
                {[
                  'Premium quality materials for long-lasting durability',
                  'Ergonomic design for maximum comfort and usability',
                  'Compact and lightweight — perfect for everyday use',
                  'Backed by our 30-day money-back guarantee',
                  'Fast worldwide shipping with order tracking'
                ].map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Specifications ── */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="text-foreground mb-1">Technical Specifications</h3>
              <p className="text-sm text-muted-foreground mb-6 capitalize">Category: {product.category}</p>

              {specs.length > 0 ? (
                <div className="space-y-0">
                  {specs.map((spec, i) => (
                    <div key={spec.label} className={`flex items-center py-3 text-sm ${i < specs.length - 1 ? 'border-b border-border' : ''}`}>
                      <span className="text-muted-foreground w-44 shrink-0">{spec.label}</span>
                      <span className="text-foreground">{spec.values[product.id] || '—'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No detailed specs available for this category yet.</p>
              )}

              {/* General specs */}
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-foreground mb-4">General Information</h4>
                <div className="space-y-0">
                  {[
                    { label: 'SKU', value: `DS-${product.id.toString().padStart(5, '0')}` },
                    { label: 'Category', value: product.category },
                    { label: 'Availability', value: 'In Stock' },
                    { label: 'Shipping', value: 'Free shipping on orders over $50' },
                    { label: 'Returns', value: '30-day return policy' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center py-3 text-sm border-b border-border last:border-b-0">
                      <span className="text-muted-foreground w-44 shrink-0">{item.label}</span>
                      <span className="text-foreground capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Reviews ── */}
          {activeTab === 'reviews' && (
            <div>
              {/* Reviews header */}
              <div className="grid md:grid-cols-[280px_1fr] gap-8 mb-8">
                {/* Left: Summary */}
                <div className="bg-slate-50 rounded-xl p-5">
                  <div className="text-center mb-4">
                    <span className="text-4xl text-foreground">{avgRating.toFixed(1)}</span>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{allReviews.length} reviews</p>
                  </div>

                  <div className="space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <RatingBar key={star} star={star} count={ratingDist[star - 1]} total={allReviews.length} />
                    ))}
                  </div>

                  <button
                    onClick={() => setShowWriteReview(true)}
                    className="w-full mt-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" /> Write a Review
                  </button>
                </div>

                {/* Right: Filter + List */}
                <div>
                  {/* Filter pills */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[
                      { val: 0, label: 'All' },
                      { val: 5, label: '5 Stars' },
                      { val: 4, label: '4 Stars' },
                      { val: 3, label: '3 Stars' },
                      { val: 2, label: '2 Stars' },
                      { val: 1, label: '1 Star' }
                    ].map((f) => (
                      <button
                        key={f.val}
                        onClick={() => setReviewFilter(f.val)}
                        className={`px-3 py-1.5 rounded-full text-xs border transition cursor-pointer ${
                          reviewFilter === f.val
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-border text-muted-foreground hover:border-indigo-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Review list */}
                  {filteredReviews.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No reviews for this filter.</p>
                    </div>
                  ) : (
                    <div>
                      {filteredReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ RELATED PRODUCTS ═══════ */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground">Related Products</h2>
              <p className="text-sm text-muted-foreground mt-1">More from {product.category}</p>
            </div>
            <Link to="/" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => {
              const rpDiscount = Math.round(((rp.oldPrice - rp.price) / rp.oldPrice) * 100);
              return (
                <Link
                  key={rp.id}
                  to={`/product/${rp.id}`}
                  className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-square overflow-hidden bg-slate-50">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {rp.badge && (
                      <span className={`absolute top-3 left-3 ${rp.badgeColor} text-white text-[11px] px-2.5 py-1 rounded-full`}>{rp.badge}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground capitalize mb-1">{rp.category}</p>
                    <h4 className="text-sm text-foreground truncate mb-2">{rp.name}</h4>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rp.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">({rp.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-600">${rp.price}</span>
                      <span className="text-xs text-muted-foreground line-through">${rp.oldPrice}</span>
                      <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full ml-auto">-{rpDiscount}%</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Write Review Modal */}
      {showWriteReview && <WriteReviewModal onClose={() => setShowWriteReview(false)} onSubmit={handleSubmitReview} />}
    </div>
  );
}
