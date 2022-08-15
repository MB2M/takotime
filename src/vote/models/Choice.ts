import mongoose from "mongoose";
import { ChoiceModel, IChoice } from "../../types/mt";

const ChoiceSchema = new mongoose.Schema<IChoice, ChoiceModel>({
    name: {
        type: String,
        enum: ["carre", "rond"],
    },
    count: { type: Number, default: 0 },
});

ChoiceSchema.static("addChoice", async function (name: string) {
    return this.updateOne({ name }, { $inc: { count: 1 } }, { upsert: true });
});

ChoiceSchema.static("resetAll", async function (name: string) {
    const votes = await this.find();
    votes.forEach((vote) => {
        vote.count = 0;
        vote.save();
    });
});

ChoiceSchema.static("deleteAll", async function (name: string) {
    await this.remove();
});

export default mongoose.model<IChoice, ChoiceModel>("Choice", ChoiceSchema);
