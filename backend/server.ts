import "dotenv/config";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

//? Tell dotenv to look in the current directory for the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express, {Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Recipe from "./models/Recipe";
import recipeRoutes from "./routes/recipeRoutes";
import { error } from "console";

const app = express();
app.use(cors());
const PORT = 3000;

//? Parse JSON
app.use(express.json());

const dbUri = process.env.MONGO_URI;

//? 1. Check if URI exists to satisfy TypeScript and prevent runtime crashes
if (!dbUri) {
    console.error("❌ Error: MONGO_URI is undefined. Check your .env file path.");
    process.exit(1); // Stop the server if we can't connect to the DB
} else {
  //? 2. Connect using the validated dbUri
mongoose
    .connect(dbUri) 
    .then(() => {
        console.log("✅ Success: Sizzle is connected to MongoDB Atlas!");
      //? TEST SEEDING REMOVED: 
      //? Your Garlic Shrimp is already safe in the cloud!
      //? We now leave this block empty or use it to initialize other services.
    })
    .catch((err) => {
        console.error("❌ Mongoose Connection Error:", err.message);
    });
}

//! TODO: Create express.static(path.resolve(import.meta.dirname, '../dist')) middleware.

//! TODO: Use the routes
app.use("/api/recipes", recipeRoutes);

//! TODO: Add global error handler middleware (must be after all routes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const defaultErr = {
        log: "Express error handler caught unknown middleware error",
        status: 500,
        message: {err: "An error has occurred ❌."}
    };
    const errorObj = Object.assign({}, defaultErr, err);
    //? create a console log
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
});

// app.get('/', (req, res) => {
//     res.send("🔥 The Sizzle Server is up and running!")
// })

//! Start server
app.listen(3000, () => {
    console.log("🔥 Server is sizzling on port 3000");
});

// ? Don't forget to export the app
export default app;
