import {
    Button,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    TextField,
} from "@mui/material";
import {
    ChangeEvent,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";

const LocalLoader = () => {
    const [events, setEvents] = useState<Competition[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>("");
    const [selectedWorkout, setSelectedWorkout] = useState<number>();
    const [heatId, setHeatId] = useState<number>();

    const [selectedRoundId, setSelectedRoundId] = useState<string>("");
    const [selectedHeatId, setSelectedHeatId] = useState<string>("");

    const selectedEvent = useMemo(
        () => events.find((event) => event._id === selectedEventId),
        [events, selectedEventId]
    );

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `http://${process.env.NEXT_PUBLIC_LIVE_API}/webapp/competition`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                const events: Competition[] = await response.json();
                setEvents(
                    events.filter(
                        (event) =>
                            event.platform === "None" &&
                            event.state === "active"
                    )
                );
            } catch (err) {
                console.log(err);
                setEvents([]);
            }
        })();
    }, []);

    const load = async () => {
        const payload = {
            event: selectedEventId,
            workout: selectedWorkout,
            heat: heatId,
        };

        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/loadLocal`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const handleEventSelectChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setSelectedEventId(e.target.value);
    };

    const handleRoundSelectChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setSelectedRoundId(e.target.value);
    };

    const handleHeatSelectChange = (e: {
        target: { value: SetStateAction<string> };
    }) => {
        setSelectedHeatId(e.target.value);
    };

    const handleWorkoutChange = async (event: any) => {
        setSelectedWorkout(event.target.value);
    };

    const hanleHeatIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setHeatId(Number(e.target.value));
    };

    useEffect(() => {
        setSelectedHeatId("");
        setSelectedRoundId("");
    }, [selectedEventId]);

    useEffect(() => {
        setSelectedHeatId("");
    }, [selectedRoundId]);

    return (
        <>
            <h3>Load from Local</h3>
            <Select
                label="tournament"
                id="tournament-checkbox"
                onChange={handleEventSelectChange}
                value={selectedEvent?._id || ""}
                // input={<OutlinedInput label="Tag" />}
                size="small"
            >
                {events.map((event) => (
                    <MenuItem key={event._id} value={event._id}>
                        {event.name}
                    </MenuItem>
                ))}
            </Select>
            {selectedEvent && (
                <>
                    <InputLabel id="workout">Wod</InputLabel>
                    <Select
                        label="workout"
                        labelId="workout"
                        id="workout-checkbox"
                        // renderValue={(selectedWorkout: number) =>
                        //     selectedEvent.workouts?.find((w) => w.id === selectedWorkout)
                        //         ?.name
                        // }
                        value={selectedWorkout || ""}
                        onChange={handleWorkoutChange}
                        // input={<OutlinedInput label="Tag" />}
                        size="small"
                    >
                        {selectedEvent.workouts.map((workout) => (
                            <MenuItem
                                key={workout.workoutId}
                                value={workout.workoutId}
                            >
                                {workout.workoutId}
                            </MenuItem>
                        ))}
                    </Select>
                </>
            )}

            {selectedWorkout && (
                <TextField
                    label="custom heat id"
                    id="outlined-size-small"
                    size="small"
                    type="number"
                    onChange={hanleHeatIdChange}
                />
            )}
            {/* {selectedEvent && (
                <Select
                    label="round"
                    id="round-checkbox"
                    onChange={handleRoundSelectChange}
                    // input={<OutlinedInput label="Tag" />}
                    size="small"
                >
                    {events
                        .find((t) => t._id === selectedEventId)
                        ?.rounds.map((r, i) => (
                            <MenuItem key={i} value={r._id}>
                                {r.name}
                            </MenuItem>
                        ))}
                </Select>
            )} */}
            {/* {selectedRoundId && (
                <Select
                    label="round"
                    id="round-checkbox"
                    onChange={handleHeatSelectChange}
                    input={<OutlinedInput label="Tag" />}
                    size="small"
                >
                    {events
                        .find((t) => t._id === selectedEventId)
                        ?.rounds.find((r) => r._id === selectedRoundId)
                        ?.heats.map((h, i) => (
                            <MenuItem key={i} value={h._id}>
                                {h.name}
                            </MenuItem>
                        ))}
                </Select>
            )} */}

            {heatId && (
                <Button variant="outlined" onClick={load} sx={{ mx: 2 }}>
                    Load
                </Button>
            )}
        </>
    );
};

export default LocalLoader;
