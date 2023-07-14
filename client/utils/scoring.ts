export const getTotalClassicReps = (station: DisplayFullStation) => {
    return (
        station.scores?.wodClassic.reduce((total, rep) => total + rep.rep, 0) ||
        0
    );
};
