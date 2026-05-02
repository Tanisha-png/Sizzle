import {Request, Response, NextFunction} from "express";
import Recipe from "../models/Recipe";

const recipeController = {
    //? Get all recipes
    getAllRecipes: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const recipes = await Recipe.find({});
            res.locals.recipes = recipes;
            return next();
        } catch (error) {
            return next({
                log: `recipeController.getAllRecipes: ERROR: ${error}`,
                message: {error: "Error fetching recipes"},
            });
        }
    },
    
    //? Create a new recipe
    createRecipe: async (req: Request, res: Response, next: NextFunction) => {
        try {
            //? Create a new recipe using the data sent in the request body
            const newRecipe = new Recipe(req.body);
            const savedRecipe = await newRecipe.save();

            //? Store the result in res.locals to pass it to the next function
            res.locals.newRecipe = savedRecipe;
            return next();
        } catch (error) {
            //? Use the next function to trigger the global error handler in server.ts
            //! NOTE: Global Handler act as a safety net
            return next({
                log: `recipeController.createRecipe: ERROR: ${error}`,
                status: 400,
                message: {error: "Error saving a recipe"},
            });
        }
    },

       //? DELETE recipe
    deletedRecipe: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {id} = req.params;
            const deletedRecipe = await Recipe.findByIdAndDelete(id);

            if (!deletedRecipe) {
                return next({
                    log: "recipeController.deleteRecipe: ERROR: ID not found",
                    status: 404,
                    message: {error: "Recipe not found"},
                });
            }

            res.locals.deleted = deletedRecipe;
            return next();
        } catch (error) {
            return next({
                log: `recipeController.deleteRecipe: ERROR: ${error}`,
                status: 400,
                message: {error: "Error deleting recipe"},
            });
        }
    }
};

export default recipeController;