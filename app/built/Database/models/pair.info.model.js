"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PairInfoSchema = new mongoose_1.default.Schema({
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
    createdAtTimestamp: {
        type: Number,
    },
});
const collectionName = 'pairInfo';
exports.default = mongoose_1.default.models.logsv2 || mongoose_1.default.model('pairInfo', PairInfoSchema, collectionName);
//# sourceMappingURL=pair.info.model.js.map