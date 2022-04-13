// type Station = {
//     appVersion: string;
//     lane_number: number;
//     athlete: string;
//     category: string;
//     // configs: {
//     //     station_ip: string;
//     //     devices: { role: string; state: string }[];
//     // };
//     currentWodPosition: {
//         repsPerBlock: Array<number>;
//         repsOfMovement: number;
//         totalRepsOfMovement: number;
//         currentMovement: string;
//         nextMovementReps: number;
//         nextMovement: string;
//     };
//     result: string;
// };

type StationDevices = {
    _id: string;
    laneNumber: number;
    ip: string;
    devices: Device[];
};

type Station = {
    _id: string;
    laneNumber: number;
    participant: string;
    category: string;
    externalId: number;
    dynamics: {
        appVersion: string;
        state: number;
        currentWodPosition: {
            block: number;
            round: number;
            movement: number;
            reps: number;
            repsPerBlock: number[];
            repsOfMovement: number;
            totalRepsOfMovement: number;
            currentMovement: string;
            nextMovementReps: number;
            nextMovement: string;
        };
        result: string;
        measurements: {
            id: number;
            value: number;
            method: string;
            tieBreak: {
                value: number;
                method: string;
            };
        }[];
    };
};

type StationDynamics = {
    _id: string;
    laneNumber: number;
    appVersion: string;
    state: number;
    currentWodPosition: {
        block: number;
        round: number;
        movement: number;
        reps: number;
        repsPerBlock: number[];
        repsOfMovement: number;
        totalRepsOfMovement: number;
        currentMovement: string;
        nextMovementReps: number;
        nextMovement: string;
    };
    result: string;
    measurements: object;
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
        measurements: Measurement;
    }>;
};

type Measurement = {
    id: number;
    type: "fortime" | "amrap";
    blocksId: number[];
    from: number;
    at: number;
    repsFrom: number;
    repsTot: number;
    device: "buzzer" | "timer" | "counter";
    save: boolean;
};

type WorkoutIds = {
    _id: string;
    customId: string;
};

type Ranks = Array<number>;

type StationRanks = {
    lane: number;
    rank: Ranks;
};

type StationRanked = Array<StationRanks>;

interface WebSocket extends EventTarget {
    sendMessage: (this: WebSocket, msg: string) => any;
}

type Broker = { [key: string]: boolean };

type Globals = {
    wodname: string;
    duration: number;
    startTime: string;
    countdown: number;
    externalEventId: number;
    externalHeatId: number;
};

interface WidescreenData {
    globals: {
        externalEventId: number;
        externalWodId: number;
        externalHeatId: number;
        duration: number;
        startTime: string;
        state: number;
    };
    stations: WidescreenStation[];
    workouts: Workout[];
}

interface WidescreenStation {
    laneNumber: number;
    externalId: number;
    participant: string;
    category: string;
    repsPerBlock: number[];
    currentMovement: string;
    repsOfMovement: number;
    totalRepsOfMovement: number;
    nextMovement: string;
    nextMovementReps: number;
    result: string;
    measurements: string;
    state: number;
    position: {
        block: number;
        round: number;
        movement: number;
        reps: number;
    };
    rank: Ranks;
}
