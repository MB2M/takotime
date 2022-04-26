import OverlayRunning from "./OverlayRunning";

const Overlay = ({
    data,
    version,
}: {
    data: WidescreenData;
    version: OverlayVersion;
}): JSX.Element => {
    const bigScrenLayout = () => {
        // switch (data?.globals?.state) {
        // case 0:
        //     return <Standing data={data} />;
        // case 2:
        if (data?.globals?.state)
            return <OverlayRunning data={data} version={version} />;
        // case 3:
        //     return <LiveEndedWorkout data={data} />;
        // default:
        //     return <HorizontalRunning data={data} />;
        // }
        return <div>loading</div>;
    };
    // return <div>dsqd</div>;
    return bigScrenLayout();

    // return data.stations?.length !== 0 || !data.globals
    //     ? null
    //     : bigScrenLayout();
};

export default Overlay;
