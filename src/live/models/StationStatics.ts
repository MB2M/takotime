import mongoose from "mongoose";

const stationStaticsSchema = new mongoose.Schema({
    laneNumber: {
        type: Number,
        unique: true,
        required: true,
        min: 1,
    },
    participant: String,
    category: String,
});

stationStaticsSchema.methods = {
    // authenticate: async function (password: string) {
    //     const match = await bcrypt.compare(password, this.password);
    //     return match;
    // },
};

export default mongoose.model("StationStatics", stationStaticsSchema);
