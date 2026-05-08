// components/AddRecipeForm.tsx
import { useState, useEffect } from "react";

interface AddRecipeFormProps {
    onRecipeAdded: () => void;
    editingRecipe: any | null;
    onUpdate: (id: string, updatedData: any) => void;
    onCancel: () => void;
    token: string | null;
}

const AddRecipeForm = ({
    onRecipeAdded,
    editingRecipe,
    onUpdate,
    onCancel,
    token
}: AddRecipeFormProps) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");

  //? This hook populates the form when editingRecipe is set in App.tsx
    useEffect(() => {
        if (editingRecipe) {
        setTitle(editingRecipe.title);
        //? Join array back into a string for the input field
        setIngredients(editingRecipe.ingredients?.join(", ") || "");
        setInstructions(editingRecipe.instructions || "");
        } else {
        setTitle("");
        setIngredients("");
        setInstructions("");
        }
    }, [editingRecipe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ingredientArray = ingredients.split(",").map((item) => item.trim());
        const recipeData = { title, ingredients: ingredientArray, instructions };

        if (editingRecipe) {
        //? If we are in edit mode, trigger the update handler
        onUpdate(editingRecipe._id, recipeData);
        } else {
        //? Otherwise, proceed with the standard POST request
        try {
            const response = await fetch("/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, 
                },
                body: JSON.stringify(recipeData),
            });
            if (response.ok) {
            setTitle("");
            setIngredients("");
            setInstructions("");
            onRecipeAdded();
            }
        } catch (err) {
            console.error("Failed to add recipe:", err);
        }
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
        <h3 style={styles.formTitle}>
            {editingRecipe
            ? "Update Your Sizzle Creation"
            : "Add a New Sizzle Creation"}
        </h3>
        <div style={styles.inputGroup}>
            <input
            style={styles.input}
            placeholder="Recipe Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
        </div>
        <div style={styles.inputGroup}>
            <input
            style={styles.input}
            placeholder="Ingredients (separate with commas)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            />
        </div>
        <div style={styles.inputGroup}>
            <textarea
            style={{ ...styles.input, ...styles.textarea }}
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            />
        </div>

        <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitBtn}>
            {editingRecipe ? "Update Recipe" : "Save Recipe"}
            </button>

            {editingRecipe && (
            <button type="button" onClick={onCancel} style={styles.cancelBtn}>
                Cancel
            </button>
            )}
        </div>
        </form>
    );
    };

    const styles = {
    form: {
        marginBottom: "40px",
        backgroundColor: "#1e1e1e",
        border: "1px solid #333",
        padding: "30px",
        borderRadius: "12px",
    },
    formTitle: {
        color: "#ff4d4d",
        marginTop: 0,
        marginBottom: "20px",
        fontSize: "1.5rem",
    },
    inputGroup: { marginBottom: "15px" },
    input: {
        width: "100%",
        padding: "12px 15px",
        borderRadius: "8px",
        border: "1px solid #444",
        backgroundColor: "#0a0a0a",
        color: "#fff",
        fontSize: "1rem",
        boxSizing: "border-box" as const,
    },
    textarea: {
        height: "100px",
        resize: "vertical" as const,
    },
    buttonGroup: {
        display: "flex",
        gap: "10px",
    },
    submitBtn: {
        flex: 2,
        padding: "12px",
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        fontSize: "1rem",
    },
    cancelBtn: {
        flex: 1,
        padding: "12px",
        backgroundColor: "transparent",
        color: "#888",
        border: "1px solid #444",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold" as const,
        fontSize: "1rem",
    },
};

export default AddRecipeForm;
