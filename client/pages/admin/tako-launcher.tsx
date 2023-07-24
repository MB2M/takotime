import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    Paper,
    Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useState } from "react";
import { useCompetitionContext } from "../../context/competition";
import { useLiveDataContext } from "../../context/liveData/livedata";
import TimerForm from "../../components/TimerForm";
import Image from "next/future/image";
import CCLoader2 from "../../components/dashboard/CCLoader2";
import { usePlanning } from "../../utils/mt/usePlanning";
import { loadHeat } from "../../utils/cc/loadHeat";
import useHeatDivisionInfo from "../../hooks/cc/useHeatDivisionInfo";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useStationWs from "../../hooks/bigscreen/useStationWs";

const TakoLauncher = () => {
    const competition = useCompetitionContext();
    const { stationDevices, globals, devices } = useLiveDataContext();

    const { fullStations } = useStationWs();

    const planning = usePlanning(10000);

    const nextHeatId = planning.findIndex(
        (heat) => heat.id === globals?.externalHeatId
    );

    const nextHeat = planning[nextHeatId + 1];
    const { heatName, workoutName } = useHeatDivisionInfo();
    const [loadNextOpen, setLoadNextOpen] = useState(false);

    const handleLoadNextHeat = async () => {
        if (!competition) return;
        await loadHeat(competition.eventId, nextHeat.workoutId, nextHeat.id);
        setLoadNextOpen(false);
    };

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#eeeeee" }}>
            <Dialog open={loadNextOpen}>
                <DialogContent>
                    <DialogContentText>
                        Confirm {nextHeat?.title} load?
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={handleLoadNextHeat}>Yes</Button>
                        <Button onClick={() => setLoadNextOpen(false)}>
                            No
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Stack alignItems={"center"}>
                <Box width={1} textAlign={"center"}>
                    <Box width={1} textAlign={"center"}>
                        <Paper
                            elevation={3}
                            sx={{ backgroundColor: "#121212" }}
                        >
                            <Image
                                src={`/api/images/${competition?.logoUrl}`}
                                width={120}
                            />
                        </Paper>
                    </Box>
                    <Box>
                        <Typography
                            fontSize={"1.8rem"}
                            fontFamily={"bebasNeue"}
                        >
                            {workoutName}
                        </Typography>
                        <Typography
                            fontSize={"1.8rem"}
                            fontFamily={"bebasNeue"}
                        >
                            {heatName}
                        </Typography>
                    </Box>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography
                                fontFamily={"bebasNeue"}
                                fontSize={"1.3rem"}
                            >
                                Heat loader
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {nextHeat && (
                                <Box p={2} textAlign={"center"}>
                                    <CCLoader2 />
                                    <Typography fontWeight={"bold"}>
                                        or load next heat
                                    </Typography>

                                    <Typography>{nextHeat.title}</Typography>
                                    <Button
                                        variant={"outlined"}
                                        onClick={() => setLoadNextOpen(true)}
                                    >
                                        Load
                                    </Button>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography
                                fontFamily={"bebasNeue"}
                                fontSize={"1.3rem"}
                            >
                                Timer loader
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box
                                textAlign="center"
                                display={"flex"}
                                justifyContent={"center"}
                            >
                                <TimerForm row />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography
                                fontFamily={"bebasNeue"}
                                fontSize={"1.3rem"}
                            >
                                Stations
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1}>
                                {fullStations
                                    .sort((a, b) => a.laneNumber - b.laneNumber)
                                    .map((station) => {
                                        const stationDevice =
                                            stationDevices.find(
                                                (s: StationDevices) =>
                                                    s.laneNumber ===
                                                    station.laneNumber
                                            );
                                        const stationConnected =
                                            devices.find((device) => {
                                                return (
                                                    device.role === "station" &&
                                                    device.ref ===
                                                        stationDevice?.ip
                                                );
                                            })?.state === 1;
                                        return (
                                            <Box
                                                border={"2px solid gray"}
                                                borderRadius={2}
                                                display={"flex"}
                                                justifyContent={"space-between"}
                                                width={1}
                                                minHeight={50}
                                                overflow={"hidden"}
                                            >
                                                <Box
                                                    px={0.5}
                                                    sx={{
                                                        background: "darkgray",
                                                    }}
                                                    display={"flex"}
                                                    justifyContent={"center"}
                                                    alignItems={"center"}
                                                    width={25}
                                                >
                                                    <Typography
                                                        color={"white"}
                                                        fontFamily={"bebasNeue"}
                                                        fontSize={"1.3rem"}
                                                        textAlign={"center"}
                                                    >
                                                        {station.laneNumber}
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    px={1}
                                                    display={"flex"}
                                                    alignItems={"start"}
                                                    flexGrow={1}
                                                    flexDirection={"column"}
                                                >
                                                    <Box
                                                        display={"flex"}
                                                        justifyContent={
                                                            "space-between"
                                                        }
                                                        width={1}
                                                    >
                                                        <Typography
                                                            height={1}
                                                            fontFamily={
                                                                "bebasNeue"
                                                            }
                                                            fontSize={"1.2rem"}
                                                        >
                                                            {
                                                                station.participant
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            height={1}
                                                            fontFamily={
                                                                "bebasNeue"
                                                            }
                                                            fontSize={"0.8rem"}
                                                        >
                                                            {stationDevice?.ip}
                                                        </Typography>
                                                    </Box>
                                                    {station.scores?.endTimer.map(
                                                        (timer) => (
                                                            <Typography
                                                                height={1}
                                                                fontFamily={
                                                                    "bebasNeue"
                                                                }
                                                                fontSize={
                                                                    "1.2rem"
                                                                }
                                                            >
                                                                {timer.time}
                                                            </Typography>
                                                        )
                                                    )}
                                                </Box>
                                                <Typography
                                                    px={0.4}
                                                    sx={{
                                                        background: "lightgray",
                                                    }}
                                                    display={"flex"}
                                                    alignItems={"center"}
                                                    fontSize={"0.8rem"}
                                                >
                                                    {stationConnected
                                                        ? "✔️"
                                                        : "⭕"}
                                                </Typography>
                                            </Box>
                                        );
                                    })}
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Stack>
        </Box>
    );
};

export default TakoLauncher;
