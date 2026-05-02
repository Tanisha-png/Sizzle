import "dotenv/config";
import path from "path";
import express from "express";
import mongoose from "mongoose";
import Recipe from "./models/Recipe";

const app = express();
const PORT = 3000;

app.use(express.json());

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
    console.error("❌ Error: MONGO_URI is not defined in the .env file.");
    process.exit(1); // Stop the server if there's no database string
}

mongoose.connect(dbUri!).then(async () => {
    console.log("✅ Success: Sizzle is connected to MongoDB Atlas!");

    // --- TEST SEEDING START ---
    try {
        const testRecipe = new Recipe({
        title: "Sizzling Garlic Shrimp",
        ingredients: ["Shrimp", "Garlic", "Olive Oil", "Red Pepper Flakes"],
        instructions:
            "Sauté garlic in oil, add shrimp until pink, sprinkle flakes.",
        cookTime: 10,
    });

    const savedRecipe = await testRecipe.save();
    console.log("🚀 Test Recipe Saved:", savedRecipe.title);
    } catch (err) {
        console.error("❌ Error saving test recipe:", err);
    }
  // --- TEST SEEDING END ---
});

//! TODO: Create express.static(path.resolve(import.meta.dirname, '../dist')) middleware.

//! TODO: Add global error handler middleware (must be after all routes)

// app.get('/', (req, res) => {
//     res.send("🔥 The Sizzle Server is up and running!")
// })

//! Start server
app.listen(3000, () => {
  console.log("🔥 Server is sizzling on port 3000");
});

// ? Don't forget to export the app
export default app;
