import type { NextPage } from "next";
import { WebSocket } from "nextjs-websocket";
import { useState, useRef, useEffect, useCallback } from "react";
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import useSWR from "swr";
import TimerForm from "../../components/TimerForm";
import * as timesync from "timesync";
import HeatUpdate from "../../components/HeatUpdate";
import DevicesUpdate from "../../components/DevicesUpdate";
import { ST } from "next/dist/shared/lib/utils";
import StaticsUpdate from "../../components/StaticsUpdate";
import LiveWorkoutSelector from "../../components/LiveWorkoutSeletor";
import LoadedWorkouts from "../../components/LoadedWorkouts";
// import ntpClient from "ntp-client-promise";

type Ranks = Array<number | undefined>;

type StationRanks = {
    lane: number;
    rank: Ranks;
};

type StationRanked = Array<StationRanks>;

interface WebSocket extends EventTarget {
    sendMessage: (this: WebSocket, msg: string) => any;
}

type Broker = { [key: string]: boolean };

type Globals = {
    wodname: string;
    duration: number;
    startTime: string;
    countdown: number;
};

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

const useChrono = (
    timesync: timesync.TimeSync | undefined,
    startTime: string | undefined,
    duration: number | undefined
    // isOn: boolean
) => {
    const [chrono, setChrono] = useState<number | string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (!startTime || startTime === "" || !timesync?.now()) {
            setChrono(null);
        } else {
            timer = setInterval(() => {
                const diff = timesync?.now() - Date.parse(startTime || "");
                if (diff < 0) {
                    setChrono(Math.trunc(diff / 1000));
                } else {
                    setChrono(
                        toReadableTime(Math.min((duration || 0) * 60000, diff))
                    );
                }
            }, 100);
        }
        return () => {
            if (typeof timer !== "undefined") {
                clearInterval(timer);
            }
        };
    }, [timesync, startTime, duration]);

    return chrono;
};

const Dashboard: NextPage = () => {
    const [workoutIds, setWorkoutIds] = useState<WorkoutIds[]>([]);
    const [loadedWorkouts, setLoadedWorkouts] = useState<Workout[]>([]);
    const [stationDevices, setStationDevices] = useState<StationDevices[]>([]);
    const [stationStatics, setStationStatics] = useState<StationStatics[]>([]);
    const [stationDynamics, setStationDynamics] = useState<StationDynamics[]>(
        []
    );
    const [brokerClients, setBrokerClients] = useState<Broker>({});
    const [ranks, setRanks] = useState<StationRanked>([]);
    const [tSync, setTSync] = useState<timesync.TimeSync>();
    const [globals, setGlobals] = useState<Globals>();
    const chrono = useChrono(tSync, globals?.startTime, globals?.duration);
    const [heatUpdateDrawerOpen, setHeatUpdateDrawerOpen] =
        useState<boolean>(false);
    const [deviceConfigUpdateDrawerOpen, setDeviceConfigUpdateDrawerOpen] =
        useState<boolean>(false);
    const ws = useRef<WebSocket>();

    const handleData = (data: string) => {
        const topic = JSON.parse(data).topic;
        const message = JSON.parse(data).data;

        switch (topic) {
            case "dynamicsUpdate":
                setStationDynamics(message);
                break;
            case "staticsUpdate":
                setStationStatics(message);
                break;
            case "brokerUpdate":
                setBrokerClients(message);
                break;
            case "rank":
                setRanks(message);
                break;
            case "globalsUpdate":
                setGlobals(message);
                break;
            case "devicesConfig":
                setStationDevices(message);
                break;
            case "workoutIds":
                setWorkoutIds(message);
                break;
            case "loadedWorkouts":
                setLoadedWorkouts(message);
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        const ts = timesync.create({
            server: `http://${process.env.NEXT_PUBLIC_LIVE_API}/timesync`,
            interval: 100000,
        });

        setTSync(ts);
    }, []);

    const sendMessage = (message: string) => {
        ws?.current?.sendMessage(message);
    };

    const handleScriptRestart = (station: StationStatics) => {
        const stationDevice = stationDevices.find(
            (s) => s.laneNumber === station.laneNumber
        );

        if (stationDevice)
            sendMessage(
                JSON.stringify({
                    topic: "client/scriptReset",
                    message: stationDevice.ip,
                })
            );
    };

    const handleRestartUpdate = (station: StationStatics) => {
        const stationDevice = stationDevices.find(
            (s) => s.laneNumber === station.laneNumber
        );

        if (stationDevice)
            sendMessage(
                JSON.stringify({
                    topic: "client/restartUpdate",
                    message: stationDevice.ip,
                })
            );
    };

    const rowData = (stationStatics: StationStatics) => {
        const lane = stationStatics.laneNumber;
        const stationDevice = stationDevices.find((s) => s.laneNumber === lane);
        const dynamics = stationStatics.dynamics;
        console.log(dynamics);
        const stationIp = stationDevice?.ip;
        const stationConnected =
            (stationIp && brokerClients[stationIp]) || false;
        const devicesConnected = !stationConnected
            ? null
            : stationDevice?.devices.map((d) => {
                  return { name: d.role, connected: d.state === "connected" };
              });

        const rank =
            (ranks.length > 0 &&
                ranks?.find((r) => r.lane === lane)?.rank?.join(" | ")) ||
            "n/a";

        return {
            lane,
            participant: stationStatics.participant,
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

    // const handleAthleteChange = (
    //     station: Station,
    //     index: number,
    //     event: any
    // ) => {
    //     const stationsCopy = stations;
    //     stationsCopy[index].athlete = event?.target?.value;
    //     setStations(stationsCopy);
    // };
    return (
        // <ThemeProvider theme={darkTheme}>
        <>
            <WebSocket
                url={`ws://${process.env.NEXT_PUBLIC_LIVE_API}`}
                onMessage={handleData}
                ref={ws}
            />
            <Typography gutterBottom variant="h2" component="div">
                Dashboard
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
                <StaticsUpdate
                    stationStatics={stationStatics}
                    // handleAthleteChange={handleAthleteChange}
                ></StaticsUpdate>
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
                <DevicesUpdate
                    stationDevices={stationDevices}
                    setStationDevices={setStationDevices}
                    // handleAthleteChange={handleAthleteChange}
                ></DevicesUpdate>
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
                    </Grid>
                    <Grid item xs={12} lg={10}>
                        <Grid container spacing={2}>
                            {stationStatics.map((s, i) => {
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
                                                    sx={{ p: 1, width: "100%" }}
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
                                                                display: "flex",
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
                                                                (d) =>
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
                                                            Rank: {data.rank}
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
                                                    </Box>
                                                </CardContent>
                                            </Box>
                                            <CardActions>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() =>
                                                        handleScriptRestart(s)
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
        </>
        // </ThemeProvider>
    );
};

export default Dashboard;
