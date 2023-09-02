import { useLiveDataContext } from "../../context/liveData/livedata";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCompetitionContext } from "../../context/competition";
import useChrono from "../useChrono";
import { sortedResult } from "../../utils/scoring";

const useStationWs = () => {
    const competition = useCompetitionContext();
    const { globals, stations, registerListener } = useLiveDataContext();
    const { plainTimer } = useChrono(globals?.startTime, globals?.duration);
    const [CCResults, setCCResults] = useState<CCSimpleResult[]>([]);

    const [stationInfo, setStationInfo] = useState<BaseStation2[]>([]);

    const [fullStations, setFullStations] = useState<Array<DisplayFullStation>>(
        []
    );

    const categories = useMemo(
        () => [...new Set(stations.map((station) => station.category))],
        [stations]
    );

    const workouts = useMemo(
        () =>
            competition?.workouts
                ?.filter(
                    (workout) =>
                        workout.linkedWorkoutId ===
                            globals?.externalWorkoutId.toString() &&
                        (!workout.categories ||
                            workout.categories.length === 0 ||
                            workout.categories.some((cat) =>
                                categories.includes(cat)
                            ))
                )
                .sort(
                    (a, b) =>
                        +a.wodIndexSwitchMinute.split(",")[0] -
                        +b.wodIndexSwitchMinute.split(",")[0]
                ) || [],
        [competition?.workouts, globals?.externalWorkoutId, categories]
    );

    const splitMinute = useMemo(
        () =>
            workouts
                .map((workout) => workout.wodIndexSwitchMinute.split(","))
                .flat()
                .sort((a, b) => +b - +a)
                .find(
                    (splitMinute) => +splitMinute * 60 * 1000 <= plainTimer
                ) || "0",
        [plainTimer, workouts]
    );

    const activeWorkout = useMemo(
        () =>
            workouts.filter((workout) => {
                return workout.wodIndexSwitchMinute
                    .split(",")
                    .includes(splitMinute);
            }),
        [workouts, splitMinute]
    );

    const results = useMemo(() => {
        return workouts
            .map((workout) => {
                if (!workout.workoutId) return null;
                const results = sortedResult(
                    fullStations,
                    workout.workoutId,
                    workout?.layout
                );
                return { workoutId: workout.workoutId, results };
            })
            .filter((result) => result) as WodResult[];
    }, [workouts, fullStations]);

    const getCCWorkoutResults = useCallback(async () => {
        try {
            const response = await fetch(`/api/results`, {
                method: "POST",

                body: JSON.stringify({
                    eventId: competition?.eventId,
                    workoutId: activeWorkout[0]?.workoutId,
                }),
            });
            if (response.ok) {
                const participants: CCResultParticipant[] = (
                    await response.json()
                ).participants;
                const results: CCSimpleResult[] = participants.map(
                    (participant) => ({
                        participantId: participant.id,
                        division: participant.divisionName,
                        participant: participant.displayName,
                        scores: participant.result[0].scores
                            .filter((score) => score.value !== "WD")
                            .map((score) =>
                                score.timeCapCompletedReps
                                    ? `Cap+ ${score.timeCapCompletedReps}`
                                    : !score.value
                                    ? score.value
                                    : score.value.includes(":")
                                    ? score.value
                                    : `${score.value} ${
                                          participant.result[0].workoutType ===
                                          "repmax"
                                              ? "kg"
                                              : "reps"
                                      }`
                            ),
                    })
                );
                return results;
            }
        } catch (err) {
            console.error(err);
        }
    }, [competition, activeWorkout]);

    useEffect(() => {
        (async () => {
            const res = await getCCWorkoutResults();
            setCCResults(res || []);
        })();
    }, [getCCWorkoutResults]);

    // console.log(activeWorkout);
    // workouts
    // .sort((a, b) => b.wodIndexSwitchMinute - a.wodIndexSwitchMinute)
    // .find(
    //     (workout) =>
    //         workout.wodIndexSwitchMinute * 60 * 1000 <= plainTimer
    // ) || workouts[0];

    useEffect(() => {
        const unregister = registerListener(
            `station`,
            (data) => {
                if (!data) return;
                if (Array.isArray(data)) {
                    setStationInfo(data);
                } else {
                    setStationInfo((current) => [
                        ...(current.filter(
                            (station) => station.laneNumber !== data.laneNumber
                        ) || []),
                        data,
                    ]);
                }
            },
            true
        );

        return () => {
            unregister();
        };
    }, []);

    useEffect(() => {
        const fullStations = stations.map((station) => ({
            laneNumber: station.laneNumber,
            participant: station.participant,
            category: station.category,
            externalId: station.externalId,
            scores:
                stationInfo.find((s) => s.laneNumber === station.laneNumber)
                    ?.scores || undefined,
        }));
        setFullStations(fullStations);
    }, [stationInfo, stations]);

    return {
        fullStations,
        activeWorkout,
        workouts,
        categories,
        CCResults,
        results,
    };
};

export default useStationWs;
