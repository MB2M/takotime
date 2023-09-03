import { EventEmitter } from "events";

class WodInterpreter extends EventEmitter {
    constructor() {
        super();
    }

    // load the json
    load(workout) {
        this.workout = workout;
        this.shortcut = {};
        this.measurements = [];
        const checkpointsTime = new Set();
        if (this.workout?.blocks) {
            for (let block of this.workout.blocks) {
                if (block.measurements) {
                    this.measurements.push(block.measurements);
                    if (block.measurements.forSave) {
                        checkpointsTime.add(block.measurements.at);
                    }
                }
            }
        }

        this.checkpointTime = [...checkpointsTime];
        this.scores = this.workout?.scoring;
        this.shortcut = this.workout?.shortcut;
    }

    updateRepsOfBlock(repsPerBlock, currentBlock, delta) {
        if (isNaN(repsPerBlock[currentBlock])) {
            repsPerBlock.push(0);
            return this.updateRepsOfBlock(repsPerBlock, currentBlock, delta);
        }
        repsPerBlock[currentBlock] += delta;
        return repsPerBlock;
    }

    deltaWodPosition(currentWodPosition, delta) {
        if (delta < -1 || delta > 1) throw "bad delta value";

        const currentBlock = currentWodPosition.block;
        const currentRound = currentWodPosition.round;
        const currentMovement = currentWodPosition.movement;
        const currentRep = currentWodPosition.reps;

        const maxBlock = this.workout.blocks.length;
        const maxRound = this.workout.blocks[currentBlock].rounds;
        const maxMovement = this.workout.blocks[currentBlock].movements.length;
        const maxReps =
            this.workout.blocks[currentBlock].movements[currentMovement].reps +
            currentRound *
                (this.workout.blocks[currentBlock].movements[currentMovement]
                    .varEachRounds || 0);

        //No movement change
        if (currentRep + delta >= 0 && currentRep + delta < maxReps) {
            currentWodPosition.reps += delta;
            currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                currentWodPosition.repsPerBlock,
                currentBlock,
                delta
            );
            return currentWodPosition;
        }

        // if next movement
        if (currentRep + delta >= maxReps) {
            // no round change
            if (currentMovement + 1 < maxMovement) {
                currentWodPosition.reps = 0;
                currentWodPosition.movement += 1;
                currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                    currentWodPosition.repsPerBlock,
                    currentBlock,
                    delta
                );
                return currentWodPosition;
            }

            // no block change
            if (currentRound + 1 < maxRound || maxRound === 0) {
                currentWodPosition.reps = 0;
                currentWodPosition.movement = 0;
                currentWodPosition.round += 1;
                currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                    currentWodPosition.repsPerBlock,
                    currentBlock,
                    delta
                );
                return currentWodPosition;
            }

            // not end
            if (currentBlock + 1 < maxBlock) {
                if (!this.expectMeasurement(currentWodPosition)) {
                    currentWodPosition.reps = 0;
                    currentWodPosition.movement = 0;
                    currentWodPosition.round = 0;
                    currentWodPosition.block += 1;
                    currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                        currentWodPosition.repsPerBlock,
                        currentBlock,
                        delta
                    );
                    return currentWodPosition;
                }
            }

            //end of block
            if (
                currentWodPosition.reps !==
                this.workout.blocks[currentBlock].movements.at(-1).reps +
                    currentRound *
                        (this.workout.blocks[currentBlock].movements.at(-1)
                            .varEachRounds || 0)
            ) {
                currentWodPosition.reps =
                    this.workout.blocks[currentBlock].movements.at(-1).reps +
                    currentRound *
                        (this.workout.blocks[currentBlock].movements.at(-1)
                            .varEachRounds || 0);

                currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                    currentWodPosition.repsPerBlock,
                    currentBlock,
                    delta
                );
            }
            return currentWodPosition;
        }

        // if previous movement
        if (currentRep + delta < 0) {
            // no round change
            if (currentMovement - 1 >= 0) {
                currentWodPosition.reps =
                    this.workout.blocks[currentBlock].movements[
                        currentMovement - 1
                    ].reps +
                    currentRound *
                        (this.workout.blocks[currentBlock].movements[
                            currentMovement - 1
                        ].varEachRounds || 0) -
                    1;
                currentWodPosition.movement -= 1;
                currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                    currentWodPosition.repsPerBlock,
                    currentBlock,
                    delta
                );
                return currentWodPosition;
            }

            // no block change
            if (currentRound - 1 >= 0) {
                currentWodPosition.reps =
                    this.workout.blocks[currentBlock].movements.at(-1).reps +
                    (currentRound - 1) *
                        (this.workout.blocks[currentBlock].movements.at(-1)
                            .varEachRounds || 0) -
                    1;
                currentWodPosition.movement = maxMovement - 1;
                currentWodPosition.round -= 1;
                currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                    currentWodPosition.repsPerBlock,
                    currentBlock,
                    delta
                );
                return currentWodPosition;
            }

            // not end
            if (currentBlock - 1 >= 0) {
                if (!this.hasMeasurementBefore(currentWodPosition)) {
                    currentWodPosition.reps =
                        this.workout.blocks[currentBlock - 1].movements.at(-1)
                            .reps +
                        (this.workout.blocks[currentBlock - 1].rounds - 1) *
                            (this.workout.blocks[currentBlock - 1].movements.at(
                                -1
                            ).varEachRounds || 0) -
                        1;
                    currentWodPosition.movement =
                        this.workout.blocks[currentBlock - 1].movements.length -
                        1;
                    currentWodPosition.round =
                        this.workout.blocks[currentBlock - 1].rounds - 1;
                    currentWodPosition.block -= 1;
                    currentWodPosition.repsPerBlock = this.updateRepsOfBlock(
                        currentWodPosition.repsPerBlock,
                        currentBlock - 1,
                        delta
                    );
                    return currentWodPosition;
                }
            }

            //end
            return currentWodPosition;
        }
    }

    expectMeasurement(repPosition) {
        return this.measurements.find(
            (m) => m.blocksId.at(-1) === repPosition.block
        );
    }

    hasMeasurementBefore(repPosition) {
        return this.measurements.find(
            (m) => m.blocksId.at(-1) === repPosition.block - 1
        );
    }

    getCheckpointTime() {
        return this.checkpointTime;
    }

    getSecondaryCheckpointTime() {}

    getNextMovement(repPosition) {
        const currentBlock = repPosition.block;
        const currentMovement = repPosition.movement;
        const currentRound = repPosition.round;
        const maxBlock = this.workout.blocks.length;
        const maxRound = this.workout.blocks[currentBlock].rounds;
        const maxMovement = this.workout.blocks[currentBlock].movements.length;

        if (currentMovement + 1 < maxMovement) {
            return this.workout.blocks[currentBlock].movements[
                currentMovement + 1
            ];
        }

        if (currentRound + 1 < maxRound || maxRound === 0) {
            return this.workout.blocks[currentBlock].movements[0];
        }

        if (currentBlock + 1 < maxBlock) {
            return this.workout.blocks[currentBlock + 1].movements[0];
        }

        return;
    }

    getRepsInfo(repPosition) {
        const currentBlock = repPosition.block;
        const currentMovement = repPosition.movement;
        const currentRep = repPosition.reps;
        const currentRound = repPosition.round;

        const movementName =
            this.workout?.blocks[currentBlock].movements[currentMovement]
                .name || "";
        const maxRepsOfMovement =
            (this.workout?.blocks[currentBlock].movements[currentMovement]
                .reps || 0) +
            currentRound *
                (this.workout?.blocks[currentBlock].movements[currentMovement]
                    .varEachRounds || 0);
        const nextMovement = this.getNextMovement(repPosition);

        repPosition.repsOfMovement = currentRep;
        repPosition.totalRepsOfMovement = maxRepsOfMovement;
        repPosition.currentMovement = movementName;
        repPosition.nextMovementReps =
            (nextMovement && nextMovement.reps) || "";
        repPosition.nextMovement = (nextMovement && nextMovement.name) || "";
    }

    checkpoint(
        source,
        wodMeasurements,
        startTime,
        timestamp,
        currentWodPosition
    ) {
        let expectNewMeasurement;
        let expectedMeasurement;
        let expectTieBreak;

        if (wodMeasurements.length === 0) {
            expectNewMeasurement = true;
        } else {
            expectNewMeasurement =
                wodMeasurements.at(-1)?.value >= 0 ? true : false;
        }

        let currentMeasurementId = wodMeasurements.at(-1)
            ? wodMeasurements.at(-1).id
            : -1;

        if (expectNewMeasurement) {
            expectedMeasurement = this.measurements.find(
                (m) => m.id === currentMeasurementId + 1
            );
            expectTieBreak = expectedMeasurement.tieBreakSource ? true : false;
        } else {
            expectedMeasurement = this.measurements.find(
                (m) => m.id === currentMeasurementId
            );
            expectTieBreak = false;
        }

        // const expectedMeasurement = this.measurements.find(
        //     (m) => m.id === wodMeasurements.length
        // );

        if (!expectedMeasurement) return;

        let isFinal = false;
        let measurement = {};
        let shortcut = false;

        if (
            this.shortcut &&
            this.shortcut.sources.includes(expectedMeasurement.id) &&
            source === this.shortcut.device
        ) {
            measurement = {
                measurementId: expectedMeasurement.id,
                value: timestamp - startTime,
                method: "time",
            };

            isFinal = true;

            shortcut = true;
        } else {
            // buzzer and counter can't validate if not expected
            if (
                source !== "timer" &&
                expectedMeasurement.device !== source &&
                expectedMeasurement.tieBreakSource !== source
            )
                return;

            // if out of time range
            if (
                source !== "timer" &&
                (timestamp - startTime < expectedMeasurement.from * 60000 ||
                    timestamp - startTime > expectedMeasurement.at * 60000)
            )
                return;

            if (source === "timer" && expectedMeasurement.at !== timestamp)
                return;

            if (
                expectedMeasurement.tieBreakSource === source &&
                expectTieBreak
            ) {
                const tieBreak = this.doMeasurement(
                    source,
                    expectedMeasurement,
                    startTime,
                    timestamp,
                    currentWodPosition
                );
                this.emit("tieBreak", tieBreak);
            } else {
                if (expectedMeasurement.tieBreakCut && expectTieBreak) {
                    isFinal = true;
                } else {
                    isFinal =
                        expectedMeasurement.id === this.measurements.at(-1).id;
                }

                measurement = this.doMeasurement(
                    source,
                    expectedMeasurement,
                    startTime,
                    timestamp,
                    currentWodPosition
                );
                this.emit("checkpoint", measurement, isFinal, shortcut);
            }
        }
    }

    doMeasurement(
        source,
        expectedMeasurement,
        startTime,
        timestamp,
        currentWodPosition
    ) {
        // AJOUTER LA

        switch (source) {
            case "buzzer":
                return {
                    measurementId: expectedMeasurement.id,
                    value:
                        timestamp -
                        (startTime + expectedMeasurement.from * 60000),
                    method: "time",
                };

            case "timer":
                let reps = 0;
                expectedMeasurement.blocksId.forEach((blockId) => {
                    reps += currentWodPosition.repsPerBlock[blockId] || 0;
                });
                reps -= expectedMeasurement.repsFrom;

                let method = "reps";

                if (expectedMeasurement.convertInTime) {
                    const duration =
                        (expectedMeasurement.at - expectedMeasurement.from) *
                        60000;
                    reps =
                        duration +
                        (expectedMeasurement.repsTot - reps) *
                            expectedMeasurement.repsConvertion;

                    method = "time";
                }

                return {
                    measurementId: expectedMeasurement.id,
                    value: reps,
                    method: method,
                };
        }
    }

    // getTimeCapResult(reps) {
    // switch (this.scoreType) {
    //     case "forTime":
    //         return this.getFinalResult(reps);
    //     default:
    // return this.getFinalResult(reps);
    // }
    // }

    pressCounter(
        timestamp,
        startTime,
        wodMeasurements,
        currentWodPosition,
        buttonValue
    ) {
        this.deltaWodPosition(currentWodPosition, parseInt(buttonValue));
        this.getRepsInfo(currentWodPosition);
    }

    pressBuzzer(timestamp, startTime, wodMeasurements, currentWodPosition) {
        // case where there is no workout loaded (only time)
        if (!this.workout) return { value: timestamp - startTime, type: "end" };

        // TODO : GESTION EN COMPTEUR DE TOUR (AUTRE QU'UN MEASUREMENT)

        this.checkpoint(
            "buzzer",
            wodMeasurements,
            startTime,
            timestamp,
            currentWodPosition
        );
    }

    getFinalScore(measurements) {
        let scores = [];
        let baseScore;
        let baseType;

        const shortcutScore = measurements.find((m) => m.shortcut);
        if (shortcutScore) {
            scores.push(this.toReadableTime(shortcutScore.value));
        } else {
            for (let score of this.scores) {
                if (["sum", "normal"].includes(score.count)) {
                    baseScore = 0;
                    baseType = "reps";
                    for (let sourceId of score.sources) {
                        const measurement = measurements.find(
                            (m) => m.id === sourceId
                        );
                        if (measurement) {
                            baseScore += measurement.value;
                            if (measurement.method === "time") {
                                baseType = "time";
                            }
                        }
                    }
                }

                switch (score.method) {
                    case "forTime":
                        switch (baseType) {
                            case "time":
                                scores.push(this.toReadableTime(baseScore));
                                break;
                            case "reps":
                                scores.push(`CAP + ${baseScore}`);
                            default:
                                break;
                        }
                        break;
                    case "amrap":
                        scores.push(`${baseScore} reps`);
                        if (measurements.at(-1)?.tieBreak) {
                            switch (measurements.at(-1).tieBreak.method) {
                                case "time":
                                    scores.push(
                                        `(${this.toReadableTime(
                                            measurements.at(-1).tieBreak.value
                                        )})`
                                    );
                                    break;
                                case "reps":
                                    scores.push(
                                        `(${
                                            measurements.at(-1).tieBreak.value
                                        })`
                                    );
                            }
                        } else if (measurements.at(-2)?.tieBreak) {
                            switch (measurements.at(-2).tieBreak.method) {
                                case "time":
                                    scores.push(
                                        `(${this.toReadableTime(
                                            measurements.at(-2).tieBreak.value
                                        )})`
                                    );
                                    break;
                                case "reps":
                                    scores.push(
                                        `(${
                                            measurements.at(-2).tieBreak.value
                                        })`
                                    );
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        return `${scores.join("|")}|`;
    }

    //SI PAS DE MEASUREMENT, REPS (SI AMRAP) SINON DECLENCHER UN (EN GROS PAS DE BUZZER ALORS 'CAP +XXX")
    addZero(x, n) {
        while (x.toString().length < n) {
            x = "0" + x;
        }
        return x;
    }

    toReadableTime(timestamp) {
        const asDate = new Date(timestamp);
        const hours = this.addZero(asDate.getUTCHours(), 2);
        const minutes = this.addZero(asDate.getUTCMinutes(), 2);
        const seconds = this.addZero(asDate.getUTCSeconds(), 2);
        const milli = this.addZero(asDate.getUTCMilliseconds(), 3);

        return `${
            hours !== "00" ? hours + ":" : ""
        }${minutes}:${seconds}.${milli}`;
    }
}

export default WodInterpreter;
