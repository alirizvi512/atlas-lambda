import dbConnect from './Database/mongodb';
import { get24HVolume, getLiquidity, getRaydiumStats, getUsdPrice } from './helper';
import poolsModel from './Database/models/pools.model';
import poolStatsModel from './Database/models/pool.stats.model';

export const lambdaHandler = async (
): Promise<string> => {
  try {
    await dbConnect()
    const pools = await poolsModel.find({});

    for (const pool of pools) {
      const raydiumStats = await getRaydiumStats(`${pool.token0.symbol}-${pool.token1.symbol}`)
      await poolsModel.updateOne(
        {
          address: pool.pairAddress,
        },
        {
          apr: raydiumStats.apr,
          liquidity: raydiumStats.liquidity,
          volume: raydiumStats.volume
        },
        {
          upsert: true
        }
      )
    }

    return 'Success'
  } catch (err) {
    console.log(err.message)
    return 'error'
  }
}