import LogsModel from './Database/models/logs.model'
import * as Web3 from 'web3';
import * as erc20 from './constants/lpToken.json';
import { SupportedChainId } from './constants/chains';
import { Liquidity } from '@raydium-io/raydium-sdk'
import { Connection } from '@solana/web3.js';
import RAYDIUM_POOL from './constants/pools';
import tokensModel from './Database/models/tokens.model';
import axios from 'axios'
import { getBscStatsQuery } from './queries'
import { PanCakeSwapSubGraphClient } from './clients/PancakeSwapSubGraphClient';


export const get24HVolume = async (token0Address: string, token1Address: string): Promise<string> => {
    try {
        const date = new Date()
        date.setDate(date.getDate() - 1)
        const oneDayVolume = await LogsModel.aggregate([
            {
                $match: {
                    createdAtTimestamp: { $gt: Math.floor(date.getTime() / 1000) },
                    type: 'SUCCESS',
                    $or: [
                        {
                            $and: [
                                { "fromTokenAddress": token0Address },
                                { "toTokenAddress": token1Address }
                            ]
                        },
                        {
                            $and: [
                                { "fromTokenAddress": token1Address },
                                { "toTokenAddress": token0Address }
                            ]
                        },
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    volume: {
                        $sum: {
                            $multiply: ['$fromAmount', '$fromTokenUSDPrice'],
                        },
                    },
                },
            },
        ])
        return oneDayVolume.length ? oneDayVolume[0].volume : 0
    } catch (err) {
        throw new Error(err.message)
    }
}

export const getLiquidity = async (pool: any) => {
    try {
        if (pool.chainId == SupportedChainId.BINANCE) {
            const url = "https://bsc-dataseed.binance.org";
            const web3 = new (Web3 as any)(url);

            const lpcontract = new web3.eth.Contract(
                erc20,
                pool.pairAddress,
            );
            const reserves = await lpcontract.methods.getReserves().call()
            return {
                reserve0: reserves._reserve0 / Math.pow(10, pool.token0.decimals),
                reserve1: reserves._reserve1 / Math.pow(10, pool.token1.decimals)
            }
        } else if (pool.chainId == SupportedChainId.RINKEBY || pool.chainId == SupportedChainId.ETHEREUM) {
            const url = pool.chainId == SupportedChainId.RINKEBY ?
                "https://eth-rinkeby.alchemyapi.io/v2/aSjJRSTQwxTGK-9f1KlGWw-E9QkdYZ9I" :
                "https://eth-mainnet.alchemyapi.io/v2/F69MBpo-FRQ7AJBqDqFA3OWNJBf3UDpw"

            const web3 = new (Web3 as any)(url);

            const lpcontract = new web3.eth.Contract(
                erc20,
                pool.pairAddress,
            );
            const reserves = await lpcontract.methods.getReserves().call()
            return {
                reserve0: reserves._reserve0 / Math.pow(10, pool.token0.decimals),
                reserve1: reserves._reserve1 / Math.pow(10, pool.token1.decimals)
            }
        } else if (pool.chainId == SupportedChainId.SOLANA) {
            const solanaConnection = new Connection("https://api.devnet.solana.com");
            const info = await Liquidity.fetchInfo({
                connection: solanaConnection,
                poolKeys: RAYDIUM_POOL
            })
            console.log(info)
            return {
                reserve0: 0,
                reserve1: 0
            }
        }
    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }
}

export const getUsdPrice = async (address: string, chainId: number) => {
    try {
        const token: any = await tokensModel.findOne({ address: address.toLowerCase(), chainId });
        return token ? token.priceUSD : null
    } catch (err) {
        throw new Error(err.message)
    }
}

export const getRaydiumStats = async (symbol: string) => {
    const raydiumResponse = await axios.get('https://api.raydium.io/v2/main/pairs')
    const raydiumPools = raydiumResponse.data
    const raydiumPool = raydiumPools.find(
        (x: any) => x.name === symbol,
    )
    console.log(raydiumPool, symbol)
    if (raydiumPool) {
        return {
            liquidity: raydiumPool.liquidity,
            volume: raydiumPool.volume7d,
            apr: raydiumPool.apr7d,
        }
    }
}

export const getBscStats = async (address: String) => {
    const pancakeswapSubGraphClient = PanCakeSwapSubGraphClient.getSubGraphClient();
    const { data } = await pancakeswapSubGraphClient.query(getBscStatsQuery, {
        address: address
    });
    console.log(data)
    return data.pairs[0];
}