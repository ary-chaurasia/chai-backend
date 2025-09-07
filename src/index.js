
import connectDB from './db/connection.js';
import dotenv from 'dotenv';
//import express from 'express';
//const app=express()
import app from './app.js';

dotenv.config({path: './.env'}); // after this step go in package.json and add something in dev-dependencies like "nodemon": "^2.0.22" and then run "npm install" to install nodemon
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
})
})
.catch((err)=>{
    console.log("MongoDB connection error:", err);
})

