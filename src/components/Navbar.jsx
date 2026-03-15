import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Collections', to: '/products' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { count } = useCart()

  const handleLogout = () => { logout(); navigate('/') }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  if (location.pathname.startsWith('/admin')) return null

  return (
    <>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-accent rounded-sm flex items-center justify-center">
              <span className="text-white font-black text-xs">SS</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight group-hover:text-accent transition-colors">SOLE SOCIETY</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link to={link.to} className={`text-sm font-medium tracking-wide transition-colors hover:text-white ${location.pathname === link.to ? 'text-white' : 'text-white/50'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Auth */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/profile" className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-white/30 hover:text-white transition-colors" title="Sign out">
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-white/50 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
                <Link to="/signup" className="text-xs font-semibold uppercase tracking-wide border border-white/20 text-white/70 hover:text-white hover:border-white/50 px-4 py-2 transition-colors">Sign Up</Link>
              </div>
            )}

            {/* Profile icon (shown only when NOT logged in, since logged-in users already see their name) */}
            {!user && (
              <Link to="/login" className="hidden md:flex text-white/25 hover:text-white/60 transition-colors" title="Sign in">
                <User size={15} />
              </Link>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative text-white/70 hover:text-white transition-colors">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="md:hidden text-white/70 hover:text-white transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={`md:hidden bg-black/98 border-t border-white/5 transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <ul className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <li key={link.label}>
                <Link to={link.to} className="text-white/70 hover:text-white text-base font-medium transition-colors block py-1">{link.label}</Link>
              </li>
            ))}
            {user ? (
              <>
                <li><Link to="/profile" className="text-white/70 hover:text-white text-base font-medium transition-colors block py-1">My Profile</Link></li>
                <li><button onClick={handleLogout} className="text-white/50 hover:text-white text-base font-medium transition-colors block py-1 text-left">Sign Out</button></li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="text-white/70 hover:text-white text-base font-medium block py-1">Sign In</Link></li>
                <li><Link to="/signup" className="text-accent font-semibold text-base block py-1">Sign Up</Link></li>
              </>
            )}
          </ul>
        </div>
      </header>
    </>
  )
}
