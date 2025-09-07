import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // one user who is subscribing
        ref: "User",
        
    },
    channel:{
        type: Schema.Types.ObjectId, // to which channel(user) he is subscribing and here channel is also a user
        ref: "User",
    }
},{timestamps: true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);