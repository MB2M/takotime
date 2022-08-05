import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import OverlayRunningAthlete from "./OverlayRunningAthlete";
import OverlayRunningDuelAthlete from "./OverlayRunningDuelAthlete";
import useChrono from "../../../hooks/useChrono";
import { List, ListItem, Typography } from "@mui/material";
import OverlayRunningDuelAthlete2 from "./OverlayRunningDuelAthlete2";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useStationPayload from "../../../hooks/useStationPayload";
import Header from "../../mt/Header";
import mtLogo from "../../../public/img/logo.png";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import { ReactChild, ReactFragment, ReactPortal } from "react";

const getWorkout = (workouts: Workout[], station: WidescreenStation) => {
    for (let workout of workouts) {
        if (workout.categories.includes(station.category)) {
            return workout;
        }
    }
};

const OverlayResult = () => {
    const { globals, stations, ranks, loadedWorkouts } = useLiveDataContext();
    const chrono = useChrono(globals?.startTime, globals?.duration);

    const stationsUpgraded = useStationPayload(stations, ranks);
    const CCData = useCompetitionCornerContext();

    return (
        <Box
            className="displayZone"
            overflow={"hidden"}
            sx={{
                width: 1920,
                height: 1080,
                flexDirection: "column",
                justifyContent: "space-evenly",
            }}
        >
            <Header
                // logo={mtLogo}
                chrono={chrono?.toString().slice(0, 5) || ""}
                chronoFontSize="4rem"
                textTop={CCData?.epHeat?.[0].heatName}
                textTopFontSize="4rem"
                imageWidth={"110px"}
                backgroundColor="#000000fa"
            />
            <Stack
                direction="column"
                // justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                width="25%"
                height="100%"
                sx={{ backgroundColor: "#000000fa" }}
                color={"white"}
            >
                <Typography
                    variant="h5"
                    fontFamily={"CantoraOne"}
                    textAlign="center"
                >
                    Heat Recap
                </Typography>
                <List sx={{ width: "100%" }}>
                    {CCData?.epHeat
                        ?.sort((a: any, b: any) => a.station - b.station)
                        .map((s) => (
                            <ListItem
                                key={s.station}
                                sx={{
                                    borderBottom: "2px solid white",
                                    borderTop: "2px solid white",
                                }}
                            >
                                <Box
                                    display={"flex"}
                                    justifyContent={"flex-end"}
                                    width={"100%"}
                                    color={
                                        s.rank === "1"
                                            ? "#FFD600"
                                            : s.rank === "2"
                                            ? "#05c1de"
                                            : s.rank === "3"
                                            ? "#fd1085"
                                            : "white"
                                    }
                                >
                                    <Typography
                                        variant="h5"
                                        fontFamily={"CantoraOne"}
                                    >
                                        {s.station}
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        fontFamily={"CantoraOne"}
                                        ml={"15px"}
                                        mr="auto"
                                        noWrap
                                        maxWidth={"250px"}
                                    >
                                        {s.displayName.toUpperCase()}
                                    </Typography>
                                    <Box display="flex">
                                        <Typography
                                            variant="h5"
                                            fontFamily={"CantoraOne"}
                                            mr="30px"
                                        >
                                            {s.points
                                                ? s.points + " pts"
                                                : s.points}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            fontFamily={"CantoraOne"}
                                            width="20px"
                                            textAlign={"end"}
                                        >
                                            {s.rank}
                                        </Typography>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                </List>
            </Stack>
        </Box>
    );
};

export default OverlayResult;
