import { useLiveDataContext } from "../../context/liveData/livedata";
import { useEffect, useMemo, useState } from "react";
import { useCompetitionContext } from "../../context/competition";
import useChrono from "../useChrono";

const useStationWs = () => {
    const competition = useCompetitionContext();
    const { globals, stations, registerListener } = useLiveDataContext();
    const { plainTimer } = useChrono(globals?.startTime, globals?.duration);

    const [stationInfo, setStationInfo] = useState<BaseStation2[]>([]);

    const [fullStations, setFullStations] = useState<Array<DisplayFullStation>>(
        []
    );

    const categories = [
        ...new Set(stations.map((station) => station.category)),
    ];

    const workouts = useMemo(
        () =>
            competition?.workouts?.filter(
                (workout) =>
                    workout.linkedWorkoutId ===
                        globals?.externalWorkoutId.toString() &&
                    (!workout.categories ||
                        workout.categories.length === 0 ||
                        workout.categories.some((cat) =>
                            categories.includes(cat)
                        ))
            ) || [],
        [competition?.workouts, globals?.externalWorkoutId, categories]
    );

    const activeWorkout =
        workouts
            .sort((a, b) => b.wodIndexSwitchMinute - a.wodIndexSwitchMinute)
            .find(
                (workout) => workout.wodIndexSwitchMinute * 10000 <= plainTimer
            ) || workouts[0];

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

    return { fullStations, activeWorkout, workouts, categories };
};

export default useStationWs;
