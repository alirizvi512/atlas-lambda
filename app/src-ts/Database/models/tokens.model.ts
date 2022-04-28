import mongoose from 'mongoose'

const TokensSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  symbol: {
    type: String,
  },

  coinGeckoId: {
    type: String,
  },

  cmcId: {
    type: Number,
  },

  address: {
    type: String,
  },

  priceUSD: {
    type: Number,
  },

  network: {
    type: String,
  },

  oneDayChange: {
    type: Number,
  },

  fourteenDaysChange: {
    type: Number,
  },

  thirtyDaysChange: {
    type: Number,
  },

  allTimeHigh: {
    type: Number,
  },

  allTimeLow: {
    type: Number,
  },

  oneDayHigh: {
    type: Number,
  },

  oneDayLow: {
    type: Number,
  },

  totalSupply: {
    type: Number,
  },

  tradeVolumeUSD: {
    type: Number,
  },

  dayVolumeUSD: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  updatedAt: {
    type: Date,
    default: Date.now(),
  },
})

const collectionName = 'tokens'
export default mongoose.models.tokens || mongoose.model('tokens', TokensSchema, collectionName)
