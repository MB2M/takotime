// import {
//     IBaseStation2,
//     IWodClassicScore,
//     IWodSplitScore,
// } from "../../types/deviceScoring";
import LiveStation from "../../live/models/Station";
import liveApp from "../../live";
import Competition from "../models/Competition";
import { postScore, ScorePost } from "../../live/services/CCTokenService";
import { IWorkout, LiftState } from "../../types/competition";
import { toReadableTime } from "../utils/toReadableTime";

let state: IBaseStation2RAM[] = [];
let maxWeigthId = 0;

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

export const addMaxWeight = async ({
    laneNumber,
    weight,
    workoutId,
    participantId,
    heatId,
    partnerId,
}: {
    laneNumber: number;
    workoutId: string;
    weight: number;
    participantId: string;
    heatId: string;
    partnerId: number;
}) => {
    let station =
        (await viewStation(heatId, laneNumber, participantId)) ||
        (await createStation(heatId, laneNumber, participantId))!;

    station.scores.wodWeight.push({
        index: workoutId,
        weight,
        partnerId,
        state: "Try",
        _id: (maxWeigthId++).toString(),
    });

    return station;
};

export const updateMaxWeight = ({
    newState,
    id,
}: {
    id: string;
    newState: LiftState;
}) => {
    const station = state.find((station) =>
        station.scores.wodWeight.find((lift) => lift._id === id)
    );

    const lift = station?.scores.wodWeight.find((lift) => lift._id === id);

    if (lift) lift.state = newState;

    return station;
};

export const addScore = async (
    score: number,
    workoutId: string,
    laneNumber: number,
    workout: IWorkout,
    heatId?: string,
    options: {
        participantId?: string;
        time?: number;
        movementIndex?: number;
        round?: number;
        category?: string;
    } = {}
) => {
    const startRead = Date.now();
    let { participantId, movementIndex, round, category } = options;
    // const workout = await getWorkout(workoutId, category);
    // const workout = currentWorkouts.filter(
    //     (workout) => workout.linkedWorkoutId === loadedWorkout().toString()
    // );
    if (!workout) return;

    heatId ??= await getHeatId();
    participantId ??= await getParticipantId(laneNumber);
    console.log("S1 - read duration", (Date.now() - startRead) / 1000);

    const startWrite = Date.now();
    switch (true) {
        case workout.layout.includes("split"):
            if (movementIndex === undefined)
                throw new Error("movementIndex is missing");
            round ??= 1;

            const station = await addSplitScore(
                score,
                workout,
                laneNumber,
                heatId,
                movementIndex,
                round,
                { participantId, category }
            );

            console.log("writing", Date.now() - startWrite);
            return station;

        default:
            const stationn = await addClassicScore(
                score,
                workout,
                laneNumber,
                heatId,
                { category, participantId }
            );
            console.log("writing", Date.now() - startWrite);
            // return await addClassicScore(score, workoutId, laneNumber, heatId, {
            //     category,
            //     participantId,
            // });
            return stationn;
    }
};

export const addClassicScore = async (
    score: number,
    workout: IWorkout,
    laneNumber: number,
    heatId: string,
    options: {
        participantId?: string;
        time?: number;
        movementIndex?: number;
        category?: string;
    } = {}
) => {
    let { participantId, category } = options;

    if (
        !(await passScoreOverflow(
            workout,
            heatId,
            laneNumber,
            score,
            "wodClassic",
            category
        ))
    )
        return;

    let station =
        (await viewStation(heatId, laneNumber, participantId)) ||
        (await createStation(heatId, laneNumber, participantId))!;

    station.scores.wodClassic.push({ rep: score, index: workout.workoutId });

    return station;

    // return Station.findOneAndUpdate(
    //     {
    //         heatId,
    //         laneNumber,
    //         participantId,
    //     },
    //     { $push: { "scores.wodClassic": { rep: score, index: wodIndex } } },
    //     { upsert: true, new: true }
    // );
};

export const addSplitScore = async (
    score: number,
    workout: IWorkout,
    laneNumber: number,
    heatId: string,
    movementIndex: number,
    round: number,
    options: {
        participantId?: string;
        time?: number;
        category?: string;
    } = {}
) => {
    let { participantId, category } = options;

    if (
        !(await passScoreOverflow(
            workout,
            heatId,
            laneNumber,
            score,
            "wodSplit",
            category,
            movementIndex,
            round
        ))
    )
        return;

    let station =
        (await viewStation(heatId, laneNumber, participantId)) ||
        (await createStation(heatId, laneNumber, participantId))!;

    station.scores.wodSplit.push({
        rep: score,
        index: workout.workoutId,
        repIndex: movementIndex,
        round: round,
    });

    return station;

    // return Station.findOneAndUpdate(
    //     {
    //         heatId,
    //         laneNumber,
    //         participantId,
    //     },
    //     {
    //         $push: {
    //             "scores.wodSplit": {
    //                 rep: score,
    //                 index: wodIndex,
    //                 repIndex: movementIndex,
    //                 round: round,
    //             },
    //         },
    //     },
    //     { upsert: true, new: true }
    // );
};

export const addTimerScore = async (
    scoreId: number[],
    scores: number[],
    laneNumber: number,
    heatId?: string,
    participantId?: string
) => {
    const workouts = await currentWorkouts();

    if (!workouts) return;

    const forTimeWorkouts = [
        ...new Set(
            workouts
                .filter((workout) => {
                    return workout.options.wodtype === "forTime";
                })
                .sort(
                    (a, b) =>
                        +(a.wodIndexSwitchMinute.split(",")[0] || 0) -
                        +(b.wodIndexSwitchMinute.split(",")[0] || 0)
                )
                .map((w) => w.workoutId)
        ),
    ];

    console.log(forTimeWorkouts);

    heatId ??= await getHeatId();
    participantId ??= await getParticipantId(laneNumber);

    const timeScores = scores
        .map((score, index) => {
            if (score === 0 || !score) return;

            const workoutId = forTimeWorkouts[index];
            if (workoutId) {
                return {
                    time: toReadableTime(score),
                    index: workoutId,
                };
            }
        })
        .filter((score): score is { time: string; index: string } => !!score);

    let station =
        (await viewStation(heatId, laneNumber, participantId)) ||
        (await createStation(heatId, laneNumber, participantId))!;

    station.scores.endTimer = timeScores;

    return station.scores;
};

const createStation = (
    heatId: string,
    laneNumber: number,
    participantId?: string
) => {
    state.push({
        heatId,
        laneNumber,
        participantId,
        scores: { endTimer: [], wodClassic: [], wodSplit: [], wodWeight: [] },
    });

    return viewStation(heatId, laneNumber, participantId);
};

const viewStation = async (
    heatId: string,
    laneNumber: number,
    participantId?: string
) => {
    participantId ??= await getParticipantId(laneNumber);
    return state.find(
        (station) =>
            station.heatId === heatId &&
            station.laneNumber === laneNumber &&
            station.participantId === participantId
    );
    // return Station.findOne({ heatId, laneNumber, participantId }).exec();
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

export const getAllStationsInfo = async () => {
    const heatId = await getHeatId();
    return state.filter((station) => station.heatId === heatId);

    // return Station.find({ heatId }).exec();
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

const getWorkout = async (
    workoutId: string,
    category?: string
): Promise<IWorkout | undefined> => {
    const workouts = (
        await Competition.findOne({
            selected: true,
        }).exec()
    )?.workouts;
    if (!workouts) return;
    return workouts.find(
        (w) =>
            w.workoutId === workoutId &&
            (category ? w.categories.includes(category) : true)
    );
};

const passScoreOverflow = async (
    workout: IWorkout,
    heatId: string,
    laneNumber: number,
    addedValue: number,
    scoreType: "wodClassic" | "wodSplit",
    category?: string,
    movementIndex?: number,
    round?: number
) => {
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
                    ?.filter((score) => score.index === workout.workoutId)
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
                            score.index === workout.workoutId &&
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
    stationInfo: IBaseStation2RAM,
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

const calculateAmrapScore = (
    stationInfo: IBaseStation2RAM,
    workoutId: string
) => {
    const classicScores = stationInfo?.scores.wodClassic;

    if (classicScores.length === 0) return { value: "0", capped: false };

    const score = classicScores
        .filter((score) => score.index === workoutId)
        .reduce((total, score) => total + +score.rep, 0);

    return { value: score.toString(), capped: false };
};

const calculateSplitScore = (
    stationInfo: IBaseStation2RAM,
    workoutId: string
) => {
    const scores = stationInfo?.scores.wodSplit;

    if (scores.length === 0) return { value: "0", capped: false };

    const score = scores
        .filter((score) => score.index === workoutId)
        .reduce((total, score) => total + +score.rep, 0);

    return { value: score.toString(), capped: false };
};

const calculateMaxWeightScore = (
    stationInfo: IBaseStation2RAM,
    workoutId: string
) => {
    const scores = stationInfo?.scores.wodWeight.filter(
        (score) => score.index === workoutId
    );

    if (scores.length === 0) return { value: "0", capped: false };

    const partners = [...new Set(scores.map((score) => score.partnerId))];

    const score = partners
        .map(
            (partnerId) =>
                scores
                    .sort((a, b) => b.weight - a.weight)
                    .find(
                        (score) =>
                            score.state === "Success" &&
                            score.partnerId === partnerId
                    )?.weight || 0
        )
        .reduce((total, score) => total + score, 0);

    return { value: score.toString(), capped: false };
};

const calculateSplitMTScore = async (
    stationInfo: IBaseStation2RAM,
    workoutId: string,
    category?: string
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

    const baseScore = (
        await getWorkout(workoutId, category)
    )?.flow.main.reps.map((rep) => +rep);

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

export const saveCC = async (
    laneNumber: number,
    participantId?: string,
    category?: string
) => {
    participantId ??= await getParticipantId(laneNumber);

    if (!participantId) return { error: "Missing participant id" };

    const stationInfo = await getStationInfo(+laneNumber);
    if (!stationInfo) return { error: "No participant loaded at this lane" };

    const workouts = (await currentWorkouts())?.filter((workout) =>
        category
            ? workout.categories.length === 0
                ? true
                : workout.categories.includes(category)
            : true
    );
    if (!workouts) return { error: "No workout loaded" };

    const { externalEventId } = await liveApp.manager.getGlobals();

    for (let workout of workouts) {
        const workoutId = workout.workoutId;

        let athleteScore: ScorePost;
        let finalScore: { value: string | number; capped: boolean };
        let capped;

        let tiebreakerScore = null;

        switch (true) {
            case workout.layout === "MTSprintLadder":
                tiebreakerScore = calculateForTimeScore(
                    stationInfo,
                    workoutId
                ).value;
                finalScore = { value: 0, capped: false };
                break;

            case workout.layout.includes("splitMT"):
                finalScore = await calculateSplitMTScore(
                    stationInfo,
                    workoutId,
                    category
                );
                break;
            case workout.layout.includes("split"):
                finalScore = calculateSplitScore(stationInfo, workoutId);
                break;

            case workout.layout.includes("maxWeight"):
                finalScore = calculateMaxWeightScore(stationInfo, workoutId);
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
            tiebreakerScore: tiebreakerScore,
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

export const resetScores = async () => {
    state = [];
};
