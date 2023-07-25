import { useRouter } from "next/router";
import withDisplayData from "../../../utils/withDisplayData";
import React, { useEffect } from "react";
import { getTotalClassicReps } from "../../../utils/scoring";
import { Box } from "@mui/system";
import Image from "next/future/image";
import { Typography } from "@mui/material";

interface Props {
    parent: React.RefCallback<Element>;
    timer: string | number | null;
    plainTimer: number;
    fullStations: DisplayFullStation[];
    workout: Workout;
    workouts: Workout[];
    state: number;
    competition?: Competition;
    categories: string[];
}
const HeatWinner: React.FC<Props> = ({
    fullStations,
    workouts,
    competition,
    categories,
}) => {
    const router = useRouter();
    const categoryIndex = +(router.query.index as string);
    const [winner, setWinner] = React.useState<DisplayFullStation>();

    useEffect(() => {
        const copiedStations = [
            ...fullStations.filter((station) =>
                categories.length > 0
                    ? station.category === categories[categoryIndex]
                    : true
            ),
        ];

        const sortedStations = copiedStations
            .sort((a, b) => a.laneNumber - b.laneNumber)
            .sort((a, b) => {
                return a.scores?.endTimer[workouts.length - 1]?.time ===
                    b.scores?.endTimer[workouts.length - 1]?.time
                    ? getTotalClassicReps(b) - getTotalClassicReps(a)
                    : (a.scores?.endTimer[workouts.length - 1]?.time ||
                          "999999") <
                      (b.scores?.endTimer[workouts.length - 1]?.time ||
                          "999999")
                    ? -1
                    : 1;
            });

        setWinner(sortedStations[0]);
    }, [fullStations, workouts]);

    if (!winner) return null;

    return (
        <Box
            width={1920}
            height={1080}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
                background: `linear-gradient(90deg,${competition?.primaryColor} 10%,${competition?.secondaryColor} 90%)`,
            }}
        >
            <Image
                src={`/api/images/${competition?.logoUrl}`}
                width={300}
                style={{
                    textAlign: "center",
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    filter: `drop-shadow(0px 0px 4px black)`,
                }}
            />
            <Typography
                width={1}
                fontFamily={"Strasua"}
                fontSize={"7.25rem"}
                color={"#dcdcdc"}
                sx={{
                    textAlign: "center",
                    position: "absolute",
                    top: -15,
                    left: "50%",
                    transform: "translateX(-50%)",
                    filter: `drop-shadow(0px 0px 6px ${competition?.secondaryColor})`,
                }}
            >
                MARSEILLE THROWDOWN 2023
            </Typography>
            <Box
                width={1920 - 200}
                height={1080 - 300}
                display={"flex"}
                borderRadius={5}
                border={"5px solid #dcdcdc"}
                overflow={"hidden"}
                boxShadow={"0px 0px 20px 0px black"}
            >
                <Box height={1}>
                    <Image
                        src={"/mt23/photoCall/test.jpg"}
                        height={2000}
                        style={{ height: "100%", width: "auto" }}
                    />
                </Box>
                <Box
                    width={1}
                    height={1}
                    sx={{ backgroundColor: "#101010" }}
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"space-between"}
                >
                    <Box
                        display={"flex"}
                        width={1}
                        justifyContent={"space-between"}
                    >
                        <Typography
                            px={4}
                            color={"#dcdcdc"}
                            fontSize={"6rem"}
                            fontFamily={"bebasNeue"}
                            textAlign={"start"}
                        >
                            Heat Winner
                        </Typography>
                        <Typography
                            color={"#dcdcdc"}
                            fontSize={"6rem"}
                            fontFamily={"bebasNeue"}
                            textAlign={"center"}
                            px={4}
                        >
                            {winner.category}
                        </Typography>
                    </Box>
                    <Box my={"auto"}>
                        <Typography
                            color={"#dcdcdc"}
                            lineHeight={0.8}
                            fontSize={"12rem"}
                            fontFamily={"bebasNeue"}
                            textAlign={"center"}
                            sx={{
                                background: `linear-gradient(90deg,${competition?.primaryColor} 10%,${competition?.secondaryColor} 90%)`,
                                "-webkitBackgroundClip": "text",
                                "-webkit-text-fill-color": "transparent",
                            }}
                        >
                            {winner?.participant}
                        </Typography>
                        <Typography
                            color={"#dcdcdc"}
                            fontSize={"6rem"}
                            fontFamily={"bebasNeue"}
                            textAlign={"center"}
                            pb={4}
                        >
                            {winner?.scores?.endTimer.at(-1)?.time ||
                                getTotalClassicReps(winner)}{" "}
                            reps
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default withDisplayData(HeatWinner);
