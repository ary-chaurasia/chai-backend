import { Router } from "express";
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register")
 .post(upload.fields([{ name: 'avatar', maxCount: 1 }, 
    { name: 'coverImage', maxCount: 5 }]), registerUser); //http://localhost:5000/api/v1/users/register(post)

router.route("/login")
 .post(loginUser); //http://localhost:5000/api/v1/users/login(post)

 //secured routes

router.route("/logout")
 .post( verifyJWT, logoutUser); //http://localhost:5000/api/v1/users/logout(post)

export default router;