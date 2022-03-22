import BaseLiveWod from "./BaseLiveWod.js";
import { State } from "../../libs/State.js";

class ForTime extends BaseLiveWod {
    elements: Array<keyof WodData["data"]> = [
        "state",
        "reps",
        "finish",
        "result",
        "totalRepsOfMovement",
        "currentMovement",
        "repsOfMovement",
        "nextMovementReps",
        "nextMovement",
        "repsTime",
    ];

    getWodRank(): StationRanked {
        const stations = this.db.getObject<Station[]>("/stations");
        const rankedStation = stations.map((s) => {
            return {
                lane: s.lane_number,
                rank: this.measurements.map((m) => {
                    return this.getMeasurementRank(m.id)[s.lane_number];
                }),
            };
        });

        // console.log(rankedStation);
        return rankedStation;
    }

    getMeasurementRank(measurementId: number) {
        const stations = this.db.getObject<Station[]>("/stations");
        // let repList: number[] = [];
        // let timeList: number[] = [];

        stations.sort((a, b) => {
            const aMeasurement =
                a.measurements && a.measurements[measurementId];
            const bMeasurement =
                b.measurements && b.measurements[measurementId];

            if (!aMeasurement && bMeasurement) return 1;

            if (!bMeasurement && aMeasurement) return -1;

            if (!aMeasurement && !bMeasurement) {
                const aReps =
                    a.currentWodPosition?.repsPerBlock.reduce((p, c, i) => {
                        return this.measurements[
                            measurementId
                        ]?.blocksId.includes(i)
                            ? p + c
                            : p + 0;
                    }, 0) || 0;

                const bReps =
                    b.currentWodPosition?.repsPerBlock.reduce((p, c, i) => {
                        return this.measurements[
                            measurementId
                        ]?.blocksId.includes(i)
                            ? p + c
                            : p + 0;
                    }, 0) || 0;

                return bReps - aReps;
            }

            if (aMeasurement?.type !== bMeasurement?.type) {
                aMeasurement?.type === "buzzer" ? -1 : 1;
            }

            if (
                aMeasurement?.type === "buzzer" &&
                bMeasurement?.type === "timer"
            )
                return aMeasurement.value - bMeasurement.value;

            if (
                aMeasurement?.type === "timer" &&
                bMeasurement?.type === "buzzer"
            )
                return bMeasurement.value - aMeasurement.value;

            return 0;
        });

        // stations.forEach((s) => {
        //     const reps = s.currentWodPosition.repsPerBlock.reduce((p, c, i) => {
        //         return blocksId.includes(i) ? p + c : 0;
        //     }, 0);
        //     s.measurements[measurementId]
        //         ? s.measurements[measurementId]?.type === "timer"
        //             ? repList.push(s.measurements[measurementId]!.value)
        //             : timeList.push(s.measurements[measurementId]!.value)
        //         : repList.push(reps);
        // });

        // stations.forEach((s) => {
        //     let count = 0;
        //     if (s.measurements[measurementId]) {
        //         for (let i = 0; i < timeList.length; i++) {
        //             if (
        //                 (timeList[i] || "") <
        //                 s.measurements[measurementId].value
        //             ) {
        //                 count++;
        //             }
        //         }
        //     } else {
        //         count = count + timeList.length;
        //         for (let i = 0; i < repList.length; i++) {
        //             if ((repList[i] || 0) > s.reps) {
        //                 count++;
        //             }
        //         }
        //     }
        //     stationRanked = { ...stationRanked, [s.lane_number]: count + 1 };
        // });
        let rank = 1;
        let stationRanked: { [x: number]: number } = {};
        stations.forEach((s, i, stations) => {
            if (i === 0) {
                stationRanked = { ...stationRanked, [s.lane_number]: rank };
            } else {
                if (
                    s.measurements &&
                    s.measurements[measurementId]?.value !==
                        stations[i - 1]?.measurements &&
                    stations[i - 1]?.measurements[measurementId]?.value
                ) {
                    rank++;
                } else {
                    const reps =
                        s.currentWodPosition?.repsPerBlock.reduce((p, c, i) => {
                            return this.measurements[
                                measurementId
                            ]?.blocksId.includes(i)
                                ? p + c
                                : p + 0;
                        }, 0) || 0;

                    const previousStationReps =
                        stations[
                            i - 1
                        ]?.currentWodPosition?.repsPerBlock.reduce(
                            (p, c, i) => {
                                return this.measurements[
                                    measurementId
                                ]?.blocksId.includes(i)
                                    ? p + c
                                    : p + 0;
                            },
                            0
                        ) || 0;
                    if (reps !== previousStationReps) {
                        rank++;
                    }
                }
                stationRanked = { ...stationRanked, [s.lane_number]: rank };
            }
        });

        return stationRanked;
    }

    update(message: WodData): void {
        // const index = this.db.getIndex(
        //     "/stations",
        //     message.data.lane_number,
        //     "lane_number"
        // );

        // this.db.push(`/stations[${index}]/appVersion`, message.data.appVersion);

        // if (message.topic === "blePeripheral") {
        //     this.db.push(`/stations[${index}]/configs`, message.data.configs);
        // }

        // if (message.topic === "reps") {
        //     this.db.push(`/stations[${index}]`, message.data);
        // }
        // this.emit("station/updated");

        // if (message.topic === "reps") {
        //     Object.entries(message.data).forEach(([k, v]) => {
        //         if (this.elements.find((e) => e === k)) {
        //             this.db.push(`/stations[${index}]/${k}`, v, false);
        //         }
        //     });
        // }
    }

    start(options: StartOptions): void {
        // this.db.push("/globals/duration", options.duration);
        // this.db.push("/globals/startTime", options.startTime);
        // this.db.push("/globals/countdown", options.countdown);

        this.updateState(State.Countdown);
        this.launchTimer(options.duration, options.startTime);

        this.emit("wodUpdate", "countdown");
        // this.emit("wodCountdown", options.startTime, options.duration);
    }
}

export default ForTime;
