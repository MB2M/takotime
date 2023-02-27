import { useEffect, useState } from "react";

const useWorkouts = (platform?: Platform, eventId?: string) => {
    const [workouts, setWorkouts] = useState<ICCWorkout[]>([]);

    const loadCCWorkout = async (eventId: string) => {
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
    };

    const loadLocalWorkout = async (eventId: string) => {
        setWorkouts([]);
    };

    useEffect(() => {
        if (!eventId || !platform) return setWorkouts([]);
        switch (platform) {
            case "CompetitionCorner":
                loadCCWorkout(eventId);
                break;
            default:
                loadLocalWorkout(eventId);
                break;
        }
    }, [eventId, platform]);

    return workouts;
};

export default useWorkouts;
