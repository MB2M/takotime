interface Station {
    lane_number: number;
    reps: number;
    time: number;
    finish: boolean;
}

interface Options {
    duration: number,
    startTime: Date
}


interface WodData {
    lane_number: number;
    reps: number;
    finish: boolean;
    time: number;
}