import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Minus,
  Plus,
  X,
  Trash2,
  ShoppingCart,
  Heart,
  Tag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Gift,
  Percent,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  PackageOpen,
  CreditCard,
  Info,
  Lock,
  Star,
  Clock,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";
import { allProducts, type Product } from "../Products/data/products";

// ─── Cart Item Type ─────────────────────────────────
interface CartItem {
  product: Product;
  qty: number;
  variant: string;
  color: string;
  selected: boolean;
}

// ─── Initial cart data ──────────────────────────────
const initialCartItems: CartItem[] = [
  { product: allProducts[0], qty: 2, variant: "Pro Max", color: "White", selected: true },
  { product: allProducts[1], qty: 1, variant: "44mm", color: "Black", selected: true },
  { product: allProducts[4], qty: 1, variant: "Size L", color: "Black", selected: true },
  { product: allProducts[9], qty: 1, variant: "Standard", color: "Warm White", selected: true },
  { product: allProducts[15], qty: 1, variant: "35L", color: "Dark Gray", selected: false },
];

// ─── Coupon codes ───────────────────────────────────
const validCoupons: Record<string, { discount: number; type: "percent" | "fixed"; label: string; minOrder: number }> = {
  DROP20: { discount: 20, type: "percent", label: "20% OFF", minOrder: 50 },
  SAVE10: { discount: 10, type: "fixed", label: "$10 OFF", minOrder: 30 },
  FREESHIP: { discount: 0, type: "fixed", label: "Free Shipping", minOrder: 0 },
};

// ─── Recommended products ───────────────────────────
const recommendedProducts = [allProducts[6], allProducts[8], allProducts[10], allProducts[13]];

// ─── Shipping options ───────────────────────────────
const shippingOptions = [
  { id: "standard", name: "Standard Shipping", price: 4.99, eta: "5-7 business days", icon: Truck },
  { id: "express", name: "Express Shipping", price: 9.99, eta: "2-3 business days", icon: Truck },
  { id: "free", name: "Free Shipping", price: 0, eta: "7-10 business days", icon: Gift, note: "Orders over $100" },
];

// ─── Component ──────────────────────────────────────
export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [showShippingOptions, setShowShippingOptions] = useState(false);
  const [movedToWishlist, setMovedToWishlist] = useState<number | null>(null);
  const [removedItem, setRemovedItem] = useState<{ item: CartItem; index: number } | null>(null);
  const [selectAll, setSelectAll] = useState(true);
  const [orderNote, setOrderNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  // ── Helpers ──
  const updateQty = (index: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newQty = Math.max(1, Math.min(99, item.qty + delta));
        return { ...item, qty: newQty };
      })
    );
  };

  const removeItem = (index: number) => {
    const item = cartItems[index];
    setRemovedItem({ item, index });
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    setTimeout(() => setRemovedItem(null), 5000);
  };

  const undoRemove = () => {
    if (!removedItem) return;
    setCartItems((prev) => {
      const newItems = [...prev];
      newItems.splice(removedItem.index, 0, removedItem.item);
      return newItems;
    });
    setRemovedItem(null);
  };

  const toggleSelect = (index: number) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
    );
  };

  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    setCartItems((prev) => prev.map((item) => ({ ...item, selected: newVal })));
  };

  const moveToWishlist = (index: number) => {
    setMovedToWishlist(cartItems[index].product.id);
    removeItem(index);
    setTimeout(() => setMovedToWishlist(null), 3000);
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    setCouponError("");
    setCouponSuccess("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    const coupon = validCoupons[code];
    if (!coupon) {
      setCouponError("Invalid coupon code. Try DROP20 or SAVE10.");
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order of $${coupon.minOrder} required.`);
      return;
    }
    setAppliedCoupon(code);
    setCouponSuccess(`Coupon "${code}" applied! ${coupon.label}`);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess("");
    setCouponError("");
  };

  // ── Calculations ──
  const selectedItems = cartItems.filter((item) => item.selected);
  const subtotal = selectedItems.reduce((s, item) => s + item.product.price * item.qty, 0);
  const totalSavings = selectedItems.reduce((s, item) => s + (item.product.oldPrice - item.product.price) * item.qty, 0);
  const shipping = shippingOptions.find((o) => o.id === selectedShipping);
  const shippingCost = subtotal >= 100 && selectedShipping === "free" ? 0 : (shipping?.price ?? 0);

  let couponDiscount = 0;
  if (appliedCoupon && validCoupons[appliedCoupon]) {
    const c = validCoupons[appliedCoupon];
    if (c.type === "percent") couponDiscount = subtotal * (c.discount / 100);
    else couponDiscount = c.discount;
  }

  const tax = (subtotal - couponDiscount) * 0.08;
  const total = subtotal - couponDiscount + shippingCost + tax;
  const freeShippingProgress = Math.min((subtotal / 100) * 100, 100);
  const freeShippingRemaining = Math.max(100 - subtotal, 0);

  // ── Empty Cart ──
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        <div className="max-w-3xl mx-auto px-4 pt-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground">Shopping Cart</span>
          </nav>

          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <PackageOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-foreground mb-2">Your cart is empty</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our products and find something you love!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/"
                className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Start Shopping
              </Link>
              <Link
                to="/best-sellers"
                className="px-8 py-3 border border-border rounded-xl text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4" /> View Best Sellers
              </Link>
            </div>
          </div>

          {/* Recommended */}
          <div className="mt-12">
            <h3 className="text-foreground mb-4">You might like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition group">
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-foreground truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-indigo-600">${p.price}</span>
                      <span className="text-xs text-muted-foreground line-through">${p.oldPrice}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* ═══════ HEADER ═══════ */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground">Shopping Cart</span>
          </nav>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl text-foreground">Shopping Cart</h1>
                <p className="text-sm text-muted-foreground">{cartItems.length} item{cartItems.length > 1 ? "s" : ""} in your cart</p>
              </div>
            </div>
            <Link to="/" className="hidden sm:flex items-center gap-1.5 text-sm text-indigo-600 hover:underline">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══════ FREE SHIPPING PROGRESS ═══════ */}
      {freeShippingRemaining > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <Truck className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                Add <span className="text-amber-900">${freeShippingRemaining.toFixed(2)}</span> more for <span className="text-amber-900">FREE Shipping!</span>
              </p>
              <div className="mt-2 h-2 bg-amber-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {freeShippingRemaining <= 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-5">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-800">You've unlocked <span className="text-emerald-900">FREE Shipping!</span></p>
          </div>
        </div>
      )}

      {/* ═══════ MAIN CONTENT ═══════ */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── LEFT: Cart Items ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select all bar */}
            <div className="bg-white rounded-xl border border-border px-5 py-3 flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4.5 h-4.5 accent-indigo-600 cursor-pointer"
                />
                <span className="text-sm text-foreground">Select All ({cartItems.length})</span>
              </label>
              <button
                onClick={() => {
                  const selectedIndexes = cartItems.map((item, i) => (item.selected ? i : -1)).filter((i) => i >= 0);
                  if (selectedIndexes.length > 0 && confirm("Remove all selected items?")) {
                    setCartItems((prev) => prev.filter((item) => !item.selected));
                  }
                }}
                className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove Selected
              </button>
            </div>

            {/* Cart items */}
            {cartItems.map((item, index) => {
              const discount = Math.round(((item.product.oldPrice - item.product.price) / item.product.oldPrice) * 100);
              return (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className={`bg-white rounded-xl border overflow-hidden transition-all ${
                    item.selected ? "border-indigo-200 shadow-sm" : "border-border"
                  }`}
                >
                  <div className="p-5 flex gap-4">
                    {/* Checkbox */}
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => toggleSelect(index)}
                        className="w-4.5 h-4.5 accent-indigo-600 cursor-pointer"
                      />
                    </div>

                    {/* Image */}
                    <Link to={`/product/${item.product.id}`} className="shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-slate-100 hover:opacity-90 transition"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${item.product.id}`}
                            className="text-sm text-foreground hover:text-indigo-600 transition line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className="text-xs bg-slate-100 text-muted-foreground px-2 py-0.5 rounded-md">
                              {item.variant}
                            </span>
                            <span className="text-xs bg-slate-100 text-muted-foreground px-2 py-0.5 rounded-md">
                              {item.color}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(item.product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"
                                }`}
                              />
                            ))}
                            <span className="text-[11px] text-muted-foreground ml-1">({item.product.reviews.toLocaleString()})</span>
                          </div>
                        </div>

                        {/* Remove btn (desktop) */}
                        <button
                          onClick={() => removeItem(index)}
                          className="hidden sm:flex p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-red-500 transition cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>

                      {/* Price + Qty */}
                      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mt-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-indigo-600 text-lg">${item.product.price}</span>
                            <span className="text-sm text-muted-foreground line-through">${item.product.oldPrice}</span>
                            <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">-{discount}%</span>
                          </div>
                          {item.qty > 1 && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Subtotal: <span className="text-foreground">${(item.product.price * item.qty).toFixed(2)}</span>
                            </p>
                          )}
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQty(index, -1)}
                              disabled={item.qty <= 1}
                              className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm text-foreground border-x border-border">{item.qty}</span>
                            <button
                              onClick={() => updateQty(index, 1)}
                              disabled={item.qty >= 99}
                              className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Action links */}
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                        <button
                          onClick={() => moveToWishlist(index)}
                          className="text-xs text-muted-foreground hover:text-indigo-600 flex items-center gap-1 transition cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" /> Move to Wishlist
                        </button>
                        <button
                          onClick={() => removeItem(index)}
                          className="sm:hidden text-xs text-muted-foreground hover:text-red-500 flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Order Note */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setShowNote(!showNote)}
                className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
              >
                <span className="text-sm text-foreground flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-muted-foreground" /> Add Order Note
                </span>
                {showNote ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {showNote && (
                <div className="px-5 pb-4">
                  <textarea
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="Special instructions for your order (e.g., gift wrapping, delivery notes...)"
                    rows={3}
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-300 resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="space-y-5">
            {/* Coupon */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm text-foreground flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-indigo-600" /> Coupon Code
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-700">{appliedCoupon}</span>
                    <span className="text-xs bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">
                      {validCoupons[appliedCoupon].label}
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-emerald-600 hover:text-red-500 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                      placeholder="Enter code"
                      className="flex-1 border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-300"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {couponError}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.keys(validCoupons).map((code) => (
                      <button
                        key={code}
                        onClick={() => setCouponCode(code)}
                        className="text-[11px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md hover:bg-indigo-100 transition cursor-pointer border border-dashed border-indigo-200"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-xl border border-border p-5">
              <button
                onClick={() => setShowShippingOptions(!showShippingOptions)}
                className="w-full flex items-center justify-between cursor-pointer"
              >
                <h3 className="text-sm text-foreground flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600" /> Shipping Method
                </h3>
                {showShippingOptions ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {showShippingOptions && (
                <div className="mt-3 space-y-2">
                  {shippingOptions.map((option) => {
                    const isSelected = selectedShipping === option.id;
                    const isFreeUnlocked = option.id === "free" && subtotal >= 100;
                    const isDisabled = option.id === "free" && subtotal < 100;
                    return (
                      <label
                        key={option.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                          isDisabled ? "opacity-50 cursor-not-allowed" : ""
                        } ${isSelected ? "border-indigo-300 bg-indigo-50" : "border-border hover:border-slate-300"}`}
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() => setSelectedShipping(option.id)}
                          className="accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-foreground">{option.name}</span>
                          <p className="text-xs text-muted-foreground">{option.eta}</p>
                        </div>
                        <span className="text-sm text-foreground">
                          {option.price === 0 ? (
                            <span className="text-emerald-600">FREE</span>
                          ) : (
                            `$${option.price.toFixed(2)}`
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
              {!showShippingOptions && shipping && (
                <p className="text-xs text-muted-foreground mt-2">
                  {shipping.name} — {shipping.price === 0 ? "FREE" : `$${shipping.price.toFixed(2)}`} ({shipping.eta})
                </p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="text-sm text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" /> Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({selectedItems.length} items)</span>
                  <span className="text-foreground">${subtotal.toFixed(2)}</span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" /> Product Discount
                    </span>
                    <span className="text-emerald-600">-${totalSavings.toFixed(2)}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Coupon ({appliedCoupon})
                    </span>
                    <span className="text-emerald-600">-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shippingCost === 0 ? <span className="text-emerald-600">FREE</span> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    Tax (8%)
                    <Info className="w-3 h-3 text-slate-300" />
                  </span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-foreground">Total</span>
                  <div className="text-right">
                    <span className="text-xl text-indigo-600">${total.toFixed(2)}</span>
                    {totalSavings + couponDiscount > 0 && (
                      <p className="text-xs text-emerald-600 mt-0.5">
                        You save ${(totalSavings + couponDiscount).toFixed(2)}!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Checkout button */}
              <Link
                to="/checkout"
                className="mt-5 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition text-sm flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Proceed to Checkout
              </Link>

              <p className="text-center text-[11px] text-muted-foreground mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure checkout with SSL encryption
              </p>
            </div>

            {/* Trust badges */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                    <Truck className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground">Free Shipping</p>
                    <p className="text-[11px] text-muted-foreground">Orders $100+</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4.5 h-4.5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground">Easy Returns</p>
                    <p className="text-[11px] text-muted-foreground">30-day policy</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4.5 h-4.5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground">Secure Payment</p>
                    <p className="text-[11px] text-muted-foreground">256-bit SSL</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-4.5 h-4.5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-foreground">24/7 Support</p>
                    <p className="text-[11px] text-muted-foreground">Always here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ RECOMMENDED ═══════ */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-foreground">You May Also Like</h2>
            <Link to="/" className="text-sm text-indigo-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map((p) => {
              const disc = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
              return (
                <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <div className="relative aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">-{disc}%</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-foreground truncate mb-1">{p.name}</p>
                    <div className="flex items-center gap-1 mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(p.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-indigo-600">${p.price}</span>
                      <span className="text-xs text-muted-foreground line-through">${p.oldPrice}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════ TOASTS ═══════ */}
      {removedItem && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <Trash2 className="w-4 h-4 text-red-400" />
          <span>Item removed</span>
          <button onClick={undoRemove} className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer">
            Undo
          </button>
        </div>
      )}
      {movedToWishlist && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50">
          <Heart className="w-4 h-4 text-red-400 fill-red-400" />
          <span>Moved to wishlist</span>
        </div>
      )}

      {/* ═══════ MOBILE STICKY CHECKOUT ═══════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 z-40 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total ({selectedItems.length} items)</p>
            <p className="text-lg text-indigo-600">${total.toFixed(2)}</p>
          </div>
          <Link
            to="/checkout"
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm flex items-center gap-2 transition"
          >
            <Lock className="w-4 h-4" /> Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
