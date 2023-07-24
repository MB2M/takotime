export const loadHeat = async (
    eventId: string,
    workoutId: number,
    heatId: number
) => {
    const payload = {
        event: eventId,
        workout: workoutId,
        heat: heatId,
    };

    try {
        await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/loadCC`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );
    } catch (err) {
        console.log(err);
    }
};
