import { formatChrono } from "../utils/timeConverter";
import { Box, Stack } from "@mui/system";
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Typography,
} from "@mui/material";
import { useCompetitionContext } from "../context/competition";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../context/liveData/livedata";
import useChrono from "../hooks/useChrono";

interface Props {
    showReset?: boolean;
    showSave?: boolean;
    row?: boolean;
}

const TimerForm = ({
    showSave = true,
    showReset = true,
    row = false,
}: Props) => {
    const competition = useCompetitionContext();
    const [timerSetting, setTimerSetting] = useState<TimerSetting>({
        countdown: 10,
        duration: 0,
        direction: "asc",
    });
    const { globals } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration);
    const [resetOpen, setResetOpen] = useState(false);
    const [resetData, setResetData] = useState(true);
    const [save, setSave] = useState(true);

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
        <>
            <Dialog open={resetOpen}>
                <DialogContent>
                    <DialogContentText>Confirm Reset?</DialogContentText>
                    <DialogActions>
                        <Button onClick={handleReset}>Yes</Button>
                        <Button onClick={handleCloseResetDialog}>No</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
            <Stack spacing={5} my={"auto"}>
                {timer ? (
                    <h1>
                        {formatChrono(
                            timer,
                            workout?.options?.chronoDirection === "desc"
                        )}
                    </h1>
                ) : (
                    <Box
                        display={"flex"}
                        flexDirection={row ? "row" : "column"}
                        gap={2}
                    >
                        <Box>
                            <Typography fontSize={"inherit"}>
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
                            <Typography fontSize={"inherit"}>
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
                    </Box>
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
                <Box
                    component="form"
                    sx={{ "& .MuiTextField-root": { display: "flex", m: 2 } }}
                >
                    {showSave && (
                        <Box display={"flex"} alignItems={"center"}>
                            <Checkbox
                                checked={save}
                                onClick={() => setSave((current) => !current)}
                            />
                            <Typography>save results</Typography>
                        </Box>
                    )}
                    {showReset && (
                        <Box display={"flex"} alignItems={"center"}>
                            <Checkbox
                                checked={resetData}
                                onClick={() =>
                                    setResetData((current) => !current)
                                }
                            />
                            <Typography>reset data</Typography>
                        </Box>
                    )}
                </Box>
            </Stack>
        </>
    );
};

export default TimerForm;
