class WodInterpreter {
    constructor(workout) {
        // this.maxReps;
        // this.duration;
        // this.scoreType;
        this.load(workout);
    }

    // load the json
    load(workout) {
        this.scoreType = workout.type;
        switch (this.scoreType) {
            case forTime:
                initForTime(workout.blocks);
                break;

            default:
                break;
        }
    }

    initForTime(blocks) {
        let cumulativeReps = 0;
        let cumulRepsList = [];
        let cumulMovementList = [];

        for (let block of blocks) {
            for (let i = 0; i < block.rounds; i++) {
                for (movement of block.movements) {
                    cumulativeReps +=
                        movement.reps + i * (movement.varEachRounds || 0);
                    cumulRepsList.push(cumulativeReps);
                    cumulMovementList.push(movement.name);
                }
            }
        }
        this.cumulRepsList = cumulRepsList;
        this.cumulMovementsList = cumulMovementList;
    }

    getCurrentRepsInfo(reps) {
        let i = 0;

        while (this.cumulRepsList[i] < reps) {
            i++;
        }

        return {
            repsOfMovement: reps - this.cumulRepsList[Math.max(i - 1, 0)],
            totalRepsOfMovement: this.cumulRepsList[i],
            currentMovement: this.cumulMovementsList[i],
        };
    }
}

export default WodInterpreter;
