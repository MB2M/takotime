import { useEffect, useLayoutEffect, useState } from "react";
// import { useFetchInterval } from "../functions/hooks";
// import { skDynamicUrl, skStaticUrl } from "../global";
// import Banner from "./Banner";
// import "../statics/css/LiveDataWorkout.css";
import LiveRunningWorkout from "./LiveRunningWorkout";
import LiveEndedWorkout from "./LiveEndedWorkout";
import LiveStandingWorkout from "./LiveStandingWorkout";
// import Overlay from "./Overlay";
// import Speaker from "./Speaker";
// import SpeakerV from "./SpeakerV";
// import logo from "../statics/img/MT-logo-rose-no-bg.png";
// import Ladder from "./Ladder";
// import basile from "../statics/img/basile.jpg";

const LiveDataWorkout = ({
    broadcast,
    workoutIds,
    loadedWorkouts,
    stationDevices,
    stationStatics,
    stationDynamics,
    brokerClients,
    ranks,
    globals,
    sendMessage,
}: any): JSX.Element => {
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
    const [showBasile, setShowBasile] = useState(false);

    const heatForBasile = [
        164955, 164958, 164961, 164963, 164965, 165032, 165034, 165035, 165090,
        165059, 165061, 165063,
    ];

    console.log(ranks);
    
    useEffect(() => {
        if (stationStatics) {
            // const athletesStatics = statics.athletes;
            // const athletesDynamics = dynamics.athletes;
            let athletesInfo = [];
            let staticsFilter = [];
            // for (let aStatic of athletesStatics) {
            //     let aInfo = { static: aStatic };

            // for (let wStatic of statics.WorkoutInfo) {
            //     if (wStatic.division === aStatic.division) {
            //         aInfo.wod = wStatic;
            //         if (!staticsFilter.includes(wStatic)) {
            //             // console.log(wStatic)
            //             staticsFilter.push(wStatic);
            //         }
            //     }
            // }
            //     for (let aDynamic of athletesDynamics) {
            //         if (aDynamic.lane === aStatic.lane) {
            //             aInfo.dynamic = aDynamic;
            //         }
            //     }
            //     athletesInfo.push(aInfo);
            // }
            // setAthletesData(athletesInfo);

            // let static2 = JSON.parse(JSON.stringify(statics));
            // static2.WorkoutInfo = staticsFilter;

            // setStaticsFiltered(static2);
        }
        if (globals) setWodStatus(globals.state);
    }, [stationStatics, globals]);

    useLayoutEffect(() => {
        if (wodStatus === 1) {
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

            let basilePopinTimer;
            // if (heatForBasile.includes(statics.heatId)) {
            //     basilePopinTimer = setTimeout(() => {
            //         setShowBasile(true);
            //         const basilePopoutTimer = setTimeout(() => {
            //             setShowBasile(false);
            //         }, 60000);
            //         return () => clearTimeout(basilePopoutTimer);
            //     }, 60000);
            // }

            return () => {
                clearTimeout(popupTimer);
                clearTimeout(wait);
            };
        }

        if (wodStatus === 2) {
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
    }, [wodStatus]);

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
        switch (globals.state) {
            case 0:
                return <LiveStandingWorkout stationStatics={stationStatics} />;
            case 1:
                return <LiveRunningWorkout stationStatics={stationStatics} />;
            case 2:
                return <LiveEndedWorkout stationStatics={stationStatics} />;
            default:
                return <LiveStandingWorkout stationStatics={stationStatics} />;
        }
    };
    if (broadcast === "bigscreen") {
        // console.log(staticsFiltered)
        // if (showBasile) {
        //     return (
        //         <div>
        //             <img
        //                 className="img img-fluid mt-auto"
        //                 src={basile}
        //                 alt="logo2"
        //             ></img>
        //         </div>
        //     );
        // }

        return (
            <>
                {/* {isTransitionLogo && (
                    <>
                        <div
                            className="transition w-100"
                            style={{ backgroundColor: transiBg }}
                        ></div>
                        <img
                            className="img img-fluid logo-transition"
                            src={logo}
                            alt="logo"
                            style={{ left: leftLogo }}
                        ></img>
                    </>
                )} */}
                {/* {isTransitionStart &&
                                <>
                                    <div className="transition-start w-100 text-center strasua align-items-center d-flex flex-column justify-content-center " style={{ backgroundColor: transiBg }}>
                                        <em className="my-auto">Go !</em>
                                        <img className="img img-fluid mt-auto" src={kairoslogo} alt="logo2"></img>
                                    </div>
                                </>
                            } */}
                {/* <Banner time="wodtimer">
                    <div className="display-1>">
                        {statics && statics.heatName}
                    </div>
                    <div className="display-1>">
                        {statics && statics.workoutName}
                    </div>
                </Banner> */}

                {stationStatics.length !== 0 && globals && bigScrenLayout()}
            </>
        );
    }

    // if (broadcast === "overlay") {
    //     return (
    //         <>
    //             {staticsFiltered.length !== 0 && dynamics && (
    //                 <Overlay
    //                     athletesData={athletesData}
    //                     statics={staticsFiltered}
    //                     wodStatus={wodStatus}
    //                 />
    //             )}
    //         </>
    //     );
    // }

    // if (broadcast === "speaker") {
    //     return (
    //         <>
    //             {staticsFiltered.length !== 0 && dynamics && (
    //                 <Speaker
    //                     athletesData={athletesData}
    //                     statics={staticsFiltered}
    //                     wodStatus={wodStatus}
    //                 />
    //             )}
    //         </>
    //     );
    // }

    // if (broadcast === "speakerV") {
    //     return (
    //         <>
    //             {staticsFiltered.length !== 0 && dynamics && (
    //                 <SpeakerV
    //                     athletesData={athletesData}
    //                     statics={staticsFiltered}
    //                     wodStatus={wodStatus}
    //                 />
    //             )}
    //         </>
    //     );
    // }

    // if (broadcast === "ladder") {
    //     return (
    //         <>
    //             {staticsFiltered.length !== 0 && dynamics && (
    //                 <Ladder
    //                     athletesData={athletesData}
    //                     statics={staticsFiltered}
    //                     wodStatus={wodStatus}
    //                 />
    //             )}
    //         </>
    //     );
    // }
};

export default LiveDataWorkout;
