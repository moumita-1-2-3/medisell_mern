import mongoose from "mongoose";
import { DB_NAME } from "../contants.js";


const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log(`Connected to database DB_HOST: ${connectionInstance.connection.host}`);
} catch (error) {
    console.log("Error connecting to database: ", error);
    process.exit(1);
    }
}

export default connectDB;
