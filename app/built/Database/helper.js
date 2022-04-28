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
exports.getLiquidity = exports.get24HVolume = void 0;
const logs_model_1 = __importDefault(require("./models/logs.model"));
const axios_1 = __importDefault(require("axios"));
const Web3 = __importStar(require("web3"));
const Multicall_json_1 = __importDefault(require("../constants/Multicall.json"));
const lpToken_json_1 = __importDefault(require("../constants/lpToken.json"));
const abi_1 = require("@ethersproject/abi");
const get24HVolume = async (token0Address, token1Address) => {
    try {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        const oneDayVolume = await logs_model_1.default.aggregate([
            {
                $match: {
                    createdAtTimestamp: { $gt: Math.floor(date.getTime() / 1000) },
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
const getLiquidity = async (pairAddress, token0, token1, chainId) => {
    try {
        if (chainId == 56) {
            const url = `https://api.bscscan.com/api?module=contract&action=getabi&address=${pairAddress}&apikey=SRJQZNN3WZI95Y5HA9VY9YDYUZ15V3E1JM`;
            const response = await axios_1.default.get(url);
        }
        else if (chainId == 4) {
            // const url = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${pairAddress}&apikey=9PKZKXYM2M1MB5V98SBQEKEAS8M23WGG6J`;
            // const response: any = await axios.get(url);
            // const abi = JSON.parse(response.data.result)
            const web3 = new Web3('https://apis.ankr.com/64529183750d42448f48d857a9bf30ba/f004b8b5ad5cfe05821142b30ca6375a/eth/fast/main');
            // const Contract = new web3.eth.Contract(abi, pairAddress);
            // const reserves = Contract.methods.getReserves();
            const calls = [
                // Balance of token in the LP contract
                {
                    address: token0,
                    name: "balanceOf",
                    params: [pairAddress],
                },
                // Balance of quote token on LP contract
                {
                    address: token1,
                    name: "balanceOf",
                    params: [pairAddress],
                },
                // Balance of LP tokens in the token1 for total supply
                {
                    address: pairAddress,
                    name: "balanceOf",
                    params: [token0],
                },
                // Total supply of LP tokens
                {
                    address: pairAddress,
                    name: "totalSupply",
                },
                // Token decimals
                {
                    address: token0,
                    name: "decimals",
                },
                // Quote token decimals
                {
                    address: token1,
                    name: "decimals",
                },
                {
                    address: pairAddress,
                    name: "getReserves",
                },
                {
                    address: token0,
                    name: "totalSupply",
                },
            ];
            const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenLiquidity, lpTotalSupply, tokenDecimals, quoteTokenDecimals, getReserves, token0TotalSupply] = await multicall(lpToken_json_1.default, calls, web3, '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821');
            const totalLiquidity = getReserves._reserve1;
            console.log(totalLiquidity);
        }
        else if (chainId == 101) {
            // const connection = new web3.Connection("https://api.devnet.solana.com");
            // const info = await Liquidity.fetchInfo({
            //     connection: connection,
            //     poolKeys: RAYDIUM_POOL,
            // })
            // console.log(info)
        }
    }
    catch (err) {
        console.log('here');
        console.log(err);
        throw new Error(err.message);
    }
};
exports.getLiquidity = getLiquidity;
// const multicall = async (chainId: number,abi: any[], calls: Call[]) => {
//     const web3 = new Web3('https://apis.ankr.com/64529183750d42448f48d857a9bf30ba/f004b8b5ad5cfe05821142b30ca6375a/eth/fast/main')
//     const multi = new web3.eth.Contract((MultiCallAbi as unknown) as AbiItem, '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821')
//     const itf = new Interface(abi)
//     const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
//     const { returnData } = await multi.methods.aggregate(calldata).call()
//     const res = returnData.map((call: any, i: any) => itf.decodeFunctionResult(calls[i].name, call))
//     return res
//   }
const multicall = async (abi, calls, web3, multiCallAddress) => {
    const multi = new web3.eth.Contract(Multicall_json_1.default, multiCallAddress);
    const itf = new abi_1.Interface(abi);
    const calldata = calls.map((call) => [
        call.address.toLowerCase(),
        itf.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await multi.methods.aggregate(calldata).call();
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call));
    return res;
};
//# sourceMappingURL=helper.js.map