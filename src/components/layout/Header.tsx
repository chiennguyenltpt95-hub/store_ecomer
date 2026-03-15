import { Search, Mail, ShoppingBag } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Header = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 relative">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 ml-2.5">
          <div className="w-[50px] h-[50px] flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-gray-700" />
          </div>
          <span className="text-xl font-bold text-gray-800">J-Mart</span>
        </Link>

        {/* Nav - centered */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/products', label: 'Categories', end: false },
            { to: '/wishlist', label: 'Wishlist', end: false },
            { to: '/orders', label: 'Order History', end: false },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-sky-500 font-semibold' : 'text-gray-600 hover:text-sky-500'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Search + Auth */}
        <div className="flex-1" />
        <div className="flex items-center gap-17">
          <form onSubmit={handleSearch} className="w-[249px]">
            <div className="flex items-center border border-gray-300 rounded-md py-2 bg-white overflow-hidden">
              <span style={{ paddingLeft: '8px', paddingRight: '8px', display: 'flex', alignItems: 'center' }}>
                <Search className="w-4 h-4 text-gray-700" />
              </span>
              <input
                type="text"
                placeholder="Search for products..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="text-sm text-gray-500 outline-none flex-1 bg-transparent pr-3"
              />
            </div>
          </form>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md hover:border-sky-500 hover:text-sky-500 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium text-gray-700 border border-gray-300 px-4 py-1.5 rounded-md hover:border-sky-500 hover:text-sky-500 transition-colors"
            >
              Sign Up
            </Link>
            <button className="text-gray-500 hover:text-sky-500 transition-colors">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
