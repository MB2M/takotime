import Keyv from "keyv";
import Workout from "../models/Workout";

const getLoadedWorkouts = async (keyvInstance: Keyv) => {
    const workoutIds = await keyvInstance.get("workoutIds");
    if (workoutIds)
        return await Promise.all(
            workoutIds?.map(async (id: string) => {
                try {
                    const workout = await Workout.findById(id).exec();
                    return workout;
                } catch (err) {
                    return;
                }
            })
        );
};

const getMeasurements = async (keyvInstance: Keyv): Promise<Measurement[]> => {
    const workouts = await getLoadedWorkouts(keyvInstance);

    let measurements: Measurement[] = [];
    if (!workouts) return measurements;
    for (let block of workouts[0].blocks) {
        if (block.measurements) {
            measurements.push(block.measurements);
        }
    }

    return measurements;
};

export default { getLoadedWorkouts, getMeasurements };
