import { Facebook, Twitter, Linkedin } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-[1440px] mx-auto px-6 py-10">
        {/* Newsletter */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-1">J-Mart</h3>
          <p className="text-sm text-gray-500 mb-4">Stay up to date</p>
          <form
            onSubmit={e => e.preventDefault()}
            className="flex items-center justify-center gap-2 max-w-xs mx-auto"
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-1.5 rounded-md transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-6">
          <span>English</span>
          <span>© 2026 J-Mart</span>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:text-sky-500 transition-colors"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-sky-500 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-sky-500 transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
