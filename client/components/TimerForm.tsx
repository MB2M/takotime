import { Button, Box, TextField } from "@mui/material";
import { useState } from "react";

const TimerForm = ({
    startTime,
    chrono,
}: {
    startTime: string | undefined;
    chrono: string | number | null;
}) => {
    const [duration, setDuration] = useState("");
    const [countdown, setCountdown] = useState("");

    const handleDurationChange = (e: any) => {
        if (isNumberOrEmpty(e.target.value)) setDuration(e.target.value);
    };

    const handleCountdownChange = (e: any) => {
        if (isNumberOrEmpty(e.target.value)) setCountdown(e.target.value);
    };

    const isNumberOrEmpty = (data: any): boolean => {
        const regexp = /(^[0-9]+$|^$)/;
        return regexp.test(data);
    };

    const handleStart = async () => {
        await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/api/switchStart?action=start&duration=${duration}&countdown=${countdown}`
        );
    };

    const handleReset = async () => {
        await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/api/switchStart?action=reset`
        );
    };

    return (
        <Box
            component="form"
            sx={{ "& .MuiTextField-root": { display: "flex", m: 2 } }}
        >
            {!startTime && (
                <>
                    <h3> Launch Workout: </h3>
                    <TextField
                        label="Duration"
                        id="outlined-size-small"
                        size="small"
                        type="number"
                        onChange={handleDurationChange}
                    />
                    <TextField
                        label="Countdown"
                        id="outlined-size-small"
                        size="small"
                        type="number"
                        onChange={handleCountdownChange}
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
            <Button variant="outlined" onClick={handleReset} sx={{ mx: 2 }}>
                Reset
            </Button>
        </Box>
    );
};

export default TimerForm;
