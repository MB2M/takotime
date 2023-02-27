import {
    Button,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ChangeEvent, useState, MouseEvent, useEffect, FormEvent } from "react";
import { useCompetitionContext } from "../context/competition";
import useWorkouts from "../hooks/useCCWorkouts";

const BASE_COUNTDOWN_BTN = [0, 1, 3, 5, 10, 15, 20];

const isNumberOrEmpty = (data: any): boolean => {
    const regexp = /(^[0-9]+$|^$)/;
    return regexp.test(data);
};

const Launcher = () => {
    const competition = useCompetitionContext();
    const CCWorkouts = useWorkouts(competition?.platform, competition?.eventId);
    const [selectedWorkoutId, setSelectedWorkoutId] = useState<string>("");
    const [timerSetting, setTimerSetting] = useState<TimerSetting>({
        countdown: 10,
        duration: 0,
        direction: "asc",
    });

    const getWorkoutCCInfo = (workoutId: string) => {
        return CCWorkouts.find(
            (workout) => workout.id.toString() === workoutId
        );
    };

    const handleWorkoutSelect = (event: SelectChangeEvent<string>) => {
        setSelectedWorkoutId(event.target.value);
    };

    const handleTimerChange =
        (settingKey: keyof TimerSetting) =>
        (event: ChangeEvent | MouseEvent, newVal?: string) => {
            setTimerSetting((current) => ({
                ...current,
                [settingKey]:
                    newVal ||
                    ("value" in event?.target ? event.target.value : ""),
            }));
        };

    const handleCountdownChange = (value: number) => {
        setTimerSetting((current) => ({
            ...current,
            countdown: value,
        }));
    };

    useEffect(() => {
        const workoutInfo = competition?.workouts.find(
            (workout) => workout.workoutId === selectedWorkoutId
        );
        if (workoutInfo) {
            setTimerSetting({
                duration: workoutInfo.duration || 0,
                direction: workoutInfo.options?.chronoDirection || "asc",
                countdown: 10,
            });
        }
    }, [selectedWorkoutId]);

    const handleStart = async () => {
        if (!timerSetting.duration) return;
        try {
            await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/switchStart?action=start&duration=${timerSetting.duration}&countdown=${timerSetting.countdown}`
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleReset = async () => {
        try {
            await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/switchStart?action=reset`
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <Box textAlign={"center"}>
                <Typography variant="h3">Wod launcher</Typography>
                <Box>
                    <Typography variant="h5">Load from settings:</Typography>
                    <Box display="flex" gap={2}>
                        <FormControl sx={{ minWidth: 300 }}>
                            <InputLabel id="workout select">
                                Select Workout to load chrono settings
                            </InputLabel>
                            <Select
                                labelId="workout select"
                                value={selectedWorkoutId}
                                onChange={handleWorkoutSelect}
                            >
                                {competition?.workouts?.map((workout) => (
                                    <MenuItem value={workout.workoutId}>
                                        {workout?.workoutId &&
                                            getWorkoutCCInfo(workout.workoutId)
                                                ?.name}{" "}
                                        ({workout.workoutId})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h5">Countdown:</Typography>
                    <TextField
                        variant="outlined"
                        type={"number"}
                        value={timerSetting.countdown}
                        onChange={handleTimerChange("countdown")}
                    />
                    <Box p={1}>
                        {BASE_COUNTDOWN_BTN.map((btn) => (
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ px: "1px", m: "4px" }}
                                onClick={() => handleCountdownChange(btn)}
                            >
                                {btn}
                            </Button>
                        ))}
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h5">Duration:</Typography>
                    <TextField
                        variant="outlined"
                        type={"number"}
                        value={timerSetting.duration}
                        onChange={handleTimerChange("duration")}
                    />
                </Box>
                <Box>
                    <Typography variant="h5">Direction:</Typography>
                    <ToggleButtonGroup
                        color="primary"
                        value={timerSetting.direction}
                        exclusive
                        onChange={handleTimerChange("direction")}
                        aria-label="Platform"
                    >
                        <ToggleButton value="asc">Asc</ToggleButton>
                        <ToggleButton value="desc">Desc</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box mt={2} gap={1} display="flex">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleStart}
                    >
                        Start
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Launcher;
