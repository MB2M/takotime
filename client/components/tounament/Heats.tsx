import { Box, Button, Divider, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import HeatsDetail from "./HeatsDetail";
import HeatsList from "./HeatsList";
import HeatsModal from "./HeatsModal";
import RankedHeat from "./RankedHeat";

const Heats = ({
    heats,
    onAddHeat,
    onEditHeat,
    onRemoveHeat,
}: {
    heats: Heat[];
    onAddHeat: (heat: Heat) => any;
    onEditHeat: (heat: Heat) => any;
    onRemoveHeat: (heatId: string) => any;
}) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedHeatId, setSelectedHeatId] = useState<string>("");

    const selectedHeat = useMemo(() => {
        return heats.find((h) => h._id === selectedHeatId);
    }, [selectedHeatId, heats]);

    const handleAddHeat = async (heat: Heat) => {
        onAddHeat(heat);
        handleModalClose();
    };

    const handleEditHeat = async (heat: Heat) => {
        console.log(heat)
        onEditHeat(heat);
        handleModalClose();
    };

    const handleRemoveHeat = async (heatId: string) => {
        onRemoveHeat(heatId);
        handleModalClose();
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const handleSelectHeat = (heatId: string) => {
        setSelectedHeatId(heatId);
    };

    return (
        <>
            <HeatsModal
                open={modalOpen}
                onSave={handleAddHeat}
                onClose={handleModalClose}
            ></HeatsModal>
            <Box
                padding="50px"
                sx={{ border: "1px solid black", borderRadius: 5 }}
            >
                <Button variant="outlined" onClick={handleOpenModal}>
                    Add new Heat
                </Button>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <HeatsList
                            heats={heats}
                            onRemoveHeat={handleRemoveHeat}
                            onEditHeat={handleEditHeat}
                            onSelectHeat={handleSelectHeat}
                        />
                    </Grid>
                    {selectedHeat && (
                        <Grid item xs={8}>
                            <HeatsDetail
                                heat={selectedHeat}
                                onUpdateResult={handleEditHeat}
                            />
                        </Grid>
                    )}
                </Grid>
            </Box>
        </>
    );
};

export default Heats;
