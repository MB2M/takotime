import {
    Modal,
    Box,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";
import { useEffect, useState } from "react";

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

const RoundsModal = ({
    open,
    onSave,
    onClose,
    round,
}: {
    open: boolean;
    onSave: (round: Round) => any;
    onClose: () => any;
    round?: Round;
}) => {
    const [newRound, setNewRound] = useState<Round>(
        round || {
            customId: "",
            name: "",
            topQualifPerHeatNumber: 0,
            draftQualifiedOverallNumber: 0,
            eliminatedNumber: 0,
            stationNumber: 0,
            resultType: "time",
            sortOrder: "asc",
            ranking: { start: 0, end: 0 },
        }
    );

    useEffect(() => {
        if (round) {
            setNewRound(round);
        }
    }, [round]);

    const handleChange = (e: { target: { name: any; value: any } }) => {
        ["start", "end"].includes(e.target.name) &&
            setNewRound((nr: any) => ({
                ...nr,
                ranking: { [e.target.name]: e.target.value },
            }));
        setNewRound((nr: any) => ({ ...nr, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        console.log(newRound);
        onSave(newRound);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Stack gap={2}>
                <TextField
                        id="customId"
                        name="customId"
                        value={newRound.customId}
                        onChange={handleChange}
                        label="custom Id"
                        type={"text"}
                        variant="outlined"
                    />
                    <TextField
                        id="name"
                        name="name"
                        value={newRound.name}
                        onChange={handleChange}
                        label="name"
                        type={"text"}
                        variant="outlined"
                    />
                    <TextField
                        id="stationNumber"
                        name="stationNumber"
                        value={newRound.stationNumber}
                        onChange={handleChange}
                        label="station number"
                        type={"number"}
                        variant="outlined"
                    />
                    <FormControl fullWidth>
                        <InputLabel id="result-type-label">
                            Result type
                        </InputLabel>
                        <Select
                            labelId="result-type-label"
                            id="resultType"
                            name="resultType"
                            value={newRound.resultType}
                            label="Resu"
                            onChange={handleChange}
                        >
                            <MenuItem value={"time"}>Time</MenuItem>
                            <MenuItem value={"reps"}>Reps</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="sort-order-label">
                            Sort Order
                        </InputLabel>
                        <Select
                            labelId="sort-order-label"
                            id="sortOrder"
                            name="sortOrder"
                            value={newRound.sortOrder}
                            label="sort order"
                            onChange={handleChange}
                        >
                            <MenuItem value={"asc"}>Ascending</MenuItem>
                            <MenuItem value={"desc"}>Descending</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="topQualifPerHeatNumber"
                        name="topQualifPerHeatNumber"
                        value={newRound.topQualifPerHeatNumber}
                        onChange={handleChange}
                        label="direct qualified"
                        type={"number"}
                        variant="outlined"
                    />
                    <TextField
                        id="draftQualifiedOverallNumber"
                        name="draftQualifiedOverallNumber"
                        value={newRound.draftQualifiedOverallNumber}
                        onChange={handleChange}
                        label="draft qualified"
                        type={"number"}
                        variant="outlined"
                    />
                    <TextField
                        id="eliminatedNumber"
                        name="eliminatedNumber"
                        value={newRound.eliminatedNumber}
                        onChange={handleChange}
                        label="direct eliminated"
                        type={"number"}
                        variant="outlined"
                    />
                    <TextField
                        id="rankingStart"
                        name="start"
                        value={newRound.ranking.start}
                        onChange={handleChange}
                        label="ranking start"
                        type={"number"}
                        variant="outlined"
                    />
                    <TextField
                        id="rankingEnd"
                        name="end"
                        value={newRound.ranking.end}
                        onChange={handleChange}
                        label="ranking end"
                        type={"number"}
                        variant="outlined"
                    />
                </Stack>
                <Button onClick={handleSave}>Validate</Button>
            </Box>
        </Modal>
    );
};

export default RoundsModal;
