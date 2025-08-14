import express from 'express'
import connectDB from './db/connection.js';
import dotenv from 'dotenv';

dotenv.config({path: './env'}); // after this step go in package.json and add something in dev-dependencies like "nodemon": "^2.0.22" and then run "npm install" to install nodemon

const app = express();
connectDB(); 

