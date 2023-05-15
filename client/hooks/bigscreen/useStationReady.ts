import { useMemo, useState } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";

import useInterval from "../useInterval";
import useStationPayload from "../useStationPayload";

const useStationReady = (
    dataSource: DataSource = "iot",
    rankingMethod: WorkoutOption["rankBy"] = "lineNumber",
    currentIndex: number
) => {
    const { globals, stations, ranks } = useLiveDataContext();
    const liveStations = useStationPayload(stations, ranks);

    const [stationsInfo, setStationsInfo] = useState<BaseStation[]>([]);

    const allPhoneScores = useMemo(() => {
        return [
            stationsInfo
                .map(
                    (station) =>
                        station.scores?.find((score) => score.index === 0)
                            ?.repCount || 0
                )
                .sort((a, b) => (b || 0) - (a || 0)),
            stationsInfo
                .map(
                    (station) =>
                        station.scores?.find((score) => score.index === 1)
                            ?.repCount || 0
                )
                .sort((a, b) => (b || 0) - (a || 0)),
        ];
    }, [stationsInfo]);
    const phoneStations = useMemo(
        () =>
            liveStations.map((stationUp) => {
                return {
                    ...stationUp,
                    repsPerBlock: [
                        stationsInfo
                            ?.find(
                                (station) =>
                                    station.laneNumber === stationUp.laneNumber
                            )
                            ?.scores?.find((score) => score.index === 0)
                            ?.repCount || 0,
                        stationsInfo
                            ?.find(
                                (station) =>
                                    station.laneNumber === stationUp.laneNumber
                            )
                            ?.scores?.find((score) => score.index === 1)
                            ?.repCount || 0,
                        stationsInfo
                            ?.find(
                                (station) =>
                                    station.laneNumber === stationUp.laneNumber
                            )
                            ?.scores?.find((score) => score.index === 2)
                            ?.repCount || 0,
                    ],
                    times: [
                        stationsInfo
                            ?.find(
                                (station) =>
                                    station.laneNumber === stationUp.laneNumber
                            )
                            ?.times?.filter((time) => time.index === 0),
                        stationsInfo
                            ?.find(
                                (station) =>
                                    station.laneNumber === stationUp.laneNumber
                            )
                            ?.times?.filter((time) => time.index === 1),
                        stationsInfo
                            ?.find(
                                (station) =>
                                    station.laneNumber === stationUp.laneNumber
                            )
                            ?.times?.filter((time) => time.index === 2),
                    ],
                    rank: allPhoneScores.map((scoreIndex, i) =>
                        scoreIndex.findIndex((score) => {
                            return (
                                score ===
                                stationsInfo
                                    ?.find(
                                        (station) =>
                                            station.laneNumber ===
                                            stationUp.laneNumber
                                    )
                                    ?.scores?.find((score) => score.index === i)
                                    ?.repCount
                            );
                        }) === -1
                            ? scoreIndex.length + 1
                            : scoreIndex.findIndex((score) => {
                                  return (
                                      score ===
                                      stationsInfo
                                          ?.find(
                                              (station) =>
                                                  station.laneNumber ===
                                                  stationUp.laneNumber
                                          )
                                          ?.scores?.find(
                                              (score) => score.index === i
                                          )?.repCount
                                  );
                              }) + 1
                    ),
                };
            }),
        [stationsInfo, allPhoneScores]
    );
    const restrieveWodStationInfo = async () => {
        if (!globals?.externalHeatId) return;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/mandelieu/station?heatId=${globals?.externalHeatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                setStationsInfo(json);
            } else {
                setStationsInfo([]);
            }
        } catch (err) {
            console.log(err);
            setStationsInfo([]);
        }
    };
    useInterval(
        () => {
            restrieveWodStationInfo();
        },
        dataSource === "web" ? 1000 : null
    );
    switch (dataSource) {
        case "iot":
            liveStations.sort((a, b) => a.laneNumber - b.laneNumber);
            if (rankingMethod === "repsCount") {
                liveStations.sort(
                    (a, b) => a.rank[currentIndex] - b.rank[currentIndex]
                );
            }
            return liveStations;

        case "web":
            phoneStations.sort((a, b) => a.laneNumber - b.laneNumber);
            if (rankingMethod === "repsCount") {
                phoneStations
                    .sort((a, b) => a.rank[currentIndex] - b.rank[currentIndex])
                    .sort((a, b) => {
                        if (a.result && !b.result) return -1;
                        if (!a.result && b.result) return 1;
                        if (!a.result && !b.result) return 0;
                        return (
                            Number(
                                a.result?.replace(":", "").replace("|", "")
                            ) -
                            Number(b.result?.replace(":", "").replace("|", ""))
                        );
                    });
            }
            return phoneStations;
        default:
            break;
    }
};

export default useStationReady;
