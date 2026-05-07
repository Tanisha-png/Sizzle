import { Response, NextFunction } from "express";
import Recipe from "../models/Recipe";
import { AuthRequest } from "../middleware/authMiddleware"; // Import your custom type

const recipeController = {
  //? Get recipes only for the logged-in user
    getAllRecipes: async (
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
        // Filter by the user's ID found in the JWT
        const recipes = await Recipe.find({ userId: req.userId });
        res.locals.recipes = recipes;
        return next();
        } catch (error) {
        return next({
            log: `recipeController.getAllRecipes: ERROR: ${error}`,
            message: { error: "Error fetching recipes" },
        });
        }
    },

    //? Create a new recipe tied to the user
    createRecipe: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
        const { title, ingredients, instructions } = req.body;

        //! Guard clause: Check fields before trying to save
        if (!title || !ingredients) {
            return next({
            log: "recipeController.createRecipe: Missing required fields",
            status: 400,
            message: { error: "Please provide a title and ingredients 😃!" },
            });
        }

        // Create recipe and manually spread body + add userId
        const newRecipe = new Recipe({
            ...req.body,
            userId: req.userId, // Ensure the recipe is owned by the logged-in user
        });

        const savedRecipe = await newRecipe.save();
        res.locals.newRecipe = savedRecipe;
        return next();
        } catch (error) {
        return next({
            log: `recipeController.createRecipe: ERROR: ${error}`,
            status: 400,
            message: { error: "Error saving a recipe" },
        });
        }
    },

    //? Update recipe (only if it belongs to the user)
    updateRecipe: async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
        const { id } = req.params;

        // findOneAndUpdate with userId ensures you can't edit someone else's recipe
        const updatedRecipe = await Recipe.findOneAndUpdate(
            { _id: id, userId: req.userId },
            req.body,
            { new: true, runValidators: true },
        );

        if (!updatedRecipe) {
            return next({
            log: "recipeController.updateRecipe: ERROR: ID not found or unauthorized",
            status: 404,
            message: { error: "Recipe not found or you don't have permission" },
            });
        }

        res.locals.updated = updatedRecipe;
        return next();
        } catch (error) {
        return next({
            log: `recipeController.updatedRecipe: ERROR: ${error}`,
            status: 400,
            message: { error: "Error updated recipe" },
        });
        }
    },

    //? DELETE recipe (only if it belongs to the user)
    deletedRecipe: async (
        req: AuthRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
        const { id } = req.params;

        // findOneAndDelete with userId for security
        const deletedRecipe = await Recipe.findOneAndDelete({
            _id: id,
            userId: req.userId,
        });

        if (!deletedRecipe) {
            return next({
            log: "recipeController.deleteRecipe: ERROR: ID not found or unauthorized",
            status: 404,
            message: { error: "Recipe not found or you don't have permission" },
            });
        }

        res.locals.deleted = deletedRecipe;
        return next();
        } catch (error) {
        return next({
            log: `recipeController.deleteRecipe: ERROR: ${error}`,
            status: 400,
            message: { error: "Error deleting recipe" },
        });
        }
    },
};

export default recipeController;
