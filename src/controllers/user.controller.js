import {asyncHandler}  from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import{User} from '../models/User.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user){
            throw new ApiError(404,"User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;// user k database k liye refresh token ban rha h
        await user.save({validateBeforeSave:false});//database mai save karna hai without password validation
        return { accessToken, refreshToken };
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating tokens");
    }
    
}

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
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length>0){
        coverImageLocalPath= req.files.coverImage[0].path;
    }

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
    return res.status(201).json( new ApiResponse(201,"User registered successfully",createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
    // Login logic
    //1. get user details from frontend
    //2. validation-not empty
    //3. check if user exists: username,email
    //4. check for password match
    //5. generate access token and refresh token
    //6. send tokens in http-only cookie
    //7. store refresh token in database
    //8. return response to frontend
    const { username, password ,email} = req.body;
    if(!username || !email){  //based on which parameters user is logging in 
        throw new ApiError(400,"username or email are required");
    }

    const user= await User.findOne({$or:[{username},{email}]});
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const isPasswordMatched= await user.isPasswordCorrect(password);
    if(!isPasswordMatched){
        throw new ApiError(401,"Invalid credentials");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

    const options = {
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken, options)

    .json(new ApiResponse(200, {user: loggedInUser,accessToken,refreshToken},"User logged in successfully"));
});

const logoutUser= asyncHandler(async(req,res)=>{
    //logout logic
await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true});
const options={
    httpOnly:true,
    secure:true,
    //expires:new Date(Date.now()) //cookies ko turant expire kar dena
}
return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User logged out successfully"));
})
export { registerUser, loginUser ,logoutUser};
