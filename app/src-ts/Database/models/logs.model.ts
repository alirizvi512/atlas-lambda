import mongoose from 'mongoose'

const LogsSchema = new mongoose.Schema({
  fromAddress: {
    type: String,
  },

  fromSymbol: {
    type: String,
  },

  fromTokenAddress: {
    type: String,
  },

  fromChain: {
    type: Number,
  },

  fromAmount: {
    type: Number,
  },

  toAddress: {
    type: String,
  },

  toSymbol: {
    type: String,
  },

  toTokenAddress: {
    type: String,
  },

  toChain: {
    type: Number,
  },

  fromDecimals: {
    type: Number,
  },

  fromTokenUSDPrice: {
    type: Number,
  },

  minimumReceived: {
    type: Number,
  },

  slippage: {
    type: Number,
  },

  feeUSD: {
    type: Number,
  },

  type: {
    type: String,
  },

  routeName: {
    type: String,
  },

  routeInfo: {
    type: String,
  },

  logs: {
    type: [String],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  updatedAt: {
    type: Date,
    default: Date.now(),
  },

  createdAtTimestamp: {
    type: Number,
  },
})

const collectionName = 'logsv2'
export default mongoose.models.logsv2 || mongoose.model('logsv2', LogsSchema, collectionName)
