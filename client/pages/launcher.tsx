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
import { Box, Stack } from "@mui/system";
import {
    ChangeEvent,
    useState,
    MouseEvent,
    useEffect,
    FormEvent,
    useMemo,
} from "react";
import { useCompetitionContext } from "../context/competition";
import useWorkouts from "../hooks/useCCWorkouts";
import { useLiveDataContext } from "../context/liveData/livedata";
import useChrono from "../hooks/useChrono";
import { formatChrono } from "../utils/timeConverter";

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
    const { globals } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);

    const getWorkoutCCInfo = (workoutId: string) => {
        return CCWorkouts.find(
            (workout) => workout.id.toString() === workoutId
        );
    };

    const handleWorkoutSelect = (event: SelectChangeEvent<string>) => {
        setSelectedWorkoutId(event.target.value);
    };

    const workout = useMemo(
        () =>
            competition?.workouts?.find(
                (workout) =>
                    workout.workoutId?.toString() ===
                    globals?.externalWorkoutId.toString()
            ),
        [competition?.workouts, globals?.externalWorkoutId]
    );

    const handleTimerChange =
        (settingKey: keyof TimerSetting) =>
        (event: ChangeEvent | MouseEvent, newVal?: string) => {
            const targetEvent = event.target as any;
            const eventValue = targetEvent.value ?? "";

            setTimerSetting((current) => ({
                ...current,
                [settingKey]: newVal || eventValue,
            }));
        };

    const handleCountdownChange = (value: number) => {
        setTimerSetting((current) => ({
            ...current,
            countdown: value,
        }));
    };

    useEffect(() => {
        if (workout) {
            setTimerSetting({
                duration: workout.duration || 0,
                direction: workout.options?.chronoDirection || "asc",
                countdown: 10,
            });
        }
    }, [workout]);

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
        <Container sx={{ p: 2 }}>
            <Box textAlign={"center"}>
                <Typography variant="h3">Wod launcher</Typography>

                <Stack spacing={2}>
                    {timer ? (
                        <h1>
                            {formatChrono(
                                timer,
                                workout?.options?.chronoDirection === "desc"
                            )}
                        </h1>
                    ) : (
                        <>
                            <Box>
                                <Typography>Countdown:</Typography>
                                <TextField
                                    variant="outlined"
                                    type={"number"}
                                    value={timerSetting.countdown}
                                    onChange={handleTimerChange("countdown")}
                                    size={"small"}
                                    sx={{ maxWidth: 80 }}
                                />
                            </Box>
                            <Box>
                                <Typography>Duration:</Typography>
                                <TextField
                                    variant="outlined"
                                    type={"number"}
                                    value={timerSetting.duration}
                                    onChange={handleTimerChange("duration")}
                                    size={"small"}
                                    sx={{ maxWidth: 80 }}
                                />
                            </Box>
                        </>
                    )}

                    <Box
                        mt={2}
                        gap={1}
                        display="flex"
                        alignItems={"center"}
                        justifyContent={"center"}
                    >
                        {!timer ? (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleStart}
                            >
                                Start
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Box>
        </Container>
    );
};

export default Launcher;
