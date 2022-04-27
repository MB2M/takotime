import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import OverlayRunningAthlete from "./OverlayRunningAthlete";
import OverlayRunningDuelAthlete from "./OverlayRunningDuelAthlete";
import useChrono from "../../../hooks/useChrono";
import { Typography } from "@mui/material";

const getWorkout = (workouts: Workout[], station: WidescreenStation ) => {
    for (let workout of workouts) {
        if (workout.categories.includes(station.category)) {
            return workout;
        }
    }
};

const OverlayRunning = ({
    data,
    version,
}: {
    data: WidescreenData;
    version: OverlayVersion;
}) => {
    const chrono = useChrono(data.globals.startTime, data.globals.duration);

    return (
        <Box
            className="displayZone"
            sx={{
                width: 1920,
                height: 1080,
                flexDirection: "column",
                justifyContent: "space-evenly",
                // border: "3px solid",
                // borderColor: "red",
            }}
        >
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
                height="100%"
            >
                <Stack
                    direction="column"
                    alignItems="flex-start"
                    spacing={7}
                    paddingTop={1}
                    height="100%"
                >
                    {data.stations
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .slice(
                            0,
                            data.stations.length / 2 +
                                (data.stations.length % 2)
                        )
                        .map((s) =>
                            version === "duel" ? (
                                <OverlayRunningDuelAthlete
                                    key={s.laneNumber}
                                    data={s}
                                    workout={getWorkout(data.workouts, s)}
                                    position="left"
                                    opposantData={data.stations[1]}
                                />
                            ) : (
                                <OverlayRunningAthlete
                                    key={s.laneNumber}
                                    data={s}
                                    workout={getWorkout(data.workouts, s)}
                                    position="left"
                                />
                            )
                        )}
                </Stack>
                <Typography
                    variant="h3"
                    component="div"
                    padding={2}
                    sx={{
                        background: "#000000f2",
                        color: "white",
                        textAlign: "center",
                        borderTop: 0,
                        radius: 0,
                        borderRadius: "0px 0px 50px 50px",
                    }}
                >
                    {chrono?.toString().slice(0,5)}
                </Typography>
                <Stack
                    direction="column"
                    alignItems="flex-end"
                    spacing={7}
                    paddingTop={1}
                    height="100%"
                >
                    {data.stations
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .slice(
                            data.stations.length / 2 +
                                (data.stations.length % 2)
                        )
                        .map((s) =>
                            version === "duel" ? (
                                <OverlayRunningDuelAthlete
                                    key={s.laneNumber}
                                    data={s}
                                    workout={getWorkout(data.workouts, s)}
                                    position="right"
                                    opposantData={data.stations[0]}
                                />
                            ) : (
                                <OverlayRunningAthlete
                                    key={s.laneNumber}
                                    data={s}
                                    workout={getWorkout(data.workouts, s)}
                                    position="right"
                                />
                            )
                        )}
                </Stack>
            </Stack>
        </Box>
    );
};

export default OverlayRunning;
