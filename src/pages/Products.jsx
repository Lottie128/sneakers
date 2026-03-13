import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { products } from '../data/products'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'

const BRANDS = ['All', 'Nike', 'Adidas', 'Jordan', 'Converse']
const CATEGORIES = ['All', 'Running', 'Lifestyle', 'Basketball', 'Skateboarding']

export default function Products() {
  const [activeBrand, setActiveBrand] = useState('All')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')

  const filtered = products
    .filter((p) => activeBrand === 'All' || p.brand === activeBrand)
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="pt-28 pb-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-white font-black text-4xl md:text-5xl tracking-tight mb-2">All Products</h1>
          <p className="text-white/40 text-sm">{filtered.length} styles</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center mb-10">
          <div className="flex items-center gap-2 border-r border-white/10 pr-4">
            <SlidersHorizontal size={14} className="text-white/40" />
            <span className="text-white/40 text-xs font-semibold uppercase tracking-widest">Filter</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => setActiveBrand(b)}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors border ${
                  activeBrand === b
                    ? 'bg-white text-black border-white'
                    : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors border ${
                  activeCategory === c
                    ? 'bg-accent text-white border-accent'
                    : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-white/10 text-white/60 text-xs font-medium px-3 py-1.5 outline-none cursor-pointer hover:border-white/30 transition-colors"
            >
              <option value="default" className="bg-black">Sort: Featured</option>
              <option value="price-asc" className="bg-black">Price: Low to High</option>
              <option value="price-desc" className="bg-black">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <Link key={product.id} to={`/products/${product.id}`} className="group block bg-[#0f0f0f] overflow-hidden card-hover">
              <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white/70 text-xs font-semibold tracking-widest uppercase border border-white/20 px-3 py-1.5">Sold Out</span>
                  </div>
                )}
                {product.badge && (
                  <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                    product.badge === 'Sale' ? 'bg-green-500 text-white' : 'bg-accent text-white'
                  }`}>{product.badge}</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-white/40 text-xs mb-1">{product.brand}</p>
                <h3 className="text-white font-semibold text-sm mb-2 truncate">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold">${product.price}</span>
                  {product.originalPrice && <span className="text-white/30 text-sm line-through">${product.originalPrice}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/30 text-lg mb-4">No products found</p>
            <button onClick={() => { setActiveBrand('All'); setActiveCategory('All') }} className="btn-outline text-sm">
              <X size={14} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
