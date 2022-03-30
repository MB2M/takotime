import BaseLiveWod from "./BaseLiveWod.js";
import { State } from "../../libs/State.js";
import StationStatics from "../../../models/StationStatics.js";

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

    async getWodRank(): Promise<StationRanked> {
        const stations = await StationStatics.find().exec();

        const measurementsRanks = await Promise.all(
            this.measurements.map(async (m) => {
                return await this.getMeasurementRank(m.id);
            })
        );

        const rankedStation = stations.map((s) => {
            return {
                lane: s.laneNumber,
                rank: measurementsRanks.map((mr) => {
                    return mr[s.laneNumber];
                }),
            };
        });

        return rankedStation;
    }

    async getMeasurementRank(measurementId: number) {
        const stations = await StationStatics.find().exec();

        stations.sort((a, b) => {
            const aMeasurement =
                a.dynamics.measurements &&
                a.dynamics.measurements[measurementId];
            const bMeasurement =
                b.dynamics.measurements &&
                b.dynamics.measurements[measurementId];

            if (!aMeasurement && bMeasurement) return 1;

            if (!bMeasurement && aMeasurement) return -1;

            if (!aMeasurement && !bMeasurement) {
                const aReps =
                    a.dynamics?.currentWodPosition?.repsPerBlock?.reduce(
                        (p: number, c: number, i: number) => {
                            return this.measurements[
                                measurementId
                            ]?.blocksId.includes(i)
                                ? p + c
                                : p + 0;
                        },
                        0
                    ) || 0;

                const bReps =
                    b.dynamics?.currentWodPosition?.repsPerBlock?.reduce(
                        (p: number, c: number, i: number) => {
                            return this.measurements[
                                measurementId
                            ]?.blocksId.includes(i)
                                ? p + c
                                : p + 0;
                        },
                        0
                    ) || 0;

                return bReps - aReps;
            }

            if (aMeasurement?.type !== bMeasurement?.type) {
                return aMeasurement?.type === "buzzer" ? -1 : 1;
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
        let rank = 1;
        let stationRanked: { [x: number]: number } = {};
        stations.forEach((s, i, stations) => {
            if (i === 0) {
                stationRanked = { ...stationRanked, [s.laneNumber]: rank };
            } else {
                if (
                    s.dynamics?.measurements &&
                    s.dynamics?.measurements[measurementId]?.value !==
                        stations[i - 1]?.dynamics?.measurements &&
                    stations[i - 1]?.dynamics?.measurements[measurementId]
                        ?.value
                ) {
                    rank++;
                } else {
                    const reps =
                        s.dynamics?.currentWodPosition?.repsPerBlock?.reduce(
                            (p: number, c: number, i: number) => {
                                return this.measurements[
                                    measurementId
                                ]?.blocksId.includes(i)
                                    ? p + c
                                    : p + 0;
                            },
                            0
                        ) || 0;

                    const previousStationReps =
                        stations[
                            i - 1
                        ]?.dynamics?.currentWodPosition?.repsPerBlock?.reduce(
                            (p: number, c: number, i: number) => {
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
                stationRanked = { ...stationRanked, [s.laneNumber]: rank };
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
