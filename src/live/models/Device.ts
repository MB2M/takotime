import mongoose from "mongoose";

const DeviceSchema = new mongoose.Schema<IDevice>({
    ref: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["station", "counter", "board"],
    },
    state: {
        type: Number,
        enum: [0, 1],
        default: 0,
    },
});

export default mongoose.model<IDevice>("Device", DeviceSchema);
