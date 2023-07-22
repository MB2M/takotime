import { Box, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import mtLogo from "../../../public/img/logo.png";
import styles from "../../../styles/AthletePresentation.module.css";
import ReactPlayer from "react-player";
import { useLiveDataContext } from "../../../context/liveData/livedata";

import Image from "next/image";

const BASE_VIDEO_URL = "/mp4/";

const RANKS_SUP = ["st", "nd", "rd", "th"];

function AthletePresentation2() {
    const { globals } = useLiveDataContext();
    const [vidUrl, setVidUrl] = useState("/mp4/test.mp4");
    const [eligibleParticipants, setEligibleParticipants] = useState<any[]>([]);

    useEffect(() => {
        if (
            !globals?.externalHeatId ||
            !globals?.externalEventId ||
            !globals?.externalWorkoutId
        ) {
            return setEligibleParticipants([]);
        }
        (async () => {
            try {
                const response = await fetch(
                    `/api/eligibleParticipant?token=${sessionStorage.getItem(
                        "CC_TOKEN"
                    )}`,
                    {
                        method: "POST",
                        body: JSON.stringify({
                            eventId: globals?.externalEventId,
                            workoutId: globals?.externalWorkoutId,
                        }),
                    }
                );
                if (response.ok) {
                    const json: any[] = await response.json();
                    setEligibleParticipants(
                        json.filter(
                            (eligibleParticipant) =>
                                eligibleParticipant.heatId ===
                                globals?.externalHeatId
                        )
                    );
                }
            } catch (err) {
                console.log(err);
                setEligibleParticipants([]);
            }
            setVidUrl("");
        })();
    }, [
        globals?.externalHeatId,
        globals?.externalEventId,
        globals?.externalWorkoutId,
    ]);

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
                                {athlete.rank}
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
                                {athlete.points} pts
                            </Typography>
                        </Stack>
                        <Box
                            className={styles.athletescore}
                            color={"#fd1085"}
                            marginX={7}
                            marginTop={4}
                        ></Box>
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
                            <Box width={400} position="relative" top={"-185px"}>
                                <Image src={mtLogo} layout="responsive"></Image>
                            </Box>
                            <Stack marginRight={5}>
                                <Typography
                                    variant="h1"
                                    fontFamily={"CantoraOne"}
                                    noWrap
                                >
                                    {athlete.displayName.toUpperCase()}
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
        </Box>
    );
}

export default AthletePresentation2;
