import type { NextPage } from "next";
import { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Drawer,
    Grid,
    Tooltip,
    Typography,
} from "@mui/material";

import { useLiveDataContext } from "../../context/liveData/livedata";
import useChrono from "../../hooks/useChrono";
import StationUpdate from "../../components/StaticsUpdate";
import DevicesUpdate from "../../components/DevicesUpdate";
import TimerForm from "../../components/TimerForm";
import LiveWorkoutSelector from "../../components/LiveWorkoutSelector";
import CCLoader from "../../components/dashboard/CCLoader";
import LocalLoader from "../../components/dashboard/LocalLoader";
import LoadedWorkouts from "../../components/LoadedWorkouts";
import CCLoader2 from "../../components/dashboard/CCLoader2";

const toReadableTime = (timestamp: number) => {
    const asDate = new Date(timestamp);
    const hours = asDate.getUTCHours();
    const minutes = asDate.getUTCMinutes();
    const seconds = asDate.getUTCSeconds();
    // const milli = asDate.getUTCMilliseconds();

    return `${hours !== 0 ? hours + ":" : ""}${
        minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
};

const Dashboard: NextPage = ({}: // workoutIds,
// loadedWorkouts,
// stationDevices,
// station,
// brokerClients,
// ranks,
// globals,
// sendMessage,
any) => {
    const {
        workoutIds,
        loadedWorkouts,
        stationDevices,
        stations,
        ranks,
        globals,
        devices,
    } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);
    const [heatUpdateDrawerOpen, setHeatUpdateDrawerOpen] =
        useState<boolean>(false);
    const [deviceConfigUpdateDrawerOpen, setDeviceConfigUpdateDrawerOpen] =
        useState<boolean>(false);

    const { sendMessage } = useLiveDataContext();

    const handleScriptRestart = (station: Station) => {
        const stationDevice = stationDevices.find(
            (s: { laneNumber: number }) => s.laneNumber === station.laneNumber
        );

        if (stationDevice)
            sendMessage(
                JSON.stringify({
                    topic: "client/scriptReset",
                    message: stationDevice.ip,
                })
            );
    };

    const handleRestartUpdate = (station: Station) => {
        const stationDevice = stationDevices.find(
            (s: { laneNumber: number }) => s.laneNumber === station.laneNumber
        );

        if (stationDevice)
            sendMessage(
                JSON.stringify({
                    topic: "client/restartUpdate",
                    message: stationDevice.ip,
                })
            );
    };

    const rowData = (station: Station) => {
        const lane = station.laneNumber;
        const stationDevice = stationDevices.find(
            (s: StationDevices) => s.laneNumber === lane
        );
        const dynamics = station.dynamics;
        const stationConnected =
            devices.find((device) => {
                return (
                    device.role === "station" &&
                    device.ref === stationDevice?.ip
                );
            })?.state === 1;
        // const stationConnected =
        //     (stationIp && brokerClients[stationIp]) || false;
        const devicesConnected = stationDevice?.devices.map((d) => {
            return {
                name: d.role,
                connected:
                    devices.find((device) => {
                        return device.role === d.role && device.ref === d.mac;
                    })?.state === 1,
            };
        });
        const rank =
            (ranks.length > 0 &&
                ranks
                    ?.find((r: { lane: number }) => r.lane === lane)
                    ?.rank?.join(" | ")) ||
            "n/a";

        return {
            lane,
            participant: station.participant,
            ip: stationDevice?.ip,
            stationConnected,
            devicesConnected,
            reps: dynamics?.currentWodPosition?.repsPerBlock.join(" | "),
            rank,
            repsOfMovement: dynamics?.currentWodPosition?.repsOfMovement,
            totalRepsOfMovement:
                dynamics?.currentWodPosition?.totalRepsOfMovement,
            currentMovement: dynamics?.currentWodPosition?.currentMovement,
            nextMovementReps: dynamics?.currentWodPosition?.nextMovementReps,
            nextMovement: dynamics?.currentWodPosition?.nextMovement,
            appVersion: dynamics?.appVersion,
            tieBreak: dynamics?.measurements?.reduce(
                (p, c) => {
                    return [
                        ...p,
                        c.tieBreak?.method === "time"
                            ? toReadableTime(c.tieBreak?.value)
                            : c.tieBreak?.method === "reps"
                            ? c.tieBreak?.value.toString() + "reps"
                            : "",
                    ];
                },
                [""]
            ),
            result: dynamics?.result,
            state: dynamics?.state,
        };
    };

    const toggleDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setHeatUpdateDrawerOpen(open);
        };

    const toggleConfigDrawer =
        (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
            if (
                event.type === "keydown" &&
                ((event as React.KeyboardEvent).key === "Tab" ||
                    (event as React.KeyboardEvent).key === "Shift")
            ) {
                return;
            }

            setDeviceConfigUpdateDrawerOpen(open);
        };

    return (
        // <ThemeProvider theme={darkTheme}>
        <Box sx={{ backgroundColor: "#cfcfcf" }}>
            <Typography gutterBottom variant="h2" component="div">
                Dashboard
                {` / state: ${globals?.state}`}
            </Typography>
            <Button onClick={toggleDrawer(true)}>Update heat</Button>
            <Drawer
                anchor="right"
                open={heatUpdateDrawerOpen}
                onClose={toggleDrawer(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 0.5,
                        boxSizing: "border-box",
                    },
                }}
            >
                <StationUpdate
                    stations={stations}
                    // handleAthleteChange={handleAthleteChange}
                ></StationUpdate>
            </Drawer>
            <Button onClick={toggleConfigDrawer(true)}>
                Update Device Config
            </Button>
            <Drawer
                anchor="right"
                open={deviceConfigUpdateDrawerOpen}
                onClose={toggleConfigDrawer(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 0.5,
                        boxSizing: "border-box",
                    },
                }}
            >
                <DevicesUpdate stationDevices={stationDevices}></DevicesUpdate>
            </Drawer>
            <Container maxWidth="xl">
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={2}>
                        <TimerForm
                            startTime={globals?.startTime}
                            chrono={timer}
                        />
                        <LiveWorkoutSelector workoutIds={workoutIds} />
                        <LoadedWorkouts loadedWorkouts={loadedWorkouts} />
                        <CCLoader2 />
                        {/* <TournamentLoader></TournamentLoader> */}
                        <LocalLoader />
                    </Grid>
                    <Grid item xs={12} lg={10}>
                        <Grid container spacing={2}>
                            {stations
                                ?.sort(
                                    (
                                        a: { laneNumber: number },
                                        b: { laneNumber: number }
                                    ) => a.laneNumber - b.laneNumber
                                )
                                .map((station, index) => {
                                    const data = rowData(station);
                                    return (
                                        <Grid key={index} item md={3}>
                                            <Card>
                                                <Box
                                                    component="div"
                                                    sx={{
                                                        display: "flex",
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 1 }}>
                                                        <Typography
                                                            gutterBottom
                                                            variant="h3"
                                                            component="div"
                                                        >
                                                            {data.lane}
                                                        </Typography>
                                                    </CardContent>
                                                    <CardContent
                                                        sx={{
                                                            p: 1,
                                                            width: "100%",
                                                        }}
                                                    >
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    display:
                                                                        "flex",
                                                                    justifyContent:
                                                                        "space-between",
                                                                }}
                                                            >
                                                                <Typography
                                                                    gutterBottom
                                                                    variant="h6"
                                                                    component="div"
                                                                >
                                                                    {
                                                                        data.participant
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    gutterBottom
                                                                    variant="caption"
                                                                    component="div"
                                                                >
                                                                    {data.ip}
                                                                </Typography>
                                                                {data.appVersion && (
                                                                    <Tooltip
                                                                        arrow
                                                                        disableFocusListener
                                                                        disableTouchListener
                                                                        title={
                                                                            <Button
                                                                                size="small"
                                                                                variant="text"
                                                                                color="inherit"
                                                                                onClick={() =>
                                                                                    handleRestartUpdate(
                                                                                        station
                                                                                    )
                                                                                }
                                                                            >
                                                                                Update
                                                                            </Button>
                                                                        }
                                                                    >
                                                                        <Chip
                                                                            label={
                                                                                data.appVersion
                                                                            }
                                                                            size="small"
                                                                            variant="outlined"
                                                                            color="info"
                                                                            sx={{
                                                                                ml: "auto",
                                                                            }}
                                                                        />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                            <Typography
                                                                gutterBottom
                                                                variant="caption"
                                                                component="div"
                                                            >
                                                                {data.stationConnected
                                                                    ? "✔️"
                                                                    : "⭕"}
                                                                {/* </Typography>
                                                        <Typography
                                                            gutterBottom
                                                            variant="caption"
                                                            component="div"
                                                        > */}
                                                                {data.devicesConnected?.map(
                                                                    (d: {
                                                                        name: any;
                                                                        connected: any;
                                                                    }) =>
                                                                        `${
                                                                            d.name
                                                                        }: ${
                                                                            d.connected
                                                                                ? "✔️"
                                                                                : "⭕"
                                                                        }`
                                                                )}
                                                            </Typography>
                                                            <Typography
                                                                gutterBottom
                                                                variant="caption"
                                                                component="div"
                                                            >
                                                                {data.state}
                                                            </Typography>
                                                            <Typography
                                                                gutterBottom
                                                                variant="caption"
                                                                component="div"
                                                            >
                                                                {data.reps}
                                                            </Typography>
                                                            <Typography
                                                                gutterBottom
                                                                variant="caption"
                                                                component="div"
                                                            >
                                                                Rank:{" "}
                                                                {data.rank}
                                                            </Typography>
                                                            <Typography
                                                                gutterBottom
                                                                variant="caption"
                                                                component="div"
                                                            >
                                                                {data.result
                                                                    ? data.result
                                                                    : !!data.repsOfMovement &&
                                                                      !isNaN(
                                                                          data.repsOfMovement
                                                                      ) &&
                                                                      `${data.repsOfMovement} / ${data.totalRepsOfMovement} ${data.currentMovement}`}
                                                            </Typography>
                                                            <Typography
                                                                gutterBottom
                                                                variant="caption"
                                                                component="div"
                                                            >
                                                                TieBreak:
                                                                {data.tieBreak?.at(
                                                                    -1
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Box>
                                                <CardActions>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleScriptRestart(
                                                                station
                                                            )
                                                        }
                                                        size="small"
                                                    >
                                                        Restart
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    );
                                })}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            {/* <Box>
                <ul>
                    {devices.map((device) => (
                        <li>{`${device.role} ${device.ref}: ${
                            device.state === 1 ? "✔️" : "⭕"
                        }`}</li>
                    ))}
                </ul>
            </Box> */}
            {/* <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Participant</TableCell>
                                        <TableCell>Station</TableCell>
                                        <TableCell>Devices</TableCell>
                                        <TableCell>Reps</TableCell>
                                        <TableCell>Ranks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stations.map((s) => {
                                        const data = rowData(s);
                                        return (
                                            <TableRow key={s.lane_number}>
                                                <TableCell>
                                                    {data.lane}
                                                </TableCell>
                                                <TableCell>
                                                    {data.athlete}
                                                </TableCell>
                                                <TableCell>
                                                    {data.stationConnected
                                                        ? "✔️"
                                                        : "⭕"}
                                                </TableCell>
                                                <TableCell>
                                                    {data.devicesConnected?.map(
                                                        (d) =>
                                                            `${d.name}: ${
                                                                d.connected
                                                                    ? "✔️"
                                                                    : "⭕"
                                                            }`
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {data.reps}
                                                </TableCell>
                                                <TableCell>
                                                    {data.rank}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleScriptRestart(s)
                                                        }
                                                        size="small"
                                                    >
                                                        Reset BLE connection
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() =>
                                                            handleRestartUpdate(s)
                                                        }
                                                        size="small"
                                                    >
                                                        Reboot Station
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer> */}
        </Box>
        // </ThemeProvider>
    );
};

export default Dashboard;
