import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Layout from '../components/Layout'
import { formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-5 sm:py-20 md:px-8 md:py-28">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark sm:h-20 sm:w-20">
            <ShoppingBag className="h-7 w-7 text-ink-muted sm:h-8 sm:w-8" strokeWidth={1.5} />
          </div>
          <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Your bag</p>
          <h1 className="mt-3 font-display text-3xl font-medium sm:text-4xl">Nothing here yet</h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-ink-muted">Explore the collection and add pieces you love. Your bag is waiting.</p>
          <Link to="/products" className="btn-primary mt-8 inline-flex rounded-full">Shop all pieces</Link>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-5 sm:py-12 md:px-8 md:py-16 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">Your bag</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </h1>
        <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-12 lg:grid-cols-3">
          <ul className="space-y-4 sm:space-y-6 lg:col-span-2">
            {items.map((item) => (
              <li key={item.key} className="flex gap-3 rounded-2xl border border-ink/10 bg-cream p-3 sm:gap-6 sm:p-5">
                <Link to={`/products/${item.product.id}`} className="h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-cream-dark sm:h-36 sm:w-28">
                  <img src={item.product.image} alt={item.product.name} onError={(e) => { e.currentTarget.src = getPlaceholderImage(item.product.name, item.product.category) }} className="h-full w-full object-cover transition hover:scale-105" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link to={`/products/${item.product.id}`} className="font-display text-base font-medium transition hover:text-terracotta sm:text-xl">{item.product.name}</Link>
                      <p className="mt-1 text-[11px] text-ink-muted sm:text-xs">Size {item.size} · {formatPrice(item.product.price)} each</p>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.key)} aria-label="Remove item" className="shrink-0 rounded-lg p-1.5 text-ink-muted transition hover:bg-rose-50 hover:text-rose-600">
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3 sm:pt-4">
                    <div className="flex items-center overflow-hidden rounded-lg border border-ink/15">
                      <button type="button" onClick={() => updateQuantity(item.key, item.quantity - 1)} className="px-2.5 py-2 text-ink-muted transition hover:bg-cream-dark hover:text-ink sm:px-3" aria-label="Decrease quantity"><Minus className="h-3.5 w-3.5" /></button>
                      <span className="min-w-[2rem] text-center text-sm font-medium">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.key, item.quantity + 1)} className="px-2.5 py-2 text-ink-muted transition hover:bg-cream-dark hover:text-ink sm:px-3" aria-label="Increase quantity"><Plus className="h-3.5 w-3.5" /></button>
                    </div>
                    <p className="text-sm font-medium sm:text-base">{formatPrice(item.lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit">
            <div className="sticky top-24 rounded-2xl border border-ink/10 bg-cream-dark/40 p-5 sm:top-28 sm:p-6">
              <h2 className="font-display text-lg font-medium sm:text-xl">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm sm:mt-6">
                <div className="flex justify-between"><span className="text-ink-muted">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-ink-muted">Shipping</span><span className="text-emerald-700">Free</span></div>
              </div>
              <div className="mt-5 flex justify-between border-t border-ink/10 pt-5 text-base font-medium">
                <span>Total</span>
                <span className="text-lg text-terracotta">{formatPrice(subtotal)}</span>
              </div>
              <Link to="/checkout" className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3.5 sm:mt-6">
                Proceed to checkout
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/products" className="mt-4 block text-center text-[13px] text-ink-muted underline underline-offset-4 transition hover:text-terracotta">Continue shopping</Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  )
}
