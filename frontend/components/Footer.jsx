export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-16 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold mb-3">BuxTech</h4>
          <p>Lagos, Nigeria</p>
          <p className="mt-2">buxtech27@gmail.com</p>
          <p>08123590484</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Company</h4>
          <a href="/about" className="block hover:text-cyan-400 mb-1">About Us</a>
          <a href="/contact" className="block hover:text-cyan-400 mb-1">Contact</a>
          <a href="/faq" className="block hover:text-cyan-400 mb-1">FAQ</a>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Policies</h4>
          <a href="/returns" className="block hover:text-cyan-400 mb-1">Returns & Refunds</a>
          <a href="/privacy" className="block hover:text-cyan-400 mb-1">Privacy Policy</a>
          <a href="/terms" className="block hover:text-cyan-400 mb-1">Terms & Conditions</a>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Follow Us</h4>
          <a href="#" className="block hover:text-cyan-400 mb-1">Instagram</a>
          <a href="#" className="block hover:text-cyan-400 mb-1">Twitter / X</a>
          <a href="#" className="block hover:text-cyan-400 mb-1">WhatsApp</a>
        </div>
      </div>
      <div className="text-center py-4 border-t border-gray-900">
        © {new Date().getFullYear()} BuxTech. All rights reserved.
      </div>
    </footer>
  );
}
