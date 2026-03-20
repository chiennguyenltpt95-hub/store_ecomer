import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  ChevronRight,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Box,
  ArrowRight,
  ShieldCheck,
  CircleDot,
  Info,
  AlertCircle,
  PackageCheck,
  Warehouse,
  Plane,
  ClipboardList,
  CalendarDays,
  Hash,
  CreditCard,
  User,
  HelpCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Star,
  RefreshCw,
} from "lucide-react";
import { allProducts } from "../Products/data/products";

// ─── Types ──────────────────────────────────────────
type OrderStatus = "processing" | "shipped" | "in-transit" | "out-for-delivery" | "delivered";

interface TrackingEvent {
  date: string;
  time: string;
  location: string;
  status: string;
  description: string;
  icon: React.ElementType;
  highlight?: boolean;
}

interface OrderItem {
  name: string;
  image: string;
  price: number;
  qty: number;
  variant?: string;
}

interface OrderData {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: OrderStatus;
  estimatedDelivery: string;
  shippingMethod: string;
  orderDate: string;
  totalAmount: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  items: OrderItem[];
  timeline: TrackingEvent[];
}

// ─── Mock order data ────────────────────────────────
const mockOrders: Record<string, OrderData> = {
  "DS-2026-78451": {
    orderId: "DS-2026-78451",
    trackingNumber: "1Z999AA10123456784",
    carrier: "UPS",
    status: "in-transit",
    estimatedDelivery: "March 23, 2026",
    shippingMethod: "Express Shipping (2-3 days)",
    orderDate: "March 18, 2026",
    totalAmount: 124.97,
    shippingAddress: {
      name: "John Anderson",
      address: "1234 Elm Street, Apt 5B",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      country: "United States",
      phone: "+1 (555) 123-4567",
    },
    items: [
      { name: "Wireless Earbuds Pro Max", image: allProducts[0].image, price: 29.99, qty: 2, variant: "White" },
      { name: "Smart Watch Ultra Series", image: allProducts[1].image, price: 49.99, qty: 1, variant: "Black / 44mm" },
      { name: "Modern LED Desk Lamp", image: allProducts[9].image, price: 22.99, qty: 1, variant: "Warm White" },
    ],
    timeline: [
      {
        date: "Mar 20, 2026",
        time: "10:32 AM",
        location: "Phoenix, AZ",
        status: "In Transit",
        description: "Package arrived at regional distribution center. Next stop: Los Angeles hub.",
        icon: Truck,
        highlight: true,
      },
      {
        date: "Mar 19, 2026",
        time: "08:15 PM",
        location: "Dallas, TX",
        status: "Departed Facility",
        description: "Package has left the Dallas sorting facility. En route to Phoenix, AZ.",
        icon: Plane,
      },
      {
        date: "Mar 19, 2026",
        time: "02:43 PM",
        location: "Dallas, TX",
        status: "Arrived at Facility",
        description: "Package arrived at UPS Dallas hub for processing and sorting.",
        icon: Warehouse,
      },
      {
        date: "Mar 19, 2026",
        time: "06:00 AM",
        location: "Memphis, TN",
        status: "Departed Facility",
        description: "Package departed from Memphis main hub.",
        icon: Truck,
      },
      {
        date: "Mar 18, 2026",
        time: "11:22 PM",
        location: "Memphis, TN",
        status: "Arrived at Hub",
        description: "Package received at UPS Memphis main sorting hub.",
        icon: Warehouse,
      },
      {
        date: "Mar 18, 2026",
        time: "04:30 PM",
        location: "Atlanta, GA",
        status: "Picked Up",
        description: "Package picked up from seller's warehouse. Scanned and verified.",
        icon: PackageCheck,
      },
      {
        date: "Mar 18, 2026",
        time: "02:15 PM",
        location: "Atlanta, GA",
        status: "Label Created",
        description: "Shipping label created. UPS tracking number assigned to package.",
        icon: ClipboardList,
      },
      {
        date: "Mar 18, 2026",
        time: "10:00 AM",
        location: "Online",
        status: "Order Confirmed",
        description: "Order #DS-2026-78451 confirmed. Payment verified and processing started.",
        icon: CheckCircle2,
      },
    ],
  },
  "DS-2026-92103": {
    orderId: "DS-2026-92103",
    trackingNumber: "9400111899223100456789",
    carrier: "USPS",
    status: "delivered",
    estimatedDelivery: "March 17, 2026",
    shippingMethod: "Standard Shipping (5-7 days)",
    orderDate: "March 10, 2026",
    totalAmount: 45.99,
    shippingAddress: {
      name: "Sarah Mitchell",
      address: "789 Oak Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      phone: "+1 (555) 987-6543",
    },
    items: [
      { name: "Streetwear Bomber Jacket", image: allProducts[4].image, price: 45.99, qty: 1, variant: "Black / Size L" },
    ],
    timeline: [
      {
        date: "Mar 17, 2026",
        time: "01:45 PM",
        location: "New York, NY",
        status: "Delivered",
        description: "Package delivered to front door. Signed by: S. MITCHELL",
        icon: CheckCircle2,
        highlight: true,
      },
      {
        date: "Mar 17, 2026",
        time: "08:30 AM",
        location: "New York, NY",
        status: "Out for Delivery",
        description: "Package out for delivery with local carrier.",
        icon: Truck,
      },
      {
        date: "Mar 16, 2026",
        time: "06:00 PM",
        location: "New York, NY",
        status: "Arrived at Post Office",
        description: "Package arrived at local USPS post office.",
        icon: Warehouse,
      },
      {
        date: "Mar 14, 2026",
        time: "10:00 AM",
        location: "Philadelphia, PA",
        status: "In Transit",
        description: "Package in transit to destination.",
        icon: Truck,
      },
      {
        date: "Mar 11, 2026",
        time: "03:00 PM",
        location: "Atlanta, GA",
        status: "Shipped",
        description: "Package shipped from warehouse.",
        icon: PackageCheck,
      },
      {
        date: "Mar 10, 2026",
        time: "11:00 AM",
        location: "Online",
        status: "Order Confirmed",
        description: "Order confirmed and payment processed.",
        icon: CheckCircle2,
      },
    ],
  },
};

// ─── Status config ──────────────────────────────────
const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; borderColor: string; icon: React.ElementType }> = {
  processing: { label: "Processing", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", icon: Clock },
  shipped: { label: "Shipped", color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200", icon: PackageCheck },
  "in-transit": { label: "In Transit", color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200", icon: Truck },
  "out-for-delivery": { label: "Out for Delivery", color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", icon: Truck },
  delivered: { label: "Delivered", color: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-200", icon: CheckCircle2 },
};

// ─── Progress steps ─────────────────────────────────
const progressSteps: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: "processing", label: "Processing", icon: ClipboardList },
  { key: "shipped", label: "Shipped", icon: PackageCheck },
  { key: "in-transit", label: "In Transit", icon: Truck },
  { key: "out-for-delivery", label: "Out for Delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

function getStepIndex(status: OrderStatus) {
  return progressSteps.findIndex((s) => s.key === status);
}

// ─── FAQ Data ───────────────────────────────────────
const faqs = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 5-7 business days. Express shipping takes 2-3 business days. Overnight delivery is available for select areas.",
  },
  {
    q: "What if my package is delayed?",
    a: "Delays can occur due to weather, customs, or carrier issues. If your package hasn't arrived within 3 days of the estimated delivery date, please contact our support team.",
  },
  {
    q: "Can I change my shipping address?",
    a: 'You can update your shipping address before the order ships. Once shipped, contact the carrier directly or reach out to our support team for assistance.',
  },
  {
    q: "How do I return an item?",
    a: "We offer a 30-day return policy. Go to your order details and click 'Request Return'. You'll receive a prepaid return label via email.",
  },
];

// ─── Main Page ──────────────────────────────────────
export function TrackOrderPage() {
  const [searchInput, setSearchInput] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [searchError, setSearchError] = useState("");
  const [searched, setSearched] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = () => {
    const input = searchInput.trim().toUpperCase();
    if (!input) {
      setSearchError("Please enter an order ID or tracking number.");
      return;
    }
    setSearchError("");
    setSearched(true);

    // Search by order ID or tracking number
    const found = Object.values(mockOrders).find(
      (o) => o.orderId.toUpperCase() === input || o.trackingNumber.toUpperCase() === input
    );

    if (found) {
      setOrder(found);
    } else {
      setOrder(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="pb-20 bg-slate-50 min-h-screen">
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden">
        <div className="relative min-h-[280px] md:min-h-[340px] bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1760800690644-dc6c71a853eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHBhY2thZ2UlMjBzaGlwcGluZyUyMGxvZ2lzdGljc3xlbnwxfHx8fDE3NzM5NzE5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
          </div>
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-10 w-56 h-56 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 py-14">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-6">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white">Track Order</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Truck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl text-white !leading-tight">Track Your Order</h1>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-6 max-w-lg">
                  Enter your order ID or tracking number to see real-time status updates, delivery estimates, and detailed shipment history.
                </p>

                {/* Search Box */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Enter Order ID or Tracking Number"
                        className="w-full pl-11 pr-4 py-3.5 bg-white rounded-xl text-sm outline-none text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer shrink-0"
                    >
                      <Search className="w-4 h-4" /> Track Order
                    </button>
                  </div>
                  {searchError && (
                    <p className="mt-2 text-red-300 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> {searchError}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-white/40 text-xs">Try:</span>
                    {Object.keys(mockOrders).map((id) => (
                      <button
                        key={id}
                        onClick={() => { setSearchInput(id); }}
                        className="text-xs text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition cursor-pointer"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden md:flex justify-end">
                <div className="relative">
                  <div className="w-56 h-56 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20">
                    <Package className="w-28 h-28 text-white/80" />
                  </div>
                  <div className="absolute -top-3 -right-3 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs flex items-center gap-1.5 animate-pulse">
                    <MapPin className="w-3.5 h-3.5" /> Live Tracking
                  </div>
                  <div className="absolute -bottom-3 -left-3 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-white text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Secure Delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ORDER RESULTS ═══════ */}
      {searched && !order && (
        <section className="max-w-3xl mx-auto px-4 mt-10">
          <div className="bg-white rounded-2xl border border-border p-10 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-foreground mb-2">Order Not Found</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              We couldn't find an order with that ID or tracking number. Please double-check and try again, or contact our support team for help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setSearchInput(""); setSearched(false); }}
                className="px-6 py-2.5 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
              >
                Try Again
              </button>
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2 cursor-pointer">
                <MessageCircle className="w-4 h-4" /> Contact Support
              </button>
            </div>
          </div>
        </section>
      )}

      {order && (
        <section className="max-w-7xl mx-auto px-4 mt-8 space-y-6">
          {/* ── Status Overview Card ── */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className={`px-6 py-4 ${statusConfig[order.status].bgColor} border-b ${statusConfig[order.status].borderColor} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div className="flex items-center gap-3">
                {(() => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return <StatusIcon className={`w-6 h-6 ${statusConfig[order.status].color}`} />;
                })()}
                <div>
                  <span className={`text-lg ${statusConfig[order.status].color}`}>
                    {statusConfig[order.status].label}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    Estimated Delivery: <span className="text-foreground">{order.estimatedDelivery}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg border border-border text-sm hover:bg-slate-50 transition cursor-pointer self-start"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-6 py-8">
              <div className="flex items-center justify-between relative">
                {/* Connection line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
                  style={{ width: `${(currentStepIndex / (progressSteps.length - 1)) * 100}%` }}
                />

                {progressSteps.map((step, i) => {
                  const StepIcon = step.icon;
                  const isCompleted = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  return (
                    <div key={step.key} className="relative flex flex-col items-center z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isCurrent
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110"
                            : isCompleted
                            ? "bg-indigo-600 border-indigo-600 text-white"
                            : "bg-white border-slate-200 text-slate-400"
                        }`}
                      >
                        {isCompleted && !isCurrent ? (
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        ) : (
                          <StepIcon className="w-4.5 h-4.5" />
                        )}
                      </div>
                      <span
                        className={`mt-2.5 text-xs text-center max-w-[80px] ${
                          isCurrent ? "text-indigo-600" : isCompleted ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full animate-ping" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Main Content Grid ── */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Timeline + Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tracking Timeline */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-foreground flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5 text-indigo-600" /> Shipment History
                  </h2>
                  <span className="text-xs text-muted-foreground">{order.timeline.length} events</span>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-0">
                    {(showAllEvents ? order.timeline : order.timeline.slice(0, 5)).map((event, i) => {
                      const EventIcon = event.icon;
                      const isFirst = i === 0;
                      const isLast = i === (showAllEvents ? order.timeline.length - 1 : Math.min(4, order.timeline.length - 1));
                      return (
                        <div key={i} className="flex gap-4 relative">
                          {/* Timeline line */}
                          {!isLast && (
                            <div className="absolute left-[18px] top-10 bottom-0 w-px bg-slate-200" />
                          )}

                          {/* Icon */}
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 ${
                              event.highlight
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                                : isFirst
                                ? "bg-indigo-100 text-indigo-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <EventIcon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className={`flex-1 pb-6 ${event.highlight ? "bg-indigo-50/50 -mx-2 px-3 py-3 rounded-xl border border-indigo-100" : ""}`}>
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-1">
                              <div>
                                <span className={`text-sm ${event.highlight ? "text-indigo-700" : "text-foreground"}`}>
                                  {event.status}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {event.location}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" /> {event.date} · {event.time}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{event.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.timeline.length > 5 && (
                    <button
                      onClick={() => setShowAllEvents(!showAllEvents)}
                      className="w-full mt-2 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      {showAllEvents ? (
                        <>Show Less <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Show All {order.timeline.length} Events <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-foreground flex items-center gap-2">
                    <Box className="w-4.5 h-4.5 text-indigo-600" /> Order Items
                  </h2>
                  <span className="text-xs text-muted-foreground">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                </div>
                <div className="divide-y divide-border">
                  {order.items.map((item, i) => (
                    <div key={i} className="px-6 py-4 flex gap-4 hover:bg-slate-50 transition">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-foreground">{item.name}</h4>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground mt-0.5">Variant: {item.variant}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.qty}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-indigo-600 text-sm">${(item.price * item.qty).toFixed(2)}</span>
                          {order.status === "delivered" && (
                            <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer">
                              <Star className="w-3 h-3" /> Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Order Total</span>
                    <span className="text-foreground text-lg">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Order Info Card */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="text-foreground text-sm flex items-center gap-2">
                    <Info className="w-4 h-4 text-indigo-600" /> Order Details
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <Hash className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Order ID</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{order.orderId}</span>
                        <button onClick={() => copyToClipboard(order.orderId)} className="cursor-pointer text-muted-foreground hover:text-indigo-600 transition">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Package className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Tracking Number</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground break-all">{order.trackingNumber}</span>
                        <button onClick={() => copyToClipboard(order.trackingNumber)} className="cursor-pointer text-muted-foreground hover:text-indigo-600 transition shrink-0">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Truck className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Carrier</p>
                      <p className="text-sm text-foreground">{order.carrier}</p>
                      <a href="#" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-0.5">
                        Track on {order.carrier} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Order Date</p>
                      <p className="text-sm text-foreground">{order.orderDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Shipping Method</p>
                      <p className="text-sm text-foreground">{order.shippingMethod}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-border overflow-hidden">
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="text-foreground text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" /> Shipping Address
                  </h3>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{order.shippingAddress.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                        {order.shippingAddress.country}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Need Help Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <HelpCircle className="w-5 h-5" />
                  <h3 className="text-sm">Need Help?</h3>
                </div>
                <p className="text-white/70 text-xs mb-4">
                  Have a question about your order? Our support team is available 24/7.
                </p>
                <div className="space-y-2">
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs transition">
                    <MessageCircle className="w-4 h-4" /> Live Chat Support
                  </a>
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs transition">
                    <Mail className="w-4 h-4" /> support@dropstore.com
                  </a>
                  <a href="#" className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-xs transition">
                    <Phone className="w-4 h-4" /> +1 (800) 555-0199
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Copied toast */}
          {copied && (
            <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copied to clipboard
            </div>
          )}
        </section>
      )}

      {/* ═══════ FAQ SECTION ═══════ */}
      <section className="max-w-3xl mx-auto px-4 mt-14">
        <div className="text-center mb-8">
          <h2 className="text-foreground mb-2">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">Everything you need to know about shipping and tracking.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-border overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-50 transition"
              >
                <span className="text-sm text-foreground pr-4">{faq.q}</span>
                {expandedFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </button>
              {expandedFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="max-w-7xl mx-auto px-4 mt-12">
        <div className="rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl md:text-2xl mb-2">Continue Shopping</h3>
              <p className="text-white/70 text-sm">Explore our latest products and best sellers while you wait for your delivery.</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                to="/best-sellers"
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl transition text-sm flex items-center gap-2"
              >
                Best Sellers
              </Link>
              <Link
                to="/"
                className="px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-white/90 transition flex items-center gap-2 text-sm"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
