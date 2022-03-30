import { useEffect, useState } from "react";
import LiveEndedAthlete from "./LiveEndedAthlete";

const LiveEndedWorkout = ({
    stationStatics,
}: {
    stationStatics: StationStatics[],
}) => {
    // const [isWod5, setIsWod5] = useState(false)
    // const [transitionTimer, setTransitionTimer] = useState(0)

    let athletesSorted = athletesData.filter((v) => v.dynamic);

    athletesSorted.sort(
        (a, b) => a.dynamic.CurrentRank - b.dynamic.CurrentRank
    );

    function getAthletes(divName, position = "start") {
        let athletes = [];
        for (let athlete of stationStatics) {
            if (athlete.static.division === divName) {
                athletes.push(athlete);
            }
        }
        if (position === "start") {
            return athletes.slice(0, Math.round(athletes.length / 2));
        } else if (position === "end") {
            return athletes.slice(Math.round(athletes.length / 2));
        }
    }

    // useEffect(() => {
    //     if (statics.workoutName.includes('Wod 2')) {
    //         setIsWod5(true)
    //     } else {
    //         setIsWod5(false)
    //     }
    // })

    // useEffect(() => {
    //     if (isWod5) {
    //         const timer = 19000
    //         setTransitionTimer(timer)
    //         const countdown = setInterval(() => {
    //                 setTransitionTimer(t => t - 1000)
    //         }, 1000)

    //         const timeout = setTimeout(() => {
    //             clearInterval(countdown)
    //         }, timer)

    //         return () => {
    //             clearInterval(countdown)
    //             // clearTimeout(timeout)
    //         }
    //     }
    // }, [isWod5])

    // if (transitionTimer > 0) {
    //     return <Countdown date={Date.now() + transitionTimer} />
    // }

    return (
        <div className="strasua container-fluid">
            <div className="row">
                <div className="display-1 text-end my-2 position-absolute top-0 end-0 p-5 mt-5">
                    Unofficial Results
                </div>
                {statics.WorkoutInfo.map((w) => {
                    return (
                        <>
                            <hr className="mb-4"></hr>
                            <div className="row my-3 d-flex justify-content-start mx-0 px-0">
                                <h1 className="standing-col-division text-start my-auto ps-5 d-flex">
                                    <div className="standing-division text-nowrap">
                                        {w.division}
                                    </div>
                                </h1>
                                <div className="standing-col-start">
                                    {getAthletes(
                                        w.division,
                                        "start"
                                    ).map(
                                        (a) =>
                                            w.division ===
                                                a.static.division && (
                                                <LiveEndedAthlete
                                                    athleteData={a}
                                                />
                                            )
                                    )}
                                </div>
                                <div className="standing-col-end">
                                    {getAthletes(
                                        w.division,
                                        "end"
                                    ).map(
                                        (a) =>
                                            w.division ===
                                                a.static.division && (
                                                <LiveEndedAthlete
                                                    athleteData={a}
                                                />
                                            )
                                    )}
                                </div>
                            </div>
                        </>
                    );
                })}
            </div>
        </div>
    );
};

export default LiveEndedWorkout;
