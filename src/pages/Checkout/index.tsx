import { Bitcoin, CheckCircle, CreditCard, Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

type PaymentMethod = 'credit-card' | 'paypal' | 'oxapay';

const CryptoIcon = ({ symbol }: { symbol: string }) => {
  switch (symbol) {
    case 'BTC':
      return (
        <svg viewBox="0 0 32 32" className="w-10 h-10">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path
            fill="#fff"
            d="M22.5 14.2c.3-2-1.2-3.1-3.3-3.8l.7-2.7-1.7-.4-.7 2.6c-.4-.1-.9-.2-1.4-.3l.7-2.7-1.7-.4-.7 2.7c-.3-.1-.7-.2-1-.3l-2.3-.6-.4 1.8s1.2.3 1.2.3c.7.2.8.6.8 1l-.8 3.3c0 0 .1 0 .1 0l-.1 0-1.2 4.7c-.1.2-.3.6-.8.4 0 0-1.2-.3-1.2-.3l-.8 1.9 2.2.5c.4.1.8.2 1.2.3l-.7 2.8 1.7.4.7-2.7c.5.1.9.2 1.4.3l-.7 2.7 1.7.4.7-2.8c2.9.5 5 .3 5.9-2.3.8-2.1 0-3.3-1.5-4.1 1.1-.2 1.9-1.1 2.1-2.7zm-3.8 5.3c-.5 2.1-4.2 1-5.4.7l1-3.9c1.2.3 5 .9 4.4 3.2zm.6-5.3c-.5 1.9-3.5.9-4.5.7l.9-3.5c1 .3 4.2.7 3.6 2.8z"
          />
        </svg>
      );
    case 'ETH':
      return (
        <svg viewBox="0 0 32 32" className="w-10 h-10">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <path fill="#fff" fillOpacity=".6" d="M16 4v8.9l7.5 3.3z" />
          <path fill="#fff" d="M16 4L8.5 16.2l7.5-3.3z" />
          <path fill="#fff" fillOpacity=".6" d="M16 21.9v6.1l7.5-10.4z" />
          <path fill="#fff" d="M16 28v-6.1L8.5 17.6z" />
          <path fill="#fff" fillOpacity=".2" d="M16 20.6l7.5-4.4L16 12.9z" />
          <path fill="#fff" fillOpacity=".6" d="M8.5 16.2l7.5 4.4v-7.7z" />
        </svg>
      );
    case 'USDT':
      return (
        <svg viewBox="0 0 32 32" className="w-10 h-10">
          <circle cx="16" cy="16" r="16" fill="#26A17B" />
          <path
            fill="#fff"
            d="M17.9 17.1v0c-.1 0-.7.1-2 .1-1 0-1.7 0-2-.1v0c-3.9-.2-6.8-.9-6.8-1.8s2.9-1.6 6.8-1.8v2.9c.3 0 1 .1 2 .1 1.2 0 1.8-.1 2-.1v-2.9c3.9.2 6.8.9 6.8 1.8s-2.9 1.6-6.8 1.8zm0-3.9v-2.6h5.5V7H8.7v3.6h5.5v2.6c-4.4.2-7.7 1.1-7.7 2.2s3.3 2 7.7 2.2v7.9h3.7v-7.9c4.4-.2 7.7-1.1 7.7-2.2s-3.3-2-7.7-2.2z"
          />
        </svg>
      );
    case 'LTC':
      return (
        <svg viewBox="0 0 32 32" className="w-10 h-10">
          <circle cx="16" cy="16" r="16" fill="#345D9D" />
          <path fill="#fff" d="M10.5 24.8h12l.8-3h-5.6l1.8-6.9 2.9-1.1.6-2.3-2.9 1.1L22 6.8h-3.8L16 14.4l-2.9 1.1-.6 2.3 2.9-1.1-1.4 5.1H9.7z" />
        </svg>
      );
    case 'TRX':
      return (
        <svg viewBox="0 0 32 32" className="w-10 h-10">
          <circle cx="16" cy="16" r="16" fill="#EF0027" />
          <path fill="#fff" d="M8.3 9.5l7.8 16.3 7.6-14.4-4.2-3.2zm2.7 1.2l10.2 1.2-3.4-2.5zm.8 1.2l6.1 11.1 4.3-8.1zm7 11.5L13 12.5l8.6 1z" />
        </svg>
      );
    case 'BNB':
      return (
        <svg viewBox="0 0 32 32" className="w-10 h-10">
          <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
          <path
            fill="#fff"
            d="M12.1 14.3L16 10.4l3.9 3.9 2.3-2.3L16 5.9 9.9 12zm-6.2 1.7l2.3-2.3 2.3 2.3-2.3 2.3zm6.2 1.7L16 21.6l3.9-3.9 2.3 2.3L16 26.1l-6.1-6.1zm10-1.7l2.3-2.3 2.3 2.3-2.3 2.3zM18.6 16L16 13.4 13.4 16 16 18.6z"
          />
        </svg>
      );
    case 'DOGE':
      return (
        <svg viewBox="0 0 32 32" className="w-10 h-10">
          <circle cx="16" cy="16" r="16" fill="#C2A633" />
          <path
            fill="#fff"
            d="M13.2 8.5h4.5c4.3 0 6.8 2.7 6.8 7.5s-2.5 7.5-6.8 7.5h-4.5zm3.2 12h1.1c2.7 0 3.9-1.7 3.9-4.5s-1.2-4.5-3.9-4.5h-1.1zM10 15h8v2h-8z"
          />
        </svg>
      );
    default:
      return <Bitcoin className="w-6 h-6 text-white" />;
  }
};

const cryptoCoins = [
  { name: 'Bitcoin', symbol: 'BTC', color: 'from-[#F7931A] to-[#E87F17]' },
  { name: 'Ethereum', symbol: 'ETH', color: 'from-[#627EEA] to-[#4A67D6]' },
  { name: 'Tether (USDT)', symbol: 'USDT', color: 'from-[#26A17B] to-[#1E8A68]' },
  { name: 'Litecoin', symbol: 'LTC', color: 'from-[#345D9D] to-[#2A4E85]' },
  { name: 'TRON', symbol: 'TRX', color: 'from-[#EF0027] to-[#CC0020]' },
  { name: 'BNB', symbol: 'BNB', color: 'from-[#F3BA2F] to-[#D4A320]' },
  { name: 'Dogecoin', symbol: 'DOGE', color: 'from-[#C2A633] to-[#A68F2A]' }
];

const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6">
    <rect width="48" height="32" rx="4" fill="#1A1F71" />
    <path
      d="M19.5 21h-2.7l1.7-10.5h2.7L19.5 21zm11.1-10.2c-.5-.2-1.4-.4-2.4-.4-2.7 0-4.5 1.4-4.5 3.4 0 1.5 1.3 2.3 2.4 2.8 1 .5 1.4.8 1.4 1.3 0 .7-.8 1-1.6 1-1.1 0-1.6-.2-2.5-.5l-.3-.2-.4 2.2c.6.3 1.8.5 3 .5 2.8 0 4.7-1.4 4.7-3.5 0-1.2-.7-2-2.3-2.8-.9-.5-1.5-.8-1.5-1.2 0-.4.5-.8 1.5-.8.9 0 1.5.2 2 .4l.2.1.3-2.3zM35.6 21h2.3l-2-10.5h-2.1c-.5 0-.9.3-1.1.7l-3.9 9.8h2.8l.5-1.5h3.4l.1 1.5zm-2.9-3.6l1.4-3.8.8 3.8h-2.2zM14.8 10.5L12.2 18l-.3-1.4c-.5-1.7-2-3.5-3.7-4.4l2.4 8.8h2.8l4.2-10.5h-2.8z"
      fill="#fff"
    />
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6">
    <rect width="48" height="32" rx="4" fill="#252525" />
    <circle cx="19" cy="16" r="8" fill="#EB001B" />
    <circle cx="29" cy="16" r="8" fill="#F79E1B" />
    <path d="M24 9.8a8 8 0 0 1 0 12.4 8 8 0 0 1 0-12.4z" fill="#FF5F00" />
  </svg>
);

const AmexIcon = () => (
  <svg viewBox="0 0 48 32" className="h-6">
    <rect width="48" height="32" rx="4" fill="#2E77BC" />
    <text x="24" y="19" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="Arial">
      AMEX
    </text>
  </svg>
);

const detectCardType = (number: string): string => {
  const n = number.replace(/\s/g, '');
  if (n.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'mastercard';
  if (n.startsWith('3')) return 'amex';
  return 'unknown';
};

export function PaymentPage() {
  const [method, setMethod] = useState<PaymentMethod>('credit-card');
  const [submitted, setSubmitted] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [showCvv, setShowCvv] = useState(false);
  const [cardFocused, setCardFocused] = useState<string | null>(null);

  // Credit card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) return v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="mb-2 text-green-700">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your payment of <span className="text-foreground">$99.00</span> has been processed successfully.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-foreground">Checkout</h1>
          <p className="text-muted-foreground mt-1">Choose your preferred payment method</p>
        </div>

        {/* Order summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-border p-5 mb-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground">Subtotal</span>
            <span>$89.00</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-muted-foreground">Tax</span>
            <span>$10.00</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span>Total</span>
            <span className="text-xl text-primary">$99.00</span>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
          {/* Tab selector */}
          <div className="grid grid-cols-3 border-b border-border">
            <button
              onClick={() => setMethod('credit-card')}
              className={`py-4 flex flex-col items-center gap-1.5 transition cursor-pointer ${
                method === 'credit-card' ? 'bg-black text-white' : 'hover:bg-slate-50 text-muted-foreground'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs">Credit Card</span>
            </button>
            <button
              onClick={() => setMethod('paypal')}
              className={`py-4 flex flex-col items-center gap-1.5 transition cursor-pointer border-x border-border ${
                method === 'paypal' ? 'bg-[#0070ba] text-white' : 'hover:bg-slate-50 text-muted-foreground'
              }`}
            >
              <span className="text-lg leading-none">P</span>
              <span className="text-xs">PayPal</span>
            </button>
            <button
              onClick={() => setMethod('oxapay')}
              className={`py-4 flex flex-col items-center gap-1.5 transition cursor-pointer ${
                method === 'oxapay' ? 'bg-[#1a1a2e] text-white' : 'hover:bg-slate-50 text-muted-foreground'
              }`}
            >
              <Bitcoin className="w-5 h-5" />
              <span className="text-xs">OxaPay</span>
            </button>
          </div>

          <div className="p-6">
            {/* Credit Card Form */}
            {method === 'credit-card' && (
              <div className="space-y-5">
                {/* Card Preview */}
                <div
                  className={`relative w-full aspect-[1.7/1] rounded-2xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-500 ${
                    detectCardType(cardNumber) === 'visa'
                      ? 'bg-gradient-to-br from-[#1A1F71] to-[#2B3990]'
                      : detectCardType(cardNumber) === 'mastercard'
                        ? 'bg-gradient-to-br from-[#1a1a2e] to-[#16213e]'
                        : detectCardType(cardNumber) === 'amex'
                          ? 'bg-gradient-to-br from-[#2E77BC] to-[#1B4F8A]'
                          : 'bg-gradient-to-br from-slate-700 to-slate-900'
                  }`}
                >
                  {/* Card shine effect */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-2xl" />
                    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full blur-2xl" />
                  </div>
                  <div className="flex justify-between items-start relative z-10">
                    {/* Chip */}
                    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
                      <div className="w-6 h-4 border border-yellow-600/40 rounded-sm" />
                    </div>
                    <div>
                      {detectCardType(cardNumber) === 'visa' && <VisaIcon />}
                      {detectCardType(cardNumber) === 'mastercard' && <MastercardIcon />}
                      {detectCardType(cardNumber) === 'amex' && <AmexIcon />}
                      {detectCardType(cardNumber) === 'unknown' && (
                        <div className="flex gap-1">
                          <VisaIcon />
                          <MastercardIcon />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="relative z-10 space-y-3">
                    <p className="text-white/90 tracking-[0.25em] text-lg font-mono">{cardNumber || '•••• •••• •••• ••••'}</p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white/50 text-[10px] uppercase tracking-wider">Card Holder</p>
                        <p className="text-white/90 text-sm tracking-wide uppercase">{cardName || 'YOUR NAME'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/50 text-[10px] uppercase tracking-wider">Expires</p>
                        <p className="text-white/90 text-sm tracking-wide">{expiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accepted cards */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Accepted:</span>
                  <div className="flex gap-1.5">
                    <VisaIcon />
                    <MastercardIcon />
                    <AmexIcon />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      onFocus={() => setCardFocused('number')}
                      onBlur={() => setCardFocused(null)}
                      className={`w-full pl-4 pr-12 py-3 bg-input-background rounded-xl border transition outline-none ${
                        cardFocused === 'number' ? 'ring-2 ring-primary/20 border-primary' : 'border-border'
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {detectCardType(cardNumber) === 'visa' && <VisaIcon />}
                      {detectCardType(cardNumber) === 'mastercard' && <MastercardIcon />}
                      {detectCardType(cardNumber) === 'amex' && <AmexIcon />}
                      {detectCardType(cardNumber) === 'unknown' && <CreditCard className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    onFocus={() => setCardFocused('name')}
                    onBlur={() => setCardFocused(null)}
                    className={`w-full px-4 py-3 bg-input-background rounded-xl border transition outline-none ${
                      cardFocused === 'name' ? 'ring-2 ring-primary/20 border-primary' : 'border-border'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      onFocus={() => setCardFocused('expiry')}
                      onBlur={() => setCardFocused(null)}
                      className={`w-full px-4 py-3 bg-input-background rounded-xl border transition outline-none ${
                        cardFocused === 'expiry' ? 'ring-2 ring-primary/20 border-primary' : 'border-border'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">CVV</label>
                    <div className="relative">
                      <input
                        type={showCvv ? 'text' : 'password'}
                        placeholder="•••"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        onFocus={() => setCardFocused('cvv')}
                        onBlur={() => setCardFocused(null)}
                        className={`w-full pl-4 pr-10 py-3 bg-input-background rounded-xl border transition outline-none ${
                          cardFocused === 'cvv' ? 'ring-2 ring-primary/20 border-primary' : 'border-border'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
                      >
                        {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security badges */}
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <p className="text-xs text-green-700">
                    Your card information is encrypted and securely processed. We never store your full card details.
                  </p>
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3.5 bg-black text-white rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Pay $99.00
                </button>
              </div>
            )}

            {/* PayPal */}
            {method === 'paypal' && (
              <div className="space-y-5">
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-[#0070ba]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-[#0070ba]">P</span>
                  </div>
                  <h3 className="text-foreground">Pay with PayPal</h3>
                  <p className="text-sm text-muted-foreground mt-1">You will be redirected to PayPal to complete your purchase securely.</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Buyer protection on eligible purchases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>No card details shared with merchant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Fast & secure checkout</span>
                  </div>
                </div>
                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3.5 bg-[#0070ba] text-white rounded-xl hover:bg-[#005ea6] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Pay with PayPal — $99.00
                </button>
              </div>
            )}

            {/* OxaPay Crypto */}
            {method === 'oxapay' && (
              <div className="space-y-5">
                <div className="text-center py-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bitcoin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-foreground">Pay with Crypto</h3>
                  <p className="text-sm text-muted-foreground mt-1">Powered by OxaPay — Select your cryptocurrency</p>
                </div>

                {/* Crypto selector */}
                <div className="space-y-2">
                  {cryptoCoins.map((coin) => (
                    <button
                      key={coin.symbol}
                      onClick={() => setSelectedCrypto(coin.symbol)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                        selectedCrypto === coin.symbol
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-border hover:border-muted-foreground/30 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                        <CryptoIcon symbol={coin.symbol} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm text-foreground">{coin.name}</div>
                        <div className="text-xs text-muted-foreground">{coin.symbol}</div>
                      </div>
                      {selectedCrypto === coin.symbol && <CheckCircle className="w-5 h-5 text-purple-600 ml-auto" />}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Pay with {selectedCrypto} — $99.00
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
