import { Link } from 'react-router-dom'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQty, count, total } = useCart()

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-[#0d0d0d] border-l border-white/5 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <ShoppingBag size={16} className="text-white/60" />
            <span className="text-white font-bold text-sm uppercase tracking-wide">Your Bag</span>
            {count > 0 && <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5">{count}</span>}
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-white/10" />
              <p className="text-white/30 text-sm">Your bag is empty</p>
              <button onClick={onClose} className="text-accent text-sm font-semibold hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover bg-[#1a1a1a] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                  <p className="text-white/30 text-[10px] mb-1">{item.brand}{item.size ? ` · Size ${item.size}` : ''}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/10">
                      <button
                        onClick={() => updateQty(item.productId, item.size, -1)}
                        className="px-2 py-1 text-white/40 hover:text-white transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="px-2 text-white text-xs font-semibold min-w-[20px] text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.size, +1)}
                        className="px-2 py-1 text-white/40 hover:text-white transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                    <span className="text-white text-xs font-bold">${(item.price * item.qty).toFixed(0)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-white/20 hover:text-red-400 transition-colors self-start mt-0.5"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/5 px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/50 text-sm">Subtotal</span>
              <span className="text-white font-black text-lg">${total.toFixed(0)}</span>
            </div>
            <p className="text-white/20 text-xs">Shipping calculated at checkout</p>
            <Link
              to="/checkout"
              onClick={onClose}
              className="btn-primary w-full justify-center"
            >
              Checkout
            </Link>
            <button onClick={onClose} className="w-full text-center text-white/30 hover:text-white text-xs font-medium transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
