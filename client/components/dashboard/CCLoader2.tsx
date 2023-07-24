import {
    Button,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCompetitionContext } from "../../context/competition";
import { loadHeat } from "../../utils/cc/loadHeat";

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
    const competition = useCompetitionContext();
    const [workouts, setWorkouts] = useState<Array<NameIdObject>>([]);
    const [selectedWorkout, setSelectedWorkout] = useState<number>();
    const [heats, setHeats] = useState<Array<NameIdObject>>([]);
    const [selectedHeat, setSelectedHeat] = useState<number>();

    useEffect(() => {
        if (!competition?.eventId) return;
        (async () => {
            try {
                const response = await fetch(
                    `/api/cc/getEventWorkouts?eventId=${competition.eventId}`
                );
                const json = await response.json();
                const workouts = json.map((w: any) => ({
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
        })();
    }, [competition?.eventId]);

    useEffect(() => {
        if (!competition?.eventId) return;
        (async () => {
            if (selectedWorkout) {
                try {
                    const response = await fetch(
                        `/api/cc/getWorkoutHeats?eventId=${competition.eventId}&workoutId=${selectedWorkout}`
                    );
                    const json = await response.json();
                    const heats = json.map((h: any) => ({
                        name: h.heatName,
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
        if (!competition?.eventId || !selectedHeat || !selectedWorkout) return;
        await loadHeat(competition.eventId, selectedWorkout, selectedHeat);
    };

    const handleWorkoutChange = async (event: any) => {
        setSelectedWorkout(event.target.value);
    };

    const handleHeatChange = async (event: any) => {
        setSelectedHeat(event.target.value);
    };

    return (
        <>
            <Typography fontWeight={"bold"}>Load from CC</Typography>
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
