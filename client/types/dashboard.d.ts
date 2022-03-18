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

type Device = {
    role: string;
    mac: string;
    state: string;
};
