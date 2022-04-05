import StationStatics from "../models/Station";
import Workout from "../models/Workout";

export default async (
    measurements: Array<Measurement>
): Promise<StationRanked> => {
    const stations = await StationStatics.find().exec();

    const measurementsRanks = await Promise.all(
        measurements.map(async (m) => {
            return await getMeasurementRank(m.id, measurements);
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
};

const getMeasurementRank = async (
    measurementId: number,
    measurements: Measurement[]
) => {
    const stations = await StationStatics.find().exec();

    stations.sort((a, b) => {
        const aMeasurement =
            a.dynamics.measurements && a.dynamics.measurements[measurementId];
        const bMeasurement =
            b.dynamics.measurements && b.dynamics.measurements[measurementId];

        if (!aMeasurement && bMeasurement) return 1;

        if (!bMeasurement && aMeasurement) return -1;

        if (!aMeasurement && !bMeasurement) {
            const aReps =
                a.dynamics?.currentWodPosition?.repsPerBlock?.reduce(
                    (p: number, c: number, i: number) => {
                        return measurements[measurementId]?.blocksId.includes(i)
                            ? p + c
                            : p + 0;
                    },
                    0
                ) || 0;

            const bReps =
                b.dynamics?.currentWodPosition?.repsPerBlock?.reduce(
                    (p: number, c: number, i: number) => {
                        return measurements[measurementId]?.blocksId.includes(i)
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

        if (aMeasurement?.type === "buzzer" && bMeasurement?.type === "timer")
            return aMeasurement.value - bMeasurement.value;

        if (aMeasurement?.type === "timer" && bMeasurement?.type === "buzzer")
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
                stations[i - 1]?.dynamics?.measurements[measurementId]?.value
            ) {
                rank++;
            } else {
                const reps =
                    s.dynamics?.currentWodPosition?.repsPerBlock?.reduce(
                        (p: number, c: number, i: number) => {
                            return measurements[
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
                            return measurements[
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
};
