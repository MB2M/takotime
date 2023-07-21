import { useEffect, useState } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";

const useHeatDivisionInfo = () => {
    const { globals } = useLiveDataContext();
    const [heatName, setHeatName] = useState<string>("");
    const [divisions, setDivisions] = useState<string[]>([]);
    const [workout, setWorkout] = useState<string>("");

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `/api/cc/getWorkoutHeats?eventId=${globals?.externalEventId}&workoutId=${globals?.externalWorkoutId}`
                );

                if (response.ok) {
                    const json = await response.json();
                    const currentHeat: {
                        id: number;
                        heatName: string;
                        divisions: [{ title: string }];
                    } = json.find(
                        (heat: { id: number }) =>
                            heat.id === globals?.externalHeatId
                    );
                    setHeatName(currentHeat?.heatName);
                    setDivisions(
                        currentHeat?.divisions.map(
                            (division: { title: string }) => division.title
                        )
                    );
                    // setStations(json);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [globals]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `/api/cc/getEventWorkouts?eventId=${globals?.externalEventId}`
                );

                if (response.ok) {
                    const json = await response.json();
                    const currentWorkout: {
                        id: number;
                        name: string;
                    } = json.find(
                        (workout: { id: number }) =>
                            workout.id === globals?.externalWorkoutId
                    );
                    setWorkout(currentWorkout?.name);
                    // setStations(json);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [globals]);

    return { heatName, divisions, workoutName: workout };
};

export default useHeatDivisionInfo;
