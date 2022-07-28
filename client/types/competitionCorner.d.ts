type CCWorkout = {
    id: number;
    format: "individual" | "team";
    type: string;
    tiebreakerType: string;
    tiebreaker: string;
    tiebreakerScoreLimit: string;
    tiebreakerTimePresentationsFormat: string | null;
    name: string;
    location: string;
    start: string | null;
    end: string | null;
    description: string | null;
    date: string;
    hasHeats: boolean;
    roundsCount: string | null;
};

type CCHeat = {
    title: string;
    id: number;
    time: string | null;
    size: number;
    isCurrent: boolean;
    divisions: string[];
    stations: any[];
};
