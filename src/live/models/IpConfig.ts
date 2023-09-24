import mongoose from "mongoose";

const IpConfigSchema = new mongoose.Schema<IIpConfig>({
    floor: {
        type: String,
    },
    laneNumber: {
        type: Number,
        min: 0,
    },
    id: {
        type: String,
        index: {
            unique: true,
            partialFilterExpression: { id: { $type: "string" } },
        },
        validate: /^$|^[0-9]{1,3}.[0-9]{1,3}$/,
    },
});

IpConfigSchema.index({ floor: 1, laneNumber: 1 }, { unique: true });

const model = mongoose.model<IIpConfig>("IpConfig", IpConfigSchema);

export default mongoose.model<IIpConfig>("IpConfig", IpConfigSchema);
