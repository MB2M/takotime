import { useLiveDataContext } from "../../../context/liveData/livedata";
import OverlayLogo from "./OverlayLogo";
import OverlayPresentation from "./OverlayPresentation";
import OverlayResult from "./OverlayResult";
import OverlayRunning from "./OverlayRunning";

const Overlay = ({ version }: { version: OverlayVersion }): JSX.Element => {
    const { globals } = useLiveDataContext();

    const bigScrenLayout = () => {
        switch (globals?.state) {
            case 0:
                return <OverlayPresentation />;
            case 2:
                return <OverlayRunning version={version} />;
            case 3:
                return <OverlayResult />;
            default:
                return <OverlayRunning version={version} />;
        }
    };
    // return <div>dsqd</div>;
    return (
        <>
            <OverlayLogo /> {bigScrenLayout()}
        </>
    );

    // return data.stations?.length !== 0 || !data.globals
    //     ? null
    //     : bigScrenLayout();
};

export default Overlay;
