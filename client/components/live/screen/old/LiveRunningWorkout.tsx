import { useEffect, useState } from "react";
import LiveAthlete from "./LiveAthlete";


function LiveRunningWorkout({
    stationStatics,
}: {
    stationStatics: StationStatics[];
}) {
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
        <div className="livezone d-flex justify-content-equity text-center align-text-bottom fixed-bottom px-1 pb-2 mb-0 h1">
            {/* {isWod2 && athletesData.map((a) => <LiveAthleteWod2 key={a.static.lane} data={a} />)} */}
            {/* {!isWod2 && !isWod3 && */}
            <>
                {/* <LiveWod data={statics.WorkoutInfo[0]} ali='left'></LiveWod> */}
                {stationStatics.map((s) => (
                    <LiveAthlete key={s.laneNumber} stationStatics={s} />
                ))}
                {/* <LiveWod data={statics.WorkoutInfo[statics.WorkoutInfo.length - 1]} ali='right'></LiveWod> */}
            </>
            {/* } */}
        </div>
    );
}

export default LiveRunningWorkout;
