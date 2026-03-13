import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Heart, ArrowRight } from 'lucide-react'
import { products } from '../data/products'

const badgeColors = {
  New: 'bg-accent text-white',
  Hot: 'bg-white text-black',
  Limited: 'bg-purple-500 text-white',
  Exclusive: 'bg-yellow-500 text-black',
  Sale: 'bg-green-500 text-white',
  Classic: 'bg-gray-600 text-white',
}

function ProductCard({ product }) {
  const [wishlist, setWishlist] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative block bg-[#0f0f0f] overflow-hidden card-hover"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#1a1a1a]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Add to cart */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-0 left-0 right-0 py-3 font-semibold text-sm tracking-wide uppercase transition-all duration-300 ${
            added
              ? 'bg-green-500 text-white translate-y-0'
              : 'bg-accent text-white translate-y-full group-hover:translate-y-0'
          }`}
        >
          {added ? '✓ Added to Bag' : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingBag size={15} /> Add to Bag
            </span>
          )}
        </button>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${badgeColors[product.badge]}`}>
            {product.badge}
          </span>
        )}

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white/70 text-xs font-semibold tracking-widest uppercase border border-white/20 px-3 py-1.5">
              Sold Out
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWishlist(!wishlist) }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-black/60"
        >
          <Heart
            size={15}
            className={wishlist ? 'fill-red-500 text-red-500' : 'text-white'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-white/40 text-xs font-medium mb-1">{product.brand}</p>
        <h3 className="text-white font-semibold text-sm mb-2 truncate">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold">${product.price}</span>
          {product.originalPrice && (
            <span className="text-white/30 text-sm line-through">${product.originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function FeaturedProducts() {
  const featured = products.slice(0, 8)

  return (
    <section id="featured" className="bg-black py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="tag mb-3">Curated Picks</p>
            <h2 className="section-title text-white">Featured Drops</h2>
          </div>
          <Link
            to="/products"
            className="hidden md:flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors group"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-10 text-center md:hidden">
          <Link to="/products" className="btn-outline">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
