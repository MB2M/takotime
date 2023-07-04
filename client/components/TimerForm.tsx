import { Button, Box, TextField, Checkbox } from "@mui/material";
import { ChangeEvent, useState } from "react";

const TimerForm = ({
    startTime,
    chrono,
}: {
    startTime: string | undefined;
    chrono: string | number | null;
}) => {
    const [duration, setDuration] = useState(1);
    const [countdown, setCountdown] = useState(0);
    const [saveResult, setSaveResult] = useState(true);
    const [resetOnStart, setResetOnStart] = useState(false);

    const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isNumberOrEmpty(e.target.value)) setDuration(+e.target.value);
    };

    const handleCountdownChange = (e: any) => {
        if (isNumberOrEmpty(e.target.value)) setCountdown(+e.target.value);
    };

    const isNumberOrEmpty = (data: any): boolean => {
        const regexp = /(^[0-9]+$|^$)/;
        return regexp.test(data);
    };

    const handleStart = async () => {
        try {
            await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/switchStart?action=start&duration=${duration}&countdown=${countdown}&save=${saveResult}&reset=${resetOnStart}`
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
        <Box
            component="form"
            sx={{ "& .MuiTextField-root": { display: "flex", m: 2 } }}
        >
            {!startTime && (
                <>
                    <h3> Launch: </h3>
                    <TextField
                        label="Duration"
                        id="outlined-size-small"
                        size="small"
                        type="number"
                        value={duration}
                        onChange={handleDurationChange}
                    />
                    <TextField
                        label="Countdown"
                        id="outlined-size-small"
                        size="small"
                        type="number"
                        onChange={handleCountdownChange}
                        value={countdown}
                    />
                    <Button
                        variant="outlined"
                        onClick={handleStart}
                        sx={{ mx: 2 }}
                    >
                        Start
                    </Button>
                </>
            )}
            <h1>{chrono}</h1>
            <Button
                color="error"
                variant="outlined"
                onClick={handleReset}
                sx={{ mx: 2 }}
            >
                Reset
            </Button>
            <Checkbox
                checked={saveResult}
                onClick={() => setSaveResult((current) => !current)}
            />{" "}
            save results
            <Checkbox
                checked={resetOnStart}
                onClick={() => setResetOnStart((current) => !current)}
            />{" "}
            reset
        </Box>
    );
};

export default TimerForm;
