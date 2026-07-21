import { useState } from 'react'
import { User, Package, MapPin, CreditCard, CheckCircle2, Truck, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../data/products'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const mockUserOrders = [
  {
    id: 'ORD-8849',
    date: 'July 18, 2026',
    total: 420,
    status: 'Shipped',
    trackingNumber: 'SE-920194821',
    estimatedDelivery: 'July 23, 2026',
    items: [
      {
        name: 'Oslo Wool Coat',
        size: 'M',
        price: 420,
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d9f232?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
  {
    id: 'ORD-7712',
    date: 'June 02, 2026',
    total: 284,
    status: 'Delivered',
    trackingNumber: 'SE-881290311',
    estimatedDelivery: 'Delivered on June 06',
    items: [
      {
        name: 'Cashmere Crew',
        size: 'L',
        price: 186,
        image: 'https://images.unsplash.com/photo-1620799140188-3b2a26155178?auto=format&fit=crop&w=400&q=80',
      },
      {
        name: 'Merino Scarf',
        size: 'One size',
        price: 98,
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=400&q=80',
      },
    ],
  },
]

export default function Profile() {
  const { user } = useAuth()
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Customer',
    email: user?.email || 'user@example.com',
    phone: '+47 912 34 567',
    address: 'Karl Johans gate 14, 0154 Oslo, Norway',
  })
  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'settings'
  const [selectedOrderTracking, setSelectedOrderTracking] = useState(null)

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-12 md:px-8 lg:px-10">
        {/* User Banner */}
        <div className="flex flex-col gap-6 rounded-3xl border border-ink/10 bg-cream/70 p-8 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink text-2xl font-display font-medium text-cream shadow-md">
              {profileData.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-[11px] font-semibold text-terracotta tracking-wider uppercase">
                Member Account
              </span>
              <h1 className="font-display text-2xl md:text-3xl">{profileData.name}</h1>
              <p className="text-xs text-ink-muted">{profileData.email}</p>
            </div>
          </div>
          <div className="flex gap-3 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`rounded-full px-5 py-2.5 font-medium transition ${
                activeTab === 'orders'
                  ? 'bg-ink text-cream'
                  : 'border border-ink/10 bg-cream text-ink hover:bg-cream-dark'
              }`}
            >
              Order History
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`rounded-full px-5 py-2.5 font-medium transition ${
                activeTab === 'settings'
                  ? 'bg-ink text-cream'
                  : 'border border-ink/10 bg-cream text-ink hover:bg-cream-dark'
              }`}
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Tab: Order History */}
        {activeTab === 'orders' && (
          <section className="mt-10 space-y-6">
            <h2 className="font-display text-2xl">Your Purchases ({mockUserOrders.length})</h2>

            <div className="space-y-6">
              {mockUserOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-ink/10 bg-cream/50 p-6 backdrop-blur-sm transition hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
                    <div>
                      <span className="font-mono text-xs font-semibold text-ink">{order.id}</span>
                      <span className="ml-3 text-xs text-ink-muted">Placed on {order.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-blue-500/10 text-blue-600'
                        }`}
                      >
                        {order.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderTracking(order)}
                        className="flex items-center gap-1 text-xs font-medium text-terracotta hover:underline"
                      >
                        Track Shipment <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-4 divide-y divide-ink/5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-display text-sm font-medium">{item.name}</h4>
                          <span className="text-xs text-ink-muted">Size: {item.size}</span>
                        </div>
                        <span className="font-medium text-xs text-ink">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4 text-xs">
                    <span className="text-ink-muted">Estimated Delivery: {order.estimatedDelivery}</span>
                    <span className="font-semibold text-sm text-ink">
                      Total: {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tab: Account Settings Form */}
        {activeTab === 'settings' && (
          <section className="mt-10 max-w-2xl rounded-2xl border border-ink/10 bg-cream/50 p-8 backdrop-blur-sm">
            <h2 className="font-display text-2xl">Personal Information</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                alert('Profile settings saved successfully!')
              }}
              className="mt-6 space-y-5 text-xs"
            >
              <div>
                <label className="block font-medium text-ink mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Shipping Address</label>
                <textarea
                  rows={3}
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-xs focus:border-terracotta focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-4 rounded-full bg-ink px-8 py-3 font-medium text-cream hover:bg-terracotta transition"
              >
                Save Changes
              </button>
            </form>
          </section>
        )}

        {/* Live Order Tracking Modal */}
        {selectedOrderTracking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-3xl border border-ink/10 bg-cream p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <div>
                  <h3 className="font-display text-xl">Shipment Tracker</h3>
                  <span className="font-mono text-xs text-ink-muted">
                    Tracking #{selectedOrderTracking.trackingNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderTracking(null)}
                  className="rounded-full p-1 text-ink-muted hover:bg-cream-dark"
                >
                  ✕
                </button>
              </div>

              {/* Progress Timeline */}
              <div className="mt-8 space-y-6 px-4">
                <div className="relative flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-cream">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">Order Confirmed</h4>
                    <span className="text-[11px] text-ink-muted">Payment verified & processing</span>
                  </div>
                </div>

                <div className="relative flex items-center gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-cream">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">In Transit (DHL Express)</h4>
                    <span className="text-[11px] text-ink-muted">Departed Oslo Sorting Hub</span>
                  </div>
                </div>

                <div className="relative flex items-center gap-4 opacity-50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink/20 text-ink">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">Out for Delivery</h4>
                    <span className="text-[11px] text-ink-muted">Expected {selectedOrderTracking.estimatedDelivery}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-cream-dark/50 p-4 text-center text-xs">
                <span className="text-ink-muted block">Courier Service: DHL Express Europe</span>
                <span className="font-medium text-ink mt-1 block">Live GPS updates synced with order portal</span>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
