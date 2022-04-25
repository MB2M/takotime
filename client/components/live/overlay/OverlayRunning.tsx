import { Box } from "@mui/system";
import Stack from "@mui/material/Stack";
import OverlayRunningAthlete from "./OverlayRunningAthlete";

const getWorkout = (workouts: Workout[], station: WidescreenStation) => {
    for (let workout of workouts) {
        if (workout.categories.includes(station.category)) {
            return workout;
        }
    }
};

const OverlayRunning = ({ data }: { data: WidescreenData }) => {
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
                    // justifyContent="space-around"
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
                        .map((s) => (
                            <OverlayRunningAthlete
                                key={s.laneNumber}
                                data={s}
                                workout={getWorkout(data.workouts, s)}
                                position="left"
                            />
                        ))}
                </Stack>
                <Stack
                    direction="column"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    spacing={2}
                    height="100%"
                >
                    {data.stations
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .slice(
                            data.stations.length / 2 +
                                (data.stations.length % 2)
                        )
                        .map((s) => (
                            <OverlayRunningAthlete
                                key={s.laneNumber}
                                data={s}
                                workout={getWorkout(data.workouts, s)}
                                position="right"
                            />
                        ))}
                </Stack>
            </Stack>
        </Box>
    );
};

export default OverlayRunning;
