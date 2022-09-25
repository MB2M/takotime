import {
    Box,
    Button,
    Container,
    Divider,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import CompetitionList from "../../components/admin/CompetitionList";
import ModalCreateCompetition from "../../components/admin/ModalCreateCompetition";

const AdminIndex = ({ competitions }: { competitions: Competition[] }) => {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const loadedEvent = useMemo(() => {
        return competitions.find((competition) => competition.selected);
    }, [competitions]);

    const [selectedEventId, setSelectedEventId] = useState<string>(
        loadedEvent?._id || ""
    );

    const handleClose = () => {
        setOpen(false);
    };

    const handleAddCompetitionClick = () => {
        setOpen(true);
    };

    const handleSelectEventId = (event: SelectChangeEvent<string>) => {
        setSelectedEventId(event.target.value);
    };

    const handleLoad = async () => {
        try {
            await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/webapp/competition/${selectedEventId}/select`
            );
            router.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container>
            <ModalCreateCompetition open={open} onClose={handleClose} />
            <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Box textAlign={"center"}>
                    <Typography variant="h5">Actual Competition:</Typography>
                    <Typography variant="h5">{loadedEvent?.name}</Typography>
                    <Typography variant="h5">
                        Select the competition to load
                    </Typography>
                    <Select
                        size="small"
                        value={selectedEventId}
                        onChange={handleSelectEventId}
                    >
                        {competitions.map((competition) => (
                            <MenuItem
                                key={competition._id}
                                value={competition._id}
                            >
                                {competition.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <Button variant="contained" onClick={handleLoad}>
                        Load
                    </Button>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        onClick={handleAddCompetitionClick}
                    >
                        Add a new competition
                    </Button>
                </Box>
            </Box>
            <Divider />
            <CompetitionList competitions={competitions} />
        </Container>
    );
};

// This gets called on every request
export async function getServerSideProps() {
    const res = await fetch(
        `http://${process.env.NEXT_PUBLIC_LIVE_API}/webapp/competition`
    );
    const data = await res.json();
    return { props: { competitions: data } };
}

export default AdminIndex;
