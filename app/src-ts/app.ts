import dbConnect from './Database/mongodb';
import { get24HVolume, getBscStats, getLiquidity, getRaydiumStats, getUsdPrice } from './helper';
import poolsModel from './Database/models/pools.model';

export const lambdaHandler = async (
): Promise<string> => {
  try {
    await dbConnect()
    const pools = await poolsModel.find({});

    for (const pool of pools) {
      if (pool.chainId == 101) {
        const raydiumStats = await getRaydiumStats(`${pool.token0.symbol}-${pool.token1.symbol}`)
        await poolsModel.updateOne(
          {
            pairAddress: pool.pairAddress,
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
      } else if (pool.chainId == 56) {
        const data = await getBscStats(pool.pairAddress);
        if (data) {
          await poolsModel.updateOne(
            {
              pairAddress: pool.pairAddress,
            },
            {
              apr: data.apr || 0,
              liquidity: data.reserveUSD || 0,
              volume: data.volumeUSD || 0
            },
            {
              upsert: true
            }
          )
        }
      } else if (pool.chainId == 1 || pool.chainId == 4) {
        const volume = await get24HVolume(pool.token0.address, pool.token1.address);
        const { reserve0, reserve1 } = await getLiquidity(pool);
        const token0Price = await getUsdPrice(pool.token0.address, pool.chainId);
        const token1Price = await getUsdPrice(pool.token1.address, pool.chainId);
        if (token0Price && token1Price) {
          await poolsModel.updateOne(
            {
              pairAddress: pool.pairAddress,
            },
            {
              apr: 0,
              liquidity: reserve0 * token0Price + reserve0 * token1Price,
              volume
            },
            {
              upsert: true
            }
          )
        }
      }

    }

    return 'Success'
  } catch (err) {
    console.log(err.message)
    return 'error'
  }
}