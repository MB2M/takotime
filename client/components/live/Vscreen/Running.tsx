import { useEffect, useState } from "react";
import LiveAthlete from "./RunningAthlete";
import LiveWod from "./LiveWod";
import { Divider } from "@mui/material";

function Running({ data }: { data: WidescreenData }) {
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
                <LiveWod data={data.workouts[0]} ali="left"></LiveWod>
                {data.stations
                    .sort((a, b) => a.laneNumber - b.laneNumber)
                    .map((s, i) => {
                        return (
                            <>
                                <LiveAthlete key={s.laneNumber} data={s} />
                                <div>
                                    {i < data.stations.length - 1 &&
                                        data.stations[i + 1].category !==
                                            s.category && (
                                            <Divider light></Divider>
                                        )}
                                </div>
                            </>
                        );
                    })}
                <LiveWod
                    data={data.workouts[data.workouts.length - 1]}
                    ali="right"
                ></LiveWod>
            </>
            {/* } */}
        </div>
    );
}

export default Running;
