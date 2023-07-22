import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import Clock from "react-live-clock";
import { useLiveDataContext } from "../../context/liveData/livedata";
import { usePlanning } from "../../utils/mt/usePlanning";
import { useCompetitionContext } from "../../context/competition";

function WarmupCall() {
    const planning = usePlanning(30000);
    const { globals } = useLiveDataContext();
    const competition = useCompetitionContext();

    const selectedHeat = useMemo(() => {
        if (globals && planning) {
            return planning.find(
                (heat) => heat.id === globals?.remoteWarmupHeat
            );
        } else {
            return;
        }
    }, [globals, planning]);

    // if (!selectedHeat) {
    //     return (

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
                textAlign={"center"}
                overflow={"hidden"}
                sx={{
                    height: "100vh",
                    width: "100vw",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#000000dd",
                }}
            >
                {selectedHeat ? (
                    <Typography
                        fontFamily={"bebasNeue"}
                        // fontSize={10rem * 100vw/1080}
                        lineHeight={1}
                        sx={{
                            background: `-webkit-linear-gradient(${"red"}, ${
                                competition?.secondaryColor
                            })`,
                            "-webkitBackgroundClip": "text",
                            "-webkit-text-fill-color": "transparent",
                            "-webkit-text-stroke-width": "3px",
                            "-webkit-text-stroke-color": "black",
                            fontSize: "calc(10vw)",
                        }}
                    >
                        <h1>{selectedHeat.title}</h1>
                    </Typography>
                ) : (
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
                )}
            </Box>
        </>
    );
}

export default WarmupCall;
