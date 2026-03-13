import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, User } from 'lucide-react'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Collections', to: '/products' },
  { label: 'About', to: '/#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location])

  const isDashboard = location.pathname.startsWith('/admin')

  if (isDashboard) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
            <span className="text-white font-black text-xs">SS</span>
          </div>
          <span className="text-white font-black text-lg tracking-tight group-hover:text-accent transition-colors">
            SOLE SOCIETY
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-white ${
                  location.pathname === link.to ? 'text-white' : 'text-white/50'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/admin"
            className="hidden md:flex items-center gap-1.5 text-white/50 hover:text-white text-sm font-medium transition-colors"
          >
            <User size={16} />
            <span>Admin</span>
          </Link>
          <button className="relative text-white/70 hover:text-white transition-colors">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-white text-[9px] font-bold flex items-center justify-center">
              2
            </span>
          </button>
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-black/98 border-t border-white/5 transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-80' : 'max-h-0'
        }`}
      >
        <ul className="px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="text-white/70 hover:text-white text-base font-medium transition-colors block py-1"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/admin" className="text-white/70 hover:text-white text-base font-medium transition-colors block py-1">
              Admin Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
