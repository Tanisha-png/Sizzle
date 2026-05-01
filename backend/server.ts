import path from "path";
import express from "express";
import mongoose from "mongoose";
import 'dotenv/config';


const app = express();
const PORT = 3000;

app.use(express.json());

//! TODO: Create express.static(path.resolve(import.meta.dirname, '../dist')) middleware. 

