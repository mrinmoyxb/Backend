import mongoose from "mongoose";

export default async function connectToMongoDB(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/auth/jwt_user");
        console.log("Connected to mongoDB");
    }catch(error){
        console.log("Couldn't connect to mongoDB");
    }
}