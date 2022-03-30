import { useEffect, useLayoutEffect, useState } from "react";
import Running from "./Running";
import Standing from "./Standing";

const Widescreen = ({ data }: { data: WidescreenData }): JSX.Element => {
    const [wodStatus, setWodStatus] = useState(1);
    const [staticsFiltered, setStaticsFiltered] = useState([]);
    const [athletesData, setAthletesData] = useState([]);
    const [isTransitionLogo, setIsTransitionLogo] = useState(false);
    const [isTransitionStart, setIsTransitionStart] = useState(false);
    const [leftLogo, setLeftLogo] = useState("-50%");
    const [transiBg, setTransiBg] = useState("#2e2e2e");
    const [transition, setTransition] = useState(false);
    const [transitionTimer, setTransitionTimer] = useState(0);
    const [transitionFinished, setTransitionFinished] = useState(true);

    useEffect(() => {
        if (data.globals?.state === 1) {
            setIsTransitionLogo(true);
            setLeftLogo("-50%");
            setTransiBg("#2e2e2e");
            const wait = setTimeout(() => {
                setLeftLogo("50%");
            }, 100);

            const popupTimer = setTimeout(() => {
                setLeftLogo("150%");
                setTransiBg("#2e2e2e20");
                const popOut = setTimeout(() => {
                    setIsTransitionLogo(false);
                }, 800);
                return () => clearTimeout(popOut);
            }, 3000);

            return () => {
                clearTimeout(popupTimer);
                clearTimeout(wait);
            };
        }

        if (data.globals?.state === 2) {
            setIsTransitionStart(true);
            setTransiBg("#2e2e2e");

            const popupTimer = setTimeout(() => {
                setTransiBg("#2e2e2e20");
                const popOut = setTimeout(() => {
                    setIsTransitionStart(false);
                }, 400);
                return () => clearTimeout(popOut);
            }, 3000);

            return () => clearTimeout(popupTimer);
        }
    }, [data]);

    // useEffect(() => {
    //     if (
    //         dynamics &&
    //         dynamics.status === "T" &&
    //         statics &&
    //         statics.workoutName.includes("Wod 5A")
    //     ) {
    //         setTransition(true);
    //     } else {
    //         setTransition(false);
    //     }
    // }, [dynamics]);

    useEffect(() => {
        if (transition || !transitionFinished) {
            let timer;
            if (!transitionFinished) {
                timer = transitionTimer;
            } else {
                timer = 60000;
            }
            setTransitionFinished(false);
            setTransitionTimer(timer);
            const countdown = setInterval(() => {
                setTransitionTimer((t) => t - 1000);
            }, 1000);

            const timeout = setTimeout(() => {
                clearInterval(countdown);
                setTransitionFinished(true);
            }, timer + 1000);

            return () => {
                clearInterval(countdown);
                clearTimeout(timeout);
            };
        }
    }, [transition]);

    if (transitionTimer > 0) {
        return (
            <div className="bigfontsize vw-100 vh-100 strasua align-items-center d-flex justify-content-center">
                {transitionTimer / 1000}
            </div>
        );
    }
    const bigScrenLayout = () => {
        switch (data.globals?.state) {
            case 0:
                return <Standing data={data} />;
            case 2:
                return <Running data={data} />;
            case 3:
                return <LiveEndedWorkout data={data} />;
            default:
                return <Standing data={data} />;
        }
        return <div>loading</div>;
    };
    // return <div>dsqd</div>;
    return bigScrenLayout();

    // return data.stations?.length !== 0 || !data.globals
    //     ? null
    //     : bigScrenLayout();
};

export default Widescreen;
