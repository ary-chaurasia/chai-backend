import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, //cloudinary url
        required: true,
        //default: "https://example.com/default-avatar.png",
    },
    coverImage: {
        type: String, //cloudinary url
        //default: "https://example.com/default-cover.jpg",
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video",
    }],
    password: {
        type: String,
        required: [true,'Password is required'],
    },
    refreshToken: {
        type: String,
        //default: null,
    },
},{timestamps: true});

//middleware which hashes the password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
         id: this._id ,
         email:this.email,
         username:this.username,
         fullname:this.fullname
     }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
};
userSchema.methods.generateAccessToken = function() {
    const accessToken = jwt.sign({ 
        id: this._id ,
        email:this.email,
        username:this.username, 
        fullname:this.fullname
     }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    return accessToken;
};
userSchema.methods.generateRefreshToken = function() {
    const refreshToken = jwt.sign({ 
        id: this._id,
     }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
    return refreshToken;
};

export const User = mongoose.model("User", userSchema);