import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sole_cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('sole_cart', JSON.stringify(items))
  }, [items])

  const addItem = (product, size) => {
    setItems(prev => {
      const key = (i) => `${i.productId}-${i.size}`
      const newKey = `${product.id}-${size}`
      const exists = prev.find(i => key(i) === newKey)
      if (exists) return prev.map(i => key(i) === newKey ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { productId: product.id, name: product.name, brand: product.brand, price: product.price, image: product.image, size, qty: 1 }]
    })
  }

  const removeItem = (productId, size) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)))
  }

  const updateQty = (productId, size, delta) => {
    setItems(prev => {
      return prev.flatMap(i => {
        if (i.productId !== productId || i.size !== size) return [i]
        const next = i.qty + delta
        return next <= 0 ? [] : [{ ...i, qty: next }]
      })
    })
  }

  const clearCart = () => setItems([])

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
