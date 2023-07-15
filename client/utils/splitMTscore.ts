export const getRoundScores = (
    scores: {
        _id: string;
        rep: number;
        index: string;
        repIndex: number;
        round: number;
    }[],
    round: number,
    workoutId: string
) => {
    return scores
        .filter((score) => score.index === workoutId && score.round === round)
        .reduce(
            (acc, score) =>
                acc.set(
                    score.repIndex,
                    (acc.get(score.repIndex) || 0) + score.rep
                ),
            new Map<number, number>()
        );
};

export const splitMTscore = (
    scores: {
        _id: string;
        rep: number;
        index: string;
        repIndex: number;
        round: number;
    }[],
    workout: Workout
) => {
    if (!workout.workoutId) return 0;

    const scoreByRound = [0, 1, 2].map((id) =>
        getRoundScores(scores, id, workout.workoutId!)
    );

    const baseScore = workout.flow.main.reps.map((rep) => +rep);

    let score = 0;
    scoreByRound.forEach((scoreByMovement) => {
        const success = scoreByMovement.get(0) === scoreByMovement.get(4);
        if (success) {
            scoreByMovement.forEach((value) => {
                score += value;
            });
        } else {
            scoreByMovement.forEach((value, key) => {
                score += Math.min(baseScore[key]!, value);
            });
        }
    });

    return score;
};

export const roundsScores = (
    scores: {
        _id: string;
        rep: number;
        index: string;
        repIndex: number;
        round: number;
    }[],
    workout: Workout
) => {
    if (!workout.workoutId) return [0, 0, 0];

    const scoreByRound = [0, 1, 2].map((id) =>
        getRoundScores(scores, id, workout.workoutId!)
    );

    const baseScore = workout.flow.main.reps.map((rep) => +rep);

    return scoreByRound.map((scoreByMovement) => {
        const success = scoreByMovement.get(0) === scoreByMovement.get(4);
        let total = 0;
        if (success) {
            scoreByMovement.forEach((value) => {
                total += value;
            });
        } else {
            scoreByMovement.forEach((value, key) => {
                total += Math.min(baseScore[key]!, value);
            });
        }
        return total;
    });
};
