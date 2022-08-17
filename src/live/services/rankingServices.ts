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

        if (aMeasurement?.method !== bMeasurement?.method) {
            return aMeasurement?.method === "time" ? -1 : 1;
        }

        if (aMeasurement?.method === "time") {
            return aMeasurement.value - bMeasurement.value;
        }

        if (aMeasurement?.method === "reps")
            return bMeasurement.value - aMeasurement.value;

        return 0;
    });
    let athleteRank = 1;
    let globalRank = 1;
    let stationRanked: { [x: number]: number } = {};
    stations.forEach((s, i, stations) => {
        if (i === 0) {
            stationRanked = { ...stationRanked, [s.laneNumber]: athleteRank };
        } else {
            if (
                s.dynamics?.measurements?.[measurementId]?.value !==
                stations[i - 1]?.dynamics?.measurements?.[measurementId]?.value
            ) {
                athleteRank = globalRank;
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
                    athleteRank = globalRank;
                }
            }
            stationRanked = { ...stationRanked, [s.laneNumber]: athleteRank };
        }
        globalRank++;
    });

    return stationRanked;
};
