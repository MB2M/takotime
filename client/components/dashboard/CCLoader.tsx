import { Button, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

type NameIdObject = {
    name: string;
    id: number;
};

const CCLoader = ({
    onLoad,
}: {
    loadButton?: boolean;
    onLoad?: (heatId: string, workoutId: string) => any;
}) => {
    const [event, setEvent] = useState<NameIdObject>();
    const [workouts, setWorkouts] = useState<Array<NameIdObject>>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<number>();
    const [heats, setHeats] = useState<Array<NameIdObject>>([]);
    const [selectedHeat, setSelectedHeat] = useState<number>();

    useEffect(() => {
        (async () => {
            if (event?.id) {
                try {
                    const response = await fetch(
                        `https://competitioncorner.net/api2/v1/schedule/events/${event.id}/workouts`,
                        { mode: "cors" }
                    );
                    const json = await response.json();
                    const workouts = json.workouts.map((w: any) => ({
                        name: w.name,
                        id: w.id,
                    }));
                    setWorkouts(workouts);
                } catch (err) {
                    setWorkouts([]);
                } finally {
                    setHeats([]);
                    setSelectedWorkout(undefined);
                    setSelectedHeat(undefined);
                }
            }
        })();
    }, [event]);

    useEffect(() => {
        (async () => {
            if (selectedWorkout) {
                try {
                    const response = await fetch(
                        `https://competitioncorner.net/api2/v1/schedule/workout/${selectedWorkout}`,
                        { mode: "cors" }
                    );
                    const json = await response.json();
                    const heats = json.map((h: any) => ({
                        name: h.title,
                        id: h.id,
                    }));
                    setHeats(heats);
                } catch (err) {
                    setHeats([]);
                } finally {
                    setSelectedHeat(undefined);
                }
            }
        })();
    }, [selectedWorkout]);

    const load = async () => {
        const payload = {
            event: event?.id,
            workout: selectedWorkout,
            heat: selectedHeat,
        };

        try {
            await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/loadCC`,
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

    const loadEvent = async (event: any) => {
        const id = event?.target.value;
        try {
            const response = await fetch(
                `https://competitioncorner.net/api2/v1/events/${id}`
            );
            const json = await response.json();
            setEvent({ name: json.name, id });
        } catch (err) {
            console.log(err);
        }
    };

    const handleWorkoutChange = async (event: any) => {
        setSelectedWorkout(event.target.value);
    };

    const handleHeatChange = async (event: any) => {
        setSelectedHeat(event.target.value);
    };

    return (
        <>
            <h3>Load from CC</h3>
            <TextField
                label="Competition id"
                id="outlined-size-small"
                size="small"
                type="number"
                onChange={loadEvent}
                helperText={event?.name}
            />
            {workouts.length > 0 && (
                <>
                    <InputLabel id="workout">Wod</InputLabel>
                    <Select
                        label="workout"
                        labelId="workout"
                        id="workout-checkbox"
                        renderValue={(selectedWorkout: number) =>
                            workouts?.find((w) => w.id === selectedWorkout)
                                ?.name
                        }
                        // value={selectedWorkout}
                        onChange={handleWorkoutChange}
                        // input={<OutlinedInput label="Tag" />}
                        size="small"
                    >
                        {workouts.map((w, i) => (
                            <MenuItem key={i} value={w.id}>
                                {w.name} ({w.id})
                            </MenuItem>
                        ))}
                    </Select>
                </>
            )}
            {heats.length > 0 && (
                <>
                    <InputLabel id="heat">Heat</InputLabel>
                    <Select
                        labelId="heat"
                        id="heat-checkbox"
                        renderValue={(selectedHeat: number) =>
                            heats?.find((h) => h.id === selectedHeat)?.name
                        }
                        onChange={handleHeatChange}
                        // input={<OutlinedInput label="Tag" />}
                        size="small"
                    >
                        {heats.map((h, i) => (
                            <MenuItem key={i} value={h.id}>
                                {h.name}
                            </MenuItem>
                        ))}
                    </Select>
                </>
            )}
            {selectedHeat && selectedWorkout && (
                <Button
                    variant="outlined"
                    onClick={() => {
                        onLoad
                            ? onLoad(
                                  selectedHeat.toString(),
                                  selectedWorkout.toString()
                              )
                            : load();
                    }}
                    sx={{ mx: 2 }}
                >
                    Load
                </Button>
            )}
        </>
    );
};

export default CCLoader;
