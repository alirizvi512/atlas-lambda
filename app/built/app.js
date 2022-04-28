"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandler = void 0;
const mongodb_1 = __importDefault(require("./Database/mongodb"));
const helper_1 = require("./helper");
const pools_model_1 = __importDefault(require("./Database/models/pools.model"));
const lambdaHandler = async () => {
    try {
        await (0, mongodb_1.default)();
        const pools = await pools_model_1.default.find({});
        for (const pool of pools) {
            const raydiumStats = await (0, helper_1.getRaydiumStats)(`${pool.token0.symbol}-${pool.token1.symbol}`);
            await pools_model_1.default.updateOne({
                address: pool.pairAddress,
            }, {
                apr: raydiumStats.apr,
                liquidity: raydiumStats.liquidity,
                volume: raydiumStats.volume
            }, {
                upsert: true
            });
        }
        return 'Success';
    }
    catch (err) {
        console.log(err.message);
        return 'error';
    }
};
exports.lambdaHandler = lambdaHandler;
//# sourceMappingURL=app.js.map