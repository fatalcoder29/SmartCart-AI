import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import Layout from '../components/Layout'
import { formatPrice } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const [placed, setPlaced] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    address: '',
    city: '',
    postal: '',
  })

  if (items.length === 0 && !placed) {
    return <Navigate to="/cart" replace />
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    clearCart()
    setPlaced(true)
  }

  if (placed) {
    return (
      <Layout>
        <section className="mx-auto max-w-lg px-5 py-24 text-center md:py-32">
          <CheckCircle className="mx-auto h-12 w-12 text-terracotta" strokeWidth={1.5} />
          <h1 className="mt-6 font-display text-4xl font-medium">Order placed</h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Thank you, {form.name.split(' ')[0]}. A confirmation has been sent to {form.email}.
            Your pieces will ship within 2–3 business days.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block bg-ink px-8 py-3.5 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta"
          >
            Continue shopping
          </Link>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
          Checkout
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">Complete your order</h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
                Full name
              </span>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
            </label>
            <label className="block">
              <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
                Address
              </span>
              <input
                name="address"
                required
                value={form.address}
                onChange={handleChange}
                className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
                  City
                </span>
                <input
                  name="city"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
              </label>
              <label className="block">
                <span className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
                  Postal code
                </span>
                <input
                  name="postal"
                  required
                  value={form.postal}
                  onChange={handleChange}
                  className="mt-2 w-full border border-ink/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-terracotta"
                />
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-ink py-4 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta"
            >
              Place order · {formatPrice(subtotal)}
            </button>
          </form>

          <aside className="h-fit border border-ink/10 bg-cream-dark/40 p-6">
            <h2 className="font-display text-xl font-medium">Your order</h2>
            <ul className="mt-6 space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex justify-between gap-4 text-sm">
                  <span className="text-ink-muted">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(item.lineTotal)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between border-t border-ink/10 pt-6 font-medium">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  )
}
