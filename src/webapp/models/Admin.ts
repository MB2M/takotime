import mongoose from "mongoose";
import { IAdmin } from "../../types/competition";

const AdminSchema = new mongoose.Schema<IAdmin>({
    key: String,
    value: String,
});

export default mongoose.model<IAdmin>("Admin", AdminSchema);
