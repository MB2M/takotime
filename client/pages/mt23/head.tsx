import { useCompetitionContext } from "../../context/competition";
import { useLiveDataContext } from "../../context/liveData/livedata";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Input,
    Stack,
    Typography,
} from "@mui/material";
import useStationWs from "../../hooks/bigscreen/useStationWs";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Image from "next/future/image";
import Chrono from "../../components/bigscreen/Chrono";
import useHeatDivisionInfo from "../../hooks/cc/useHeatDivisionInfo";

const Head = () => {
    const competition = useCompetitionContext();
    const { heatName } = useHeatDivisionInfo();
    const { globals, sendMessage } = useLiveDataContext();

    const { fullStations, activeWorkout } = useStationWs();

    const [currentCCScores, setCurrentCCScores] = useState<
        { id: number; result: string }[]
    >([]);

    const [open, setOpen] = useState(false);
    const [selectedMissingLift, setSelectedMissingLift] = useState(0);
    const [selectedLane, setSelectedLane] = useState(1);
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedMissingLift(0);
        setInputValue(event.target.value);
    };
    const handleConfirm = async () => {
        const score = selectedMissingLift
            ? `0${2 + Math.floor(selectedMissingLift / 6)}:${
                  10 * (selectedMissingLift % 6) || "00"
              }.000`
            : inputValue;

        try {
            let payload: any[];
            let id = fullStations.find(
                (station) => station.laneNumber === selectedLane
            )?.externalId;

            if (activeWorkout[0].layout === "MTSprintLadder") {
                payload = [{ score: 0, tiebreakerScore: score, id }];
            } else {
                payload = [{ score: score, id }];
            }

            const response = await fetch("/api/updateResults", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    eventId: competition?.eventId,
                    workoutId: activeWorkout[0].workoutId,
                    payload,
                }),
            });

            if (!response.ok) {
                alert("error posting score");
            }

            await refreshCCScores();
            handleClose();
        } catch (error) {
            console.error(error);
            alert("error posting score");
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handlePost = (laneNumber: number) => () => {
        sendMessage(JSON.stringify({ topic: "save", data: { laneNumber } }));
        setTimeout(() => refreshCCScores(), 2000);
    };

    const refreshCCScores = useCallback(async () => {
        if (!competition?.eventId || !activeWorkout[0]?.workoutId) return;

        try {
            const response = await fetch(
                `/api/results/byWorkout?eventId=${competition.eventId}&workoutId=${activeWorkout[0].workoutId}`
            );
            if (!response.ok) {
                throw new Error(await response.text());
            }

            setCurrentCCScores(await response.json());
        } catch (e) {
            console.log(e);
        }
    }, [activeWorkout[0]?.workoutId]);

    useEffect(() => {
        refreshCCScores();
        const interval = setInterval(() => {
            refreshCCScores();
        }, 15000);

        return () => clearInterval(interval);
    }, [refreshCCScores]);

    if (!globals) return null;

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Score</DialogTitle>
                <DialogContent>
                    <Stack justifyContent="center" spacing={2}>
                        <DialogContentText id="alert-dialog-description">
                            Select the number of missing lifts:
                        </DialogContentText>
                        <Grid2 container spacing={1}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                (missingLift) => (
                                    <Grid2 xs={2.3}>
                                        <Button
                                            onClick={() => {
                                                setInputValue("");
                                                setSelectedMissingLift(
                                                    missingLift
                                                );
                                            }}
                                            variant={
                                                missingLift ===
                                                selectedMissingLift
                                                    ? "contained"
                                                    : "outlined"
                                            }
                                        >
                                            {missingLift}
                                        </Button>
                                    </Grid2>
                                )
                            )}
                        </Grid2>
                        <DialogContentText id="alert-dialog-description">
                            Or enter score mm.ss.MMM
                        </DialogContentText>
                        <Box>
                            <Input onChange={handleInputChange}></Input>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Box
                sx={{
                    backgroundColor: "#101010",
                    minHeight: "100vh",
                }}
                px={2}
            >
                <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Image
                        src={`/api/images/${competition?.logoUrl}`}
                        width={50}
                    />
                    <Typography
                        color={"white"}
                        fontFamily={"bebasNeue"}
                        fontSize={"2rem"}
                    >
                        {heatName}
                    </Typography>
                    <Chrono fontSize={"2rem"} fontFamily={"ChivoMono"} />
                </Box>

                <Stack gap={1} justifyContent={"space-between"}>
                    {fullStations
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .map((station) => {
                            const endTime =
                                station.scores?.endTimer.at(-1)?.time;
                            const currentCCScore = currentCCScores
                                .find(
                                    (score) => score.id === station.externalId
                                )
                                ?.result.replaceAll("0<span> + ", "")
                                .replaceAll("</span>", "");

                            const isUpToDate = currentCCScore === endTime;

                            return (
                                <Box
                                    key={station.laneNumber}
                                    width={1}
                                    height={100}
                                    border={"1px solid gray"}
                                    borderRadius={2}
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                    alignItems={"center"}
                                    px={2}
                                >
                                    <Box display={"flex"} gap={2} height={1}>
                                        <Typography
                                            fontFamily={"BebasNeue"}
                                            fontSize={"2rem"}
                                            color={"white"}
                                            borderRight={"1px solid gray"}
                                            my={"auto"}
                                            px={1}
                                        >
                                            {station.laneNumber}
                                        </Typography>
                                        <Typography
                                            fontFamily={"BebasNeue"}
                                            fontSize={"2rem"}
                                            color={"white"}
                                            my={"auto"}
                                        >
                                            {station.participant}
                                        </Typography>
                                    </Box>
                                    {endTime && (
                                        <Box
                                            display={"flex"}
                                            justifyContent={"center"}
                                            alignItems={"center"}
                                        >
                                            <Typography
                                                px={1}
                                                pt={0.5}
                                                color={"white"}
                                                fontSize={"3rem"}
                                                fontFamily={"BebasNeue"}
                                                borderRadius={"10px"}
                                                sx={{
                                                    textShadow:
                                                        "0px 0px 15px black",
                                                }}
                                            >
                                                {endTime}
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box width={170}>
                                        {!isUpToDate &&
                                            (endTime ? (
                                                <Button
                                                    variant={"contained"}
                                                    sx={{
                                                        backgroundColor:
                                                            "#02abcc",
                                                        width: "100%",
                                                    }}
                                                    size={"large"}
                                                    onClick={handlePost(
                                                        station.laneNumber
                                                    )}
                                                >
                                                    Post Score
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant={"contained"}
                                                    sx={{
                                                        backgroundColor:
                                                            "#e2538b",
                                                        width: "100%",
                                                    }}
                                                    size={"large"}
                                                    onClick={() => {
                                                        setOpen(true);
                                                        setSelectedLane(
                                                            station.laneNumber
                                                        );
                                                    }}
                                                >
                                                    Manual Score
                                                </Button>
                                            ))}
                                        <Typography
                                            color={"white"}
                                            textAlign={"center"}
                                            py={0.3}
                                        >
                                            {currentCCScore}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                </Stack>
            </Box>
        </>
    );
};

export default Head;
