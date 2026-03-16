import { Link } from 'react-router-dom';

const Header = () => {
  const pageName = ['Home', 'Products', 'About', 'Contact'];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-16">
      <div className="flex h-full items-center justify-between mx-12">
        <div className="w-1/3 flex items-center gap-4 justify-center">
          <img src="/images/logo.png" alt="Logo" className="w-10 object-contain cursor-pointer" onClick={() => (window.location.href = '/')} />
        </div>
        <div className="flex items-center gap-4 flex-1 w-2/3 justify-center">
          <nav className="flex items-center gap-6 flex-1 text-[20px]">
            {pageName.map((name) => (
              <Link
                key={name}
                to={name === 'Home' ? '/' : `/${name.toLowerCase()}`}
                className="text-gray-600 hover:text-black transition text-[14px] font-medium"
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="relative flex items-center justify-between w-full h-2">
          <input
            type="text"
            placeholder="Search products..."
            className="relative z-10 border border-gray-300 rounded-full text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-300 w-48 bg-white ml-6 pl-[10px]"
          />
          <div className="flex items-center gap-2 absolute right-10">
            <span
              className="text-gray-600 hover:text-gray-900 hover:bg-amber-300 transition-all duration-200 text-sm font-semibold cursor-pointer rounded-full px-4 py-1.5 shadow-sm"
              onClick={() => (window.location.href = '/login')}
            >
              login
            </span>
            <span
              className="text-gray-600 hover:text-gray-900 hover:bg-amber-300 transition-all duration-200 text-sm font-semibold cursor-pointer rounded-full px-4 py-1.5 shadow-sm"
              onClick={() => (window.location.href = '/register')}
            >
              signup
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
