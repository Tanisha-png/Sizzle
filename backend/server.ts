import path from 'path';
import express from 'express';


const app = express();
const PORT = 3000;

app.use(express.json());

//! TODO: Create express.static(path.resolve(import.meta.dirname, '../dist')) middleware. 
