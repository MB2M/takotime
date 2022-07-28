import { Button, Container, Paper, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import { usePlanning } from "../../../utils/mt/usePlanning";

function WarmupRemote() {
    const { globals, sendMessage } = useLiveDataContext();

    const planning = usePlanning(300000);

    const [selectedId, setSelectedId] = useState<string>("");

    function handleHeatClick(id: number) {
        // let title;
        // if (selectedId === id.toString()) {
        //     title = "";
        // } else {
        //     title = id;
        // }
        // setSelectedId(title.toString());

        // sendMessage(
        //     JSON.stringify({ topic: "client/remoteWarmupHeat", message: title })
        // );

        let message;
        if (globals?.remoteWarmupHeat === id) {
            message = "";
        } else {
            message = id;
        }
        // setSelectedId(title.toString());

        sendMessage(
            JSON.stringify({ topic: "client/remoteWarmupHeat", message })
        );

        // const requestOptions = {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ remoteHeatName: title }),
        // };
        // fetch("/livedata/remote-post", requestOptions);
    }

    const handleUnselect = () => {
        sendMessage(
            JSON.stringify({ topic: "client/remoteWarmupHeat", message: "" })
        );
        // setSelectedId("");
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
