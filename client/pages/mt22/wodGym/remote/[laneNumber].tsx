import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Modal,
    Slider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const LaneRemote = () => {
    const { globals } = useLiveDataContext();
    const { stations } = useLiveDataContext();
    const router = useRouter();
    const { laneNumber }: any = useMemo(() => router.query, [router]);
    const [stationInfo, setStationInfo] = useState<GymStation | null>(null);
    const [heatConfig, setHeatConfig] = useState<HeatConfig | null>(null);
    const [selectedRoundNumber, setSelectedRoundNumber] = useState<number>(1);
    const [selectedType, setSelectedType] = useState<"gym" | "buyin">("buyin");

    const selectedRound = useMemo(() => {
        return heatConfig?.rounds?.find(
            (round) => round.roundNumber === selectedRoundNumber
        );
    }, [selectedRoundNumber]);

    const stationData = useMemo(() => {
        return stations.find(
            (station) => station.laneNumber === Number(laneNumber)
        );
    }, [laneNumber, stations]);

    console.log(globals?.externalHeatId);

    // useEffect(() => console.log(lastStationInfo), [lastStationInfo]); // to REMOVE

    const restrieveStationInfo = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodGym/station/${laneNumber}?heatId=${globals?.externalHeatId}`,
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

    const retrieveHeatConfig = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodGym/heatconfig/${globals?.externalHeatId}`,
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
                setHeatConfig(json);
            } else {
                setHeatConfig(null);
            }
        } catch (err) {
            console.log(err);
            setHeatConfig(null);
        }
    };

    useEffect(() => {
        if (!laneNumber || !globals?.externalHeatId) return;
        restrieveStationInfo();
        retrieveHeatConfig();
    }, [globals?.externalHeatId, laneNumber]);

    const patchResult = async (
        scoreId: string,
        newState: "Success" | "Fail" | "Cancel"
    ) => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station/${laneNumber}?scoreId=${scoreId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ state: newState }),
                }
            );
            if (response.ok) {
                restrieveStationInfo();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleRoundSelect = (roundNumber: number) => {
        setSelectedRoundNumber(roundNumber);
    };

    const handleTypeSelect = (type: "gym" | "buyin") => {
        setSelectedType(type);
    };

    const roundReps = (roundNumber: number, type: "gym" | "buyin") => {
        if (type === "buyin") {
            return (
                stationInfo?.scores?.find(
                    (score) => score.roundNumber === roundNumber
                )?.buyinRepCount || 0
            );
        }
        if (type === "gym") {
            return (
                (stationInfo?.scores?.find(
                    (score) => score.roundNumber === roundNumber
                )?.gymRepCount || 0) *
                (heatConfig?.rounds.find(
                    (round) => round.roundNumber === roundNumber
                )?.pointsPerMovement || 0)
            );
        }
        return 0;
    };

    const handleRepsClick = async (
        roundNumber: number,
        type: "buyin" | "gym",
        value: number
    ) => {
        if (!globals?.externalHeatId) return;

        const payload = {
            heatId: globals.externalHeatId.toString(),
            laneNumber,
            scores: heatConfig?.rounds.map((round) => {
                const currentScore = stationInfo?.scores?.find(
                    (score) => score.roundNumber === round.roundNumber
                );
                if (currentScore) {
                    if (round.roundNumber === roundNumber) {
                        switch (type) {
                            case "buyin":
                                return {
                                    ...currentScore,
                                    buyinRepCount: Math.min(
                                        Math.max(
                                            currentScore.buyinRepCount + value,
                                            0
                                        ),
                                        round.buyInReps
                                    ),
                                };
                            case "gym":
                                return {
                                    ...currentScore,
                                    gymRepCount: Math.max(
                                        currentScore.gymRepCount + value,
                                        0
                                    ),
                                };
                            default:
                                return currentScore;
                        }
                    } else {
                        return currentScore;
                    }
                } else {
                    if (round.roundNumber === roundNumber) {
                        switch (type) {
                            case "buyin":
                                return {
                                    roundNumber: round.roundNumber,
                                    buyinRepCount: Math.max(value, 0),
                                    gymRepcount: 0,
                                };
                            case "gym":
                                return {
                                    roundNumber: round.roundNumber,
                                    buyinRepCount: 0,
                                    gymRepcount: Math.max(value, 0),
                                };
                            default:
                                return {
                                    roundNumber: round.roundNumber,
                                    buyinRepCount: 0,
                                    gymRepcount: 0,
                                };
                        }
                    } else {
                        return {
                            roundNumber: round.roundNumber,
                            buyinRepCount: 0,
                            gymRepcount: 0,
                        };
                    }
                }
            }),
        };
        console.log(payload);
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodGym/station/${laneNumber}?heatId=${globals?.externalHeatId}`,
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
                <Box
                    // my={3}
                    display="flex"
                    justifyContent={"center"}
                >
                    {
                        // laneNumber &&
                        //     globals?.externalHeatId &&
                        heatConfig?.rounds?.map((round) => (
                            <Button
                                key={round.roundNumber}
                                variant={
                                    selectedRoundNumber === round.roundNumber
                                        ? "contained"
                                        : "outlined"
                                }
                                size={"large"}
                                onClick={() =>
                                    handleRoundSelect(round.roundNumber)
                                }
                            >
                                Round {round.roundNumber}
                            </Button>
                            // <Box>
                            //     <Typography variant="h5">
                            //         Round {round.roundNumber}
                            //     </Typography>
                            //     <Box>
                            //         <Typography>BuyIn : </Typography>
                            //         <Typography>
                            //             {roundReps(round.roundNumber, "buyin")}
                            //         </Typography>
                            //         <Button
                            //             variant={"contained"}
                            //             color="success"
                            //             onClick={() =>
                            //                 handleRepsClick(
                            //                     round.roundNumber,
                            //                     "buyin",
                            //                     1
                            //                 )
                            //             }
                            //             disabled={
                            //                 roundReps(round.roundNumber, "buyin") >=
                            //                 round.buyInReps
                            //             }
                            //         >
                            //             +
                            //         </Button>
                            //         <Button
                            //             variant={"contained"}
                            //             color="error"
                            //             onClick={() =>
                            //                 handleRepsClick(
                            //                     round.roundNumber,
                            //                     "buyin",
                            //                     -1
                            //                 )
                            //             }
                            //             disabled={
                            //                 roundReps(round.roundNumber, "buyin") <= 0
                            //             }
                            //         >
                            //             -
                            //         </Button>
                            //     </Box>
                            //     <Box>
                            //         <Typography>Gym Mvt : </Typography>
                            //         <Typography>
                            //             {roundReps(round.roundNumber, "gym")}
                            //         </Typography>
                            //         <Button
                            //             variant={"contained"}
                            //             color="success"
                            //             onClick={() =>
                            //                 handleRepsClick(round.roundNumber, "gym", 1)
                            //             }
                            //             disabled={
                            //                 round.buyInReps !==
                            //                 roundReps(round.roundNumber, "buyin")
                            //             }
                            //         >
                            //             +
                            //         </Button>
                            //         <Button
                            //             variant={"contained"}
                            //             color="error"
                            //             onClick={() =>
                            //                 handleRepsClick(
                            //                     round.roundNumber,
                            //                     "gym",
                            //                     -1
                            //                 )
                            //             }
                            //             disabled={
                            //                 round.buyInReps !==
                            //                     roundReps(round.roundNumber, "buyin") ||
                            //                 roundReps(round.roundNumber, "gym") <= 0
                            //             }
                            //         >
                            //             -
                            //         </Button>
                            //     </Box>
                            // </Box>
                        ))
                    }
                </Box>
                <Box
                    gap={2}
                    // my={3}
                    display="flex"
                    justifyContent={"center"}
                >
                    {["buyin", "gym"].map((type: any) => (
                        <Button
                            key={type}
                            variant={
                                selectedType === type ? "contained" : "outlined"
                            }
                            size={"large"}
                            onClick={() => handleTypeSelect(type)}
                        >
                            {type}
                        </Button>
                    ))}
                </Box>
                <Box
                // my={3}
                >
                    <Typography
                        textAlign="center"
                        variant="h1"
                        fontFamily={"CantoraOne"}
                    >
                        {roundReps(selectedRoundNumber, selectedType)}
                    </Typography>
                    <Typography variant="h5" textAlign="center">
                        {selectedType === "buyin" &&
                            selectedRound &&
                            `/${selectedRound?.buyInReps}`}
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    justifyContent={"center"}
                    //  my={3}
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
                            onClick={() =>
                                handleRepsClick(
                                    selectedRoundNumber,
                                    selectedType,
                                    1
                                )
                            }
                        >
                            +
                        </Button>
                        <Button
                            variant={"contained"}
                            color="error"
                            sx={{ width: "70vw", fontSize: "20px" }}
                            onClick={() =>
                                handleRepsClick(
                                    selectedRoundNumber,
                                    selectedType,
                                    -1
                                )
                            }
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
