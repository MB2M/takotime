import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.methods = {
    authenticate: async function (password: string) {
        const match = await bcrypt.compare(password, this.password);
        return match;
    },
};

export default mongoose.model("User", userSchema);
