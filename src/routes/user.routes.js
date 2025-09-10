import { Router } from "express";
import {
     registerUser,
     loginUser,
     logoutUser,
     refreshAccessToken,
     updateAccountDetails,
     changeCurrentPassword,
     getCurrentUserDetails,
     updateUserAvatar,
     updateUserCoverImage,
     getUserChannelProfile,
     getWatchHistory
} from "../controllers/user.controller.js";
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

router.route("/refresh-access-token")
 .post( refreshAccessToken); //http://localhost:5000/api/v1/users/refresh-access-token(post)

router.route("/change-password").post(verifyJWT, changeCurrentPassword); //http://localhost:5000/api/v1/users/change-password(post)
router.route("/current-user").get(verifyJWT, getCurrentUserDetails); //http://localhost:5000/api/v1/users/current-user(get)
router.route("/update-account").patch(verifyJWT,updateAccountDetails);//http://localhost:5000/api/v1/users/update-account(patch)
router.route("/avatar-change").patch(verifyJWT, upload.single('avatar'), updateUserAvatar);//http://localhost:5000/api/v1/users/avatar-change(patch)
router.route("/cover-image-change").patch(verifyJWT, upload.single('/coverImage'), updateUserCoverImage);//http://localhost:5000/api/v1/users/cover-image-change(patch)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile); //http://localhost:5000/api/v1/users/c/:username(get) to get user channel profile 

router.route("/watch-history").get(verifyJWT, getWatchHistory); //http://localhost:5000/api/v1/users/watch-history(get) to get user watch history
export default router;