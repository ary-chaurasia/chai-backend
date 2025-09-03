import { Router } from "express";
import { registerUser,loginUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register")
 .post(registerUser); //http://localhost:5000/api/v1/users/register(post)

router.route("/login")
 .post(loginUser); //http://localhost:5000/api/v1/users/login(post)

export default router;