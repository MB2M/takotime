import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
// import { eventId, paramsUrl } from "../global";
import mtLogo from "../../../public/img/logo.png";
import styles from "../../../styles/AthletePresentation.module.css";
// import _ from "lodash";
import ReactPlayer from "react-player";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import mockEp from "./mockEP.json";
import mockEp2 from "./mockEP2.json";
import Image from "next/image";

const BASE_URL =
    "https://competitioncorner.net/api2/v1/events/1989/workouts/11352/eligible-participants";

const BASE_VIDEO_URL = "/mp4/";

function AthletePresentation2() {
    const { globals } = useLiveDataContext();
    // const params = useFetchInterval(paramsUrl, 300);
    // const paramsRef = useRef(params);
    const [vidUrl, setVidUrl] = useState("/mp4/test.mp4");
    const [eligibleParticipants, setEligibleParticipants] = useState<any[]>([]);

    useEffect(() => {
        if (!globals?.externalHeatId || !globals.externalEventId) {
            return setEligibleParticipants([]);
        }
        (async () => {
            console.log(mockEp2)
            setEligibleParticipants(
                mockEp2.filter(
                    (eligibleParticipant) =>
                        eligibleParticipant.heatId === globals?.externalHeatId
                )
            );
            // try {
            //     const response = await fetch(
            //         `${BASE_URL}${globals?.externalEventId}/workouts/${globals?.externalWorkoutId}/eligible-participants`,
            //         {
            //             method: "GET",
            //             headers: {
            //                 Authorization: "Bearer " + access_token.value,
            //             }, //TODO
            //         }
            //     );

            //     if (response.ok) {
            //         const json: any[] = await response.json();

            //         setEligibleParticipants(
            //             json.filter(
            //                 (eligibleParticipant) =>
            //                     eligibleParticipant.heatId ===
            //                     globals?.externalHeatId
            //             )
            //         );
            //     }
            // } catch (err) {
            //     console.log(err);
            //     setEligibleParticipants([]);
            // }
            setVidUrl("");
        })();
    }, [globals?.externalHeatId]);

    useEffect(()=> {
        console.log("neeeeeee")
    }, [eligibleParticipants])

    useEffect(() => {
        if (globals?.remoteFinaleAthlete) {
            setVidUrl(`${BASE_VIDEO_URL}/${globals?.remoteFinaleAthlete}.mp4`);
        } else {
            setVidUrl("");
        }
    }, [globals?.remoteFinaleAthlete]);

    const athlete = useMemo(
        () =>
            eligibleParticipants.find(
                (eligibleParticipant) =>
                    eligibleParticipant.id === globals?.remoteFinaleAthlete
            ),
        [globals?.remoteFinaleAthlete, eligibleParticipants]
    );

    useEffect(() => {
        getCCToken();
    }, []);

    const getCCToken = async () => {
        try {
            const response = await fetch("/api/CCtoken");
            if (response.ok) {
                console.log(await response.json());
            }
        } catch (err) {
            console.log(err);
        }
    };

    console.log(globals?.remoteFinaleAthlete);

    // const loadAthletes = async (params) => {
    //     const response = await fetch(
    //         "/livedata/heats2?eventId=" +
    //             eventId +
    //             "&workoutId=" +
    //             params.workoutId,
    //         { cache: "no-store" }
    //     );
    //     const json = await response.json();
    //     console.log(json);
    //     console.log(params.participantId);
    //     setAthlete(filterEpByAthleteId(json, params.participantId));
    //     setVidUrl(
    //         "http://127.0.0.1:8000/static/live_data/mp4/" +
    //             params.participantId +
    //             ".mp4"
    //     );
    // };

    // useMemo(() => {
    //     if (!_.isEqual(paramsRef.current, params)) {
    //         if (params) {
    //             loadAthletes(params);
    //         }
    //         paramsRef.current = params;
    //     }
    // }, [params]);

    // if (athlete) {
    return (
        <Box>
            <Box
                position="absolute"
                zIndex={-1}
                top={0}
                left={0}
                width={"100vw"}
                height={"100vh"}
                overflow="hidden"
            >
                {vidUrl !== "" && (
                    <ReactPlayer
                        url={vidUrl}
                        playing={true}
                        muted={true}
                        width={1920}
                        height={1080}
                    />
                )}
            </Box>
            {athlete && (
                <>
                    <Stack
                        className={styles.athletescore}
                        direction={"row"}
                        justifyContent={"space-between"}
                        display={"flex"}
                        spacing={2}
                        fontFamily={"CantoraOne"}
                        color={"#c6316e"}
                        marginX={4}
                    >
                        <Typography
                            fontFamily={"CantoraOne"}
                            fontSize={"6.2rem"}
                            sx={{transition:"font-size"}}
                        >
                            Rank : {athlete.rank + 10}
                        </Typography>
                        <Typography
                            fontFamily={"CantoraOne"}
                            fontSize={"6.2rem"}
                        >
                            Points : {athlete.points + 302}
                        </Typography>
                    </Stack>
                    <Box
                        className={styles.athletedata}
                        position={"fixed"}
                        display={"flex"}
                        flexDirection={"column"}
                        justifyContent={"space-between"}
                        textAlign={"start"}
                        width={1}
                    >
                        <Stack direction={"row"}>
                            <Box
                                width={450}
                                position="relative"
                                top={"-150px"}
                                // sx={{ transform: "translate(50%,50%)" }}
                            >
                                <Image src={mtLogo} layout="responsive"></Image>
                            </Box>
                            <Typography
                                variant="h1"
                                className={styles.athletename}
                                paddingX={4}
                                fontFamily={"CantoraOne"}
                            >
                                {athlete.displayName}
                            </Typography>
                        </Stack>
                    </Box>
                </>
            )}
            {/* <div className="ms-ato athlete-score fixed-top d-flex flex-column justify-content-between strasua">
                    <div className="athlete-rank d-flex justify-content-center align-items-center">
                        {athlete.rank}
                    </div>
                    <div className="athlete-rank d-flex justify-content-center align-items-center">
                        {athlete.points}
                    </div>
                </div>
                <div className="athlete-data fixed-bottom text-start d-flex">
                    <div className="logo">
                        <MTLogo />
                    </div>
                    <div className="col-2"></div>
                    <div className="cl-10 d-flex align-items-center">
                        <h1 className="athlete-name px-4 text-wrap lh-1">
                            {athlete.displayName}
                        </h1>
                    </div>
                </div> */}
        </Box>
    );
    // }

    return null;
}

export default AthletePresentation2;
