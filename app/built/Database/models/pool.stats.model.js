"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PoolStatsSchema = new mongoose_1.default.Schema({
    address: {
        type: String
    },
    token0Liquidity: {
        type: Number
    },
    token1Liquidity: {
        type: Number
    },
    twentyFourHourVolume: {
        type: Number
    },
    apr: {
        type: Number
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
const collectionName = 'poolStats';
exports.default = mongoose_1.default.models.poolStats || mongoose_1.default.model('poolStats', PoolStatsSchema, collectionName);
//# sourceMappingURL=pool.stats.model.js.map