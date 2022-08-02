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

const RANKS_SUP = ["st", "nd", "rd", "th"];

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
            console.log(mockEp2);
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

    useEffect(() => {
        console.log("neeeeeee");
    }, [eligibleParticipants]);

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
                sx={{ backgroundColor: "black" }}
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
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Stack
                            className={styles.athletescore}
                            display={"flex"}
                            spacing={2}
                            fontFamily={"CantoraOne"}
                            color={"#c6316e"}
                            marginX={10}
                            marginTop={4}
                        >
                            <Typography
                                className={styles.gradiant}
                                fontFamily={"CantoraOne"}
                                fontSize={"6.2rem"}
                            >
                                {athlete.rank + 8}
                                <sup>
                                    {[1, 2, 3].includes(athlete.rank)
                                        ? RANKS_SUP[athlete.rank]
                                        : "th"}
                                </sup>
                            </Typography>
                            <Typography
                                className={styles.gradiant}
                                fontFamily={"CantoraOne"}
                                fontSize={"6.2rem"}
                            >
                                {athlete.points + 302} pts
                            </Typography>
                        </Stack>
                        <Box
                            className={styles.athletescore}
                            color={"#fd1085"}
                            marginX={7}
                            marginTop={4}
                        >
                            {/* <Typography
                                fontFamily={"CantoraOne"}
                                fontSize={"5rem"}
                            >
                                {athlete.division}
                            </Typography> */}
                        </Box>
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
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                        >
                            <Box
                                width={400}
                                position="relative"
                                top={"-185px"}
                                sx={{ backgroundColor: "#000000df" }}
                                // sx={{ transform: "translate(50%,50%)" }}
                            >
                                <Image src={mtLogo} layout="responsive"></Image>
                            </Box>
                            <Stack marginRight={5}>
                                <Typography
                                    variant="h1"
                                    // paddingX={4}
                                    fontFamily={"CantoraOne"}
                                    noWrap
                                >
                                    {athlete.displayName}
                                </Typography>
                                <Typography
                                    fontFamily={"CantoraOne"}
                                    fontSize={"3rem"}
                                    color={"#05c1de"}
                                    textAlign={"end"}
                                >
                                    {athlete.division}
                                </Typography>
                            </Stack>
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
}

export default AthletePresentation2;
