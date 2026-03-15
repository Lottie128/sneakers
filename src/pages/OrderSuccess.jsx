import { Link, useLocation } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function OrderSuccess() {
  const orderId = new URLSearchParams(useLocation().search).get('orderId')

  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <div className="max-w-md mx-auto px-6 pt-32 pb-20 text-center">
        <CheckCircle size={64} className="text-green-400 mx-auto mb-6" />
        <h1 className="text-white font-black text-3xl mb-3">Order Confirmed!</h1>
        {orderId && (
          <p className="text-accent font-mono font-bold text-lg mb-3">{orderId}</p>
        )}
        <p className="text-white/40 text-sm mb-2">Thank you for your order.</p>
        <p className="text-white/30 text-sm mb-10">Estimated delivery: 3–5 business days</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/profile" className="btn-primary">View My Orders</Link>
          <Link to="/products" className="btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
