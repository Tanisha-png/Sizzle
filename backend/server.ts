import path from "path";
import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';


const app = express();
const PORT = 3000;

app.use(express.json());

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