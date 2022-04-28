"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get24HVolume = void 0;
const logs_model_1 = __importDefault(require("./models/logs.model"));
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
//# sourceMappingURL=dbHelper.js.map