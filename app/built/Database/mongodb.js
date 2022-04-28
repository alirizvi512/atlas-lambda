"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = 'mongodb+srv://atlasdex:UpPryjCbZVHEHyTP@cluster0.e7k96.mongodb.net/atlasdex?retryWrites=true&w=majority&ssl=true'; //process.env.MONGODB_URI
const globalAny = global;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI variable');
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = globalAny.mongoose;
if (!cached) {
    cached = globalAny.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose_1.default.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
exports.default = dbConnect;
//# sourceMappingURL=mongodb.js.map