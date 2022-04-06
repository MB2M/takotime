import { useEffect, useState } from "react";
import LiveStandingAthlete from "./LiveStandingAthlete";

const LiveStandingWorkout = ({
    stationStatics,
}: {
    stationStatics: StationStatics[];
}) => {
    const [categories, setCategories] = useState<string[]>([]);

    const categoriesAll = stationStatics.map((s) => s.category);

    useEffect(() => {
        setCategories(Array.from(new Set(categoriesAll)));
    }, [stationStatics]);

    function getAthletes(divName: string, position = "start") {
        let athletes = [];
        for (let station of stationStatics) {
            if (station.category === divName) {
                athletes.push(station);
            }
        }
        if (position === "start") {
            return athletes.slice(0, Math.round(athletes.length / 2));
        } else {
            return athletes.slice(Math.round(athletes.length / 2));
        }
    }
    return (
        <div className="strasua container-fluid">
            <div className="row">
                <div className="display-1 text-end my-2 position-absolute top-0 end-0 p-5 mt-5">
                    Current Heat
                </div>
                {stationStatics &&
                    categories.map((c) => {
                        return (
                            <div className="row my-3 d-flex justify-content-start mx-0 px-0">
                                <hr className="mb-4"></hr>
                                <h1 className="standing-col-division text-start my-auto ps-5 d-flex">
                                    <div className="standing-division text-nowrap">
                                        {c}
                                    </div>
                                </h1>
                                <div className="standing-col-start">
                                    {getAthletes(c, "start").map(
                                        (a) =>
                                            c === a.category && (
                                                <LiveStandingAthlete
                                                    stationStatics={a}
                                                />
                                            )
                                    )}
                                </div>
                                <div className="standing-col-end">
                                    {getAthletes(c, "end").map(
                                        (a) =>
                                            c === a.category && (
                                                <LiveStandingAthlete
                                                    stationStatics={a}
                                                />
                                            )
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default LiveStandingWorkout;
