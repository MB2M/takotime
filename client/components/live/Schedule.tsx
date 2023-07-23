import Head from "next/head";
import Script from "next/script";
import {
    ReactChild,
    ReactFragment,
    ReactPortal,
    useEffect,
    useState,
} from "react";
import { usePlanning } from "../../utils/mt/usePlanning";

const Schedule = ({ globals }: any) => {
    const planning = usePlanning(300000);
    const [heatPositionPlanning, setHeatPositionPLanning] = useState(0);
    const [viewPastHeat, setViewPastHeat] = useState(false);
    useEffect(() => {
        if (globals) {
            let heatId = globals.heatId;
            for (let i = 0; i < planning.length; i++) {
                console.log(planning[i]);
                if (planning[i].id === heatId) {
                    setHeatPositionPLanning(i);
                    break;
                }
            }
        }
    }, [globals, planning]);

    if (planning.length === 0) {
        return null;
    }

    function positionColor(position: number) {
        if (position < heatPositionPlanning) {
            return "grey";
        }

        if (position === heatPositionPlanning) {
            return "green";
        }

        return "#c6316e";
    }

    const togglePastHeat = () => {
        setViewPastHeat((v) => !v);
    };

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
                    crossOrigin="anonymous"
                />
            </Head>
            {/* <Banner>
                <div className="display-5">{statics && statics.heatName}</div>
                <div className="display-5">
                    {statics && statics.workoutName}
                </div>
            </Banner> */}
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    onChange={togglePastHeat}
                    checked={viewPastHeat}
                />
                <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                >
                    View passed heats
                </label>
            </div>
            <div className="container-lg">
                <div
                    className="planning-accordion accordion accordion-flush bg-transparent"
                    id="accordionExample"
                >
                    {planning.map((h, i) => {
                        if (i < heatPositionPlanning && !viewPastHeat) {
                            return <div key={i}></div>;
                        }
                        return (
                            // <div className={"accordion-item bg-transparent" + (i < heatPositionPlanning - 4 ? ' d-none' : '')}>
                            <div
                                key={h.id}
                                className="accordion-item bg-transparent"
                            >
                                <h2
                                    className="accordion-header bg-transparent"
                                    id={"heading" + i}
                                >
                                    <button
                                        className="accordion-button collapsed fw-bold"
                                        style={{
                                            backgroundColor: positionColor(i),
                                        }}
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={"#collapse" + i}
                                        aria-expanded="true"
                                        aria-controls={"collapse" + i}
                                    >
                                        {h.time} | {h.workoutName} | {h.title} -{" "}
                                        {h.id}
                                    </button>
                                </h2>
                                <div
                                    id={"collapse" + i}
                                    className="accordion-collapse collapse"
                                    aria-labelledby={"heading" + i}
                                    data-bs-parent="#accordionExample"
                                >
                                    <div className="accordion-body">
                                        <table className="table text-white table-sm planning-table">
                                            <thead>
                                                <tr>
                                                    <th>Lane</th>
                                                    <th>Athlete</th>
                                                    <th>Category</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {h.stations.map(
                                                    (s: {
                                                        station:
                                                            | {}
                                                            | null
                                                            | undefined;
                                                        participantName:
                                                            | boolean
                                                            | ReactChild
                                                            | ReactFragment
                                                            | ReactPortal
                                                            | null
                                                            | undefined;
                                                        division:
                                                            | boolean
                                                            | ReactChild
                                                            | ReactFragment
                                                            | ReactPortal
                                                            | null
                                                            | undefined;
                                                    }) => {
                                                        return (
                                                            <tr
                                                                key={
                                                                    "h" +
                                                                    h.id +
                                                                    "s" +
                                                                    s.station
                                                                }
                                                            >
                                                                <td>
                                                                    {s.station}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        s.participantName
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {s.division}
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                crossOrigin="anonymous"
            />
        </>
        // {planning.map()

        // }
    );
};

export default Schedule;
