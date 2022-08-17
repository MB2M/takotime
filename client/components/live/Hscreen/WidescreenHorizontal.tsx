import { useEffect, useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import HeatPresentation from "../HeatPresentation";
import HeatResult from "../HeatResult";
import HeatWinner from "./HeatWinner";
import HorizontalRunning from "./HRunning";
import HorizontalRunningNoData from "./HRunningNoData";

const WidescreenHorizontal = ({
    withTako = false,
}: {
    withTako?: boolean;
}): JSX.Element => {
    const { globals } = useLiveDataContext();

    const [waitEndWorkout, setWaitEndWorkout] = useState<boolean>(false);

    useEffect(() => {
        if (globals?.state === 3) {
            setWaitEndWorkout(true);
            setTimeout(() => {
                setWaitEndWorkout(false);
            }, 5000);
        } else {
            setWaitEndWorkout(false);
        }
    }, [globals?.state]);

    switch (globals?.state) {
        case 0:
            return <HeatPresentation />;
        case 1:
            return withTako ? (
                <HorizontalRunning  />
            ) : (
                <HorizontalRunningNoData />
            );
        case 2:
            return withTako ? (
                <HorizontalRunning  />
            ) : (
                <HorizontalRunningNoData />
            );
        case 3:
            return withTako ? (
                !waitEndWorkout ? (
                    <HeatWinner  />
                ) : (
                    <HorizontalRunning  />
                )
            ) : (
                <HorizontalRunningNoData />
            );
        default:
            return <HorizontalRunning />;
    }
};

export default WidescreenHorizontal;
