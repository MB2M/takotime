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

type CCEPParticipant = {
    id: number;
    division: string;
    divisionId: number;
    displayName: string;
    participantNumber: null;
    heatId: number;
    heatName: string;
    heatTime: string;
    station: number;
    workoutId: string;
    workout: string;
    workoutDate: string;
    location: string;
    rank: string;
    points: string;
    age: string;
    height: string;
    weight: number;
    countryCode: string;
    benchmarks: {
        fran: string;
        helen: string;
        grace: string;
        filthy: string;
        sprint400m: string;
        run5k: string;
        twoKRow: string;
        fightgonebad: string;
        cleanJerk: string;
        deadlift: string;
        crossfitTotal: string;
        snatch: string;
        backsquat: string;
    };
};
