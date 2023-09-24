import mongoose from "mongoose";

const connectDB = () => mongoose.connect("mongodb://localhost/db");

export default connectDB;
