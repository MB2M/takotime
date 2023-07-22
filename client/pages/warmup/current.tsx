import { useEffect, useState } from "react";
import { usePlanning } from "../../utils/mt/usePlanning";
import Clock from "react-live-clock";
import { Box, Grid, Paper, Typography } from "@mui/material";
import useChrono from "../../hooks/useChrono";
import { useLiveDataContext } from "../../context/liveData/livedata";
import { useCompetitionContext } from "../../context/competition";

const WarmupCurrent = () => {
    const competition = useCompetitionContext();
    const { globals } = useLiveDataContext();
    const planning = usePlanning(45000);
    const [allowedHeats, setAllowedHeats] = useState<PlanningHeat[]>([]);
    const liveData = useLiveDataContext();
    const { timer } = useChrono(
        liveData.globals?.startTime,
        liveData.globals?.duration
    );

    useEffect(() => {
        if (planning && globals?.externalHeatId) {
            let allowedHeats = [];

            for (let i = 0; i < planning.length; i++) {
                let heat = planning[i];
                if (heat.id === globals.externalHeatId) {
                    allowedHeats.push(planning[i]);
                    if (i + 1 < planning.length) {
                        allowedHeats.push(planning[i + 1]);
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
                    backgroundColor: "#00000080",
                    color: "white",
                }}
            >
                {allowedHeats.length === 0 ? (
                    <Typography
                        fontFamily={"wwDigital"}
                        color={"white"}
                        sx={{
                            background: `-webkit-linear-gradient(${competition?.primaryColor}, ${competition?.secondaryColor})`,
                            "-webkitBackgroundClip": "text",
                            "-webkit-text-fill-color": "transparent",
                            "-webkit-text-stroke-width": "3px",
                            "-webkit-text-stroke-color": "black",
                            fontSize: "calc(35vw)",
                        }}
                    >
                        <Clock
                            format={"HH:mm"}
                            ticking={true}
                            timezone={"Europe/Paris"}
                        />
                    </Typography>
                ) : (
                    <>
                        <Typography
                            fontSize={"4rem"}
                            fontFamily={"BebasNeue"}
                            sx={{ position: "absolute", top: 0, right: 30 }}
                        >
                            <Clock
                                format={"HH:mm"}
                                ticking={true}
                                timezone={"Europe/Paris"}
                            />
                        </Typography>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="start"
                            spacing={5}
                        >
                            {allowedHeats.map((allowedHeat, index) => {
                                return (
                                    <Grid item xs={5}>
                                        <Typography
                                            variant="h4"
                                            textAlign={"center"}
                                            fontFamily={"BebasNeue"}
                                        >
                                            {`${
                                                index
                                                    ? "Next Heat"
                                                    : "Current Heat"
                                            } :`}
                                        </Typography>
                                        <Typography
                                            variant="h3"
                                            textAlign={"center"}
                                            fontFamily={"BebasNeue"}
                                            marginBottom={3}
                                        >
                                            {`${allowedHeat.title}  ${
                                                index
                                                    ? " @ " + allowedHeat.time
                                                    : timer
                                                    ? " : " +
                                                      timer
                                                          ?.toLocaleString()
                                                          .slice(0, 5)
                                                    : ""
                                            }`}
                                        </Typography>
                                        <Grid container spacing={1}>
                                            {allowedHeat.stations
                                                .sort(
                                                    (a, b) =>
                                                        a.station - b.station
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
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "start",
                                                                }}
                                                                minHeight={
                                                                    "7vh"
                                                                }
                                                                p={0.2}
                                                                pl={1}
                                                            >
                                                                <Typography
                                                                    lineHeight={
                                                                        1
                                                                    }
                                                                    fontFamily={
                                                                        "BebasNeue"
                                                                    }
                                                                    color={
                                                                        "inherit"
                                                                    }
                                                                    fontSize={
                                                                        "1.8vw"
                                                                    }
                                                                >
                                                                    {
                                                                        station.station
                                                                    }{" "}
                                                                    -{" "}
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
                    </>
                )}
            </Box>
        </>
    );
};

export default WarmupCurrent;
