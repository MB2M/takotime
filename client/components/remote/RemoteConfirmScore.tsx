import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Stack,
    Typography,
} from "@mui/material";
import RemoteWorkoutFinalScore from "./RemoteWorkoutFinalScore";
import { useState } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";

interface Props {
    workouts: Workout[];
    scores: BaseStation2["scores"];
    laneNumber: string;
}
const RemoteConfirmScore = ({ workouts, scores, laneNumber }: Props) => {
    const [open, setOpen] = useState(false);
    const { sendMessage } = useLiveDataContext();

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleConfirmClick = async () => {
        sendMessage(JSON.stringify({ topic: "save", data: { laneNumber } }));
        handleClose();
    };

    // @ts-ignore
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Confirm Score</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Scores will be saved, please review and confirm. You
                        won't be able to modify this score.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleConfirmClick} autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Stack
                py={4}
                textAlign={"center"}
                borderBottom={"2px solid black"}
                gap={2}
            >
                <Typography variant={"h5"}>
                    Workout is over, please review score with judge! Adjust it
                    if needed, and confirm it by clicking button below.
                </Typography>
                {workouts.map((wod, index) => (
                    <Box key={wod.workoutId}>
                        <Typography fontWeight={700}>{`score ${
                            index + 1
                        }:`}</Typography>
                        <RemoteWorkoutFinalScore
                            workout={wod}
                            scores={scores}
                        />
                    </Box>
                ))}

                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={handleOpen}
                >
                    Confirm score
                </Button>
            </Stack>
        </>
    );
};

export default RemoteConfirmScore;
