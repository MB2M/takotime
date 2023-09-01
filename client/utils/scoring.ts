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

const getTotalMaxWeightScore = (
    station: DisplayFullStation,
    workoutId?: string
) => {
    const partners = [
        ...new Set(station.scores?.wodWeight.map((score) => score.partnerId)),
    ];

    const scores = partners.map((partnerId) => {
        const partnerScore = station?.scores?.wodWeight
            .filter((aaa) => {
                return aaa.index === workoutId;
            })
            .filter((score) => score.partnerId === partnerId);
        if (!partnerScore || partnerScore.length === 0) return 0;
        return (
            partnerScore
                .filter((score) => score.state === "Success")
                .sort((a, b) => b.weight - a.weight)[0]?.weight || 0
        );
    });

    return scores.reduce((total, score) => total + score, 0);
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

export const sortedResult = (
    stations: DisplayFullStation[],
    workoutId: string,
    wodLayout?: string
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
                    getTotalSplitReps(station, workoutId) +
                    getTotalMaxWeightScore(station, workoutId);

            const finished = typeof finalScore === "string";

            return {
                finalScore,
                finished,
                participantId: station.externalId,
                category: station.category,
                units: wodLayout?.toLowerCase().includes("weight")
                    ? "kg"
                    : "reps",
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
