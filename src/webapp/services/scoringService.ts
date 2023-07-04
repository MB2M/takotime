import {
    IBaseStation2,
    IWodClassicScore,
    IWodSplitScore,
} from "../../types/deviceScoring";
import LiveStation from "../../live/models/Station";
import Station from "../models/Station";
import liveApp from "../../live";
import Competition from "../models/Competition";
import { postScore, ScorePost } from "../../live/services/CCTokenService";
import { IWorkout } from "../../types/competition";
import { toReadableTime } from "../utils/toReadableTime";

const loadedWorkout = async () => {
    return (await liveApp.manager.getGlobals()).externalWorkoutId;
};

const currentWorkouts = async () => {
    const workouts = (
        await Competition.findOne({
            selected: true,
        }).exec()
    )?.workouts;

    if (!workouts) return;

    const loadedWorkoutId = await loadedWorkout();

    return workouts.filter(
        (workout) => workout.linkedWorkoutId === loadedWorkoutId.toString()
    );
};

export const addScore = async (
    score: number,
    workoutId: string,
    laneNumber: number,
    heatId?: string,
    options: {
        participantId?: string;
        time?: number;
        movementIndex?: number;
        round?: number;
    } = {}
) => {
    const workout = await getWorkout(workoutId);
    if (!workout) return;
    let { participantId, movementIndex, round } = options;

    heatId ??= await getHeatId();
    participantId ??= await getParticipantId(laneNumber);

    switch (true) {
        case workout.layout.includes("split"):
            if (movementIndex === undefined)
                throw new Error("movementIndex is missing");
            round ??= 1;

            return await addSplitScore(
                score,
                workoutId,
                laneNumber,
                heatId,
                movementIndex,
                round,
                {
                    participantId,
                }
            );

        default:
            return await addClassicScore(score, workoutId, laneNumber, heatId, {
                participantId,
            });
    }
};

export const addClassicScore = async (
    score: number,
    wodIndex: string,
    laneNumber: number,
    heatId: string,
    options: {
        participantId?: string;
        time?: number;
        movementIndex?: number;
    } = {}
) => {
    let { participantId } = options;

    if (
        !(await passScoreOverflow(
            wodIndex,
            heatId,
            laneNumber,
            score,
            "wodClassic"
        ))
    )
        return;

    return Station.findOneAndUpdate(
        {
            heatId,
            laneNumber,
            participantId,
        },
        { $push: { "scores.wodClassic": { rep: score, index: wodIndex } } },
        { upsert: true, new: true }
    );
};

export const addSplitScore = async (
    score: number,
    wodIndex: string,
    laneNumber: number,
    heatId: string,
    movementIndex: number,
    round: number,
    options: {
        participantId?: string;
        time?: number;
    } = {}
) => {
    let { participantId } = options;

    if (
        !(await passScoreOverflow(
            wodIndex,
            heatId,
            laneNumber,
            score,
            "wodSplit",
            movementIndex,
            round
        ))
    )
        return;

    return Station.findOneAndUpdate(
        {
            heatId,
            laneNumber,
            participantId,
        },
        {
            $push: {
                "scores.wodSplit": {
                    rep: score,
                    index: wodIndex,
                    repIndex: movementIndex,
                    round: round,
                },
            },
        },
        { upsert: true, new: true }
    );
};

export const addTimerScore = async (
    scores: number[],
    laneNumber: number,
    heatId?: string,
    participantId?: string
) => {
    const workouts = await currentWorkouts();
    if (!workouts) return;

    const forTimeWorkouts = workouts
        .filter((workout) => {
            return workout.options.wodtype === "forTime";
        })
        .sort((a, b) => a.wodIndexSwitchMinute - b.wodIndexSwitchMinute);

    heatId ??= await getHeatId();
    participantId ??= await getParticipantId(laneNumber);

    await Promise.all(
        scores.map(async (score, index) => {
            console.log(score);
            if (score === 0 || !score) return;

            const workoutId = forTimeWorkouts[index]?.workoutId;
            if (workoutId) {
                const station = await Station.findOneAndUpdate(
                    {
                        heatId,
                        laneNumber,
                        participantId,
                    },
                    {
                        $addToSet: {
                            "scores.endTimer": {
                                time: toReadableTime(score),
                                index: workoutId,
                            },
                        },
                    },
                    { upsert: true, new: true }
                ).exec();
                return station.scores;
            }
        })
    );
};

export const viewStation = async (
    heatId: string,
    laneNumber: number,
    participantId?: string
) => {
    participantId ??= await getParticipantId(laneNumber);
    return Station.findOne({ heatId, laneNumber, participantId }).exec();
};

export const getHeatId = async () => {
    return (await liveApp.manager.getGlobals()).externalHeatId as string;
};

export const getStationInfo = async (
    laneNumber: number,
    participantId?: string
) => {
    const heatId = await getHeatId();
    participantId ??= await getParticipantId(laneNumber);

    return viewStation(heatId, laneNumber, participantId);
};

const getWorkoutMaxReps = (workout: IWorkout) => {
    return (
        workout.flow.buyIn.reps.reduce(
            (total, current) => total + +current,
            0
        ) +
        workout.flow.main.reps.reduce((total, current) => total + +current, 0) +
        workout.flow.buyOut.reps.reduce((total, current) => total + +current, 0)
    );
};

const getWorkoutMaxRepsOfMovement = (
    workout: IWorkout,
    movementIndex: number
) => {
    const movements = [
        ...workout.flow.buyIn.reps,
        ...workout.flow.main.reps,
        ...workout.flow.buyOut.reps,
    ];

    return movements[movementIndex];
};

const getWorkout = async (workoutId: string): Promise<IWorkout | undefined> => {
    const workouts = (
        await Competition.findOne({
            selected: true,
        }).exec()
    )?.workouts;
    if (!workouts) return;
    return workouts.find((w) => w.workoutId === workoutId);
};

const passScoreOverflow = async (
    workoutId: string,
    heatId: string,
    laneNumber: number,
    addedValue: number,
    scoreType: "wodClassic" | "wodSplit",
    movementIndex?: number,
    round?: number
) => {
    const workout = await getWorkout(workoutId);
    if (!workout) return false;

    let totalReps = 0;
    let scores = [];
    let maxReps = 0;

    switch (scoreType) {
        case "wodClassic":
            scores = (await viewStation(heatId, laneNumber))?.scores[
                scoreType
            ] as IWodClassicScore[];
            totalReps =
                scores
                    ?.filter((score) => score.index === workoutId)
                    .reduce((total, current) => total + +current.rep, 0) || 0;
            maxReps = getWorkoutMaxReps(workout);
            break;
        case "wodSplit":
            if (movementIndex === undefined || round === undefined)
                return false;
            scores = (await viewStation(heatId, laneNumber))?.scores[
                scoreType
            ] as IWodSplitScore[];
            totalReps =
                scores
                    ?.filter(
                        (score) =>
                            score.index === workoutId &&
                            score.repIndex === movementIndex &&
                            score.round === round
                    )
                    .reduce((total, current) => total + +current.rep, 0) || 0;
            maxReps = +(
                getWorkoutMaxRepsOfMovement(workout, movementIndex) || 0
            );
            break;
    }

    if (totalReps + addedValue < 0) return false;

    switch (workout.options.wodtype) {
        case "forTime":
            if (totalReps + addedValue > maxReps) return false;
            break;
        case "amrap":
            break;
    }

    return true;
};

const getParticipantId = async (laneNumber: number) => {
    const station = await LiveStation.findOne({ laneNumber }).exec();

    return station?.externalId?.toString();
};

const calculateForTimeScore = (
    stationInfo: IBaseStation2,
    workoutId: string
) => {
    const endTimers = stationInfo?.scores.endTimer;
    const classicScores = stationInfo?.scores.wodClassic;

    if (classicScores.length === 0 && endTimers.length === 0)
        return { value: "0", capped: true };

    const timeResult = endTimers
        .filter((endTime) => endTime.index === workoutId)
        .at(-1)?.time;

    let score;

    if (timeResult) {
        if (timeResult.length <= 9) {
            score = `00:${timeResult}`;
        } else {
            score = timeResult;
        }
    } else {
        score = classicScores
            .filter((score) => score.index === workoutId)
            .reduce((total, score) => total + +score.rep, 0);
    }

    const capped = !timeResult;

    return { value: score.toString(), capped };
};

const calculateAmrapScore = (stationInfo: IBaseStation2, workoutId: string) => {
    const classicScores = stationInfo?.scores.wodClassic;

    if (classicScores.length === 0) return { value: "0", capped: false };

    const score = classicScores
        .filter((score) => score.index === workoutId)
        .reduce((total, score) => total + +score.rep, 0);

    return { value: score.toString(), capped: false };
};

const calculateSplitScore = (stationInfo: IBaseStation2, workoutId: string) => {
    const scores = stationInfo?.scores.wodSplit;

    if (scores.length === 0) return { value: "0", capped: false };

    const score = scores
        .filter((score) => score.index === workoutId)
        .reduce((total, score) => total + +score.rep, 0);

    return { value: score.toString(), capped: false };
};

const calculateSplitMTScore = async (
    stationInfo: IBaseStation2,
    workoutId: string
) => {
    const scores = stationInfo?.scores.wodSplit;

    if (scores.length === 0) return { value: "0", capped: false };

    const getRoundScore = (round: number) =>
        scores
            .filter(
                (score) => score.index === workoutId && score.round === round
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

    const baseScore = (await getWorkout(workoutId))?.flow.main.reps.map(
        (rep) => +rep
    );

    if (!baseScore) return { value: "0", capped: false };

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

    return { value: score.toString(), capped: false };
};

export const saveCC = async (laneNumber: number, participantId?: string) => {
    participantId ??= await getParticipantId(laneNumber);
    if (!participantId) return { error: "Missing participant id" };

    const stationInfo = await getStationInfo(laneNumber);
    if (!stationInfo) return { error: "No participant loaded at this lane" };

    const workouts = await currentWorkouts();
    if (!workouts) return { error: "No workout loaded" };

    const { externalEventId } = await liveApp.manager.getGlobals();

    for (let workout of workouts) {
        const workoutId = workout.workoutId;

        let athleteScore: ScorePost;
        let finalScore: { value: string | number; capped: boolean };
        let capped;

        switch (true) {
            case workout.layout === "splitMT":
                finalScore = await calculateSplitMTScore(
                    stationInfo,
                    workoutId
                );
                break;
            case workout.layout.includes("split"):
                finalScore = calculateSplitScore(stationInfo, workoutId);
                break;
            default:
                switch (workout.options.wodtype) {
                    case "forTime":
                        finalScore = calculateForTimeScore(
                            stationInfo,
                            workoutId
                        );
                        break;
                    case "amrap":
                        finalScore = calculateAmrapScore(
                            stationInfo,
                            workoutId
                        );
                        capped = false;
                        break;
                }
                break;
        }

        athleteScore = {
            score: finalScore.value,
            isCapped: finalScore.capped,
            id: +participantId!,
            secondaryScore: null,
            tiebreakerScore: null,
            scaled: false,
            didNotFinish: false,
        };

        const scorePayload: ScorePost[] = [athleteScore];
        const { error } = await postScore(
            externalEventId,
            workoutId,
            scorePayload
        );
        if (error) return { error };
    }

    return { success: "ok" };
};

export const resetScores = async (workoutId: string, heatId: string) => {
    await Station.updateMany(
        {
            heatId,
        },
        {
            $set: {
                "scores.wodClassic": [],
                "scores.wodWeight": [],
                "scores.endTimer": [],
                "scores.wodSplit": [],
            },
        },
        { upsert: true, new: true }
    ).exec();
};
