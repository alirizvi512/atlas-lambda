import mongoose from 'mongoose'

/* PoolSchema will correspond to a collection in your MongoDB database. */
const PoolsSchema = new mongoose.Schema({
  token0: {
    type: Object,
    required: [true, 'Please provide an address for this tokenMintA.'],
  },
  token1: {
    type: Object,
    required: [true, 'Please provide an address for this tokenMintB.'],
  },
  pairAddress: {
    type: String,
    required: [true, 'Please provide an pair address for this for the pool contract.'],
  },
  routerAddress: {
    type: String,
    required: [true, 'Please provide an pair address for this for the pool contract.'],
  },
  chainId: {
    type: Number,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
})

export default mongoose.models.pools || mongoose.model('pools', PoolsSchema)
