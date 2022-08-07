type wodWeightState = "Cancel" | "Success" | "Fail" | "Try";

type wodWeightScore = {
    _id: string;
    weight: number;
    state: wodWeightState;
};
