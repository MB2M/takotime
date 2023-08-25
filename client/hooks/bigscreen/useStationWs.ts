import { useLiveDataContext } from "../../context/liveData/livedata";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCompetitionContext } from "../../context/competition";
import useChrono from "../useChrono";

const useStationWs = () => {
    const competition = useCompetitionContext();
    const { globals, stations, registerListener } = useLiveDataContext();
    const { plainTimer } = useChrono(globals?.startTime, globals?.duration);
    const [results, setResults] = useState<CCSimpleResult[]>([]);

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
            workouts.find((workout) => {
                return workout.wodIndexSwitchMinute
                    .split(",")
                    .includes(splitMinute);
            }),
        [workouts, splitMinute]
    );

    const getWorkoutResults = useCallback(async () => {
        try {
            const response = await fetch(`/api/results`, {
                method: "POST",

                body: JSON.stringify({
                    eventId: competition?.eventId,
                    workoutId: activeWorkout?.workoutId,
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
                        scores: participant.result[0].scores.map((score) =>
                            score.timeCapCompletedReps
                                ? `Cap+ ${score.timeCapCompletedReps}`
                                : score.value
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
            const res = await getWorkoutResults();
            console.log(res);
            setResults(res || []);
        })();
    }, [getWorkoutResults]);

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
        results,
    };
};

export default useStationWs;
