export const getTotalClassicReps = (
    station: DisplayFullStation,
    workoutId?: string
) => {
    return (
        station.scores?.wodClassic
            .filter((aaa) => {
                return aaa.index === workoutId;
            })
            .reduce((total, rep) => total + rep.rep, 0) || 0
    );
};

export const getTotalSplitReps = (
    station: DisplayFullStation,
    workoutId?: string
) => {
    return (
        station.scores?.wodSplit
            .filter((aaa) => {
                return aaa.index === workoutId;
            })
            .reduce((total, score) => total + +score.rep, 0) || 0
    );
};

// export const getWodWeightScore = (
//     station: DisplayFullStation,
//     workoutId?: string
// ) => {
//     return (
//         station.scores?.wodWeight
//             .filter((aaa) => {
//                 return aaa.index === workoutId;
//             })
//             .reduce(
//                 (total, score) => total + +score.rep,
//                 0
//             ) || 0
//     );
// };

export const getStationScore = (
    station: DisplayFullStation,
    workout: Workout
) => {};

export const getWorkoutRank = (
    stations: DisplayFullStation[],
    workout: Workout
) => {};

export const sortedResult = (
    stations: DisplayFullStation[],
    workoutId: string
) => {
    // const reps = stations
    //     .map(
    //         (station) =>
    //             getTotalClassicReps(station, workout.workoutId) +
    //             getTotalSplitReps(station, workout.workoutId)
    //     )
    //     .sort((a, b) => b - a);

    return stations
        .map((station) => {
            const finalScore =
                station.scores?.endTimer.find(
                    (score) => score.index === workoutId
                )?.time ||
                getTotalClassicReps(station, workoutId) +
                    getTotalSplitReps(station, workoutId);

            const finished = typeof finalScore === "string";

            return {
                finalScore,
                finished,
                participantId: station.externalId,
                category: station.category,
            };
        })
        .sort((a, b) => {
            if (!a.finished && !b.finished) {
                return +b.finalScore - +a.finalScore;
            }
            if (a.finished && b.finished) {
                return a.finalScore < b.finalScore ? -1 : 1;
            }

            if (a.finished) return -1;
            return 1;
        })
        .map((score, _, array) => ({
            ...score,
            rank:
                array
                    .filter((a) => a.category === score.category)
                    .findIndex((item) => item.finalScore === score.finalScore) +
                1,
        }));
};
