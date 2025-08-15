import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema= new Schema({
   videoFile:{
    type: String, //cloudinary URL or local path
    required: true,
   },
   thumbnail:{
    type: String, //cloudinary URL or local path
    required: true,
   },
   title:{
    type: String,
    required: true,
   },
   description:{
    type: String,
    required: true,
   },
   duration:{
    type: Number, // duration in seconds
    required: true,
   },
   views: {
    type: Number,
    default: 0,
   },
   isPublished: {
    type: Boolean,
    default: true, // true for published, false for draft
   },
   owner:{
    type: Schema.Types.ObjectId,
    ref: "User", // Assuming there's a User model
    required: true,
   }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);