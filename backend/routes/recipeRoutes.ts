import express, {Request, Response, NextFunction} from "express";
import recipeController from "../controllers/recipeController";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import Recipe from "../models/Recipe";
import { deleteModel } from "mongoose";

const router = express.Router();

//? GET all recipes
router.get("/", authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const recipes = await Recipe.find({userId: req.userId});
        res.status(200).json(recipes)
    } catch (error) {
        next(error);
    }
});

//? POST /api/recipes
router.post("/", authenticate, recipeController.createRecipe, (req: Request, res: Response) => {
    return res.status(200).json(res.locals.newRecipe)
});

router.delete("/:id", authenticate, recipeController.deletedRecipe, (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Recipe deleted successfully",
        deletedRecipe: res.locals.deleted
    });
});

//? Update: update a recipe
router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { title, ingredients, instructions } = req.body;

        const updatedRecipe = await Recipe.findOneAndUpdate(
        {_id: id, userId: req.userId},
        { title, ingredients, instructions },
        { new: true },
        );

        if (!updatedRecipe) {
        return res.status(404).json({ message: "Recipe not found." });
        }
        res.json(updatedRecipe);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

//? PATCH: change one field(change the title)
router.patch("/:id", recipeController.updateRecipe, (req: Request, res: Response) => {
    return res.status(200).json(res.locals.updated);
});

 


export default router;