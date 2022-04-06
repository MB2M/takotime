import { List } from "@mui/material";
import { useEffect, useState } from "react";
import StandingAthlete from "./StandingAthlete";

const Standing = ({ data }: { data: WidescreenData }) => {
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        if (data.stations) {
            const categoriesAll = data.stations.map((s) => s.category);
            setCategories(Array.from(new Set(categoriesAll)));
        }
    }, [data]);

    function getAthletes(divName: string, position = "start") {
        let athletes = [];
        for (let station of data.stations.sort(
            (a, b) => a.laneNumber - b.laneNumber
        )) {
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
                {categories &&
                    categories.map((c) => {
                        return (
                            <div className="row my-3 d-flex justify-content-start mx-0 px-0">
                                <hr className="mb-4"></hr>
                                <h1 className="standing-col-division text-start my-auto ps-5 d-flex">
                                    <div className="standing-division text-nowrap">
                                        {c}
                                    </div>
                                </h1>
                                <List
                                    sx={{
                                        width: "35%",
                                    }}
                                >
                                    {getAthletes(c, "start").map(
                                        (a) =>
                                            c === a.category && (
                                                <StandingAthlete data={a} />
                                            )
                                    )}
                                </List>
                                <List
                                    sx={{
                                        width: "35%",
                                    }}
                                >
                                    {getAthletes(c, "end").map(
                                        (a) =>
                                            c === a.category && (
                                                <StandingAthlete data={a} />
                                            )
                                    )}
                                </List>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default Standing;
