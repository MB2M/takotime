import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import HRunningAthlete from "./HRunningAthlete";

const getWorkout = (workouts: Workout[], station: WidescreenStation) => {
    for (let workout of workouts) {
        if (workout.categories.includes(station.category)) {
            return workout;
        }
    }
};

function HorizontalRunning({ data }: { data: WidescreenData }) {
    // const [isWod2, setIsWod2] = useState(false)
    // const [isWod3, setIsWod3] = useState(false)

    // useEffect(() => {
    // setIsWod2(statics.workoutName.includes('WOD 2'))
    // setIsWod3(statics.workoutName === 'Wod 3')
    // });

    // if (isWod3) {
    //     return <Ladder statics={statics} athletesData={athletesData}/>
    // }

    return (
        <Box
            className="displayZone"
            sx={{
                width: 1920,
                height: 1080,
                backgroundColor: "black",
                flexDirection: "column",
                justifyContent: "space-evenly",
                // border: "3px solid",
                // borderColor: "red",
            }}
        >
            {data.stations
                .sort((a, b) => a.laneNumber - b.laneNumber)
                .map((s) => (
                    <HRunningAthlete
                        key={s.laneNumber}
                        data={s}
                        workout={getWorkout(data.workouts, s)}
                    />
                ))}
        </Box>
    );
    {
        /* <div className="livezone d-flex justify-content-equity text-center align-text-bottom fixed-bottom px-1 pb-2 mb-0 h1">
                <>
                    {data.stations
                        .sort((a, b) => a.laneNumber - b.laneNumber)
                        .map((s) => (
                            <HRunningAthlete key={s.laneNumber} data={s} />
                        ))}
                </>
            </div> */
    }
}

export default HorizontalRunning;
