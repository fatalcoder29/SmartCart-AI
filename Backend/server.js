require('dotenv').config()
const app = require('./src/app')
const connectDB = require('./src/config/db')

const PORT = process.env.PORT || 5000

process.on('uncaughtException', (err) => {
  console.error(`[Server] Uncaught Exception: ${err.message}`)
})

// Start HTTP Server immediately — don't block on DB connection
const server = app.listen(PORT, async () => {
  console.log('')
  console.log('┌─────────────────────────────────────────────────────┐')
  console.log(`│  🚀 Server running on http://localhost:${PORT}          │`)
  console.log(`│  🏥 Health:  http://localhost:${PORT}/api/v1/health    │`)
  console.log('└─────────────────────────────────────────────────────┘')

  // Connect DB after HTTP is open
  const connected = await connectDB()
  if (connected) {
    console.log('[Server] ✅ Full stack ready — API + Database online\n')
  } else {
    console.log('[Server] ⚠️  Running without database — see DB setup above\n')
  }
})

process.on('unhandledRejection', (err) => {
  console.error(`[Server] Unhandled Rejection: ${err.message}`)
})
