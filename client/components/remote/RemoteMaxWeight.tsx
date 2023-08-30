import {
    Box,
    Button,
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
import { useMemo, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveIcon from "@mui/icons-material/Remove";

interface Props {
    workout: Workout;
    sendMessage: (message: string) => void;
    laneNumber: number;
    station?: BaseStation2 | null;
    participantId: string;
    category: string;
    numberOfPartner?: number;
}

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

const RemoteMaxWeight = ({
    workout,
    sendMessage,
    laneNumber,
    station,
    participantId,
    category,
    numberOfPartner = 2,
}: Props) => {
    const selectedWorkoutId = workout.workoutId;
    const [addWeight, setAddWeight] = useState<number>(100);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [scoreEditId, setScoreEditId] = useState<string>("");
    const [selectedPartnerId, setSelectedPartnerId] = useState<number>(0);

    const lastStationInfo = useMemo(
        () =>
            station?.scores.wodWeight
                .sort((a, b) => +b._id - +a._id)
                .find((score) => score.partnerId === selectedPartnerId),
        [station?.scores.wodWeight, selectedPartnerId]
    );

    console.log(
        station?.scores.wodWeight.filter(
            (score) => score.partnerId === selectedPartnerId
        )
    );

    const handleAddClick = () => {
        sendMessage(
            JSON.stringify({
                topic: "maxWeight",
                data: {
                    station: laneNumber,
                    weight: addWeight,
                    wodIndex: selectedWorkoutId,
                    participantId,
                    category,
                    heatId: station?.heatId,
                    partnerId: selectedPartnerId,
                    state: "Try",
                },
            })
        );
    };

    const handleUpdate = (scoreId: string, state: LiftState) => {
        sendMessage(
            JSON.stringify({
                topic: "maxWeight",
                data: {
                    scoreId,
                    state,
                },
            })
        );
    };

    const handleUpdateClick = (state: LiftState) => () => {
        handleUpdate(scoreEditId, state);
        handleCloseModal();
    };

    const handleValidationClick = (scoreId: string, state: LiftState) => () => {
        handleUpdate(scoreId, state);
    };

    const handleAddTFChange = (event: any) => {
        setAddWeight(Number(event.target.value));
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setScoreEditId("");
    };

    const handleEditResultModal = (scoreId: string) => {
        setScoreEditId(scoreId);
        setModalOpen(true);
    };

    const handlePartnerSelect = (index: number) => {
        setSelectedPartnerId(index);
    };

    return (
        <>
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={style}>
                    <h4>{`Choose new result for score ${
                        station?.scores.wodWeight.find(
                            (score: any) => score._id === scoreEditId
                        )?.weight
                    } kg`}</h4>
                    <Stack gap={2}>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleUpdateClick("Success")}
                        >
                            Success
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleUpdateClick("Fail")}
                        >
                            Fail
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleUpdateClick("Cancel")}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Modal>
            <Box
                // my={3}
                display="flex"
                justifyContent={"center"}
            >
                {[...Array(numberOfPartner).keys()].map((_, index) => (
                    <Button
                        key={index}
                        variant={
                            selectedPartnerId === index
                                ? "contained"
                                : "outlined"
                        }
                        size={"large"}
                        onClick={() => handlePartnerSelect(index)}
                    >
                        Partner {index + 1}
                    </Button>
                ))}
            </Box>
            {lastStationInfo?.state !== "Try" ? (
                <Box
                    marginTop={4}
                    justifyContent="center"
                    textAlign={"center"}
                    mb={"auto"}
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
                    <Button onClick={handleAddClick} variant="outlined">
                        add
                    </Button>
                </Box>
            ) : (
                <>
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
                                        onClick={handleValidationClick(
                                            lastStationInfo._id,
                                            "Success"
                                        )}
                                    >
                                        Success
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleValidationClick(
                                            lastStationInfo._id,
                                            "Fail"
                                        )}
                                    >
                                        Fail
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={handleValidationClick(
                                            lastStationInfo._id,
                                            "Cancel"
                                        )}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </>
            )}
            <Box marginTop={4}>
                <List>
                    {station?.scores.wodWeight
                        .filter(
                            (score) => score.partnerId === selectedPartnerId
                        )
                        .map((score) => (
                            <ListItem
                                key={score._id}
                                onClick={() => handleEditResultModal(score._id)}
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
                                <ListItemText primary={`${score.weight} kg`} />
                                {score.state}
                            </ListItem>
                        ))}
                </List>
            </Box>
        </>
    );
};
export default RemoteMaxWeight;
