interface IWodWeightScore {
    _id: string;
    weight: number;
    state: string;
    partnerId?: number;
    index: string;
}

interface IWodClassicScore {
    rep: number;
    index: string;
    round: number;
}

interface IWodSplitScore {
    rep: number;
    index: string;
    repIndex: number;
    round?: number;
}

type IScoreType = "wodWeight" | "wodClassic";

//new
interface IBaseStation2RAM {
    heatId?: string;
    laneNumber?: number;
    scores: {
        wodWeight: IWodWeightScore[];
        wodClassic: IWodClassicScore[];
        endTimer: IEndTimer[];
        wodSplit: IWodSplitScore[];
    };
    participantId?: string;
    category?: string;

    times?: { rep: number; time: number; index: number }[];
}

interface IEndTimer {
    time: string;
    index: string;
}
