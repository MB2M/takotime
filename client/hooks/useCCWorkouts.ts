import { useEffect, useState } from "react";

const useCCWorkouts = (eventId?: string) => {
    const [workouts, setWorkouts] = useState<ICCWorkout[]>([]);

    useEffect(() => {
        (async () => {
            if (eventId) {
                try {
                    const response = await fetch(
                        `https://competitioncorner.net/api2/v1/schedule/events/${eventId}/workouts`
                    );
                    const json = await response.json();
                    const workouts = json.workouts;
                    setWorkouts(workouts);
                } catch (err) {
                    setWorkouts([]);
                }
            } else {
                setWorkouts([]);
            }
        })();
    }, [eventId]);

    return workouts;
};

export default useCCWorkouts;
