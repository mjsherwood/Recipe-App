"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = exports.initDb = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: './backend/src/.env' });
console.log('Current working directory:', process.cwd());
let db;
const MONGO_URI = process.env.MONGODB_URI || '';
if (!MONGO_URI) {
    console.error('Missing MONGODB_URI');
}
else {
    console.log('Connecting to MongoDB');
}
const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (db) {
        console.log('DB is already initialized!');
        return db;
    }
    try {
        const client = yield mongodb_1.MongoClient.connect(MONGO_URI);
        db = client.db();
        console.log('Connected to MongoDB');
        return db;
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
});
exports.initDb = initDb;
const getDb = () => {
    if (!db) {
        console.error('DB not initialized');
        throw new Error('Db not initialized');
    }
    return db;
};
exports.getDb = getDb;
