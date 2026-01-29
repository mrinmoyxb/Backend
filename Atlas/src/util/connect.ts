import mongoose from "mongoose";

export async function connectToDB(){
    try{
        if(!process.env.MONGODB_URI){
            console.log("MONGODB ATLAS URI is missing");
        }
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB Atlas✅");
    }catch(error){
        console.log("Couldn't connect to MongoDB Atlas: ", error);
    }
}