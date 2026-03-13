import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, MoreVertical } from 'lucide-react'
import { products as initialProducts } from '../../data/products'

export default function DashboardProducts() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const toggleStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inStock: !p.inStock } : p))
    )
  }

  const deleteProduct = (id) => {
    if (confirm('Delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-2xl mb-1">Products</h1>
          <p className="text-white/30 text-sm">{products.length} total products</p>
        </div>
        <button className="btn-primary text-xs py-2.5 px-5">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#111] border border-white/5 text-white placeholder-white/20 pl-10 pr-4 py-3 text-sm outline-none focus:border-white/20 transition-colors max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Brand', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-white/30 text-xs font-semibold uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover bg-[#1a1a1a] flex-shrink-0" />
                      <span className="text-white font-medium truncate max-w-[160px]">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-white/50">{product.brand}</td>
                  <td className="px-5 py-3.5 text-white/50">{product.category}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">${product.price}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => toggleStock(product.id)}
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide cursor-pointer transition-colors ${
                        product.inStock
                          ? 'text-green-400 bg-green-400/10 hover:bg-green-400/20'
                          : 'text-red-400 bg-red-400/10 hover:bg-red-400/20'
                      }`}
                    >
                      {product.inStock ? 'In Stock' : 'Sold Out'}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="text-white/30 hover:text-white transition-colors p-1">
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-white/30 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-white/20 py-10 text-sm">No products found</p>
        )}
      </div>
    </div>
  )
}
