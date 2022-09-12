import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import { workouts } from "../config";
import useWorkout from "../../../../hooks/useWorkout";

const LaneRemote = () => {
    const { globals, stations } = useLiveDataContext();
    const router = useRouter();
    const [stationInfo, setStationInfo] = useState<BaseStation | null>(null);
    const [scoreIndex, setScoreIndex] = useState<number>(0);

    const { laneNumber }: any = useMemo(() => router.query, [router]);

    const repsCompleted = useMemo(
        () =>
            stationInfo?.scores?.find((score) => score.index === scoreIndex)
                ?.repCount || 0,
        [stationInfo, scoreIndex]
    );

    const {
        totalReps,
        currentMovement,
        currentMovementReps,
        currentMovementTotalReps,
    } = useWorkout(
        workouts,
        globals?.externalWorkoutId.toString() || "",
        repsCompleted
    );
    // CREATE HOOKS
    // const workout: WorkoutDescription = {
    //     name: "Wod1",
    //     main: {
    //         movements: [],
    //         reps: [],
    //     },
    // };

    console.log(stationInfo);

    // const totalReps = 55;
    // const currentMovement = "WALL BALL";
    // const currentMovementReps = "50";

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
            score: Math.min(Math.max(repsCompleted + value, 0), totalReps),
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

    return (
        <Container sx={{ height: "100vh" }}>
            <Stack
                height="100%"
                justifyContent={"space-between"}
                gap={3}
                py={5}
            >
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
                <Box>
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
                <Box display="flex" justifyContent={"center"}>
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
            </Stack>
        </Container>
    );
};

export default LaneRemote;
