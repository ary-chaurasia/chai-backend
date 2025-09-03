import {asyncHandler}  from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import{User} from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResonse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
    // Registration logic 
    //1. get user details from frontend
    //2. validation-not empty
    //3. check if user already exists: username,email
    //4.check for images,check for avatar
    //5. upload them on cloudinary,avatar
    //6. create user object in database
    //7. remove password and refresh token field from response
    //8. check for user creation
    //return res

    const{fullName,username,email,password}=req.body;

    if([fullName, email, username, password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }
    //check if user already exists
    const existedUser = await User.findOne({$or:[{email},{username}]});
    if(existedUser){
        throw new ApiError(409,"User already exists");
    }

    const avatarLocalPath= req.files?.avatar[0]?.path;
    const coverImageLocalPath= req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar image is required");
    }
   const avatar=await uploadToCloudinary(avatarLocalPath);
   const coverImage=coverImageLocalPath ? await uploadToCloudinary(coverImageLocalPath) : null;

   if(!avatar){
        throw new ApiError(500,"Failed to upload avatar image");
   }
    if(!coverImage){
        throw new ApiError(500,"Failed to upload cover image");
   }

const user = await User.create({
    fullName,
    username:username.toLowerCase(),
    email,
    password,
    avatar:{
        publicId:avatar.public_id,
        url:avatar.url
    },
    coverImage: coverImage ? {
        publicId: coverImage.public_id,
        url: coverImage.url
    } : null
   })
    const createdUser= await User.findById(user._id).select('-password -refreshToken'); //ky ky nhi chahiye
    if(!createdUser){
        throw new ApiError(500,"Failed to create user");
    }
    return res.status(201).json( new ApiResonse(201,"User registered successfully",createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
    // Login logic
    res.status(200).json({ message: 'User logged in successfully' });
});

export { registerUser, loginUser };
