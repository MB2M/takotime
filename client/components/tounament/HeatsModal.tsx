import {
    Modal,
    Box,
    Stack,
    TextField,
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

const HeatsModal = ({
    open,
    onSave,
    onClose,
    heat,
}: {
    open: boolean;
    onSave: (heat: Heat) => any;
    onClose: () => any;
    heat?: Heat;
}) => {
    const [newHeat, setNewHeat] = useState<Heat>(
        heat || {
            customId: "",
            name: "",
            // order: 0,
        }
    );

    useEffect(() => {
        if (heat) {
            setNewHeat(heat);
        }
    }, [heat]);

    const handleChange = (e: { target: { name: any; value: any } }) => {
        setNewHeat((nr: any) => ({ ...nr, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        onSave(newHeat);
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Stack gap={2}>
                    <TextField
                        id="customId"
                        name="customId"
                        value={newHeat.customId}
                        onChange={handleChange}
                        label="custom Id"
                        type={"text"}
                        variant="outlined"
                    />
                    <TextField
                        id="name"
                        name="name"
                        value={newHeat.name}
                        onChange={handleChange}
                        label="name"
                        type={"text"}
                        variant="outlined"
                    />
                </Stack>
                <Button onClick={handleSave}>Validate</Button>
            </Box>
        </Modal>
    );
};

export default HeatsModal;
