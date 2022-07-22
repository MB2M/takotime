import { Box, Button, Divider, Modal, TextField } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import CCLoader from "../CCLoader";

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
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [ccHeatId, setCCHeatId] = useState<string>("");
    const [ccWorkoutId, setCCWorkoutId] = useState<string>("");
    const [stations, setStations] = useState<any[]>([]);

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

    const handleClickModal = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setStations([]);
        setModalOpen(false);
    };

    const handleCCLoad = async (heatId: string, workoutId: string) => {
        setCCHeatId(heatId);
        setCCWorkoutId(workoutId);
    };

    const handleLoadHeat = () => {
        const results = stations.map((s) => ({
            station: s.station,
            participant: {
                customId: s.participantId,
                name: s.participantName,
            },
        }));
        heat.results = results;
        onUpdateResult(heat);
        handleModalClose();
    };

    if (!heat) {
        return <></>;
    }

    return (
        <Box>
            <Modal open={modalOpen} onClose={handleModalClose}>
                <Box sx={style}>
                    <Box marginY={2}>
                        <CCLoader onLoad={handleCCLoad}></CCLoader>
                    </Box>
                    {stations.length > 0 && (
                        <>
                            <Divider />
                            <Box marginY={2}>
                                {stations.map((s) => (
                                    <div>
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
            <Box textAlign={"center"}>
                <h2>
                    {heat.name}
                    <Button onClick={handleClickModal}>load athlete</Button>
                </h2>
            </Box>
            {heat.results?.map((r) => (
                <div key={r.station}>
                    {`[${r.station}] ${r.participant.name}`}
                    
                </div>
            ))}
        </Box>
    );
};

export default HeatsDetail;
