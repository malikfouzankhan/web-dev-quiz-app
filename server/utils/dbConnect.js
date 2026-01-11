import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function dbConnect() {
    await mongoose.connect(process.env.DB_URI);
    console.log(`Server is successfully connected to backend!!`);
}

dbConnect();