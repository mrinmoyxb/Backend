import mongoose from "mongoose";

export async function utilConnectMongoDB(){
    try{
        await mongoose.connect(process.env.MONGODB_AUTH_URI as string);
        console.log("Sucessfully connected to MongoDB Atlas ✅");
    }catch(error){
        console.log("Failed to connect to MongoDB Atlas ✅");
    }
}