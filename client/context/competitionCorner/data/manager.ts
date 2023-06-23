import { useState, useEffect } from "react";
import { useCompetitionContext } from "../../competition";

export const useCompetitionCorner = (
    eventId?: number,
    workoutId?: number,
    heatId?: number
) => {
    const [heats, setHeats] = useState<CCHeat[]>([]);
    const [epHeat, setEpHeat] = useState<CCEPParticipant[]>();
    const [results, setResults] = useState<CCSimpleResult[]>([]);
    const competition = useCompetitionContext();

    const getWorkoutResults = async () => {
        try {
            const response = await fetch(`/api/results`, {
                method: "POST",

                body: JSON.stringify({
                    eventId,
                    workoutId,
                }),
            });
            if (response.ok) {
                const participants: CCResultParticipant[] = (
                    await response.json()
                ).participants;
                const results: CCSimpleResult[] = participants.map(
                    (participant) => ({
                        participantId: participant.id,
                        division: participant.divisionName,
                        participant: participant.displayName,
                        scores: participant.result[0].scores.map((score) =>
                            score.timeCapCompletedReps
                                ? `Cap+ ${score.timeCapCompletedReps}`
                                : score.value
                        ),
                    })
                );
                setResults(results);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!eventId || !workoutId || !heatId) return;
        if (competition?.platform !== "CompetitionCorner") return;
        (async () => {
            try {
                const response = await fetch(`/api/eligibleParticipant`, {
                    method: "POST",

                    body: JSON.stringify({
                        eventId,
                        workoutId,
                    }),
                });
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
            try {
                const response = await fetch(
                    `https://competitioncorner.net/api2/v1/schedule/workout/${workoutId}?divisionId=all`,
                    { mode: "cors" }
                );
                if (response.ok) {
                    const heats: CCHeat[] = await response.json();
                    setHeats(heats);
                } else {
                    setHeats([]);
                }
            } catch (err) {
                console.log(err);
                setHeats([]);
            }
        })();
        getWorkoutResults().then();
    }, [eventId, workoutId, heatId, competition?.platform]);

    return { heats, epHeat, results };
};
