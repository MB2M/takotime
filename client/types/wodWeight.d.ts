type WodWeightState = "Cancel" | "Success" | "Fail" | "Try";

type WodWeightScore = {
    partnerId: number;
    _id: string;
    weight: number;
    state: WodWeightState;
};

type WodWeightStation = {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: WodWeightScore[];
};
