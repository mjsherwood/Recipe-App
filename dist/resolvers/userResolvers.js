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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../database");
const mongodb_1 = require("mongodb");
function isWithId(obj) {
    return obj && obj._id !== undefined;
}
const userResolvers = {
    Query: {
        users: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const users = yield db.collection('users').find().toArray();
                console.log('Users fetched:', users); // Log statement
                return users.map(user => (Object.assign(Object.assign({}, user), { id: user._id.toString() })));
            }
            catch (error) {
                console.error('Error fetching users:', error);
                throw new Error('Error fetching users');
            }
        }),
        user: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const user = yield db.collection('users').findOne({ _id: new mongodb_1.ObjectId(args.id) });
                if (!user) {
                    console.error('User not found');
                    throw new Error('User not found');
                }
                return Object.assign(Object.assign({}, user), { id: user._id.toString() });
            }
            catch (error) {
                console.error('Error fetching user:', error);
                throw new Error('Error fetching user');
            }
        }),
    },
    Mutation: {
        addUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(args);
            try {
                const db = (0, database_1.getDb)();
                const result = yield db.collection('users').insertOne(args.input);
                if (!result.insertedId) {
                    throw new Error('Failed to insert user');
                }
                const newUser = yield db.collection('users').findOne({ _id: result.insertedId });
                if (!newUser) {
                    throw new Error('Inserted user not found');
                }
                return Object.assign(Object.assign({}, newUser), { id: newUser._id.toString() });
            }
            catch (error) {
                console.error('Error adding user:', error);
                throw new Error('Error adding user');
            }
        }),
        updateUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const updateArgs = Object.assign({}, args.input);
                const result = yield db.collection('users').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: updateArgs }, { returnDocument: 'after' });
                const updatedUser = (result === null || result === void 0 ? void 0 : result.value) || result;
                if (!isWithId(updatedUser)) {
                    console.error('User not found or update failed: No additional error information');
                    throw new Error('User not found or update failed');
                }
                return Object.assign(Object.assign({}, updatedUser), { id: updatedUser._id.toString() });
            }
            catch (error) {
                console.error('Error updating user:', error);
                throw new Error('Error updating user');
            }
        }),
        deleteUser: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const userId = new mongodb_1.ObjectId(args.id);
                const existingUser = yield db.collection('users').findOne({ _id: userId });
                if (!existingUser) {
                    throw new Error('User not found');
                }
                yield db.collection('users').findOneAndDelete({ _id: userId });
                return Object.assign(Object.assign({}, existingUser), { id: existingUser._id.toString() });
            }
            catch (error) {
                console.error('Error deleting user:', error);
                throw new Error('Error deleting user');
            }
        }),
    }
};
exports.default = userResolvers;
