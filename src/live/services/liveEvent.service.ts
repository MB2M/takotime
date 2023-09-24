import WodTimer from "../../lib/timer/WodTimer";

class LiveEventService {
    timer: WodTimer;
    floorId: string;

    constructor(timer: WodTimer, floor: string) {
        this.timer = timer;
        this.floorId = floor;
    }

    buzz(laneNumber: number, timestamp: number): void {
        console.log(
            `[${this.floorId}]: Lane ${laneNumber} buzzed at ${timestamp}`
        );
    }
}

export default LiveEventService;
