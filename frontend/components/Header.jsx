import { useState } from 'react';

const CATEGORIES = ['Laptops', 'Phones', 'Kitchen', 'Home', 'Accessories'];

export default function Header({ cartCount = 0, user, onSearch }) {
  const [query, setQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-6">
        <a href="/" className="text-2xl font-bold text-white shrink-0">
          BUX<span className="text-cyan-400">TECH</span>
        </a>

        <div className="relative">
          <button
            onClick={() => setShowCategories((s) => !s)}
            className="text-gray-300 hover:text-cyan-400 text-sm"
          >
            Categories ▾
          </button>
          {showCategories && (
            <div className="absolute top-8 left-0 bg-[#0d1117] border border-gray-700 rounded shadow-lg w-48">
              {CATEGORIES.map((c) => (
                <a
                  key={c}
                  href={`/category/${c.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-cyan-400"
                >
                  {c}
                </a>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search laptops, blenders, phones..."
            className="w-full bg-[#0d1117] border border-gray-700 rounded px-4 py-2 text-white text-sm"
          />
        </form>

        <a href="/cart" className="relative text-gray-300 hover:text-cyan-400">
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-cyan-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </a>

        <a href={user ? '/account' : '/login'} className="text-gray-300 hover:text-cyan-400 text-sm">
          {user ? `Hi, ${user.name.split(' ')[0]}` : 'Account'}
        </a>
      </div>
    </header>
  );
}
