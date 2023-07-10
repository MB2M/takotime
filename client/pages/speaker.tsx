import {
    Button,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useCompetitionCornerContext } from "../context/competitionCorner/data/competitionCorner";
import { useLiveDataContext } from "../context/liveData/livedata";
import { logoBlanc, workouts } from "../eventConfig/mandelieu/config";
import Image from "next/image";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // py: 6,
    // px: 2,
};

const Speaker = () => {
    const { globals } = useLiveDataContext();
    const EPInfo = useCompetitionCornerContext();
    const [stations, setStations] = useState<any>();
    const [open, setOpen] = useState<boolean>(false);

    console.log(EPInfo);

    const workout = useMemo(
        () =>
            workouts.find(
                (workout) =>
                    workout.workoutIds.includes(
                        globals?.externalWorkoutId.toString() || ""
                    ) && workout.index === 0
            ),
        [workouts, globals?.externalWorkoutId]
    );

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `https://competitioncorner.net/api2/v1/schedule/workout/${globals?.externalWorkoutId}`
                );
                if (response.ok) {
                    const json = await response.json();
                    const stations = json.find(
                        (heat: { id: number | undefined }) =>
                            heat.id === globals?.externalHeatId
                    )?.stations;
                    if (stations) {
                        setStations(stations);
                    }
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [globals]);

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickWorkout = () => {
        setOpen(true);
    };

    return (
        <>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Image
                        src={`/img/${workout?.name}.png`}
                        alt={workout?.name}
                        width={1920}
                        height={1080}
                    />
                </Box>
            </Modal>
            <Box
                position={"absolute"}
                height="100vh"
                width="100vw"
                sx={{
                    backgroundImage: `url(${logoBlanc.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "opacity(10%) blur(4px)",
                    webkitFilter: "opacity(10%) blur(4px)",
                }}
            ></Box>
            <Box
                height="100vh"
                display={"flex"}
                flexDirection={"column"}
                // justifyContent={"space-evenly"}
                sx={{
                    backgroundColor: "#262626",
                    color: "white",
                }}
            >
                <Box
                    display={"flex"}
                    justifyContent={"space-around"}
                    py={5}
                    alignItems={"center"}
                >
                    <Typography variant="h4">
                        {EPInfo?.epHeat?.[0]?.heatName} (
                        {EPInfo?.epHeat?.[0]?.division})
                    </Typography>
                    <Typography variant="h5">
                        {EPInfo?.epHeat?.[0]?.heatTime}
                    </Typography>
                </Box>
                <Box>
                    <Button variant={"outlined"} onClick={handleClickWorkout}>
                        View workout
                    </Button>
                </Box>
                <Box>
                    <TableContainer>
                        <Table sx={{ p: 0 }} size={"small"}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: "white" }}>
                                        #
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        Participant
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        Box
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        Rank
                                    </TableCell>
                                    <TableCell sx={{ color: "white" }}>
                                        Points
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {EPInfo.epHeat
                                    ?.sort((a, b) => a.station - b.station)
                                    .map((ep) => (
                                        <TableRow>
                                            <TableCell sx={{ color: "white" }}>
                                                {ep.station}
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                {ep.displayName}
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                {stations?.find(
                                                    (station: {
                                                        station: number;
                                                    }) =>
                                                        station.station ===
                                                        ep.station
                                                )?.affiliate || ""}
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                {ep.rank}
                                            </TableCell>
                                            <TableCell sx={{ color: "white" }}>
                                                {ep.points}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    );
};

export default Speaker;
