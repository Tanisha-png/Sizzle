import {Request, Response, NextFunction} from "express";
import Recipe from "../models/Recipe";

const recipeController = {
    //? POST a new recipe
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
    }
};

export default recipeController;