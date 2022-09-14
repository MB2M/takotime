type wodWeightState = "Cancel" | "Success" | "Fail" | "Try";

type wodWeightScore = {
    partnerId: number;
    _id: string;
    weight: number;
    state: wodWeightState;
};
