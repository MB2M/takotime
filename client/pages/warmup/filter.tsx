import { useEffect, useState } from "react";
import { usePlanning } from "../../utils/mt/usePlanning";
import Clock from "react-live-clock";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useLiveDataContext } from "../../context/liveData/livedata";
import { useCompetitionContext } from "../../context/competition";
import { deltaMinutes } from "../../utils/timeConverter";

const Warmup = () => {
    const { globals } = useLiveDataContext();
    const planning = usePlanning(45000);
    const competition = useCompetitionContext();
    const [allowedHeats, setAllowedHeats] = useState<PlanningHeat[]>([]);

    useEffect(() => {
        if (planning && globals?.externalHeatId) {
            let allowedHeats = [];
            const filteredPlanning = planning.filter(
                (p) => p.workoutName !== "E5"
            );
            for (let i = 0; i < filteredPlanning.length; i++) {
                let heat = filteredPlanning[i];
                if (heat.id === globals.externalHeatId) {
                    if (i + 1 < filteredPlanning.length) {
                        allowedHeats.push(filteredPlanning[i + 1]);
                    }
                    if (i + 2 < filteredPlanning.length) {
                        allowedHeats.push(filteredPlanning[i + 2]);
                    }
                    if (i + 3 < filteredPlanning.length) {
                        allowedHeats.push(filteredPlanning[i + 3]);
                    }
                }
            }
            setAllowedHeats(allowedHeats);
        }
    }, [planning, globals?.externalHeatId]);

    return (
        <>
            <Box
                sx={{
                    height: "100vh",
                    width: "100vw",
                    backgroundImage: `url(/api/images/${competition?.logoUrl})`,
                    backgroundSize: "60vw",
                    backgroundPosition: "center",
                    backgroundColor: "black",
                    backgroundRepeat: "no-repeat",
                }}
            />

            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                position="absolute"
                sx={{
                    height: "100vh",
                    width: "100vw",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#000000aa",
                    color: "white",
                }}
            >
                {allowedHeats.length === 0 && (
                    <Typography
                        variant={"h1"}
                        fontSize={"50rem"}
                        fontFamily={"BebasNeue"}
                    >
                        <Clock
                            format={"HH:mm"}
                            ticking={true}
                            timezone={"Europe/Paris"}
                        />
                    </Typography>
                )}

                <Grid
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center"
                    spacing={5}
                    paddingX={5}
                >
                    {allowedHeats.map((allowedHeat, index) => {
                        return (
                            <Grid item xs={12 / allowedHeats.length}>
                                <Typography
                                    variant="h4"
                                    textAlign={"center"}
                                    fontFamily={"BebasNeue"}
                                    color={"inherit"}
                                >
                                    {`Next Heat ${index ? "+" + index : ""} :`}
                                </Typography>
                                <Typography
                                    variant="h3"
                                    textAlign={"center"}
                                    fontFamily={"BebasNeue"}
                                    color={"inherit"}
                                    height={50}
                                >
                                    {`${allowedHeat.title} @ ${allowedHeat.time}`}
                                </Typography>
                                <Typography
                                    variant="h3"
                                    textAlign={"center"}
                                    fontFamily={"BebasNeue"}
                                    marginBottom={5}
                                    // color={"inherit"}
                                    height={100}
                                    color={"#fd0c0c"}
                                >
                                    {`Chambre d'appel @ ${deltaMinutes(
                                        allowedHeat.time?.split(":")[0] || "0",
                                        allowedHeat.time?.split(":")[1] || "0",
                                        -11
                                    )}`}
                                </Typography>
                                <Grid container spacing={1}>
                                    {allowedHeat.stations
                                        .sort((a, b) =>
                                            a.participantName <
                                            b.participantName
                                                ? -1
                                                : 1
                                        )
                                        .map((station) => (
                                            <Grid item xs={6}>
                                                <Paper
                                                    sx={{
                                                        backgroundColor:
                                                            "#ffffffaa",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "start",
                                                        }}
                                                        minHeight={"7vh"}
                                                        p={0.2}
                                                        pl={1}
                                                    >
                                                        <Typography
                                                            lineHeight={1}
                                                            fontFamily={
                                                                "BebasNeue"
                                                            }
                                                            color={"inherit"}
                                                            fontSize={"1.6vw"}
                                                        >
                                                            {
                                                                station.participantName
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>
        </>
    );
};

export default Warmup;
