import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";

import Image from "next/future/image";
import { useCompetitionContext } from "../../../context/competition";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { getFlagEmoji } from "../../../utils/flagEmoji";

function AthletePresentation2() {
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
    });
    const competition = useCompetitionContext();
    const { globals } = useLiveDataContext();
    const [eligibleParticipants] = useState<any[]>([]);
    const [results, setResults] = useState<
        {
            station: number;
            affiliate: string;
            competitor: string;
            countryCode: string;
        }[]
    >([]);
    const { epHeat } = useCompetitionCornerContext();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `/api/cc/getResults?eventId=${globals?.externalEventId}&workoutId=${globals?.externalWorkoutId}&heatId=${globals?.externalHeatId}`
                );

                if (response.ok) {
                    const json = await response.json();
                    setResults(json);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, [globals]);

    const athlete = useMemo(() => {
        const selectedEp = epHeat?.find(
            (eligibleParticipant) =>
                eligibleParticipant.id === globals?.remoteFinaleAthlete
        );
        const selectedResult = results.find(
            (result) => result.station === selectedEp?.station
        );
        return {
            ...selectedResult,
            ...selectedEp,
            ["countryCode"]: selectedResult?.countryCode,
        };
    }, [globals?.remoteFinaleAthlete, eligibleParticipants]);

    return (
        <Box
            maxWidth={1920}
            minWidth={1920}
            minHeight={1080}
            maxHeight={1080}
            overflow={"hidden"}
            position={"relative"}
            ref={parent}
        >
            {athlete.station && (
                <>
                    <Box top={0} position={"absolute"}>
                        <Image
                            src={"/img/mt23_finale_top.png"}
                            alt={"mt23"}
                            width={2053.76}
                            height={198.1}
                            style={{ width: "2053.76px", height: "198.1px" }}
                        />
                    </Box>
                    <Box bottom={-5} position={"absolute"}>
                        <Image
                            src={"/img/mt23_finale_bottom.png"}
                            alt={"mt23"}
                            width={2053.76}
                            height={227.46}
                            style={{ width: "2053.76px", height: "227.46px" }}
                        />
                    </Box>
                    <Box
                        top={0}
                        position={"absolute"}
                        p={2}
                        display={"flex"}
                        width={1}
                        pr={5}
                    >
                        <Image
                            src={`/api/images/${competition?.logoUrl}`}
                            alt={"mt23"}
                            width={200}
                            // style={{ width: "200px" }}
                        />

                        <Typography
                            fontFamily={"bebasNeue"}
                            fontSize={"7rem"}
                            sx={{
                                transform: "rotate(-0.005turn)",
                                textShadow: "0px 4px 4px #00000082",
                            }}
                            mx={"auto"}
                        >
                            {athlete.division}
                        </Typography>
                        <Box display={"flex"} ml={"auto"} gap={10}>
                            {athlete.points?.length &&
                                athlete.points.length > 0 && (
                                    <Box
                                        display={"flex"}
                                        gap={1}
                                        alignItems={"baseline"}
                                    >
                                        <Typography
                                            fontFamily={"bebasNeue"}
                                            fontSize={"4rem"}
                                        >
                                            Points:
                                        </Typography>

                                        <Typography
                                            fontFamily={"bebasNeue"}
                                            fontSize={"6rem"}
                                            color={"white"}
                                        >
                                            {athlete.points}
                                        </Typography>
                                    </Box>
                                )}
                            {athlete.rank?.length &&
                                athlete.rank?.length > 0 && (
                                    <Box
                                        display={"flex"}
                                        gap={1}
                                        alignItems={"baseline"}
                                    >
                                        <Typography
                                            fontFamily={"bebasNeue"}
                                            fontSize={"4rem"}
                                        >
                                            Rank:
                                        </Typography>
                                        <Typography
                                            fontFamily={"bebasNeue"}
                                            fontSize={"6rem"}
                                            color={"white"}
                                        >
                                            {athlete.rank}
                                        </Typography>
                                    </Box>
                                )}
                        </Box>
                    </Box>
                    <Box
                        bottom={0}
                        position={"absolute"}
                        display={"flex"}
                        width={1}
                        height={150}
                    >
                        <Typography
                            fontFamily={"bebasNeue"}
                            fontSize={"8rem"}
                            sx={{
                                textShadow: "0px 4px 4px #00000082",
                            }}
                            px={5}
                            lineHeight={1}
                        >
                            #{athlete.station}
                        </Typography>
                        <Typography
                            fontFamily={"bebasNeue"}
                            fontSize={"6rem"}
                            color={"white"}
                            lineHeight={1}
                            sx={{
                                transform: "rotate(-0.005turn)",
                                textShadow: "0px 4px 4px #00000082",
                            }}
                            ml={23}
                        >
                            {athlete.competitor}{" "}
                            {athlete.countryCode &&
                                getFlagEmoji(athlete.countryCode)}
                        </Typography>
                        <Box
                            display={"flex"}
                            ml={"auto"}
                            gap={10}
                            position={"absolute"}
                            right={32}
                            bottom={0}
                        >
                            <Typography
                                lineHeight={1.4}
                                fontFamily={"bebasNeue"}
                                fontSize={"4rem"}
                            >
                                {athlete.affiliate}
                            </Typography>
                        </Box>
                    </Box>
                </>
            )}
        </Box>
    );
}

export default AthletePresentation2;
