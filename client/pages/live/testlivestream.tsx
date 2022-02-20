import type { NextPage } from "next";
import { WebSocket } from "nextjs-websocket";
import { useState, useRef, useEffect } from "react";
import {
    Container,
    Grid,
    CardContent,
    Card,
    Typography,
    Box,
} from "@mui/material";
import * as timesync from "timesync";
// import ntpClient from "ntp-client-promise";

interface Station {
    lane_number: number;
    athlete: string;
    configs: {
        station_ip: string;
        devices: { role: string; state: string }[];
    };
    currentWodPosition: {
        repsPerBlock: Array<number>;
        repsOfMovement: number;
        totalRepsOfMovement: number;
        currentMovement: string;
        nextMovementReps: number;
        nextMovement: string;
    };
    result: string;
}

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

const TestLiveStream: NextPage = () => {
    const [stations, setStations] = useState<Station[]>([]);
    const [brokerClients, setBrokerClients] = useState<Broker>({});
    const [ranks, setRanks] = useState<StationRanked>([]);
    const [time, setTime] = useState<number>();
    const [globals, setGlobals] = useState<Globals>();
    const ws = useRef<WebSocket>();

    const handleData = (data: string) => {
        const topic = JSON.parse(data).topic;
        const message = JSON.parse(data).data;

        switch (topic) {
            case "stationUpdate":
                message.sort(
                    (a: Station, b: Station) => a.lane_number - b.lane_number
                );
                setStations(message);
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
            default:
                break;
        }
    };

    useEffect(() => {
        const ts = timesync.create({
            server: `http://${process.env.NEXT_PUBLIC_LIVE_API}/timesync`,
            interval: 100000,
        });
        const serverT = setInterval(function () {
            const now = ts.now();
            setTime(now);
        }, 300);

        return () => clearInterval(serverT);
    }, []);

    const sendMessage = (message: string) => {
        ws?.current?.sendMessage(message);
    };

    const rowData = (station: Station) => {
        const stationConnected =
            brokerClients[station.configs.station_ip] || false;
        const devicesConnected = !stationConnected
            ? null
            : station.configs.devices.map((d) => {
                  return { name: d.role, connected: d.state === "connected" };
              });

        const rank =
            (ranks.length > 0 &&
                ranks
                    ?.find((r) => r.lane === station.lane_number)
                    ?.rank?.join(" | ")) ||
            "n/a";
        2;

        return {
            lane: station.lane_number,
            athlete: station.athlete,
            stationConnected,
            devicesConnected,
            reps: station.currentWodPosition.repsPerBlock.join(" | "),
            rank,
            repsOfMovement: station.currentWodPosition.repsOfMovement,
            totalRepsOfMovement: station.currentWodPosition.totalRepsOfMovement,
            currentMovement: station.currentWodPosition.currentMovement,
            nextMovementReps: station.currentWodPosition.nextMovementReps,
            nextMovement: station.currentWodPosition.nextMovement,
            result: station.result,
        };
    };

    const streamData = (station: Station) => {
        const data = rowData(station);
        return (
            <Grid
                container
                spacing={2}
                sx={{
                    border: 2,
                    borderColor: "#630082",
                    borderRadius: "0px 0px 100px 0px",
                    backgroundColor: "#FBEEFE95",
                    pl: 2,
                }}
            >
                <Grid item xs={8}>
                    <Typography variant="h2" component="div" gutterBottom>
                        {data.athlete}
                    </Typography>
                    {data.result === "" ? (
                        <Typography variant="h4" component="div" gutterBottom>
                            {`${data.totalRepsOfMovement || ""} ${
                                data.currentMovement || ""
                            }`}
                        </Typography>
                    ) : (
                        <Typography variant="h4" component="div" gutterBottom>
                            {data.result}
                        </Typography>
                    )}
                </Grid>
                {data.result === "" && (
                    <Grid item xs={4} sx={{ padding: 1 }}>
                        <Typography variant="h1" component="div" gutterBottom>
                            {data.repsOfMovement}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        );
    };

    const streamDataReverse = (station: Station) => {
        const data = rowData(station);
        return (
            <Grid
                container
                spacing={2}
                sx={{
                    border: 2,
                    borderColor: "#630082",
                    borderRadius: "0px 0px 0px 100px",
                    backgroundColor: "#FBEEFE95",
                    textAlign: "right",
                    pr: 2,
                }}
                padding={1}
            >
                {data.result === "" && (
                    <Grid item xs={4} sx={{ padding: 1 }}>
                        <Typography variant="h1" component="div" gutterBottom>
                            {data.repsOfMovement}
                        </Typography>
                    </Grid>
                )}
                <Grid item xs={8}>
                    <Typography variant="h2" component="div" gutterBottom>
                        {data.athlete}
                    </Typography>
                    {data.result === "" ? (
                        <Typography variant="h4" component="div" gutterBottom>
                            {`${data.totalRepsOfMovement || ""} ${
                                data.currentMovement || ""
                            }`}
                        </Typography>
                    ) : (
                        <Typography variant="h4" component="div" gutterBottom>
                            {data.result}
                        </Typography>
                    )}
                </Grid>
            </Grid>
        );
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

    const getChrono = () => {
        if (!globals?.startTime || globals?.startTime === "" || !time) return;

        const diff = time - Date.parse(globals?.startTime || "");
        if (diff < 0) {
            return Math.trunc(diff / 1000);
        } else {
            return toReadableTime(Math.min(globals?.duration * 60000, diff));
        }
    };

    return (
        // <ThemeProvider theme={darkTheme}>
        <Box>
            <WebSocket
                url={`ws://${process.env.NEXT_PUBLIC_LIVE_API}`}
                onMessage={handleData}
                ref={ws}
            />
            <Grid
                container
                spacing={2}
                sx={{ justifyContent: "space-between" }}
            >
                <Grid item xs={3}>
                    {stations[0] && streamData(stations[0])}
                </Grid>
                <Grid item xs={2}>
                    <Typography
                        variant="h3"
                        component="div"
                        gutterBottom
                        sx={{
                            background: "#F1F1F1",
                            textAlign: "center",
                            border: 3,
                            borderTop: 0,
                            radius: 0,
                            borderColor: "#630082",
                            borderRadius: "0px 0px 50px 50px",
                        }}
                    >
                        {getChrono()}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    {stations[1] && streamDataReverse(stations[1])}
                </Grid>
            </Grid>
        </Box>
    );
};

export default TestLiveStream;
