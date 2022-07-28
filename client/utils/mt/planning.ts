export async function loadHeats(workoutId: number) {
    let response = await fetch(
        "https://competitioncorner.net/api2/v1/schedule/workout/" + workoutId
    );
    let json = await response.json();
    return json;
}

export async function loadPlanning(
    workouts: CCWorkout[],
    workoutNameExcludeFilter?: string[]
) {
    const heats = await Promise.all(
        workouts.map(async (workout) => {
            if (workoutNameExcludeFilter?.includes(workout.name)) return;

            let heats = await loadHeats(workout.id);
            const planningHeats = heats.map((heat: CCHeat) => ({
                ...heat,
                day: new Date(workout.date).toDateString(),
                time: heat.time,
                workoutId: workout.id,
                workoutName: workout.name,
            }));

            return planningHeats.sort((a: { time: number; }, b: { time: number; }) => a.time - b.time);
        })
    );
    return heats.flat();
}
