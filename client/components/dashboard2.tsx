import type { NextPage } from "next";
import { useState, useEffect, Key } from "react";
import {
    Container,
    Button,
    Grid,
    CardContent,
    Card,
    Typography,
    Box,
    CardActions,
    Drawer,
    Chip,
    Tooltip,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
// import useSWR from "swr";
import TimerForm from "./TimerForm";
import * as timesync from "timesync";
import DevicesUpdate from "./DevicesUpdate";
import LiveWorkoutSelector from "./LiveWorkoutSelector";
import LoadedWorkouts from "./LoadedWorkouts";
import CCLoader from "./CCLoader";
import StationUpdate from "./StaticsUpdate";
import TournamentLoader from "./TournamentLoader";
import { useLiveDataContext } from "../context/liveData/livedata";
import useChrono from "../hooks/useChrono";
// import ntpClient from "ntp-client-promise";

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
        brokerClients,
        ranks,
        globals,
        devices,
    } = useLiveDataContext();
    const [tSync, setTSync] = useState<timesync.TimeSync>();
    const chrono = useChrono(globals?.startTime, globals?.duration);
    const [heatUpdateDrawerOpen, setHeatUpdateDrawerOpen] =
        useState<boolean>(false);
    const [deviceConfigUpdateDrawerOpen, setDeviceConfigUpdateDrawerOpen] =
        useState<boolean>(false);

    const { sendMessage } = useLiveDataContext();

    useEffect(() => {
        const ts = timesync.create({
            server: `http://${process.env.NEXT_PUBLIC_LIVE_API}/timesync`,
            interval: 100000,
        });

        setTSync(ts);
    }, []);

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
        const stationIp = stationDevice?.ip;
        const stationConnected =
            devices.find((device) => {
                return (
                    device.role === "station" && device.ref === stationDevice?.ip
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

    const getChrono = () => {
        if (!globals?.startTime || globals?.startTime === "" || !tSync?.now())
            return;
        // if (!globals?.startTime || globals?.startTime === "" || !time) return;

        const diff = tSync.now() - Date.parse(globals?.startTime || "");
        // const diff = time - Date.parse(globals?.startTime || "");
        if (diff < 0) {
            return Math.trunc(diff / 1000);
        } else {
            return toReadableTime(Math.min(globals?.duration * 60000, diff));
        }
    };

    const darkTheme = createTheme({
        palette: {
            mode: "dark",
        },
    });

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
        <Box sx={{ backgroundColor: "#3b3b3b" }}>
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
                            chrono={chrono}
                        ></TimerForm>
                        <LiveWorkoutSelector
                            workoutIds={workoutIds}
                        ></LiveWorkoutSelector>
                        <LoadedWorkouts
                            loadedWorkouts={loadedWorkouts}
                        ></LoadedWorkouts>
                        <CCLoader></CCLoader>
                        <TournamentLoader></TournamentLoader>
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
                                .map(
                                    (s: Station, i: Key | null | undefined) => {
                                        const data = rowData(s);
                                        return (
                                            <Grid key={i} item md={3}>
                                                <Card>
                                                    <Box
                                                        component="div"
                                                        sx={{
                                                            display: "flex",
                                                        }}
                                                    >
                                                        <CardContent
                                                            sx={{ p: 1 }}
                                                        >
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
                                                                    display:
                                                                        "flex",
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
                                                                        {
                                                                            data.ip
                                                                        }
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
                                                                                            s
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
                                                                    s
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
                                    }
                                )}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
            <Box>
                <ul>
                    {devices.map((device) => (
                        <li>{`${device.role} ${device.ref}: ${
                            device.state === 1 ? "✔️" : "⭕"
                        }`}</li>
                    ))}
                </ul>
            </Box>
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
