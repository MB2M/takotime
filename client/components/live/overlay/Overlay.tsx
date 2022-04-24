import OverlayRunning from "./OverlayRunning";

const Overlay = ({
    data,
}: {
    data: WidescreenData | undefined;
}): JSX.Element => {
    const bigScrenLayout = () => {
        switch (data?.globals?.state) {
            // case 0:
            //     return <Standing data={data} />;
            case 2:
                return <OverlayRunning data={data} />;
            // case 3:
            //     return <LiveEndedWorkout data={data} />;
            // default:
            //     return <HorizontalRunning data={data} />;
        }
        return <div>loading</div>;
    };
    // return <div>dsqd</div>;
    return bigScrenLayout();

    // return data.stations?.length !== 0 || !data.globals
    //     ? null
    //     : bigScrenLayout();
};

export default Overlay;
