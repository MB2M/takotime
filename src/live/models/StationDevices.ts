import mongoose from "mongoose";

const stationDevicesSchema = new mongoose.Schema({
    laneNumber: {
        type: Number,
        unique: true,
        required: true,
        min: 1,
    },
    ip: {
        type: String,
        index: {
            unique: true,
            sparse: true,
        },
        validate: /^$|^192.168.3.1[0-9]{1,2}$/,
    },
    devices: [
        {
            role: {
                type: String,
                enum: ["counter", "board"],
            },
            mac: {
                type: String,
                // validate: /^$|^([0-9]|[a-f]){12}$/,
                validate: /^$|^[0-9]*$/,
                index: {
                    unique: true,
                    sparse: true,
                },
            },
            state: String,
            _id: false,
        },
    ],
});

stationDevicesSchema.methods = {
    // authenticate: async function (password: string) {
    //     const match = await bcrypt.compare(password, this.password);
    //     return match;
    // },
};

export default mongoose.model("StationDevices", stationDevicesSchema);
