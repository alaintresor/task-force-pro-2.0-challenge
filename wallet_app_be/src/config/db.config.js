import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(
        process.env.NODE_ENV == "production"
            ? process.env.PRO_MONGODB_URL
            : process.env.DEV_MONGODB_URL,
    );
    console.log(`db connected successfully! `);
  } catch (error) {
    console.error(`Error: ${error} `);
    process.exit(1);
  }
};

export default connectDB;