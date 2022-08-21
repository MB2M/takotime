import { Divider, Typography } from "@mui/material";
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
    const chrono = useChrono(globals?.startTime, globals?.duration);

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
        <Box sx={{ width: 1920, height: 1080, backgroundColor: "#242424" }}>
            <Box
                className="displayZone"
                display={"flex"}
                overflow={"hidden"}
                gap={0}
                sx={{
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    height: "100%",
                }}
            >
                {stationsUpgraded
                    ?.sort((a, b) => a.laneNumber - b.laneNumber)
                    ?.map((s, i) => {
                        return (
                            <>
                                <HRunningAthlete
                                    key={s.laneNumber}
                                    data={s}
                                    workout={getWorkout(loadedWorkouts, s)}
                                    divNumber={stationsUpgraded.length}
                                    rankByFront={
                                        1 +
                                        (s.result?.[s.result?.length - 1] === ""
                                            ? stationsUpgraded
                                                  .filter(
                                                      (station) =>
                                                          station.category ===
                                                          s.category
                                                  )
                                                  .map(
                                                      (station) =>
                                                          station
                                                              .repsPerBlock?.[
                                                              station
                                                                  .repsPerBlock
                                                                  ?.length - 1
                                                          ] || 0
                                                  )
                                                  .sort((a, b) => b - a)
                                                  .findIndex(
                                                      (reps) =>
                                                          reps ===
                                                          (s.repsPerBlock?.[
                                                              s.repsPerBlock
                                                                  .length - 1
                                                          ] || 0)
                                                  ) +
                                              stationsUpgraded.filter(
                                                  (station) =>
                                                      station.category ===
                                                          s.category &&
                                                      station.result[
                                                          station.result
                                                              .length - 1
                                                      ] !== ""
                                              ).length
                                            : stationsUpgraded
                                                  .filter(
                                                      (station) =>
                                                          station.category ===
                                                              s.category &&
                                                          station.result?.[
                                                              station.result
                                                                  .length - 1
                                                          ] !== ""
                                                  )
                                                  .sort().reverse()
                                                  .findIndex(
                                                      (result) =>
                                                          result.result ===
                                                          s.result
                                                  ))
                                    }
                                />
                                <div>
                                    {i < stationsUpgraded.length - 1 &&
                                        stationsUpgraded[i + 1].category !==
                                            s.category && (
                                            <Divider
                                                sx={{
                                                    backgroundColor: "white",
                                                }}
                                            ></Divider>
                                        )}
                                </div>
                            </>
                        );
                    })}
            </Box>

            {/* <Box
                zIndex={1}
                position="absolute"
                top={"50%"}
                width={"50%"}
                right={35}
                sx={{ transform: "translateY(-50%)" }}
            >
                {globals?.state === 1 ? (
                    <Typography
                        color={"gray"}
                        fontSize={"45rem"}
                        fontFamily={"CantoraOne"}
                        paddingRight={"200px"}
                    >
                        {chrono?.toString().slice(1) || ""}
                    </Typography>
                ) : (
                    loadedWorkouts?.[0]?.blocks.flatMap((block, index1) => {
                        let mvts: JSX.Element[][] = [];
                        for (let i = 0; i < block.rounds; i++) {
                            mvts.push(
                                block.movements.map((movement, index2) => {
                                    const mvt = `${
                                        movement.reps +
                                        (movement.varEachRounds || 0) * i
                                    } ${movement.name}`;
                                    return (
                                        <Typography
                                            key={index1 + "-" + index2}
                                            color={"gray"}
                                            fontSize={"4.5rem"}
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
            </Box> */}
        </Box>
    );
}

export default HorizontalRunning;
