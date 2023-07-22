import { Button, Container, Paper, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../context/liveData/livedata";
import { usePlanning } from "../../utils/mt/usePlanning";

function WarmupRemote() {
    const { globals, sendMessage } = useLiveDataContext();

    const planning = usePlanning(300000);

    function handleHeatClick(id: number) {
        let message;
        if (globals?.remoteWarmupHeat === id) {
            message = "";
        } else {
            message = id;
        }

        sendMessage(
            JSON.stringify({ topic: "client/remoteWarmupHeat", message })
        );
    }

    const handleUnselect = () => {
        sendMessage(
            JSON.stringify({ topic: "client/remoteWarmupHeat", message: "" })
        );
    };

    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    width: "100%",
                    zIndex: 1,
                }}
            >
                <Paper
                    elevation={8}
                    sx={{
                        paddingY: "15px",
                        textAlign: "center",
                    }}
                >
                    <Button
                        variant={"outlined"}
                        color="error"
                        onClick={handleUnselect}
                    >
                        unselect
                    </Button>
                </Paper>
            </Box>
            <Container>
                <Stack spacing={1} paddingTop={9}>
                    {planning.map((h) => {
                        return (
                            <Button
                                key={h.id}
                                onClick={() => handleHeatClick(h.id)}
                                variant={
                                    globals?.remoteWarmupHeat === h.id
                                        ? "contained"
                                        : "outlined"
                                }
                            >
                                {h.title}
                            </Button>
                        );
                    })}
                </Stack>
            </Container>
        </>
    );
}

export default WarmupRemote;
