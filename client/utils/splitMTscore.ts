const splitMTscore = (
    scores: {
        _id: string;
        rep: number;
        index: string;
        repIndex: number;
        round: number;
    }[],
    workout: Workout
) => {
    const getRoundScore = (round: number) =>
        scores
            .filter(
                (score) =>
                    score.index === workout.workoutId && score.round === round
            )
            .reduce(
                (acc, score) =>
                    acc.set(
                        score.repIndex,
                        (acc.get(score.repIndex) || 0) + score.rep
                    ),
                new Map<number, number>()
            );

    const scoreByRound = [0, 1, 2].map((id) => getRoundScore(id));

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

export default splitMTscore;
