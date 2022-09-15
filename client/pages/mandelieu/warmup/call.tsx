import { Box, Paper, Typography } from "@mui/material";
import { useMemo } from "react";
import Clock from "react-live-clock";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import { usePlanning } from "../../../utils/mt/usePlanning";
import { bg, logo } from "../../../eventConfig/mandelieu/config";

function WarmupCall() {
    const planning = usePlanning(30000);
    const { globals } = useLiveDataContext();

    const selectedHeat = useMemo(() => {
        if (globals && planning) {
            return planning.find(
                (heat) => heat.id === globals?.remoteWarmupHeat
            );
        } else {
            return;
        }
    }, [globals, planning]);

    return (
        <>
            {!selectedHeat ? (
                <Box
                    sx={{
                        height: "100vh",
                        width: "100vw",
                        backgroundImage: `url(${bg.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(8px)",
                        webkitFilter: "blur(8px)",
                    }}
                ></Box>
            ) : (
                <Box
                    sx={{
                        height: "100vh",
                        width: "100vw",
                        backgroundImage: `url(${bg.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundBlendMode: "darken",
                        backgroundColor:"#00000040",
                        filter: "blur(25px)",
                        webkitFilter: "blur(25px)",
                    }}
                ></Box>
            )}
            <Box
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                position="absolute"
                textAlign={"center"}
                sx={{
                    height: "100vh",
                    width: "100vw",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                {selectedHeat ? (
                    <Typography fontFamily={"CantoraOne"} variant="h1">
                        {/* <h3>Athletes of heat :</h3> */}
                        {/* <Box paddingY={2}> */}
                        <Paper
                            sx={{
                                width: "90vw",
                                height: "400px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            elevation={24}
                            
                        >
                            {/* <Box> */}
                                <h1>{selectedHeat.title}</h1>
                            {/* </Box> */}
                        </Paper>
                        {/* </Box> */}
                        {/* <h3>are required</h3> */}
                    </Typography>
                ) : (
                    <Typography
                        variant={"h1"}
                        fontSize={"50rem"}
                        fontFamily={"CantoraOne"}
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
