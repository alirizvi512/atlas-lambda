import mongoose from 'mongoose'

const PoolStatsSchema = new mongoose.Schema({

  address: {
    type: String
  },

  token0Liquidity: {
    type: Number
  },
  token1Liquidity: {
    type: Number
  },

  twentyFourHourVolume: {
    type: Number
  },

  apr: {
    type: Number
  },
  
  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

const collectionName = 'poolStats'
export default mongoose.models.poolStats || mongoose.model('poolStats', PoolStatsSchema, collectionName)
