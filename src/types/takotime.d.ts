interface Station {
    lane_number: number;
    finish: boolean;
    currentWodPosition: {
        block: number;
        round: number;
        movement: number;
        reps: number;
        lastRoundPerBlock: number[];
        repsPerBlock: number[];
    };
    measurements: {
        [id: number]: InWodMeasurement;
    };
}

interface InWodMeasurement {
    value: number;
    type: string;
}

interface StartOptions {
    duration: number;
    startTime: Date;
    countdown: number;
    saveResults: boolean;
}

interface WodData {
    topic: string;
    data: {
        state: number;
        lane_number: number;
        reps: number;
        finish: boolean;
        result: string;
        totalRepsOfMovement: number;
        currentMovement: string;
        repsOfMovement: number;
        nextMovementReps: number;
        nextMovement: string;
        now: number;
        configs: object;
        repsTime: { [number]: number };
        appVersion: string;
    };
}

interface WodBlock {
    blockName: string;
    rounds: number;
    movements: {
        name: string;
        reps: number;
        varEachRounds: number;
    }[];
    measurements: Measurement;
}

interface Measurement {
    id: number;
    type: "fortime" | "amrap";
    blocksId: number[];
    from: number;
    at: number;
    repsFrom: number;
    repsTot: number;
    device: "buzzer" | "timer" | "counter";
    save: boolean;
}

type StationRanked = {
    lane: number;
    rank: (number | undefined)[];
}[];

type StationDevices = {
    lane_number: number;
    station_ip: string;
    devices: Device[];
};

type Device = {
    role: string;
    mac: string | null;
    state: string;
};

type AedesWithClients<T> = Partial<T> & { clients: object };

interface IDevice {
    ref: string;
    role: string;
    state: Number;
}
