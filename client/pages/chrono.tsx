import { useLiveDataContext } from "../context/liveData/livedata";
import { useCompetitionContext } from "../context/competition";
import { useMemo } from "react";
import Chrono from "../components/bigscreen/Chrono";
import { Box } from "@mui/system";

const ChronoFull = () => {
    const { globals } = useLiveDataContext();
    const competition = useCompetitionContext();
    const workout = useMemo(
        () =>
            competition?.workouts.find(
                (workout) =>
                    workout.workoutId === globals?.externalWorkoutId.toString()
            ),
        [competition, globals?.externalWorkoutId]
    );
    return (
        <Box
            display="flex"
            justifyContent={"center"}
            alignItems={"center"}
            height={"100vh"}
            sx={{ backgroundColor: "#1f1f1f", color: "white" }}
            overflow={"hidden"}
        >
            <Chrono
                reverse={workout?.options?.chronoDirection === "desc"}
                fontSize={"50rem"}
                fontFamily={"BebasNeue"}
            />
        </Box>
    );
};
export default ChronoFull;
