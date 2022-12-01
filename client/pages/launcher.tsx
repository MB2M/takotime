import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo, useState } from "react";
import { useCompetitionContext } from "../context/competition";
import useCCWorkouts from "../hooks/useCCWorkouts";

const Launcher = () => {
    const competition = useCompetitionContext();
    const CCWorkouts = useCCWorkouts(competition?.eventId);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");

    const getWorkoutCCInfo = (workoutId: string) => {
        return CCWorkouts.find(
            (workout) => workout.id.toString() === workoutId
        );
    };
    console.log(competition);
    return (
        <>
            <Typography variant="h3">Wod launcher</Typography>
            <Box display="flex" gap={2}>
                {competition?.workouts?.map((workout) => (
                    <Button
                        variant={
                            selectedWorkoutId === workout.workoutId
                                ? "contained"
                                : "outlined"
                        }
                    >
                        {workout?.workoutId &&
                            getWorkoutCCInfo(workout.workoutId)?.name}{" "}
                        ({workout.workoutId})
                    </Button>
                ))}
            </Box>
        </>
    );
};

export default Launcher;
