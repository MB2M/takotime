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

    const [imgList, setImgList] = useState<any[]>([]);

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

    useEffect(() => {
        (async () => {
            if (!epHeat) return;
            const array = await Promise.all(
                epHeat?.map(async (eligibleParticipant) => {
                    try {
                        const img = await import(
                            `../../../public/mtt23/photoCall/${globals?.remoteFinaleAthlete}.jpg`
                        );
                        return { image: img, id: eligibleParticipant.id };
                    } catch (err) {
                        return { image: null, id: eligibleParticipant.id };
                    }
                })
            );
            setImgList(array);
        })();

        // (async () => {
        //     const array = await Promise.all(
        //         epHeat?.map((eligibleParticipant) => eligibleParticipant.id)

        // {
        // const img = await import(
        //     `../../../public/mtt23/photoCall/${globals?.remoteFinaleAthlete}.jpg`
        // );
        // return { image: img, id: eligibleParticipant.id };
        // })
        // );
        // })();
    }, [globals]);

    // const imgFiles = useMemo(
    //     () =>
    //         epHeat?.map((eligibleParticipant) => {
    //             const img = await import(
    //                 `../../../public/mtt23/photoCall/${globals?.remoteFinaleAthlete}.jpg`
    //             );
    //             return { image: img, id: eligibleParticipant.id };
    //         }),
    //     [globals]
    // );

    useEffect(() => {
        console.log(globals?.remoteFinaleAthlete);
    }, [globals?.remoteFinaleAthlete]);

    const viewImg = useMemo(() => {
        return imgList?.find((img) => img.id === globals?.remoteFinaleAthlete)
            ?.image;
    }, [globals?.remoteFinaleAthlete, imgList]);

    return (
        <Box
            maxWidth={1920}
            minWidth={1920}
            minHeight={1080}
            maxHeight={1080}
            height={1080}
            width={1920}
            // overflow={"hidden"}
            position={"relative"}
            ref={parent}
            sx={{
                backgroundImage: "url(/img/TAKO_MTTD.png)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <Box
                display={"flex"}
                gap={2}
                p={5}
                flexDirection={"column"}
                justifyContent={"space-between"}
                sx={{
                    backdropFilter: "blur(80px) brightness(85%) ",
                    "-webkit-backdrop-filter": "blur(80px) brightness(85%)",
                }}
                height={1}
                maxHeight={1}
                // overflow={"hidden"}
                position={"relative"}
            >
                <Box
                    display={"flex"}
                    // flexGrow={1}
                    flexGrow={2}
                    flexBasis={"auto"}
                    justifyContent={"space-evenly"}
                    overflow={"hidden"}
                    py={5}
                    // maxHeight={4 / 5}
                    // minHeight={4 / 5}
                >
                    <Box
                        minWidth={1 / 3}
                        maxWidth={1 / 3}
                        width={1 / 3}
                        display={"flex"}
                        justifyContent={"space-between"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        py={1}
                    >
                        <Image
                            src={`/api/images/${competition?.logoUrl}`}
                            alt={"mt23"}
                            width={300}

                            // style={{ width: "200px" }}
                        />
                        <Typography
                            fontSize={"5rem"}
                            lineHeight={"4rem"}
                            fontFamily={competition?.customFont}
                            textAlign={"center"}
                            color={"black"}
                        >
                            FINAL EVENT
                        </Typography>
                        <Box
                            display={"flex"}
                            width={1}
                            justifyContent={"space-evenly"}
                            mt={"auto"}
                        >
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                gap={2}
                            >
                                <Typography
                                    // fontFamily={"BebasNeue"}
                                    fontFamily={competition?.customFont}
                                    textAlign={"center"}
                                    // color={competition?.primaryColor}
                                    color={"black"}
                                    fontSize={"5rem"}
                                    lineHeight={"5rem"}
                                >
                                    RANK
                                </Typography>
                                <Typography
                                    fontFamily={"BebasNeue"}
                                    textAlign={"center"}
                                    color={"white"}
                                    fontSize={"7rem"}
                                    lineHeight={"7rem"}
                                    sx={{
                                        textShadow:
                                            "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                                    }}
                                >
                                    {athlete?.rank}
                                </Typography>
                            </Box>
                            <Box
                                display={"flex"}
                                flexDirection={"column"}
                                gap={2}
                            >
                                <Typography
                                    // fontFamily={"BebasNeue"}
                                    fontFamily={competition?.customFont}
                                    textAlign={"center"}
                                    // color={competition?.primaryColor}
                                    fontSize={"5rem"}
                                    color={"black"}
                                    lineHeight={"5rem"}
                                >
                                    POINTS
                                </Typography>
                                <Typography
                                    fontFamily={"BebasNeue"}
                                    textAlign={"center"}
                                    color={"white"}
                                    fontSize={"7rem"}
                                    lineHeight={"7rem"}
                                    sx={{
                                        textShadow:
                                            "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                                    }}
                                >
                                    {athlete?.points}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                        mx={5}
                        boxShadow={`5px 5px 15px 0px black`}
                        position={"relative"}
                        width={1}
                        overflow={"hidden"}
                        borderRadius={"8px"}
                    >
                        {viewImg && (
                            <Image
                                // src={`/mtt23/photoCall/${globals?.remoteFinaleAthlete}.jpg`}
                                src={viewImg}
                                alt={"mt23"}
                                // width={200}
                                style={{
                                    // width: "100%",
                                    height: "100%",
                                    // objectFit: "contain",
                                    // height: "100%",
                                    // border: `10px solid black`,
                                    // borderRadius: "10px",
                                }}
                            />
                        )}
                    </Box>
                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    maxHeight={1 / 4}
                    height={1 / 4}
                    minHeight={1 / 4}
                    flexShrink={1}
                >
                    <Box my={2}>
                        <Typography
                            // fontFamily={competition?.customFont}
                            fontFamily={"bebasNeue"}
                            textAlign={"center"}
                            color={"white"}
                            fontSize={"7rem"}
                            lineHeight={"7rem"}
                            sx={{
                                textShadow:
                                    "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                            }}
                        >
                            {athlete?.displayName}
                        </Typography>
                        <Typography
                            // fontFamily={competition?.customFont}
                            fontFamily={"bebasNeue"}
                            textAlign={"center"}
                            color={"black"}
                            fontSize={"7rem"}
                            lineHeight={"2rem"}
                        >
                            -
                        </Typography>
                        <Typography
                            // fontFamily={competition?.customFont}
                            fontFamily={"bebasNeue"}
                            textAlign={"center"}
                            color={"black"}
                            fontSize={"7rem"}
                            lineHeight={"7rem"}
                        >
                            {athlete?.affiliate}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default AthletePresentation2;
