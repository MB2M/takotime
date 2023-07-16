import {
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { useCompetitionContext } from "../context/competition";
import useWorkouts from "../hooks/useCCWorkouts";
import { useLiveDataContext } from "../context/liveData/livedata";
import useChrono from "../hooks/useChrono";
import { formatChrono } from "../utils/timeConverter";

const TimerLauncher = () => {
    const competition = useCompetitionContext();
    const [timerSetting, setTimerSetting] = useState<TimerSetting>({
        countdown: 10,
        duration: 0,
        direction: "asc",
    });
    const { globals } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);
    const [resetOpen, setResetOpen] = useState(false);

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
                `http://${
                    process.env.NEXT_PUBLIC_LIVE_API
                }/live/api/switchStart?action=start&duration=${
                    timerSetting.duration
                }&countdown=${
                    timerSetting.countdown
                }&save=${true}&reset=${true}`
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
        handleCloseResetDialog();
    };

    const handleCloseResetDialog = () => {
        setResetOpen(false);
    };

    return (
        <Container sx={{ p: 2, minHeight: "100vh", height: "100vh" }}>
            <Dialog open={resetOpen}>
                <DialogContent>
                    <DialogContentText>Confirm Reset?</DialogContentText>
                    <DialogActions>
                        <Button onClick={handleReset}>Yes</Button>
                        <Button onClick={handleCloseResetDialog}>No</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Stack
                textAlign={"center"}
                justifyContent={"space-around"}
                height={1}
            >
                <Typography variant="h3">Wod launcher</Typography>

                <Stack spacing={5} my={"auto"}>
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
                                <Typography fontSize={"2rem"}>
                                    Countdown:
                                </Typography>
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
                                <Typography fontSize={"2rem"}>
                                    Duration:
                                </Typography>
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
                                onClick={() => setResetOpen(true)}
                            >
                                Reset
                            </Button>
                        )}
                    </Box>
                </Stack>
            </Stack>
        </Container>
    );
};

export default TimerLauncher;
