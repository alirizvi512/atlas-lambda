"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LogsSchema = new mongoose_1.default.Schema({
    fromAddress: {
        type: String,
    },
    fromSymbol: {
        type: String,
    },
    fromTokenAddress: {
        type: String,
    },
    fromChain: {
        type: Number,
    },
    fromAmount: {
        type: Number,
    },
    toAddress: {
        type: String,
    },
    toSymbol: {
        type: String,
    },
    toTokenAddress: {
        type: String,
    },
    toChain: {
        type: Number,
    },
    fromDecimals: {
        type: Number,
    },
    fromTokenUSDPrice: {
        type: Number,
    },
    minimumReceived: {
        type: Number,
    },
    slippage: {
        type: Number,
    },
    feeUSD: {
        type: Number,
    },
    type: {
        type: String,
    },
    routeName: {
        type: String,
    },
    routeInfo: {
        type: String,
    },
    logs: {
        type: [String],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    createdAtTimestamp: {
        type: Number,
    },
});
const collectionName = 'logsv2';
exports.default = mongoose_1.default.models.logsv2 || mongoose_1.default.model('logsv2', LogsSchema, collectionName);
//# sourceMappingURL=logs.model.js.map