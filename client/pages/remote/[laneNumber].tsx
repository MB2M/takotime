import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";
import { useCompetitionContext } from "../../context/competition";
import Chrono from "../../components/bigscreen/Chrono";
import RemoteClassic from "../../components/remote/RemoteClassic";
import RemoteHeader from "../../components/remote/RemoteHeader";
import RemoteConfirmScore from "../../components/remote/RemoteConfirmScore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoteSplit from "../../components/remote/RemoteSplit";

const LaneRemote = () => {
    const competition = useCompetitionContext();
    const { globals, stations, sendMessage, registerListener } =
        useLiveDataContext();

    const router = useRouter();
    const [stationInfo, setStationInfo] = useState<BaseStation2 | null>(null);

    const [openSnack, setOpenSnack] = useState(false);
    const [snackMessage, setSnackMessage] = useState<{
        message: string;
        severity: string;
    }>({ message: "", severity: "error" });
    const [panelOpen, setPanelOpen] = useState(false);

    const laneNumber = router.query.laneNumber as string;
    const stationData = useMemo(() => {
        return stations.find(
            (station) => station.laneNumber === Number(laneNumber)
        );
    }, [laneNumber, stations]);

    const category = stationData?.category || "";

    const workouts = useMemo(
        () =>
            competition?.workouts?.filter(
                (workout) =>
                    workout.linkedWorkoutId ===
                        globals?.externalWorkoutId.toString() &&
                    (!workout.categories ||
                        workout.categories.length === 0 ||
                        workout.categories.includes(category))
            ) || [],
        [competition?.workouts, globals?.externalWorkoutId, category]
    );

    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>(
        () => workouts[0]?.workoutId || ""
    );

    useEffect(() => {
        if (!workouts[0]?.workoutId) return;
        setSelectedWorkoutId(workouts[0].workoutId);
    }, [workouts[0]?.workoutId]);

    const workout = useMemo(
        () => workouts.find((wod) => wod.workoutId === selectedWorkoutId),
        [selectedWorkoutId, workouts]
    );

    console.log(workout);

    const layout = workout?.layout;

    useEffect(() => {
        if (!laneNumber) return;
        const unregister = registerListener(
            `station/${laneNumber}`,
            (data) => {
                setStationInfo(data);
            },
            true
        );

        const unregister2 = registerListener(
            `postScore/${laneNumber}`,
            (data) => {
                setSnackMessage({
                    message: data,
                    severity: data === "error" ? "error" : "success",
                });
                setOpenSnack(true);
            },
            false
        );
        return () => {
            unregister();
            unregister2();
        };
    }, [laneNumber]);

    const wodCount = workouts.length;

    const handleWorkoutSelect = (id?: string) => {
        if (!id) return;
        setSelectedWorkoutId(id);
    };

    const handleCloseSnack = () => {
        setOpenSnack(false);
    };

    const handleChangePanel = () => {
        setPanelOpen((current) => !current);
    };

    useEffect(() => {
        if (!globals?.state) return;

        if (globals.state <= 2) setPanelOpen(true);

        if (globals.state === 3) setPanelOpen(false);
    }, [globals?.state]);

    if (!stationData || !globals || !layout) return null;

    return (
        <Box sx={{ height: "100vh" }}>
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                open={openSnack}
                onClose={handleCloseSnack}
                autoHideDuration={4000}
                message={snackMessage.message}
                ContentProps={{
                    sx: {
                        backgroundColor:
                            snackMessage.severity === "error"
                                ? "indianred"
                                : "darkgreen",
                        p: "10px",
                        fontSize: "1rem",
                    },
                }}
            />

            <Stack gap={1} justifyContent={"space-between"} height={1}>
                <Box position={"fixed"} top={0} width={1} zIndex={10}>
                    <RemoteHeader
                        participant={stationData.participant}
                        laneNumber={laneNumber}
                        chronoDirection={workout?.options?.chronoDirection}
                        state={globals.state}
                    />
                </Box>
                <Container sx={{ height: "100vh", pt: "120px" }}>
                    {globals.state === 0 && (
                        <Box textAlign={"center"}>
                            <Stack>
                                <Typography variant={"h5"} color={"red"}>
                                    Workout not started
                                </Typography>
                            </Stack>
                            <p>
                                As soon as the timer start, you will be able to
                                score the workout.
                            </p>
                            <p>
                                Please take time to review the workout
                                description below:
                            </p>
                        </Box>
                    )}

                    {globals.state === 1 && (
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            height={1}
                        >
                            <Chrono fontSize={"12rem"} />
                        </Box>
                    )}

                    {stationInfo && globals.state > 2 && (
                        <RemoteConfirmScore
                            scores={stationInfo.scores}
                            workouts={workouts}
                            laneNumber={laneNumber}
                        />
                    )}

                    {globals?.state >= 2 && (
                        <Accordion
                            elevation={0}
                            sx={{ "MuiAccordion-root": { boxShadow: "none" } }}
                            onChange={handleChangePanel}
                            expanded={panelOpen}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>
                                    {globals?.state === 3 ? "Update Score" : ""}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box
                                    // my={3}
                                    display="flex"
                                    justifyContent={"center"}
                                    gap={2}
                                    my={2}
                                >
                                    {wodCount > 1 &&
                                        workouts.map((workout, index) => (
                                            <Button
                                                key={workout.workoutId}
                                                variant={
                                                    selectedWorkoutId ===
                                                    workout.workoutId
                                                        ? "contained"
                                                        : "outlined"
                                                }
                                                onClick={() =>
                                                    handleWorkoutSelect(
                                                        workout.workoutId
                                                    )
                                                }
                                            >
                                                score {index + 1}
                                            </Button>
                                        ))}
                                </Box>
                                {layout === "MTSprintLadder" && (
                                    <RemoteClassic
                                        laneNumber={+laneNumber}
                                        sendMessage={sendMessage}
                                        station={stationInfo}
                                        workout={workout}
                                        participantId={stationData.externalId.toString()}
                                        category={category}
                                    />
                                )}
                                {layout.includes("default") && (
                                    <RemoteClassic
                                        laneNumber={+laneNumber}
                                        sendMessage={sendMessage}
                                        station={stationInfo}
                                        workout={workout}
                                        participantId={stationData.externalId.toString()}
                                        category={category}
                                    />
                                )}
                                {workout && layout.includes("split") && (
                                    <RemoteSplit
                                        laneNumber={+laneNumber}
                                        sendMessage={sendMessage}
                                        station={stationInfo}
                                        workout={workout}
                                        participantId={stationData.externalId.toString()}
                                        category={category}
                                    />
                                )}
                                {/*{layout === "maxWeight" && (*/}
                                {/*    <RemoteWeight*/}
                                {/*        heatId={globals?.externalHeatId}*/}
                                {/*        laneNumber={laneNumber as string}*/}
                                {/*        numberOfPartner={2}*/}
                                {/*        category={category}*/}
                                {/*    />*/}
                                {/*)}*/}
                            </AccordionDetails>
                        </Accordion>
                    )}
                </Container>
            </Stack>
        </Box>
    );
};

export default LaneRemote;
