type HeatConfig = {
    _id: string;
    heatId: string;
    rounds: {
        roundNumber: 1 | 2 | 3;
        pointsPerMovement: number;
        buyInReps: number;
    }[];
};

type GymStation = {
    _id: string;
    heatId?: string;
    laneNumber?: number;
    scores?: GymScore[];
}

type GymScore = {
    _id: string;
    roundNumber: 1 | 2 | 3;
    buyinRepCount: number;
    gymRepCount: number;
}
