"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRaydiumStats = exports.getUsdPrice = exports.getLiquidity = exports.get24HVolume = void 0;
const logs_model_1 = __importDefault(require("./Database/models/logs.model"));
const Web3 = __importStar(require("web3"));
const erc20 = __importStar(require("./constants/lpToken.json"));
const chains_1 = require("./constants/chains");
const raydium_sdk_1 = require("@raydium-io/raydium-sdk");
const web3_js_1 = require("@solana/web3.js");
const pools_1 = __importDefault(require("./constants/pools"));
const tokens_model_1 = __importDefault(require("./Database/models/tokens.model"));
const axios_1 = __importDefault(require("axios"));
const get24HVolume = async (token0Address, token1Address) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const oneDayVolume = await logs_model_1.default.aggregate([
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
        ]);
        return oneDayVolume.length ? oneDayVolume[0].volume : 0;
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.get24HVolume = get24HVolume;
const getLiquidity = async (pool) => {
    try {
        if (pool.chainId == chains_1.SupportedChainId.BINANCE) {
            const url = "https://bsc-dataseed.binance.org";
            const web3 = new Web3(url);
            const lpcontract = new web3.eth.Contract(erc20, pool.pairAddress);
            const reserves = await lpcontract.methods.getReserves().call();
            return {
                reserve0: reserves._reserve0 / Math.pow(10, pool.token0.decimals),
                reserve1: reserves._reserve1 / Math.pow(10, pool.token1.decimals)
            };
        }
        else if (pool.chainId == chains_1.SupportedChainId.RINKEBY || pool.chainId == chains_1.SupportedChainId.ETHEREUM) {
            const url = pool.chainId == chains_1.SupportedChainId.RINKEBY ?
                "https://eth-rinkeby.alchemyapi.io/v2/aSjJRSTQwxTGK-9f1KlGWw-E9QkdYZ9I" :
                "https://eth-mainnet.alchemyapi.io/v2/F69MBpo-FRQ7AJBqDqFA3OWNJBf3UDpw";
            const web3 = new Web3(url);
            const lpcontract = new web3.eth.Contract(erc20, pool.pairAddress);
            const reserves = await lpcontract.methods.getReserves().call();
            return {
                reserve0: reserves._reserve0 / Math.pow(10, pool.token0.decimals),
                reserve1: reserves._reserve1 / Math.pow(10, pool.token1.decimals)
            };
        }
        else if (pool.chainId == chains_1.SupportedChainId.SOLANA) {
            const solanaConnection = new web3_js_1.Connection("https://api.devnet.solana.com");
            const info = await raydium_sdk_1.Liquidity.fetchInfo({
                connection: solanaConnection,
                poolKeys: pools_1.default
            });
            console.log(info);
            return {
                reserve0: 0,
                reserve1: 0
            };
        }
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};
exports.getLiquidity = getLiquidity;
const getUsdPrice = async (address, chainId) => {
    try {
        const token = await tokens_model_1.default.findOne({ address: address.toLowerCase(), chainId });
        return token ? token.priceUSD : 1;
    }
    catch (err) {
        throw new Error(err.message);
    }
};
exports.getUsdPrice = getUsdPrice;
const getRaydiumStats = async (symbol) => {
    const raydiumResponse = await axios_1.default.get('https://api.raydium.io/v2/main/pairs');
    const raydiumPools = raydiumResponse.data;
    const raydiumPool = raydiumPools.find((x) => x.name === symbol);
    console.log(raydiumPool, symbol);
    if (raydiumPool) {
        return {
            liquidity: raydiumPool.liquidity,
            volume: raydiumPool.volume7d,
            apr: raydiumPool.apr7d,
        };
    }
};
exports.getRaydiumStats = getRaydiumStats;
//# sourceMappingURL=helper.js.map