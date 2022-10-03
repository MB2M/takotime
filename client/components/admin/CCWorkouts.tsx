import {
    Button,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCompetitionContext } from "../../context/competition";

type NameIdObject = {
    name: string;
    id: number;
};

const CCWorkouts = ({
    onLoad,
}: {
    loadButton?: boolean;
    onLoad?: (heatId: string, workoutId: string) => any;
}) => {
    const competition = useCompetitionContext();
    const [workouts, setWorkouts] = useState<Array<NameIdObject>>([]);
    // const [selectedWorkout, setSelectedWorkout] = useState<number>();
    // const [heats, setHeats] = useState<Array<NameIdObject>>([]);
    // const [selectedHeat, setSelectedHeat] = useState<number>();

    useEffect(() => {
        (async () => {
            if (competition?.eventId) {
                try {
                    const response = await fetch(
                        `https://competitioncorner.net/api2/v1/schedule/events/${competition?.eventId}/workouts`
                    );
                    const json = await response.json();
                    const workouts = json.workouts.map((w: any) => ({
                        name: w.name,
                        id: w.id,
                    }));
                    setWorkouts(workouts);
                } catch (err) {
                    setWorkouts([]);
                }
                // finally {
                // setHeats([]);
                // setSelectedWorkout(undefined);
                // setSelectedHeat(undefined);
                // }
            }
        })();
    }, [competition]);

    // useEffect(() => {
    //     (async () => {
    //         if (selectedWorkout) {
    //             try {
    //                 const response = await fetch(
    //                     `https://competitioncorner.net/api2/v1/schedule/workout/${selectedWorkout}`
    //                 );
    //                 const json = await response.json();
    //                 const heats = json.map((h: any) => ({
    //                     name: h.title,
    //                     id: h.id,
    //                 }));
    //                 setHeats(heats);
    //             } catch (err) {
    //                 setHeats([]);
    //             } finally {
    //                 setSelectedHeat(undefined);
    //             }
    //         }
    //     })();
    // }, [selectedWorkout]);

    // const load = async () => {
    //     const payload = {
    //         event: event?.id,
    //         workout: selectedWorkout,
    //         heat: selectedHeat,
    //     };

    //     try {
    //         const response = await fetch(
    //             `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/loadCC`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(payload),
    //             }
    //         );
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // const loadEvent = async (event: any) => {
    //     const id = event?.target.value;
    //     try {
    //         const response = await fetch(
    //             `https://competitioncorner.net/api2/v1/events/${id}`
    //         );
    //         const json = await response.json();
    //         setEvent({ name: json.name, id });
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    // const handleWorkoutChange = async (event: any) => {
    //     setSelectedWorkout(event.target.value);
    // };

    // const handleHeatChange = async (event: any) => {
    //     setSelectedHeat(event.target.value);
    // };

    return (
        <>
            <h3>CC workouts</h3>
            <InputLabel id="workout">Wod</InputLabel>
            <List>
                {workouts.map((workout) => (
                    <ListItem>
                        {workout.name} ({workout.id})
                    </ListItem>
                ))}
            </List>
            {/* <Select
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
                                {w.name}
                            </MenuItem>
                        
                    </Select> */}
        </>
    );
};

export default CCWorkouts;
