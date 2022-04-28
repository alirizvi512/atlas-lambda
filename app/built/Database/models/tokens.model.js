"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TokensSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
    },
    symbol: {
        type: String,
    },
    coinGeckoId: {
        type: String,
    },
    cmcId: {
        type: Number,
    },
    address: {
        type: String,
    },
    priceUSD: {
        type: Number,
    },
    network: {
        type: String,
    },
    oneDayChange: {
        type: Number,
    },
    fourteenDaysChange: {
        type: Number,
    },
    thirtyDaysChange: {
        type: Number,
    },
    allTimeHigh: {
        type: Number,
    },
    allTimeLow: {
        type: Number,
    },
    oneDayHigh: {
        type: Number,
    },
    oneDayLow: {
        type: Number,
    },
    totalSupply: {
        type: Number,
    },
    tradeVolumeUSD: {
        type: Number,
    },
    dayVolumeUSD: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});
const collectionName = 'tokens';
exports.default = mongoose_1.default.models.tokens || mongoose_1.default.model('tokens', TokensSchema, collectionName);
//# sourceMappingURL=tokens.model.js.map