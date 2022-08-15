import {
    Box,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Modal,
    Slider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveIcon from "@mui/icons-material/Remove";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vw",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
};

const LaneRemote = () => {
    const { globals } = useLiveDataContext();
    const { stations } = useLiveDataContext();
    const router = useRouter();
    const { laneNumber }: any = useMemo(() => router.query, [router]);
    const [stationInfo, setStationInfo] = useState<any>(null);
    const [addWeight, setAddWeight] = useState<number>(100);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [scoreEditId, setScoreEditId] = useState<string>("");

    const stationData = useMemo(() => {
        return stations.find(
            (station) => station.laneNumber === Number(laneNumber)
        );
    }, [laneNumber, stations]);

    const lastStationInfo = useMemo(
        () => stationInfo?.scores[0],
        [stationInfo]
    );

    // useEffect(() => console.log(lastStationInfo), [lastStationInfo]); // to REMOVE

    const restrieveStationInfo = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station/${laneNumber}?heatId=${globals?.externalHeatId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                json?.scores?.reverse();
                setStationInfo(json);
            } else {
                setStationInfo(null);
            }
        } catch (err) {
            console.log(err);
            setStationInfo(null);
        }
    };

    useEffect(() => {
        if (!laneNumber || !globals?.externalHeatId) return;
        restrieveStationInfo();
    }, [globals?.externalHeatId, laneNumber]);

    const handleAddScore = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station/${laneNumber}?heatId=${globals?.externalHeatId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ weight: addWeight, state: "Try" }),
                }
            );
            if (response.ok) {
                restrieveStationInfo();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddTFChange = (
        event: any,
        value?: number | number[],
        activeThumb?: number
    ) => {
        setAddWeight(Number(event.target.value));
    };

    const handleAddChange = (e: any, newVal: number) => {
        setAddWeight(Number(newVal));
    };

    const handleValidationClick = async (
        type: "Success" | "Fail" | "Cancel"
    ) => {
        patchResult(lastStationInfo._id, type);
    };

    const handleEditClick = (newState: "Success" | "Fail" | "Cancel") => {
        patchResult(scoreEditId, newState);
        setModalOpen(false);
    };

    const patchResult = async (
        scoreId: string,
        newState: "Success" | "Fail" | "Cancel"
    ) => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/wodMax/station/${laneNumber}?scoreId=${scoreId}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ state: newState }),
                }
            );
            if (response.ok) {
                restrieveStationInfo();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setScoreEditId("");
    };

    const handleEditResultModal = (scoreId: string) => {
        setScoreEditId(scoreId);
        setModalOpen(true);
    };

    return (
        <Container>
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={style}>
                    <h4>{`Choose new result for score ${
                        stationInfo?.scores.find(
                            (score: any) => score._id === scoreEditId
                        )?.weight
                    } kg`}</h4>
                    <Stack gap={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleEditClick("Success")}
                        >
                            Success
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleEditClick("Fail")}
                        >
                            Fail
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => handleEditClick("Cancel")}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Box
                display="flex"
                justifyContent={"flex-start"}
                textAlign="center"
                paddingTop="20px"
            >
                <Typography variant="h4" fontFamily={"CantoraOne"}>
                    {stationData?.laneNumber}
                </Typography>
                <Typography variant="h4" fontFamily={"CantoraOne"} ml={4}>
                    {stationData?.participant}
                </Typography>
            </Box>
            {laneNumber &&
                globals?.externalHeatId &&
                lastStationInfo?.state !== "Try" && (
                    <Box
                        marginTop={4}
                        justifyContent="center"
                        textAlign={"center"}
                    >
                        <TextField
                            type={"number"}
                            value={addWeight}
                            onChange={handleAddTFChange}
                            label="New weight"
                        ></TextField>
                        <Slider
                            aria-label="Weight"
                            defaultValue={100}
                            value={addWeight}
                            // getAriaValueText={valuetext}
                            valueLabelDisplay="auto"
                            step={2.5}
                            // marks
                            min={10}
                            max={170}
                            onChange={handleAddTFChange}
                        />
                        <Button onClick={handleAddScore} variant="outlined">
                            add
                        </Button>
                    </Box>
                )}
            {stationInfo && (
                <>
                    {lastStationInfo?.state === "Try" && (
                        <Box
                            borderTop={"2px solid black"}
                            borderBottom={"2px solid black"}
                            paddingY={2}
                            marginY={2}
                        >
                            <Grid container>
                                <Grid
                                    item
                                    xs={8}
                                    alignItems="center"
                                    justifyContent="center"
                                    display={"flex"}
                                >
                                    <Typography
                                        variant={"h3"}
                                        textAlign="center"
                                        fontFamily={"CantoraOne"}
                                    >
                                        {lastStationInfo.weight} kg
                                    </Typography>
                                </Grid>
                                <Grid item xs={4}>
                                    <Stack gap={2}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() =>
                                                handleValidationClick("Success")
                                            }
                                        >
                                            Success
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() =>
                                                handleValidationClick("Fail")
                                            }
                                        >
                                            Fail
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                handleValidationClick("Cancel")
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                    <Box marginTop={4}>
                        <List>
                            {stationInfo.scores.map((score: wodWeightScore) => (
                                <ListItem
                                    key={score._id}
                                    onClick={() =>
                                        handleEditResultModal(score._id)
                                    }
                                >
                                    <ListItemIcon>
                                        {score.state === "Success" ? (
                                            <CheckCircleIcon color="success" />
                                        ) : score.state === "Fail" ? (
                                            <CancelIcon color="error" />
                                        ) : (
                                            <RemoveIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${score.weight} kg`}
                                    />
                                    {score.state}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default LaneRemote;
