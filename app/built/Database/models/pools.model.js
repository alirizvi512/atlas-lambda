"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
/* PoolSchema will correspond to a collection in your MongoDB database. */
const PoolsSchema = new mongoose_1.default.Schema({
    token0: {
        type: Object,
        required: [true, 'Please provide an address for this tokenMintA.'],
    },
    token1: {
        type: Object,
        required: [true, 'Please provide an address for this tokenMintB.'],
    },
    pairAddress: {
        type: String,
        required: [true, 'Please provide an pair address for this for the pool contract.'],
    },
    routerAddress: {
        type: String,
        required: [true, 'Please provide an pair address for this for the pool contract.'],
    },
    chainId: {
        type: Number,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
    updatedAt: {
        type: Date,
        default: new Date(),
    },
});
exports.default = mongoose_1.default.models.pools || mongoose_1.default.model('pools', PoolsSchema);
//# sourceMappingURL=pools.model.js.map