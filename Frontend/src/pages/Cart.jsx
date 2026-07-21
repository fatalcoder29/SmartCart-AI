import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Layout from '../components/Layout'
import { formatPrice, getPlaceholderImage } from '../data/products'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()

  if (items.length === 0) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-20 text-center md:px-8 md:py-28">
          <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
            Your bag
          </p>
          <h1 className="mt-3 font-display text-4xl font-medium">Nothing here yet</h1>
          <p className="mt-4 text-sm text-ink-muted">
            Explore the collection and add pieces you love.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block bg-ink px-8 py-3.5 text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta"
          >
            Shop all pieces
          </Link>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16 lg:px-10">
        <p className="text-[11px] font-medium tracking-[0.28em] text-terracotta uppercase">
          Your bag
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <ul className="space-y-8 lg:col-span-2">
            {items.map((item) => (
              <li
                key={item.key}
                className="flex gap-5 border-b border-ink/10 pb-8 sm:gap-8"
              >
                <Link
                  to={`/products/${item.product.id}`}
                  className="h-32 w-24 shrink-0 overflow-hidden bg-cream-dark sm:h-40 sm:w-32 rounded-lg"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    onError={(e) => {
                      e.currentTarget.src = getPlaceholderImage(item.product.name, item.product.category)
                    }}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-display text-xl font-medium hover:text-terracotta"
                      >
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-ink-muted">Size: {item.size}</p>
                      <p className="mt-1 text-sm text-ink-muted">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.key)}
                      aria-label="Remove item"
                      className="text-ink-muted transition hover:text-terracotta"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-ink/15">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="px-3 py-2 text-ink-muted hover:text-ink"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[2rem] text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="px-3 py-2 text-ink-muted hover:text-ink"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-medium">{formatPrice(item.lineTotal)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit border border-ink/10 bg-cream-dark/40 p-6 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-medium">Order summary</h2>
            <div className="mt-6 flex justify-between text-sm">
              <span className="text-ink-muted">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm">
              <span className="text-ink-muted">Shipping</span>
              <span className="text-ink-muted">Calculated at checkout</span>
            </div>
            <div className="mt-6 flex justify-between border-t border-ink/10 pt-6 font-medium">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 block w-full bg-ink py-3.5 text-center text-[13px] font-medium tracking-wide text-cream transition hover:bg-terracotta"
            >
              Proceed to checkout
            </Link>
            <Link
              to="/products"
              className="mt-4 block text-center text-[13px] text-ink-muted underline underline-offset-4 hover:text-terracotta"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </section>
    </Layout>
  )
}
