import { useState, useEffect } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";
import { loadPlanning } from "./planning";

export function usePlanning(
    interval = 30000,
    workoutNameExcludeFilter?: string[]
) {
    const { globals } = useLiveDataContext();
    const [planning, setPlanning] = useState<PlanningHeat[]>([]);

    async function loadData() {
        if (!globals?.externalEventId) return
        try {
            const response = await fetch(
                `https://competitioncorner.net/api2/v1/schedule/events/${globals?.externalEventId}/workouts`
            );
            if (response.ok) {
                const json = await response.json();
                const workouts: CCWorkout[] = json.workouts;
                const planning: PlanningHeat[] = await loadPlanning(
                    workouts,
                    workoutNameExcludeFilter
                );
                setPlanning(planning);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        loadData();
        const timer = setInterval(() => {
            loadData();
        }, interval);

        return () => clearInterval(timer);
    }, [globals]);

    console.log(planning)

    return planning;
}
