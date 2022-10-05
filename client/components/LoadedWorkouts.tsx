const LoadedWorkouts = ({ loadedWorkouts }: { loadedWorkouts: LiveWorkout[] }) => {
    return (
        <>
            <h3>Loaded:</h3>
            {loadedWorkouts?.map((w) => {
                return (
                    <div key={w._id}>
                        <h5>{w.name}</h5>
                        <p>{w.categories.join(",")}</p>
                    </div>
                );
            })}
        </>
    );
};

export default LoadedWorkouts;
