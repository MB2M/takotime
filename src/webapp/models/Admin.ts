import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema<IAdmin>({
    key: String,
    value: String,
});

export default mongoose.model<IAdmin>("Admin", AdminSchema);
