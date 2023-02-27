import {
    Modal,
    Box,
    TextField,
    Select,
    MenuItem,
    Button,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import { ChangeEvent, useState, useEffect, useCallback } from "react";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // width: "50%",
    // height: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const ModalCreateCompetition = ({
    open,
    onClose: onClose,
}: {
    open: boolean;
    onClose: () => any;
}) => {
    const [eventId, setEventId] = useState<string>("");
    const [eventName, setEventName] = useState<string>("");
    const [platform, setPlatform] = useState<Platform>("CompetitionCorner");
    const [competitionName, setCompetitionName] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const findCCEventName = useCallback(async () => {
        if (eventId.length <= 0) setEventName("");
        try {
            const response = await fetch(
                `https://competitioncorner.net/api2/v1/events/${eventId}`
            );
            const json = await response.json();
            setEventName(json.name);
        } catch (err) {
            console.log(err);
        }
    }, [eventId]);

    useEffect(() => {
        switch (platform) {
            case "CompetitionCorner":
                findCCEventName();
                break;
            default:
                setEventName("");
        }
    }, [findCCEventName, platform]);

    const handleCompetitionName = (event: ChangeEvent<HTMLInputElement>) => {
        setCompetitionName(event.target.value);
    };

    const handlePlatformChange = async (event: SelectChangeEvent<string>) => {
        setPlatform(event.target.value as Platform);
    };

    const handleEventChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const id = event?.target.value;
        setEventId(id);
    };

    const handleCreateCompetition = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/webapp/competition`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        name: competitionName,
                        platform,
                        eventId: eventId,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                handleClose();
            } else {
                const json = await response.json();
                setErrorMessage(json.error);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("something wrong!!!");
        }
    };

    const handleClose = () => {
        setErrorMessage("");
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={modalStyle}
                gap={2}
                display="flex"
                flexDirection={"column"}
            >
                <Box>
                    <TextField
                        label="Competition name"
                        size="small"
                        onChange={handleCompetitionName}
                    />
                </Box>
                <Box display="flex" gap={2}>
                    <Select
                        label="platform"
                        defaultValue={"CompetitionCorner"}
                        size="small"
                        value={platform}
                        onChange={handlePlatformChange}
                    >
                        <MenuItem value="CompetitionCorner">
                            Competition Corner
                        </MenuItem>
                        <MenuItem value="None">None</MenuItem>
                    </Select>
                    <TextField
                        label="event id"
                        size="small"
                        onChange={handleEventChange}
                        helperText={eventName}
                    />
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleCreateCompetition}
                    >
                        Create
                    </Button>
                    <Typography>{errorMessage}</Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default ModalCreateCompetition;
