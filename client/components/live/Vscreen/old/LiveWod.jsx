const LiveWod = ({ data, ali }) => {
    const hrs = [];
    for (let i = data.mvt_reps.length - 1; i > 0; i--) {
        hrs.push(
            <div>
                <span className={"live-mvt-name " + ali}>
                    {data.mvt_reps[i]} {data.mvt_names[i]}
                </span>
            </div>
        );
        hrs.push(<hr></hr>);
    }
    hrs.push(
        <div>
            <span className={"live-mvt-name " + ali}>
                {data.mvt_reps[0]} {data.mvt_names[0]}
            </span>
        </div>
    );

    return (
        <div className="liveathletezone w-0 d-flex flex-column justify-content-end">
            <div className="progress-zone h-100 d-flex flex-column justify-content-end">
                <div className="hrs h-100 mx-1 d-flex flex-column justify-content-evenly">
                    {hrs}
                </div>
            </div>
        </div>
    );
};

export default LiveWod;
