import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import Clock from "react-live-clock";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import { usePlanning } from "../../../utils/mt/usePlanning";

function WarmupCall() {
    const planning = usePlanning(30000);
    const { globals } = useLiveDataContext();

    const selectedHeat = useMemo(() => {
        if (globals && planning) {
            console.log(planning);
            const aaa = planning.find(
                (heat) => heat.id === globals?.remoteWarmupHeat
            );
            console.log(aaa);
            return aaa;
        } else {
            return;
        }
    }, [globals, planning]);

    // console.log(globals?.remoteWarmupHeat);

    if (!selectedHeat) {
        return (
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
                }}
            >
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
            </Box>
        );
    }

    return (
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
            <Typography fontFamily={"CantoraOne"} variant="h1">
                <h3>Athletes of heat :</h3>
                <h1>
                    {selectedHeat.title}
                </h1>
                <h3>are required</h3>
            </Typography>
        </Box>
    );

}

export default WarmupCall;
