import { useState } from 'react'
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  Edit,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react'
import { products as initialProducts, formatPrice } from '../data/products'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const mockOrders = [
  {
    id: 'ORD-9821',
    customer: 'Sophia Lindqvist',
    email: 'sophia@example.com',
    date: '2026-07-20',
    total: 420,
    items: 1,
    status: 'Shipped',
  },
  {
    id: 'ORD-9822',
    customer: 'Lars Berg',
    email: 'lars@example.com',
    date: '2026-07-21',
    total: 372,
    items: 2,
    status: 'Processing',
  },
  {
    id: 'ORD-9823',
    customer: 'Elena Rostova',
    email: 'elena@example.com',
    date: '2026-07-21',
    total: 245,
    items: 1,
    status: 'Delivered',
  },
  {
    id: 'ORD-9824',
    customer: 'Oliver Hansen',
    email: 'oliver@example.com',
    date: '2026-07-21',
    total: 186,
    items: 1,
    status: 'Pending',
  },
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products') // 'products' | 'orders' | 'analytics'
  const [productList, setProductList] = useState(initialProducts)
  const [orders, setOrders] = useState(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // New product state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'outerwear',
    image: '',
    description: '',
    stock: 15,
  })

  function handleAddProduct(e) {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) return

    const productToAdd = {
      id: `custom-${Date.now()}`,
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      tag: 'New',
      image:
        newProduct.image ||
        'https://images.unsplash.com/photo-1591047139829-d91aecb6aae4?auto=format&fit=crop&w=800&q=80',
      description: newProduct.description || 'Premium Scandinavian design item.',
      details: ['100% Quality inspected', 'Hand-finished'],
      sizes: ['S', 'M', 'L'],
    }

    setProductList([productToAdd, ...productList])
    setIsAddModalOpen(false)
    setNewProduct({
      name: '',
      price: '',
      category: 'outerwear',
      image: '',
      description: '',
      stock: 15,
    })
  }

  function handleDeleteProduct(id) {
    setProductList(productList.filter((p) => p.id !== id))
  }

  function handleUpdateOrderStatus(orderId, newStatus) {
    setOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    )
  }

  const filteredProducts = productList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <Navbar />
      <main className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-8 lg:px-10">
        {/* Header Banner */}
        <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
                Admin Control Center
              </span>
              <span className="text-xs text-ink-muted">July 2026</span>
            </div>
            <h1 className="font-display mt-2 text-3xl md:text-4xl">Store Management & AI Insights</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-medium text-cream shadow-md transition hover:bg-terracotta"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </button>
        </div>

        {/* KPI Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-cream/70 p-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted">Total Revenue</span>
              <div className="rounded-full bg-emerald-500/10 p-2.5 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display mt-4 text-3xl font-medium">€14,890</p>
            <span className="mt-1 block text-[11px] text-emerald-600">↑ 18.4% from last month</span>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-cream/70 p-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted">Active Orders</span>
              <div className="rounded-full bg-blue-500/10 p-2.5 text-blue-600">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display mt-4 text-3xl font-medium">{orders.length}</p>
            <span className="mt-1 block text-[11px] text-blue-600">4 awaiting dispatch</span>
          </div>

          <div className="rounded-2xl border border-ink/10 bg-cream/70 p-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink-muted">Inventory Catalog</span>
              <div className="rounded-full bg-purple-500/10 p-2.5 text-purple-600">
                <Package className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display mt-4 text-3xl font-medium">{productList.length}</p>
            <span className="mt-1 block text-[11px] text-purple-600">All items synced</span>
          </div>

          <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-6 backdrop-blur-sm shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-terracotta">AI Conversion Rate</span>
              <div className="rounded-full bg-terracotta/10 p-2.5 text-terracotta">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
            <p className="font-display mt-4 text-3xl font-medium">34.2%</p>
            <span className="mt-1 block text-[11px] text-terracotta">+12% via AI Stylist</span>
          </div>
        </div>

        {/* AI Business Insights Banner */}
        <div className="mt-8 rounded-2xl border border-ink/10 bg-ink p-6 text-cream">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-terracotta p-3 text-cream">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-medium">AI Inventory & Sales Demand Forecast</h3>
              <p className="mt-1 text-xs text-cream/70 leading-relaxed">
                Our recommendation engine forecasts high demand for <strong>Outerwear & Knitwear</strong> during the upcoming autumn transition. Low stock detected for <em>Oslo Wool Coat</em>. We recommend increasing stock reserves by 25%.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-10 flex items-center justify-between border-b border-ink/10 pb-4">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === 'products'
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Products Management ({productList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`pb-2 text-sm font-medium transition ${
                activeTab === 'orders'
                  ? 'border-b-2 border-terracotta text-terracotta'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Order Processing ({orders.length})
            </button>
          </div>

          {activeTab === 'products' && (
            <div className="relative w-64">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-ink-muted" />
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-ink/10 bg-cream pl-9 pr-4 py-1.5 text-xs focus:border-terracotta focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Products Management View */}
        {activeTab === 'products' && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-cream/50 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ink/10 bg-cream-dark/60 text-ink-muted uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="transition hover:bg-cream-dark/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-medium text-ink block">{p.name}</span>
                          <span className="text-[10px] text-ink-muted">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-ink-muted">{p.category}</td>
                    <td className="px-6 py-4 font-semibold text-ink">{formatPrice(p.price)}</td>
                    <td className="px-6 py-4 font-medium text-ink">18 units</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                        In Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id)}
                        className="rounded-lg p-2 text-ink-muted transition hover:bg-terracotta/10 hover:text-terracotta"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Orders Processing View */}
        {activeTab === 'orders' && (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-cream/50 shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ink/10 bg-cream-dark/60 text-ink-muted uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {orders.map((o) => (
                  <tr key={o.id} className="transition hover:bg-cream-dark/30">
                    <td className="px-6 py-4 font-mono font-medium text-ink">{o.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-medium text-ink block">{o.customer}</span>
                        <span className="text-[10px] text-ink-muted">{o.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">{o.date}</td>
                    <td className="px-6 py-4 font-semibold text-ink">{formatPrice(o.total)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : o.status === 'Shipped'
                            ? 'bg-blue-500/10 text-blue-600'
                            : o.status === 'Processing'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-rose-500/10 text-rose-600'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        className="rounded-lg border border-ink/10 bg-cream px-3 py-1 text-xs focus:border-terracotta focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-ink/10 bg-cream p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-ink/10 pb-4">
                <h3 className="font-display text-xl">Add Product to Inventory</h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-full p-1 text-ink-muted hover:bg-cream-dark"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-ink mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nordic Wool Trench"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-cream-dark/30 px-4 py-2.5 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-ink mb-1">Price (€)</label>
                    <input
                      type="number"
                      required
                      placeholder="299"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full rounded-xl border border-ink/10 bg-cream-dark/30 px-4 py-2.5 focus:border-terracotta focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-ink mb-1">Category</label>
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full rounded-xl border border-ink/10 bg-cream-dark/30 px-4 py-2.5 focus:border-terracotta focus:outline-none capitalize"
                    >
                      <option value="outerwear">Outerwear</option>
                      <option value="knitwear">Knitwear</option>
                      <option value="leather">Leather</option>
                      <option value="footwear">Footwear</option>
                      <option value="objects">Objects</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-cream-dark/30 px-4 py-2.5 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide materials, fit guide, and details..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full rounded-xl border border-ink/10 bg-cream-dark/30 px-4 py-2.5 focus:border-terracotta focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 rounded-full border border-ink/10 py-3 font-medium text-ink hover:bg-cream-dark"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-ink py-3 font-medium text-cream hover:bg-terracotta"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
