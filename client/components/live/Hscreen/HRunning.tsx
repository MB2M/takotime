import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import HRunningAthlete from "./HRunningAthlete";

const getWorkout = (workouts: Workout[], station: WidescreenStation) => {
    for (let workout of workouts) {
        if (workout.categories.includes(station.category)) {
            return workout;
        }
    }
};

const useStationPayload = (stations: Station[], ranks: StationRanked) => {
    const [stationsPayload, setStationsPayload] = useState<WidescreenStation[]>(
        []
    );

    useEffect(() => {
        console.log(stations);
        setStationsPayload(
            stations.map((s) => {
                const r = ranks.find((r) => r.lane === s.laneNumber);

                let rank: Ranks = [];
                if (!r) {
                    rank = [];
                } else {
                    rank = r.rank;
                }

                return {
                    laneNumber: s.laneNumber,
                    externalId: s.externalId,
                    participant: s.participant,
                    category: s.category,
                    repsPerBlock: s.dynamics?.currentWodPosition?.repsPerBlock,
                    currentMovement:
                        s.dynamics?.currentWodPosition?.currentMovement,
                    repsOfMovement:
                        s.dynamics?.currentWodPosition?.repsOfMovement,
                    totalRepsOfMovement:
                        s.dynamics?.currentWodPosition?.totalRepsOfMovement,
                    nextMovement: s.dynamics?.currentWodPosition?.nextMovement,
                    nextMovementReps:
                        s.dynamics?.currentWodPosition?.nextMovementReps,
                    result: s.dynamics?.result,
                    measurements: s.dynamics?.measurements,
                    state: s.dynamics?.state,
                    position: {
                        block: s.dynamics?.currentWodPosition?.block,
                        round: s.dynamics?.currentWodPosition?.round,
                        movement: s.dynamics?.currentWodPosition?.movement,
                        reps: s.dynamics?.currentWodPosition?.reps,
                    },
                    rank: rank,
                };
            })
        );
    }, [stations, ranks]);

    return stationsPayload;
};

function HorizontalRunning() {
    const { stations, ranks, loadedWorkouts } = useLiveDataContext();
    console.log(ranks);

    const stationsUpgraded = useStationPayload(stations, ranks);

    // const [isWod2, setIsWod2] = useState(false)
    // const [isWod3, setIsWod3] = useState(false)

    // useEffect(() => {
    // setIsWod2(statics.workoutName.includes('WOD 2'))
    // setIsWod3(statics.workoutName === 'Wod 3')
    // });

    // if (isWod3) {
    //     return <Ladder statics={statics} athletesData={athletesData}/>
    // }

    return (
        <Box>
            <Box
                className="displayZone"
                display={"flex"}
                overflow={"hidden"}
                gap={0}
                sx={{
                    width: 1920,
                    height: 1080,
                    backgroundColor: "#242424",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    // border: "3px solid",
                    // borderColor: "red",
                }}
            >
                {stationsUpgraded
                    .sort((a, b) => a.laneNumber - b.laneNumber)
                    .map((s) => (
                        <HRunningAthlete
                            key={s.laneNumber}
                            data={s}
                            workout={getWorkout(loadedWorkouts, s)}
                            divNumber={stationsUpgraded.length}
                        />
                    ))}
            </Box>
            <Box
                zIndex={1}
                position="absolute"
                top={"50%"}
                right={40}
                sx={{ transform: "translateY(-50%)" }}
            >
                {loadedWorkouts?.[0]?.blocks.flatMap((block) => {
                    let mvts: JSX.Element[][] = [];
                    for (let i = 0; i < block.rounds; i++) {
                        mvts.push(
                            block.movements.map((movement) => {
                                const mvt = `${
                                    movement.reps +
                                    (movement.varEachRounds || 0) * i
                                } ${movement.name}`;
                                return (
                                    <Typography
                                        color={"gray"}
                                        fontSize={"5.5rem"}
                                        fontFamily={"CantoraOne"} 
                                    >
                                        {mvt}
                                    </Typography>
                                );
                            })
                        );
                    }
                    return mvts;
                })}
            </Box>
        </Box>
    );
    {
        /* <div className="livezone d-flex justify-content-equity text-center align-text-bottom fixed-bottom px-1 pb-2 mb-0 h1">
                <>
                    {data.stations
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .map((s) => (
                            <HRunningAthlete key={s.laneNumber} data={s} />
                        ))}
                </>
            </div> */
    }
}

export default HorizontalRunning;
