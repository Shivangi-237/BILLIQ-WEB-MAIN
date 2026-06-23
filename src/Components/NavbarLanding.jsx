import { FaBolt } from "react-icons/fa";

export default function NavbarLanding() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <FaBolt className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            BillIQ
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-indigo-600 transition-colors">
            How it works
          </a>
          <a href="#benefits" className="hover:text-indigo-600 transition-colors">
            Benefits
          </a>
        </nav>
        <a
          href="/login"
          className="inline-flex items-center h-10 px-5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-medium hover:shadow-lg hover:scale-105 transition-all"
        >
          Launch Dashboard
        </a>
      </div>
    </header>
  );
}