import mongoose, {Schema, model, Document} from "mongoose";

//? Define an interface representing a document in MongoDB
export interface IRecipe extends Document {
    title: string;
    ingredients: string[];
    instructions: string;
    cookTime?: number; //? This field is optional
    createdAt: Date;
    userId: mongoose.Types.ObjectId;
}

//? Create a Schema corresponding to the document interface
const recipeSchema = new Schema<IRecipe>({
    title: {type: String, required: true},
    ingredients: {type: [String], required: true},
    instructions: {type: String, required: true},
    cookTime: {type: Number},
    createdAt: {type: Date, default: Date.now},
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true}
});

//? Create and export the Model
const Recipe = model<IRecipe>("Recipe", recipeSchema);

export default Recipe;