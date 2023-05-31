import mongoose from "mongoose";

const connectDB = () => {
    try {
        mongoose.connect("mongodb://localhost/db", (err) => {
            console.log(
                err ? "Error while DB connecting" : "Connected to mongoDB"
            );
        });
    } catch (error) {
        console.error(error);
    }
};

export default connectDB;
