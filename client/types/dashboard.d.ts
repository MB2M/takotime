type Station = {
    appVersion: string;
    lane_number: number;
    athlete: string;
    category: string;
    // configs: {
    //     station_ip: string;
    //     devices: { role: string; state: string }[];
    // };
    currentWodPosition: {
        repsPerBlock: Array<number>;
        repsOfMovement: number;
        totalRepsOfMovement: number;
        currentMovement: string;
        nextMovementReps: number;
        nextMovement: string;
    };
    result: string;
};

type StationDevices = {
    _id: string;
    laneNumber: number;
    ip: string;
    devices: Device[];
};

type StationStatics = {
    _id: string;
    laneNumber: number;
    participant: string;
    category: string;
};

type Device = {
    role: string;
    mac: string;
    state: string;
};

type Workout = {
    _id: string;
    name: string;
    customId: string;
    active: boolean;
    categories: Array<string>;
    shortcut: {
        method: string;
        count: string;
        device: "buzzer" | "timer";
        sources: Array<number>;
    };
    scoring: Array<{
        method: string;
        count: "normal" | "sum";
        sources: Array<number>;
    }>;
    blocks: Array<{
        rounds: number;
        movements: Array<{ name: string; reps: number; varEachRounds: number }>;
        measurements: object;
    }>;
};

type WorkoutIds = {
    _id: string;
    customId: string;
};
