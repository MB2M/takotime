import { useState, useEffect } from "react";

export const useCompetitionCorner = (
    eventId?: number,
    workoutId?: number,
    heatId?: number
) => {
    // const [workouts, setWorkouts] = useState<CCWorkout[]>([]);
    // const [heats, setHeats] = useState<CCHeat[]>([]);
    const [epHeat, setEpHeat] = useState<CCEPParticipant[]>();

    useEffect(() => {
        if (!eventId || !workoutId || !heatId) return;
        (async () => {
            try {
                const response = await fetch(
                    `/api/eligibleParticipant?token=${sessionStorage.getItem(
                        "CC_TOKEN"
                    )}`,
                    {
                        method: "POST",

                        body: JSON.stringify({
                            eventId,
                            workoutId,
                        }),
                    }
                );
                if (response.ok) {
                    const EPHeat: CCEPParticipant[] = await response.json();
                    setEpHeat(EPHeat.filter((ep) => ep.heatId === heatId));
                }
            } catch (err) {
                console.error(err);
            }

            // try {
            //     const response = await fetch(
            //         `https://competitioncorner.net/api2/v1/schedule/events/${eventId}/workouts`
            //     );
            //     if (response.ok) {
            //         const json = await response.json();
            //         const workouts: CCWorkout[] = json.workouts;
            //         setWorkouts(workouts);
            //     } else {
            //         setWorkouts([]);
            //     }
            // } catch (err) {
            //     console.log(err);
            //     setWorkouts([]);
            // }
            // try {
            //     const response = await fetch(
            //         `https://competitioncorner.net/api2/v1/schedule/workout/${workoutId}`
            //     );
            //     if (response.ok) {
            //         const heats: CCHeat[] = await response.json();
            //         setHeats(heats);
            //     } else {
            //         setHeats([]);
            //     }
            // } catch (err) {
            //     console.log(err);
            //     setHeats([]);
            // }
        })();
    }, [eventId, workoutId, heatId]);

    return { epHeat };
};
