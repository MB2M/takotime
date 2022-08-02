import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import HRunningAthlete from "./HRunningAthlete";
import useStationPayload from "../../../hooks/useStationPayload";

const getWorkout = (workouts: Workout[], station: WidescreenStation) => {
    for (let workout of workouts) {
        if (workout.categories.includes(station.category)) {
            return workout;
        }
    }
};

function HorizontalRunning() {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    // const chrono = useChrono(globals?.startTime, globals?.duration);

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
                {globals?.state === 1 ? (
                    <Typography
                        color={"gray"}
                        fontSize={"45rem"}
                        fontFamily={"CantoraOne"}
                        paddingRight={"200px"}
                    >
                        {/* {chrono?.toString().slice(1) || ""} */}
                    </Typography>
                ) : (
                    loadedWorkouts?.[0]?.blocks.flatMap((block) => {
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
                    })
                )}
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