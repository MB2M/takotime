import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useCompetitionContext } from "../../../../context/competition";

interface Props {
    station: DisplayFullStation;
    height: number;
    workout: Workout;
    // allTotalReps: (number | string)[];
    firstScore?: string;
    participantTextRows?: number;
    results: {
        workoutId: string;
        result:
            | {
                  rank: number;
                  finalScore: string | number;
                  finished: boolean;
                  participantId: number;
              }
            | undefined;
    }[];
    numberOfPartner?: number;
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#BBB3BB";
const BASE_WIDTH = 0.47;

const MaxWeightAthletes = ({
    station,
    height,
    workout,
    results,
    numberOfPartner = 2,
}: Props) => {
    const competition = useCompetitionContext();

    const rank = results.find((r) => r.workoutId === workout?.workoutId)?.result
        ?.rank;

    const scores = [...Array(numberOfPartner).keys()].map((partnerId) => {
        const partnerScore = station?.scores?.wodWeight.filter(
            (score) => score.partnerId === partnerId
        );
        if (!partnerScore || partnerScore.length === 0) return { max: 0 };
        return {
            max:
                partnerScore
                    .filter((score) => score.state === "Success")
                    .sort((a, b) => b.weight - a.weight)[0]?.weight || 0,
            current: partnerScore.find((score) => score.state === "Try"),
        };
    });

    return (
        <Box
            key={station.laneNumber}
            width={1}
            // px={1}
            height={height}
            borderRadius={"10px"}
            display={"flex"}
            position={"relative"}
            overflow={"hidden"}
            sx={{
                background: `${
                    rank === 1
                        ? `linear-gradient(90deg, ${
                              competition?.primaryColor
                          } 0%, ${`${competition?.secondaryColor} 100%)`}`
                        : `linear-gradient(90deg, ${BAR_COLOR} ${
                              BASE_WIDTH * 100
                          }%, ${`${BAR_COLOR} 100%)`}`
                }`,
            }}
        >
            <Box
                width={0.04}
                px={1}
                borderRight={`4px solid ${BG_COLOR}`}
                position={"relative"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                sx={{
                    // backgroundColor: "#101010",
                    backgroundColor: rank === 1 ? "none" : BG_COLOR,
                    color: rank === 1 ? "black" : competition?.primaryColor,
                }}
            >
                <Typography
                    fontSize={"3rem"}
                    fontFamily={"bebasNeue"}
                    fontWeight={800}
                    lineHeight={"2.2rem"}
                >
                    {rank}
                </Typography>
            </Box>
            <Box
                width={BASE_WIDTH / 2}
                p={1}
                position={"relative"}
                display={"flex"}
                gap={1.3}
                borderRight={`3px solid ${BG_COLOR}`}
            >
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                    height={1}
                    overflow={"hidden"}
                >
                    <Typography
                        lineHeight={0.85}
                        maxHeight={"6rem"}
                        fontSize={
                            station.participant.length > 23 ? "3rem" : "3rem"
                        }
                        fontFamily={"bebasNeue"}
                        textOverflow={"ellipsis"}
                        my={"auto"}
                        maxWidth={"100%"}
                        noWrap
                    >
                        {station.participant.slice(0, 50)}
                    </Typography>
                    {/*<Box display={"flex"} gap={4}>*/}
                    {/*    {otherResults.length > 0 &&*/}
                    {/*        otherResults.map((result, index) => (*/}
                    {/*            <Box*/}
                    {/*                display={"flex"}*/}
                    {/*                gap={2}*/}
                    {/*                alignItems={"baseline"}*/}
                    {/*            >*/}
                    {/*                <Typography*/}
                    {/*                    lineHeight={0.75}*/}
                    {/*                    fontSize={"2rem"}*/}
                    {/*                    fontFamily={"bebasNeue"}*/}
                    {/*                    color={"gray"}*/}
                    {/*                    fontWeight={900}*/}
                    {/*                    sx={{*/}
                    {/*                        textShadow:*/}
                    {/*                            "2.8px 0px black, -2.8px 0px black, 0px -2.8px black, 0px 2.8px black,2.8px 2.8px black, -2.8px -2.8px black,2.8px -2.8px black, -2.8px 2.8px black",*/}
                    {/*                    }}*/}
                    {/*                >*/}
                    {/*                    rank {index + 1} :*/}
                    {/*                </Typography>*/}
                    {/*                <Typography*/}
                    {/*                    lineHeight={0.75}*/}
                    {/*                    fontSize={"2.5rem"}*/}
                    {/*                    fontFamily={"bebasNeue"}*/}
                    {/*                    color={"white"}*/}
                    {/*                    fontWeight={900}*/}
                    {/*                    sx={{*/}
                    {/*                        textShadow:*/}
                    {/*                            "2.8px 0px black, -2.8px 0px black, 0px -2.8px black, 0px 2.8px black,2.8px 2.8px black, -2.8px -2.8px black,2.8px -2.8px black, -2.8px 2.8px black",*/}
                    {/*                    }}*/}
                    {/*                >*/}
                    {/*                    {result.result?.rank}*/}
                    {/*                </Typography>*/}
                    {/*            </Box>*/}
                    {/*        ))}*/}
                    {/*</Box>*/}
                </Box>
                <Typography
                    lineHeight={"2.2rem"}
                    maxHeight={"6rem"}
                    fontSize={"2rem"}
                    fontFamily={"bebasNeue"}
                    width={0.14}
                    ml={"auto"}
                    textAlign={"end"}
                >
                    #{station.laneNumber}
                </Typography>
            </Box>
            <Box display={"flex"} justifyContent={"space-evenly"} flexGrow={2}>
                {scores.map((score, index) => (
                    <React.Fragment key={index}>
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            width={1 / (scores.length + 1)}
                            borderLeft={`2.5px solid ${BG_COLOR}`}
                            borderRight={`1px solid ${BG_COLOR}`}
                            height={1}
                        >
                            {score.current?.weight && (
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"baseline"}
                                    gap={1}
                                >
                                    <Typography
                                        fontFamily={"bebasNeue"}
                                        fontSize={"3rem"}
                                        lineHeight={"2.2rem"}
                                        // fontWeight={900}
                                        pt={1}
                                    >
                                        {score.current?.weight}
                                    </Typography>
                                    <Typography
                                        fontFamily={"bebasNeue"}
                                        fontSize={"2rem"}
                                        lineHeight={"2.2rem"}
                                        // fontWeight={900}
                                    >
                                        kg
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        <Box
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            width={1 / (scores.length + 1)}
                            borderLeft={`1px solid ${BG_COLOR}`}
                            borderRight={`2.5px solid ${BG_COLOR}`}
                            height={1}
                        >
                            {score.max > 0 && (
                                <Box
                                    display={"flex"}
                                    justifyContent={"center"}
                                    alignItems={"baseline"}
                                    gap={1}
                                >
                                    <Typography
                                        fontFamily={"bebasNeue"}
                                        fontSize={"3rem"}
                                        lineHeight={"2rem"}
                                        color={"white"}
                                        fontWeight={800}
                                        pt={1}
                                        sx={{
                                            textShadow:
                                                "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                                        }}
                                    >
                                        {score.max}
                                    </Typography>
                                    <Typography
                                        fontFamily={"bebasNeue"}
                                        fontSize={"2rem"}
                                        lineHeight={"2.2rem"}
                                        color={"white"}
                                        fontWeight={800}
                                        sx={{
                                            textShadow:
                                                "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                                        }}
                                    >
                                        kg
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </React.Fragment>
                ))}
                <Box
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={1 / (scores.length + 1)}
                    borderLeft={`3px solid ${BG_COLOR}`}
                    height={1}
                    sx={{
                        backgroundColor: rank === 1 ? "none" : BG_COLOR + "dd",
                    }}
                >
                    <Box
                        display={"flex"}
                        // justifyContent={"center"}
                        alignItems={"baseline"}
                        gap={1}
                    >
                        <Typography
                            pt={2}
                            color={"white"}
                            fontSize={"3.5rem"}
                            lineHeight={"2.2rem"}
                            fontFamily={"bebasNeue"}
                            // fontFamily={competition?.customFont}
                            fontWeight={700}
                            sx={{
                                textShadow:
                                    "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                            }}
                        >
                            {scores.reduce((acc, score) => acc + score.max, 0)}
                        </Typography>
                        <Typography
                            fontFamily={"bebasNeue"}
                            // fontFamily={competition?.customFont}
                            fontSize={"2.2rem"}
                            lineHeight={"2.2rem"}
                            color={"white"}
                            fontWeight={700}
                            sx={{
                                textShadow:
                                    "2.8px 2.8px black, 2.8px -2.8px black, -2.8px 2.8px black, -2.8px -2.8px black",
                            }}
                        >
                            kg
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default MaxWeightAthletes;
