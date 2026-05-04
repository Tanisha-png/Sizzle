import { useState } from "react";

const AddRecipeForm = ({ onRecipeAdded }: { onRecipeAdded: () => void }) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Convert comma-separated string into an array for your Mongoose schema
        const ingredientArray = ingredients.split(",").map((item) => item.trim());

        const newRecipe = {
        title,
        ingredients: ingredientArray,
        instructions,
        };

        try {
        const response = await fetch("/api/recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecipe),
        });

        if (response.ok) {
            // Clear the form
            setTitle("");
            setIngredients("");
            setInstructions("");
            // Refresh the list in the parent component
            onRecipeAdded();
        }
        } catch (err) {
        console.error("Failed to add recipe:", err);
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        style={{
            marginBottom: "40px",
            border: "1px solid #ccc",
            padding: "20px",
        }}
        >
        <h3>Add a New Sizzle Creation</h3>
        <div>
            <input
            placeholder="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
        </div>
        <div style={{ margin: "10px 0" }}>
            <input
            placeholder="Ingredients (separate with commas)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            />
        </div>
        <div>
            <textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
            Save Recipe
        </button>
        </form>
    );
};

export default AddRecipeForm;
