import WodTonnageRunningAthlete from "./WodTonnageRunningAthlete";
import { useMemo, useState } from "react";
import useInterval from "../../hooks/useInterval";
import { useCompetitionContext } from "../../context/competition";

function MaxTonnage({
    heatId,
    stations,
}: {
    heatId: number | undefined;
    stations: Array<DisplayFullStation>;
}) {
    const [wodWeightInfo, setWodWeightInfo] = useState<WodWeightStation[]>([]);
    const competition = useCompetitionContext();

    // const workout = useMemo(
    //     () =>
    //         competition?.workouts.find(
    //             (workout) =>
    //                 workout.workoutId === globals?.externalWorkoutId.toString()
    //         ),
    //     [competition, globals?.externalWorkoutId]
    // );
    // const allScores = useMemo(() => {
    //     return wodWeightInfo
    //         .map(
    //             (station) =>
    //                 station.scores
    //                     ?.sort(
    //                         (a: { weight: number }, b: { weight: number }) =>
    //                             b.weight - a.weight
    //                     )
    //                     .find(
    //                         (score: { state: string }) =>
    //                             score.state === "Success"
    //                     )?.weight
    //         )
    //         .sort((a, b) => (b || 0) - (a || 0));
    // }, [wodWeightInfo]);

    const fullStations = useMemo(() => {
        return stations.map((stationUp) => {
            const wodWeightScore0 = (
                wodWeightInfo?.find(
                    (station) => station?.laneNumber === stationUp?.laneNumber
                )?.scores || []
            ).filter(
                (score) =>
                    ["Success", "Fail"].includes(score.state) &&
                    score.partnerId === 0
            );
            const wodWeightScore1 = (
                wodWeightInfo?.find(
                    (station) => station.laneNumber === stationUp.laneNumber
                )?.scores || []
            ).filter(
                (score) =>
                    ["Success", "Fail"].includes(score.state) &&
                    score.partnerId === 1
            );

            return {
                ...stationUp,
                result0: wodWeightScore0,
                result1: wodWeightScore1,
                total:
                    wodWeightScore0.reduce(
                        (p, c) => p + (c.state === "Success" ? c.weight : 0),
                        0
                    ) +
                    wodWeightScore1.reduce(
                        (p, c) => p + (c.state === "Success" ? c.weight : 0),
                        0
                    ),
            };
        });
    }, [stations, wodWeightInfo]);

    // const allTry = useMemo(() => {
    //     return wodWeightInfo
    //         .map(
    //             (station) =>
    //                 station.scores
    //                     ?.sort(
    //                         (a: { weight: number }, b: { weight: number }) =>
    //                             b.weight - a.weight
    //                     )
    //                     .find(
    //                         (score: { state: string }) => score.state === "Try"
    //                     )?.weight
    //         )
    //         .sort((a, b) => (b || 0) - (a || 0));
    // }, [wodWeightInfo]);

    const retrieveWodWeightInfo = async () => {
        if (!heatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station?heatId=${heatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                setWodWeightInfo(json);
            } else {
                setWodWeightInfo([]);
            }
        } catch (err) {
            console.log(err);
            setWodWeightInfo([]);
        }
    };

    useInterval(retrieveWodWeightInfo, 1000);

    return (
        <>
            {fullStations
                ?.sort((a, b) => a.laneNumber - b.laneNumber)
                ?.sort((a, b) => b.total - a.total)
                ?.map((station) => (
                    <WodTonnageRunningAthlete
                        key={station.laneNumber}
                        station={station}
                        primaryColor={competition?.primaryColor || "white"} //commun
                        secondaryColor={competition?.secondaryColor || "white"} //commun
                        // wodWeightData={wodWeightInfo?.find(
                        //     (station) =>
                        //         station.laneNumber === station.laneNumber
                        // )}
                        height={1 / fullStations.length} //commun
                        scoreOfFirst={fullStations[0].total}
                    />
                ))}
        </>
    );
}

export default MaxTonnage;
