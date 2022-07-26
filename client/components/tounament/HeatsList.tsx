import {
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Stack,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListItem,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HeatsModal from "./HeatsModal";
import RankedHeat from "./RankedHeat";

const HeatsList = ({
    heats,
    onRemoveHeat,
    onEditHeat,
    onSelectHeat,
}: {
    heats: Heat[];
    onRemoveHeat: (heatId: string) => any;
    onEditHeat: (heat: Heat) => any;
    onSelectHeat: (heatId: string) => any;
}) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedHeatId, setSelectedHeatId] = useState<string>("");

    const selectedHeat = useMemo(() => {
        return heats.find((h) => h._id === selectedHeatId);
    }, [selectedHeatId, heats]);

    useEffect(() => {
        onSelectHeat(selectedHeatId);
    }, [selectedHeatId]);

    const handleDeleteDialogClose = () => {
        setOpenDeleteDialog(false);
    };

    const handleDeleteDialog = (heatId: string) => {
        setSelectedHeatId(heatId);
        setOpenDeleteDialog(true);
    };

    const handleEditModal = (heatId: string) => {
        setSelectedHeatId(heatId);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleRemoveHeat = async (heatId: string | undefined) => {
        if (!heatId) return;
        onRemoveHeat(heatId);
        setOpenDeleteDialog(false);
    };

    const handleEditHeat = async (heat: Heat) => {
        onEditHeat(heat);
        handleModalClose();
    };

    const handleSelectHeat = (heatId: string) => {
        setSelectedHeatId(heatId);
    };

    return (
        <div>
            <HeatsModal
                open={modalOpen}
                onSave={handleEditHeat}
                onClose={handleModalClose}
                heat={selectedHeat}
            ></HeatsModal>
            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`You are going to delete heat : ${selectedHeat?.name}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to continue ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteDialogClose}>Disagree</Button>
                    <Button
                        color="warning"
                        onClick={() => handleRemoveHeat(selectedHeat?._id)}
                        autoFocus
                    >
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>

            <List component="nav" aria-label="main mailbox folders">
                {heats.map((h) => (
                    <>
                        <ListItem
                            key={h.customId}
                            disablePadding
                            secondaryAction={
                                <div>
                                    <IconButton
                                        aria-label="delete"
                                        size="small"
                                        onClick={() =>
                                            handleEditModal(h._id || "")
                                        }
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        size="small"
                                        onClick={() =>
                                            handleDeleteDialog(h._id || "")
                                        }
                                    >
                                        <DeleteIcon fontSize="inherit" />
                                    </IconButton>
                                </div>
                            }
                        >
                            <ListItemButton
                                selected={selectedHeatId === h._id}
                                onClick={() => handleSelectHeat(h._id || "")}
                            >
                                <ListItemText primary={h.name} />
                                {/* <h2>{h.name}</h2> */}
                            </ListItemButton>
                        </ListItem>
                        <div>
                            {selectedHeatId === h._id && selectedHeat && (
                                <RankedHeat heat={selectedHeat} />
                            )}
                        </div>
                    </>
                ))}
            </List>
        </div>
    );
};

export default HeatsList;
