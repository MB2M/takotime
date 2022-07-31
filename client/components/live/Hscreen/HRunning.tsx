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
        <Box
            className="displayZone"
            sx={{
                width: 1920,
                height: 1080,
                backgroundColor: "black",
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
                    />
                ))}
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
