import path from "path";
import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';


const app = express();
const PORT = 3000;

app.use(express.json());

//! TODO: Create express.static(path.resolve(import.meta.dirname, '../dist')) middleware. 


//! TODO: Add global error handler middleware (must be after all routes)


//! Start server
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`)
});

// ? Don't forget to export the app
export default app;