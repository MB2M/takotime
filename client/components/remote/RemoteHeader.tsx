import { Box, Typography } from "@mui/material";
import Chrono from "../bigscreen/Chrono";

interface Props {
    laneNumber: string;
    participant: string;
    chronoDirection: WorkoutOption["chronoDirection"];
    state: number;
}
const RemoteHeader = ({
    laneNumber,
    participant,
    chronoDirection,
    state,
}: Props) => {
    return (
        <Box
            sx={{
                backgroundColor: "#E8E8E8",
                boxShadow: "0px 0px 9px 0px #00000090;",
            }}
        >
            <Box
                display="flex"
                justifyContent={"flex-start"}
                textAlign="center"
                alignItems="center"

                // paddingTop="20px"
            >
                <Box
                    display="flex"
                    sx={{
                        borderRight: "1px solid gray",
                    }}
                    alignItems={"center"}
                >
                    <Typography
                        fontFamily={"CantoraOne"}
                        fontSize={"1.5rem"}
                        p={1.5}
                    >
                        {laneNumber}
                    </Typography>
                </Box>
                <Box display="flex" p={1}>
                    <Typography
                        fontSize={"1.5rem"}
                        fontFamily={"CantoraOne"}
                        ml={4}
                    >
                        {participant}
                    </Typography>
                </Box>
            </Box>
            {state > 1 && (
                <Box
                    display={"flex"}
                    justifyContent={"center"}
                    borderTop={"1px solid gray"}
                    // borderBottom={"2px solid black"}
                    p={1}
                >
                    <Chrono
                        reverse={chronoDirection === "desc"}
                        fontSize={"2rem"}
                        fontFamily={"CantoraOne"}
                    />
                </Box>
            )}
        </Box>
    );
};

export default RemoteHeader;
