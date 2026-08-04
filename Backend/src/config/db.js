const mongoose = require('mongoose')
const dns = require('dns')

// Set Google & Cloudflare DNS servers to resolve MongoDB Atlas SRV records reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch (e) {
  // Ignore DNS override errors if in restricted environment
}

let _mongoServer = null

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || ''

  // If Atlas URI is provided, use it directly
  if (mongoURI && mongoURI.includes('mongodb+srv')) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 15000,
      })
      console.log(`[MongoDB] ✅ Atlas Connected: ${conn.connection.name}@${conn.connection.host}`)
      return true
    } catch (error) {
      console.error(`[MongoDB] ❌ Atlas Connection Failed: ${error.message}`)
      console.log('[MongoDB] 💡 Check: username, password, IP whitelist (Add 0.0.0.0/0) at cloud.mongodb.com')
      return false
    }
  }

  // Local URI — try direct connection first (if mongod is running)
  if (mongoURI && !mongoURI.includes('mongodb+srv')) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 3000,
      })
      console.log(`[MongoDB] ✅ Local Connected: ${conn.connection.name}@${conn.connection.host}`)
      return true
    } catch {
      // Local mongod not running
    }
  }

  // Fallback: mongodb-memory-server
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server')
    if (!_mongoServer) {
      console.log('[MongoDB] 🔄 Starting In-Memory MongoDB...')
      _mongoServer = await MongoMemoryServer.create()
    }
    const uri = _mongoServer.getUri()
    const conn = await mongoose.connect(uri)
    console.log(`[MongoDB] ✅ In-Memory DB started: ${conn.connection.name}`)
    return true
  } catch {
    console.error('[MongoDB] ❌ Connection failed.')
    printSetupGuide()
    return false
  }
}

function printSetupGuide() {
  console.log('')
  console.log('╔════════════════════════════════════════════════════════════════╗')
  console.log('║           DATABASE SETUP REQUIRED — Choose One Option          ║')
  console.log('╠════════════════════════════════════════════════════════════════╣')
  console.log('║  OPTION A: MongoDB Atlas (Free Cloud — Recommended)            ║')
  console.log('║  1. Go to: https://www.mongodb.com/atlas/database              ║')
  console.log('║  2. Security > Network Access > Add 0.0.0.0/0                  ║')
  console.log('║  3. Paste connection string into Backend/.env                   ║')
  console.log('╚════════════════════════════════════════════════════════════════╝')
  console.log('')
}

module.exports = connectDB
