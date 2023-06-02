import db from "./admin";

export const updateResult = async (
    eventId: string,
    workoutId: string,
    data: {
        result: string;
        participantId: string;
        participant: string;
        category: string;
        heatId: string;
    }
) => {
    const ref = db.ref(
        `events/${eventId}/workouts/${workoutId}/results/${data.participantId}`
    );
    await ref.update(data);
};
