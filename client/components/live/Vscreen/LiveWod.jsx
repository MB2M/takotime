import { useEffect, useState } from "react";

function LiveWod({ data, ali }) {
    const [hrs, setHrs] = useState([]);

    // console.log(data);

    useEffect(() => {
        const hrs = [];
        const mvts = data?.blocks?.flatMap((b) => {
            let mvt = [];
            for (let i = 0; i < b.rounds; i++) {
                mvt.push(b.movements);
            }
            return mvt.flat();
        });
        console.log(mvts)
        for (let i = mvts?.length - 1; i >= 0; i--) {
            hrs.push(
                <div>
                    <span className={"live-mvt-name " + ali}>
                        {mvts[i].reps} {mvts[i].name}
                    </span>
                </div>
            );
            hrs.push(<hr></hr>);
        }
        setHrs(hrs);
        // hrs.push(<div><span className={"live-mvt-name " + ali}>{data.mvt_reps[0]} {data.mvt_names[0]}</span></div>)
    }, [data, ali]);
    // console.log(hrs)
    return (
        <div className="liveathletezone w-0 d-flex flex-column justify-content-end">
            <div className="progress-zone h-100 d-flex flex-column justify-content-end">
                <div className="hrs h-100 mx-1 d-flex flex-column justify-content-evenly">
                    {hrs}
                </div>
            </div>
        </div>
    );
}

export default LiveWod;
