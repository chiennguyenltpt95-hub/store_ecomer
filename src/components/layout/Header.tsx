import { Link } from "react-router-dom";

const Header = () => {
  const pageName = [
    'Home',
    'Products',
    'About',
    'Contact'
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16">
      <div className="flex h-full items-center gap-10" style={{ paddingLeft: '50px' }}>
        <img src="/images/logo.png" alt="Logo" className="h-10 w-10 object-contain shrink-0" />
        <nav className="flex items-center gap-6">
          {pageName.map((name) => (
            <Link
              key={name}
              to={name === 'Home' ? '/' : `/${name.toLowerCase()}`}
              className="text-gray-600 hover:text-black transition text-sm font-medium"
            >
              {name}
            </Link>
          ))}
        </nav>
        <div className="relative flex items-center justify-start w-full h-2" >
          <input
            type="text"
            placeholder="Search products..."
            className="relative z-10 border border-gray-300 rounded-full  text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-300 w-48 bg-white"
          />
        </div>

      </div>
    </header>
  );
};

export default Header;
