import { isAxiosError } from 'axios';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Facebook,
  Github,
  Loader2,
  Lock,
  Mail,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { http, setAuthTokensFromResponse } from '../../services/http';

type ToastState = {
  type: 'success' | 'error';
  message: string;
};

function getBackendFieldErrors(data: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};

  const setFieldError = (key: string, message: string) => {
    if (!message.trim()) return;

    const lowerKey = key.toLowerCase();
    if (lowerKey === 'email') fieldErrors.signupEmail = message;
    else if (lowerKey === 'password') fieldErrors.signupPassword = message;
    else if (lowerKey === 'confirm_password' || lowerKey === 'confirmPassword') fieldErrors.confirmPassword = message;
    else if (lowerKey === 'full_name' || lowerKey === 'fullname') {
      fieldErrors.firstName = message;
      fieldErrors.lastName = message;
    } else fieldErrors.form = message;
  };

  if (!data || typeof data !== 'object') return fieldErrors;

  if ('errors' in data) {
    const errors = data.errors;

    if (Array.isArray(errors)) {
      for (const item of errors) {
        if (!item || typeof item !== 'object') continue;
        const field = 'field' in item ? item.field : undefined;
        const message = 'message' in item ? item.message : undefined;
        if (typeof field === 'string' && typeof message === 'string') {
          setFieldError(field, message);
        }
      }
    } else if (errors && typeof errors === 'object') {
      for (const [key, value] of Object.entries(errors)) {
        if (typeof value === 'string') {
          setFieldError(key, value);
        } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
          setFieldError(key, value[0]);
        }
      }
    }
  }

  return fieldErrors;
}

// ─── Google SVG icon (no lucide equivalent) ─────────
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ─── Password strength ──────────────────────────────
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

const passwordRules = [
  { test: (p: string) => p.length >= 8, label: 'At least 8 characters' },
  { test: (p: string) => /[A-Z]/.test(p), label: 'One uppercase letter' },
  { test: (p: string) => /[a-z]/.test(p), label: 'One lowercase letter' },
  { test: (p: string) => /[0-9]/.test(p), label: 'One number' },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: 'One special character' }
];

// ─── Trust badges ───────────────────────────────────
const trustBadges = [
  { icon: ShieldCheck, label: 'Secure Account', desc: '256-bit encryption' },
  { icon: Truck, label: 'Free Shipping', desc: 'On orders $100+' },
  { icon: CreditCard, label: 'Easy Payments', desc: 'All methods accepted' }
];

// ─── Component ──────────────────────────────────────
export function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();

  // Reset on mode change
  useEffect(() => {
    setErrors({});
    setSuccess(false);
    setLoading(false);
    setResetSent(false);
  }, [mode]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timeoutId);
  }, [toast]);

  // ── Validation ──
  const validateLogin = () => {
    const e: Record<string, string> = {};
    if (!loginEmail.trim()) e.loginEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) e.loginEmail = 'Invalid email address';
    if (!loginPassword) e.loginPassword = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignup = () => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!signupEmail.trim()) e.signupEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) e.signupEmail = 'Invalid email address';
    if (!signupPassword) e.signupPassword = 'Password is required';
    else if (signupPassword.length < 8) e.signupPassword = 'Password must be at least 8 characters';
    if (confirmPassword !== signupPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) e.terms = 'You must agree to the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateForgot = () => {
    const e: Record<string, string> = {};
    if (!forgotEmail.trim()) e.forgotEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) e.forgotEmail = 'Invalid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Handlers ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);

    setErrors((prev) => {
      const { form, loginEmail, loginPassword, ...rest } = prev;
      return rest;
    });

    try {
      const response = await http.post('/v1/auth/login', {
        email: loginEmail.trim(),
        password: loginPassword
      });

      setAuthTokensFromResponse(response.data);

      setToast({ type: 'success', message: 'Đăng nhập thành công' });
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      let message = 'Login failed. Please try again.';
      const mappedErrors: Record<string, string> = {};

      if (isAxiosError(error)) {
        const responseData = error.response?.data;

        if (typeof responseData === 'string' && responseData.trim()) {
          message = responseData;
        } else if (responseData && typeof responseData === 'object' && 'message' in responseData && typeof responseData.message === 'string') {
          message = responseData.message;
        } else if (responseData && typeof responseData === 'object' && 'error' in responseData && typeof responseData.error === 'string') {
          message = responseData.error;
        } else if (error.message) {
          message = error.message;
        }

        // Backend returns "Account is not verified..." when user has not verified email yet.
        if (message.toLowerCase().includes('not verified')) {
          message = 'Your account is not verified. Please check your email to verify your account, then sign in again.';
        }

        if (responseData && typeof responseData === 'object' && 'errors' in responseData) {
          const backendErrors = responseData.errors;

          if (Array.isArray(backendErrors)) {
            for (const item of backendErrors) {
              if (!item || typeof item !== 'object') continue;
              const field = 'field' in item ? item.field : undefined;
              const fieldMessage = 'message' in item ? item.message : undefined;
              if (typeof field !== 'string' || typeof fieldMessage !== 'string') continue;

              const lowerField = field.toLowerCase();
              if (lowerField === 'email') mappedErrors.loginEmail = fieldMessage;
              else if (lowerField === 'password') mappedErrors.loginPassword = fieldMessage;
            }
          } else if (backendErrors && typeof backendErrors === 'object') {
            for (const [key, value] of Object.entries(backendErrors)) {
              const fieldMessage =
                typeof value === 'string' ? value : Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' ? value[0] : '';

              if (!fieldMessage) continue;

              const lowerField = key.toLowerCase();
              if (lowerField === 'email') mappedErrors.loginEmail = fieldMessage;
              else if (lowerField === 'password') mappedErrors.loginPassword = fieldMessage;
            }
          }
        }
      }

      setErrors((prev) => ({ ...prev, ...mappedErrors, form: message }));
      setToast({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true);
    setErrors((prev) => {
      const { form, firstName, lastName, signupEmail, signupPassword, confirmPassword, ...rest } = prev;
      return rest;
    });

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    try {
      await http.post('/v1/users', {
        email: signupEmail.trim(),
        full_name: fullName,
        password: signupPassword
      });

      setToast({ type: 'success', message: 'Đăng ký thành công' });
      setSuccess(true);
      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      let message = 'Sign up failed. Please try again.';
      let mappedErrors: Record<string, string> = {};

      if (isAxiosError(error)) {
        const responseData = error.response?.data;
        if (typeof responseData === 'string' && responseData.trim()) {
          message = responseData;
        } else if (responseData && typeof responseData === 'object' && 'message' in responseData && typeof responseData.message === 'string') {
          message = responseData.message;
        } else if (responseData && typeof responseData === 'object' && 'error' in responseData && typeof responseData.error === 'string') {
          message = responseData.error;
        } else if (error.message) {
          message = error.message;
        }

        mappedErrors = getBackendFieldErrors(responseData);
        if (mappedErrors.form) {
          message = mappedErrors.form;
        }
      }

      setErrors((prev) => ({ ...prev, ...mappedErrors, form: message }));
      setToast({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForgot()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setResetSent(true);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGoogleLoading(false);
    setSuccess(true);
    setTimeout(() => navigate('/'), 1200);
  };

  const strength = getPasswordStrength(signupPassword);

  // ── Success overlay ──
  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-border p-10 text-center max-w-sm w-full shadow-lg animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-foreground mb-2">{mode === 'signup' ? 'Account Created!' : 'Welcome Back!'}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {mode === 'signup' ? 'Your account has been created successfully. Redirecting...' : "You've logged in successfully. Redirecting..."}
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to homepage...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm shadow-lg border ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground">{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* ═══════ LEFT: Branding Panel ═══════ */}
          <div className="hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden h-full min-h-[680px]">
              <img
                src="https://images.unsplash.com/photo-1621340164339-100beaa9d02f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBzaG9wcGluZyUyMGxpZmVzdHlsZSUyMGNvbG9yZnVsfGVufDF8fHx8MTc3Mzk3MzM3NXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/95 via-indigo-900/60 to-indigo-900/30" />

              <div className="relative z-10 h-full flex flex-col justify-between p-10">
                <div>
                  {/* Logo */}
                  <div className="flex items-center gap-2 mb-16">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl text-white tracking-tight">
                      Drop<span className="text-indigo-300">Store</span>
                    </span>
                  </div>

                  <div className="max-w-md">
                    <h2 className="text-3xl text-white !leading-tight mb-4">
                      Your favorite products,
                      <br />
                      <span className="text-indigo-300">delivered to your door.</span>
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed mb-8">
                      Join over 50,000+ happy customers who shop with DropStore for the best deals on electronics, fashion, home goods, and more.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-10">
                      <div className="text-center">
                        <p className="text-2xl text-white">50K+</p>
                        <p className="text-xs text-white/50">Happy Customers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl text-white">10K+</p>
                        <p className="text-xs text-white/50">Products</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl text-white">4.9</p>
                        <p className="text-xs text-white/50">Avg Rating</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex gap-4">
                  {trustBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.label}
                        className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10"
                      >
                        <Icon className="w-5 h-5 text-indigo-300 shrink-0" />
                        <div>
                          <p className="text-xs text-white">{badge.label}</p>
                          <p className="text-[11px] text-white/50">{badge.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════ RIGHT: Auth Forms ═══════ */}
          <div className="max-w-md mx-auto w-full lg:max-w-none">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl tracking-tight text-foreground">
                Drop<span className="text-indigo-600">Store</span>
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              {/* ── Tab Switcher ── */}
              {mode !== 'forgot' && (
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setMode('login')}
                    className={`flex-1 py-4 text-sm text-center transition relative cursor-pointer ${
                      mode === 'login' ? 'text-indigo-600' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Sign In
                    {mode === 'login' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-indigo-600 rounded-full" />}
                  </button>
                  <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 py-4 text-sm text-center transition relative cursor-pointer ${
                      mode === 'signup' ? 'text-indigo-600' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Create Account
                    {mode === 'signup' && <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-indigo-600 rounded-full" />}
                  </button>
                </div>
              )}

              <div className="p-6 sm:p-8">
                {/* ────────── LOGIN FORM ────────── */}
                {mode === 'login' && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-foreground text-xl mb-1">Welcome back</h2>
                      <p className="text-sm text-muted-foreground">Sign in to your account to continue shopping</p>
                    </div>

                    {/* Social login */}
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer disabled:opacity-60"
                      >
                        {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
                        Continue with Google
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">
                          <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">
                          <Github className="w-4 h-4" /> GitHub
                        </button>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or sign in with email</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                      {/* Email */}
                      <div>
                        <label className="block text-sm text-foreground mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            placeholder="you@example.com"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition ${
                              errors.loginEmail ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                            }`}
                          />
                        </div>
                        {errors.loginEmail && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.loginEmail}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-sm text-foreground">Password</label>
                          <button type="button" onClick={() => setMode('forgot')} className="text-xs text-indigo-600 hover:underline cursor-pointer">
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm outline-none transition ${
                              errors.loginPassword ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.loginPassword && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.loginPassword}
                          </p>
                        )}
                      </div>

                      {/* Remember me */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={() => setRememberMe(!rememberMe)}
                          className="w-4 h-4 accent-indigo-600 cursor-pointer rounded"
                        />
                        <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
                      </label>

                      {/* Submit */}
                      {errors.form && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.form}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Sign In <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Don't have an account?{' '}
                      <button onClick={() => setMode('signup')} className="text-indigo-600 hover:underline cursor-pointer">
                        Create one for free
                      </button>
                    </p>
                  </>
                )}

                {/* ────────── SIGNUP FORM ────────── */}
                {mode === 'signup' && (
                  <>
                    <div className="text-center mb-6">
                      <h2 className="text-foreground text-xl mb-1">Create your account</h2>
                      <p className="text-sm text-muted-foreground">Join DropStore and start shopping today</p>
                    </div>

                    {/* Social signup */}
                    <div className="space-y-3 mb-6">
                      <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer disabled:opacity-60"
                      >
                        {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GoogleIcon className="w-5 h-5" />}
                        Sign up with Google
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">
                          <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">
                          <Github className="w-4 h-4" /> GitHub
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">or register with email</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                      {/* Name row */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-foreground mb-1.5">First Name</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="John"
                              className={`w-full pl-10 pr-3 py-3 border rounded-xl text-sm outline-none transition ${
                                errors.firstName ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                              }`}
                            />
                          </div>
                          {errors.firstName && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-foreground mb-1.5">Last Name</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                            className={`w-full px-3 py-3 border rounded-xl text-sm outline-none transition ${
                              errors.lastName ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                            }`}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm text-foreground mb-1.5">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="you@example.com"
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition ${
                              errors.signupEmail ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                            }`}
                          />
                        </div>
                        {errors.signupEmail && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.signupEmail}
                          </p>
                        )}
                      </div>

                      {/* Phone (optional) */}
                      <div>
                        <label className="block text-sm text-foreground mb-1.5">
                          Phone Number <span className="text-muted-foreground">(optional)</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="tel"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            placeholder="+1 (555) 000-0000"
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm outline-none focus:border-indigo-300 transition"
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm text-foreground mb-1.5">Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            placeholder="Create a strong password"
                            className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm outline-none transition ${
                              errors.signupPassword ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.signupPassword && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.signupPassword}
                          </p>
                        )}

                        {/* Password strength */}
                        {signupPassword && (
                          <div className="mt-3">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1 flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-slate-200'}`}
                                  />
                                ))}
                              </div>
                              <span
                                className={`text-xs ${strength.score <= 2 ? 'text-red-500' : strength.score <= 3 ? 'text-amber-500' : strength.score <= 4 ? 'text-blue-500' : 'text-emerald-500'}`}
                              >
                                {strength.label}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              {passwordRules.map((rule) => {
                                const passed = rule.test(signupPassword);
                                return (
                                  <div
                                    key={rule.label}
                                    className={`flex items-center gap-1 text-[11px] ${passed ? 'text-emerald-600' : 'text-muted-foreground'}`}
                                  >
                                    {passed ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                    {rule.label}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-sm text-foreground mb-1.5">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className={`w-full pl-10 pr-11 py-3 border rounded-xl text-sm outline-none transition ${
                              errors.confirmPassword ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                          </p>
                        )}
                        {confirmPassword && confirmPassword === signupPassword && (
                          <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Passwords match
                          </p>
                        )}
                      </div>

                      {/* Terms */}
                      <div>
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={() => setAgreeTerms(!agreeTerms)}
                            className="w-4 h-4 accent-indigo-600 cursor-pointer mt-0.5 rounded"
                          />
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            I agree to the{' '}
                            <a href="#" className="text-indigo-600 hover:underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-indigo-600 hover:underline">
                              Privacy Policy
                            </a>
                          </span>
                        </label>
                        {errors.terms && (
                          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {errors.terms}
                          </p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" /> Create Account
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                      Already have an account?{' '}
                      <button onClick={() => setMode('login')} className="text-indigo-600 hover:underline cursor-pointer">
                        Sign in
                      </button>
                    </p>
                  </>
                )}

                {/* ────────── FORGOT PASSWORD ────────── */}
                {mode === 'forgot' && (
                  <>
                    {resetSent ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="w-7 h-7 text-emerald-600" />
                        </div>
                        <h2 className="text-foreground text-xl mb-2">Check your email</h2>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                          We've sent a password reset link to <span className="text-foreground">{forgotEmail}</span>. Check your inbox and follow the
                          instructions.
                        </p>
                        <div className="space-y-3">
                          <button
                            onClick={() => {
                              setResetSent(false);
                              setForgotEmail('');
                            }}
                            className="w-full py-3 border border-border rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer"
                          >
                            Try a different email
                          </button>
                          <button
                            onClick={() => setMode('login')}
                            className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition cursor-pointer flex items-center justify-center gap-2"
                          >
                            <ArrowRight className="w-4 h-4 rotate-180" /> Back to Sign In
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-6">
                          <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-6 h-6 text-indigo-600" />
                          </div>
                          <h2 className="text-foreground text-xl mb-1">Reset your password</h2>
                          <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
                        </div>

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div>
                            <label className="block text-sm text-foreground mb-1.5">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <input
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="you@example.com"
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none transition ${
                                  errors.forgotEmail ? 'border-red-300 bg-red-50/50' : 'border-border focus:border-indigo-300'
                                }`}
                              />
                            </div>
                            {errors.forgotEmail && (
                              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.forgotEmail}
                              </p>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                          >
                            {loading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                Send Reset Link <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setMode('login')}
                            className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition cursor-pointer flex items-center justify-center gap-1"
                          >
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" /> Back to Sign In
                          </button>
                        </form>
                      </>
                    )}
                  </>
                )}

                {/* Security note */}
                {mode !== 'forgot' && (
                  <div className="mt-6 pt-5 border-t border-border">
                    <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> SSL Secured
                      </span>
                      <span className="flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Data Protected
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> GDPR Compliant
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
