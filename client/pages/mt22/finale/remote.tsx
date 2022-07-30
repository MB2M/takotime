import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import { usePlanning } from "../../../utils/mt/usePlanning";

function WarmupRemote() {
    const { globals, sendMessage } = useLiveDataContext();

    const planning = usePlanning(300000);

    const selectedHeat = useMemo<PlanningHeat | undefined>(() => {
        return planning.find((heat) => heat.id === globals?.externalHeatId);
    }, [globals?.externalHeatId, planning]);

    function handleHeatClick(id: number) {
        let message;
        if (globals?.remoteFinaleAthlete === id) {
            message = "";
        } else {
            message = id;
        }

        sendMessage(
            JSON.stringify({ topic: "client/remoteFinaleAthlete", message })
        );
    }

    const handleUnselect = () => {
        sendMessage(
            JSON.stringify({ topic: "client/remoteFinaleAthlete", message: "" })
        );
    };

    // useEffect(() => {
    //     handleUnselect();
    // }, [globals?.externalHeatId]);

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
                <Typography variant="h2" paddingTop={12} textAlign="center">
                    {selectedHeat?.title}
                </Typography>
                <Stack spacing={1} marginTop={2}>
                    {selectedHeat?.stations?.map((athlete) => (
                        <Button
                            key={athlete.participantId}
                            onClick={() =>
                                handleHeatClick(athlete.participantId)
                            }
                            variant={
                                globals?.remoteFinaleAthlete ===
                                athlete.participantId
                                    ? "contained"
                                    : "outlined"
                            }
                        >
                            {athlete.participantName}
                        </Button>
                    ))}
                </Stack>
            </Container>
        </>
    );
}

export default WarmupRemote;
