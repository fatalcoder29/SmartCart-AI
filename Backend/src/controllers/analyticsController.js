const asyncHandler = require('../utils/asyncHandler')
const Order = require('../models/Order')
const Product = require('../models/Product')
const User = require('../models/User')

// @desc    Get Admin Dashboard KPI Overview Analytics
// @route   GET /api/v1/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = asyncHandler(async (req, res) => {
  // Total Revenue from Paid orders
  const revenueData = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
  ])
  const totalRevenue = revenueData[0]?.totalRevenue || 0

  // Total Orders & Status Count
  const totalOrders = await Order.countDocuments()
  const paidOrders = await Order.countDocuments({ isPaid: true })
  const pendingOrders = await Order.countDocuments({ status: 'Pending' })

  // Customer Count
  const totalUsers = await User.countDocuments({ role: 'user' })

  // Product Inventory Stats
  const totalProducts = await Product.countDocuments()
  const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } })

  // Recent 5 Orders
  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5)

  // Monthly Sales Chart Data (Last 6 Months)
  const monthlySales = await Order.aggregate([
    { $match: { isPaid: true } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$totalPrice' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  res.status(200).json({
    success: true,
    analytics: {
      totalRevenue,
      totalOrders,
      paidOrders,
      pendingOrders,
      totalUsers,
      totalProducts,
      lowStockProducts,
      recentOrders,
      monthlySales,
    },
  })
})

module.exports = {
  getDashboardAnalytics,
}
