import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json({
    limit: '50mb', 
}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.static("public"));
app.use(cookieParser());

//routes
app.use("/api/v1/users", userRouter); //http://localhost:5000/api/v1/users/

export default {app}