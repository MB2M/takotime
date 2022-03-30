import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    Button,
} from "@mui/material";
import { useState } from "react";

const LiveWorkoutSelector = ({ workoutIds }: { workoutIds: WorkoutIds[] }) => {
    const [workoutCustomId, setWorkoutCustomId] = useState<string[]>([]);
    const handleChange = (event: SelectChangeEvent<typeof workoutCustomId>) => {
        const {
            target: { value },
        } = event;
        setWorkoutCustomId(
            // On autofill we get a stringified value.
            typeof value === "string" ? value.split(",") : value
        );
    };

    const handleLoadWorkout = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/loadWorkout`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ customId: workoutCustomId }),
                }
            );
            setWorkoutCustomId([]);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h3> Load Workout: </h3>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="workout">Wod</InputLabel>
                <Select
                    labelId="workout"
                    id="workout-checkbox"
                    multiple
                    value={workoutCustomId}
                    onChange={handleChange}
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected: any[]) => selected.join(", ")}
                    size="small"
                >
                    {workoutIds?.map((w) => (
                        <MenuItem key={w.customId} value={w.customId}>
                            <Checkbox
                                checked={
                                    workoutCustomId.indexOf(w.customId) > -1
                                }
                            />
                            <ListItemText primary={w.customId} />
                        </MenuItem>
                    ))}
                </Select>
                <Button variant="outlined" onClick={handleLoadWorkout}>
                    Load workouts
                </Button>
            </FormControl>
        </div>
    );
};

export default LiveWorkoutSelector;
