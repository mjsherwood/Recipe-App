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
const recipeResolvers = {
    Query: {
        recipes: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const recipes = yield db.collection('recipes').find().toArray();
                return recipes.map(recipe => (Object.assign(Object.assign({}, recipe), { id: recipe._id.toString() })));
            }
            catch (error) {
                console.error('Error fetching recipes:', error);
                throw new Error('Error fetching recipes');
            }
        }),
        recipe: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const recipe = yield db.collection('recipes').findOne({ _id: new mongodb_1.ObjectId(args.id) });
                if (!recipe) {
                    console.error('Recipe not found');
                    throw new Error('Recipe not found');
                }
                return Object.assign(Object.assign({}, recipe), { id: recipe._id.toString() });
            }
            catch (error) {
                console.error('Error fetching recipe:', error);
                throw new Error('Error fetching recipe');
            }
        }),
    },
    Mutation: {
        addRecipe: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const result = yield db.collection('recipes').insertOne(args);
                if (!result.insertedId) {
                    throw new Error('Failed to insert recipe');
                }
                const newRecipe = yield db.collection('recipes').findOne({ _id: result.insertedId });
                if (!newRecipe) {
                    throw new Error('Inserted recipe not found');
                }
                return Object.assign(Object.assign({}, newRecipe), { id: newRecipe._id.toString() });
            }
            catch (error) {
                console.error('Error adding recipe:', error);
                throw new Error('Error adding recipe');
            }
        }),
        updateRecipe: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const updateArgs = Object.assign({}, args.input);
                const result = yield db.collection('recipes').findOneAndUpdate({ _id: new mongodb_1.ObjectId(args.id) }, { $set: updateArgs }, { returnDocument: 'after' });
                const updatedRecipe = (result === null || result === void 0 ? void 0 : result.value) || result;
                if (!isWithId(updatedRecipe)) {
                    console.error('Recipe not found or update failed: No additional error information');
                    throw new Error('Recipe not found or update failed');
                }
                return Object.assign(Object.assign({}, updatedRecipe), { id: updatedRecipe._id.toString() });
            }
            catch (error) {
                console.error('Error updating recipe:', error);
                throw new Error('Error updating recipe');
            }
        }),
        deleteRecipe: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const db = (0, database_1.getDb)();
                const recipeId = new mongodb_1.ObjectId(args.id);
                const existingRecipe = yield db.collection('recipes').findOne({ _id: recipeId });
                if (!existingRecipe) {
                    throw new Error('Recipe not found');
                }
                yield db.collection('recipes').findOneAndDelete({ _id: recipeId });
                return Object.assign(Object.assign({}, existingRecipe), { id: existingRecipe._id.toString() });
            }
            catch (error) {
                console.error('Error deleting recipe:', error);
                throw new Error('Error deleting recipe');
            }
        }),
    }
};
exports.default = recipeResolvers;
