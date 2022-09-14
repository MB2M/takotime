import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import { workouts } from "../config";
import useWorkout from "../../../../hooks/useWorkout";
import RemoteWeight from "../../../../components/mandelieu/RemoteWeight";

const LaneRemote = () => {
    const { globals, stations } = useLiveDataContext();
    const router = useRouter();
    const [stationInfo, setStationInfo] = useState<BaseStation | null>(null);
    const [scoreIndex, setScoreIndex] = useState<number>(0);
    const [wodCount, setWodCount] = useState<number>(0);

    const { laneNumber }: any = useMemo(() => router.query, [router]);

    const repsCompleted = useMemo(
        () =>
            stationInfo?.scores?.find((score) => score.index === scoreIndex)
                ?.repCount || 0,
        [stationInfo, scoreIndex]
    );

    const workout = useMemo(
        () =>
            workouts.find(
                (workout) =>
                    workout.workoutIds.includes(
                        globals?.externalWorkoutId.toString() || ""
                    ) && scoreIndex === workout.index
            ),
        [workouts, globals?.externalWorkoutId, scoreIndex]
    );

    useEffect(() => {
        const count = workouts.filter((workout) =>
            workout.workoutIds.includes(
                globals?.externalWorkoutId.toString() || ""
            )
        ).length;
        setWodCount(count);
    }, [workouts, globals?.externalWorkoutId]);

    const {
        totalReps,
        currentMovement,
        currentMovementReps,
        currentMovementTotalReps,
        currentRound,
        workoutType,
    } = useWorkout(workout, repsCompleted);

    const stationData = useMemo(() => {
        return stations.find(
            (station) => station.laneNumber === Number(laneNumber)
        );
    }, [laneNumber, stations]);

    const restrieveStationInfo = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/mandelieu/station/${laneNumber}?heatId=${globals?.externalHeatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                json?.scores?.reverse();
                setStationInfo(json);
            } else {
                setStationInfo(null);
            }
        } catch (err) {
            console.log(err);
            setStationInfo(null);
        }
    };

    useEffect(() => {
        if (!laneNumber || !globals?.externalHeatId) return;
        restrieveStationInfo();
    }, [globals?.externalHeatId, laneNumber]);

    const handleRepsClick = async (value: number) => {
        if (!globals?.externalHeatId) return;
        const payload = {
            heatId: globals.externalHeatId.toString(),
            laneNumber,
            score: Math.min(
                Math.max(repsCompleted + value, 0),
                workoutType === "forTime" ? totalReps : 10000000
            ),
        };
        console.log(payload);
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/mandelieu/station/${laneNumber}?heatId=${globals?.externalHeatId}&scoreIndex=${scoreIndex}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
            if (response.ok) {
                restrieveStationInfo();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleVariantSelect = (index: number) => {
        setScoreIndex(index);
    };

    return (
        <Container sx={{ height: "100vh" }}>
            <Stack height="100%" gap={3} py={5}>
                <Box
                    display="flex"
                    justifyContent={"flex-start"}
                    textAlign="center"
                    // paddingTop="20px"
                >
                    <Typography variant="h4" fontFamily={"CantoraOne"}>
                        {stationData?.laneNumber}
                    </Typography>
                    <Typography variant="h4" fontFamily={"CantoraOne"} ml={4}>
                        {stationData?.participant}
                    </Typography>
                </Box>
                <Box
                    // my={3}
                    display="flex"
                    justifyContent={"center"}
                >
                    {[...Array(wodCount + 1).keys()]
                        .splice(1)
                        .map((_, index) => (
                            <Button
                                key={index}
                                variant={
                                    scoreIndex === index
                                        ? "contained"
                                        : "outlined"
                                }
                                size={"large"}
                                onClick={() => handleVariantSelect(index)}
                            >
                                variant {index + 1}
                            </Button>
                        ))}
                </Box>
                {workoutType && ["amrap", "forTime"].includes(workoutType) && (
                    <>
                        <Box my={"auto"}>
                            {workoutType === "amrap" && currentRound > 0 && (
                                <Typography
                                    textAlign="center"
                                    fontFamily={"CantoraOne"}
                                >
                                    Round n° {currentRound}
                                </Typography>
                            )}
                            <Typography
                                textAlign="center"
                                variant="h1"
                                fontFamily={"CantoraOne"}
                            >
                                {currentMovementReps}
                            </Typography>
                            <Typography variant="h5" textAlign="center">
                                {`/ ${currentMovementTotalReps} ${currentMovement}`}
                            </Typography>
                        </Box>
                        <Box
                            display="flex"
                            justifyContent={"center"}
                            mt={"auto"}
                        >
                            <Stack gap={5}>
                                <Button
                                    variant={"contained"}
                                    color="success"
                                    fullWidth
                                    sx={{
                                        height: "200px",
                                        width: "70vw",
                                        fontSize: "80px",
                                    }}
                                    onClick={() => handleRepsClick(1)}
                                >
                                    +
                                </Button>
                                <Button
                                    variant={"contained"}
                                    color="error"
                                    sx={{ width: "70vw", fontSize: "20px" }}
                                    onClick={() => handleRepsClick(-1)}
                                >
                                    -
                                </Button>
                            </Stack>
                        </Box>
                    </>
                )}
                {workoutType && ["maxWeight"].includes(workoutType) && (
                    <RemoteWeight
                        heatId={globals?.externalHeatId}
                        laneNumber={laneNumber}
                        numberOfPartner={2}
                    />
                )}
            </Stack>
        </Container>
    );
};

export default LaneRemote;
