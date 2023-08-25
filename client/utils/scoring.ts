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
