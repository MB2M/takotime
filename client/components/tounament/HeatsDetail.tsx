import {
    Box,
    Button,
    Divider,
    List,
    Modal,
    Paper,
    Switch,
    TextField,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import CCLoader from "../CCLoader";
import Result from "./Result";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const CCURL = `https://competitioncorner.net/api2/v1/schedule/workout/`;

const HeatsDetail = ({
    heat,
    onUpdateResult,
}: {
    heat: Heat;
    onUpdateResult: (heat: Heat) => any;
}) => {
    const [modalCCOpen, setModalCCOpen] = useState<boolean>(false);
    const [ccHeatId, setCCHeatId] = useState<string>("");
    const [ccWorkoutId, setCCWorkoutId] = useState<string>("");
    const [stations, setStations] = useState<any[]>([]);
    const [finished, setFinished] = useState<boolean>(false);

    useEffect(() => {
        if (ccHeatId && ccWorkoutId) {
            (async () => {
                try {
                    const url = CCURL + ccWorkoutId;
                    const response = await fetch(url);
                    const json: any = await response.json();
                    const heat = json.find(
                        (s: any) => s.id.toString() === ccHeatId
                    );
                    const stations = heat.stations;
                    setStations(stations);
                } catch (err) {
                    console.log(err);
                }
            })();
        }
    }, [ccHeatId, ccWorkoutId]);

    useEffect(() => {
        if (heat) {
            setFinished(heat.state === "F");
        }
    }, [heat]);

    const handleClickCCModal = () => {
        setModalCCOpen(true);
    };

    const handleModalCCClose = () => {
        setStations([]);
        setModalCCOpen(false);
    };

    const handleCCLoad = async (heatId: string, workoutId: string) => {
        setCCHeatId(heatId);
        setCCWorkoutId(workoutId);
    };

    const handleLoadHeat = () => {
        const results: Result[] = stations.map((s) => ({
            station: s.station,
            participant: {
                customId: s.participantId,
                name: s.participantName,
            },
            state: "R",
            result: "",
            athleteSources: [],
        }));
        heat.results = results;
        onUpdateResult(heat);
        handleModalCCClose();
    };

    const handleResultChange = () => {
        onUpdateResult(heat);
    };

    const handleFinishedChange = () => {
        heat.state = heat.state === "F" ? "NF" : "F";
        onUpdateResult(heat);
    };

    const handleClickLoadResults = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/stationstatics`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const stations = await response.json();
            console.log(stations);
            const results: Result[] = stations.map(
                (s: {
                    laneNumber: any;
                    participant: any;
                    participantName: any;
                    result: any;
                }) => ({
                    station: s.laneNumber,
                    participant: {
                        name: s.participant,
                    },
                    result: s.result || "",
                })
            );
            heat.results = heat.results.map((r) => {
                const result = stations.find(
                    (station: { laneNumber: number }) =>
                        station.laneNumber === r.station
                );
                return { ...r, result: result.result };
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Modal open={modalCCOpen} onClose={handleModalCCClose}>
                <Box sx={style}>
                    <Box marginY={2}>
                        <CCLoader onLoad={handleCCLoad}></CCLoader>
                    </Box>
                    {stations.length > 0 && (
                        <>
                            <Divider />
                            <Box marginY={2}>
                                {stations.map((s) => (
                                    <div key={s.station}>
                                        {s.station} - {s.participantName}
                                    </div>
                                ))}
                                <Button onClick={handleLoadHeat}>
                                    load athlete
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
            <Box paddingX={5}>
                <Box textAlign={"center"}>
                    <h2>
                        {heat.name}
                        <Button onClick={handleClickCCModal}>
                            load athlete
                        </Button>
                        <Button onClick={handleClickLoadResults}>
                            Get Results
                        </Button>
                        {/* <Button onClick={handleClickCustomModal}>
                            setup custom
                        </Button> */}
                        <Switch
                            checked={finished}
                            onChange={handleFinishedChange}
                            inputProps={{ "aria-label": "controlled" }}
                        />
                        Finished
                    </h2>
                </Box>
                <Box justifyContent="center">
                    <Paper>
                        <List
                            dense={true}
                            sx={{
                                width: "100%",
                                maxWidth: "80%",
                            }}
                        >
                            {heat.results
                                ?.sort((a, b) => a.station - b.station)
                                .map((r, i) => (
                                    <Result
                                        key={r.station}
                                        result={r}
                                        onChange={handleResultChange}
                                    ></Result>
                                ))}
                        </List>
                    </Paper>
                </Box>
            </Box>
        </>
    );
};

export default HeatsDetail;
