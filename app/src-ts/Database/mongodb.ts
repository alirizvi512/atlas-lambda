import mongoose from 'mongoose'

const MONGODB_URI = 'mongodb+srv://atlasdex:UpPryjCbZVHEHyTP@cluster0.e7k96.mongodb.net/atlasdex?retryWrites=true&w=majority&ssl=true'//process.env.MONGODB_URI
const globalAny: any = global

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI variable')
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalAny.mongoose

if (!cached) {
  cached = globalAny.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect
