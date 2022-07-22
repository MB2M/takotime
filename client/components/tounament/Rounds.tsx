import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
} from "@mui/material";
import { useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Heats from "./Heats";
import RoundsModal from "./RoundsModal";

const Rounds = ({
    rounds,
    onRemoveRound,
    onEditRound,
}: {
    rounds: Round[];
    onRemoveRound: (roundId: string | undefined) => any;
    onEditRound: (round: Round) => any;
}) => {
    const [selectedRoundId, setSelectedRoundId] = useState<string>("");
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const selectedRound = useMemo(() => {
        return rounds.find((r) => r._id === selectedRoundId);
    }, [selectedRoundId]);

    const printName = (round: Round) => `${round.customId} - ${round.name}`;

    const handleRemoveRound = async (roundId: string | undefined) => {
        onRemoveRound(roundId);
        setOpenDeleteDialog(false);
    };

    const handleEditRound = async (round: Round) => {
        onEditRound(round);
        handleModalClose();
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteDialogOpen = () => {
        setOpenDeleteDialog(true);
    };

    const handleAddHeat = (heat: Heat) => {
        if (!selectedRound) return;
        selectedRound.heats?.push(heat);
        handleEditRound(selectedRound);
    };

    const handleEditHeat = (heat: Heat) => {
        if (!selectedRound) return;

        const newHeatList = selectedRound.heats?.map((h) => {
            if (h._id !== heat._id) {
                return h;
            }

            return heat;
        });

        selectedRound.heats = newHeatList;

        handleEditRound(selectedRound);
    };

    const handleRemoveHeat = (heatId: string) => {
        if (!heatId) return;
        if (!selectedRound?.heats) return;

        const newHeatList = selectedRound.heats.filter((h) => h._id !== heatId);

        selectedRound.heats = newHeatList;

        handleEditRound(selectedRound);
    };

    return (
        <div>
            <RoundsModal
                open={modalOpen}
                onSave={handleEditRound}
                onClose={handleModalClose}
                round={selectedRound}
            ></RoundsModal>
            <Box>
                <Grid container spacing={2} justifyContent="center">
                    {rounds.map((r) => (
                        <Grid item xs={3} key={r._id}>
                            <Button
                                variant={"outlined"}
                                onClick={() => setSelectedRoundId(r._id || "")}
                                fullWidth
                            >
                                {printName(r)}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            {selectedRound && (
                <>
                    <Box>
                        <Stack direction="row" gap={3} alignItems={"baseline"}>
                            <h2> {printName(selectedRound)}</h2>
                            <div>
                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={handleDeleteDialogOpen}
                                >
                                    <DeleteIcon fontSize="inherit" />
                                </IconButton>
                                <Dialog
                                    open={openDeleteDialog}
                                    onClose={handleDeleteDialogClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">
                                        {`You are going to delete round : ${selectedRound.name}`}
                                    </DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            Are you sure you want to continue ?
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button
                                            onClick={handleDeleteDialogClose}
                                        >
                                            Disagree
                                        </Button>
                                        <Button
                                            color="warning"
                                            onClick={() =>
                                                handleRemoveRound(
                                                    selectedRound._id
                                                )
                                            }
                                            autoFocus
                                        >
                                            Agree
                                        </Button>
                                    </DialogActions>
                                </Dialog>

                                <IconButton
                                    aria-label="delete"
                                    size="small"
                                    onClick={handleOpenModal}
                                >
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            </div>
                            <div>{`(station of ${selectedRound.stationNumber})`}</div>
                        </Stack>
                        <div>
                            {`Ranked by ${
                                selectedRound.sortOrder === "asc"
                                    ? "Ascending"
                                    : "Descending"
                            } ${selectedRound.resultType}`}
                        </div>
                        <Stack direction="row" gap={3}>
                            <div>
                                {`Qualified per heat: ${selectedRound.topQualifPerHeatNumber}`}
                            </div>
                            <div>
                                {`Eliminated per heat: ${selectedRound.eliminatedNumber}`}
                            </div>
                            <div>
                                {`Draft qualified: ${selectedRound.draftQualifiedOverallNumber}`}
                            </div>
                        </Stack>
                    </Box>
                    {selectedRound.heats && (
                        <Heats
                            heats={selectedRound.heats}
                            onAddHeat={handleAddHeat}
                            onEditHeat={handleEditHeat}
                            onRemoveHeat={handleRemoveHeat}
                        ></Heats>
                    )}
                </>
            )}
        </div>
    );
};

export default Rounds;
