import express, {Request, Response, NextFunction} from "express";
import recipeController from "../controllers/recipeController";
import Recipe from "../models/Recipe";
import { deleteModel } from "mongoose";

const router = express.Router();

//? GET all recipes
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes)
    } catch (error) {
        // res.status(500).json({message: "Error fetching recipes", error: error});
        next(error);
    }
});

// //? POST a new recipe
// router.post("/", async (req, res) => {
//     try {
//         const newRecipe = new Recipe(req.body);
//         const savedRecipe = await newRecipe.save();
//         res.status(200).json(savedRecipe)
//     } catch (error) {
//         res.status(400).json({message: "Error saving recipe", error: error});
//     }
// });

//? POST /api/recipes
router.post("/", recipeController.createRecipe, (req: Request, res: Response) => {
    return res.status(200).json(res.locals.newRecipe)
});

// //? DELETE /api/recipes/:id (Delete a specific recipe by ID)
// router.delete("/:id", async (req: Request, res: Response, next: NextFunction ) => {
//     try {
//         const {id} = req.params;
//         const deletedRecipe = await Recipe.findByIdAndDelete(id);

//         if (!deletedRecipe) {
//             return res.status(404).json({message: "Recipe not found"})
//         }
//         res.status(200).json({message: "Recipe deleted successfully"})
//     } catch (error) {
//         next(error)
//     }
// });

router.delete("/:id", recipeController.deletedRecipe, (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Recipe deleted successfully",
        deletedRecipe: res.locals.deleted
    });
});

//? PATCH: change one field(change the title)
router.patch("/:id", recipeController.updateRecipe, (req: Request, res: Response) => {
    return res.status(200).json(res.locals.updated);
});


export default router;