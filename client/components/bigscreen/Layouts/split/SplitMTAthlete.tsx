import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";
import { useCompetitionContext } from "../../../../context/competition";
import {
    getRoundScores,
    roundsScores,
    splitMTscore,
} from "../../../../utils/splitMTscore";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface Props {
    station: DisplayFullStation;
    height: number;
    workout: Workout;
    repsOfFirst: number;
    allTotalReps: (number | string)[];
    round: number;
    rest: boolean;
}

const BG_COLOR = "#312F2F";
const BAR_COLOR = "#BBB3BB";

const SplitMTAthlete = ({
    station,
    height,
    workout,
    // repsOfFirst,
    allTotalReps,
    round,
    rest,
}: Props) => {
    const [parent] = useAutoAnimate({
        duration: 200,
        easing: "ease-in-out",
    });
    const competition = useCompetitionContext();

    const repsCompleted = useMemo(
        () => splitMTscore(station.scores?.wodSplit || [], workout),
        [station?.scores, workout.workoutId]
    );

    const rank = useMemo(
        () => allTotalReps.findIndex((reps) => reps === repsCompleted) + 1,
        [allTotalReps, repsCompleted]
    );

    const currentRoundReps = useMemo(
        () =>
            workout.workoutId
                ? getRoundScores(
                      station.scores?.wodSplit || [],
                      round,
                      workout.workoutId
                  )
                : null,
        [station?.scores, workout.workoutId, round]
    );

    const scoreOfRounds = useMemo(
        () =>
            station.scores?.wodSplit
                ? roundsScores(station.scores?.wodSplit, workout)
                : [0, 0, 0],
        [station?.scores, workout.workoutId]
    );

    return (
        <Box
            key={station.laneNumber}
            width={1}
            height={height}
            borderRadius={"10px"}
            display={"flex"}
            position={"relative"}
            overflow={"hidden"}
            sx={{
                background: `${
                    rank === 1
                        ? `linear-gradient(90deg, ${competition?.primaryColor} 0%, ${competition?.secondaryColor} 100%)`
                        : `linear-gradient(90deg, ${BAR_COLOR} 0%, ${BAR_COLOR} 100%)`
                }`,
            }}
        >
            <Box
                width={0.05}
                p={1}
                borderRight={`2px solid ${BG_COLOR}`}
                position={"relative"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
            >
                <Typography fontSize={50} fontFamily={"bebasNeue"}>
                    {rank}
                </Typography>
            </Box>
            <Box width={1}>
                <Box display={"flex"} width={1}>
                    <Box
                        p={1}
                        position={"relative"}
                        display={"flex"}
                        gap={1.3}
                        alignItems={"center"}
                    >
                        <Typography
                            lineHeight={"2.5rem"}
                            maxHeight={"6rem"}
                            fontSize={"2rem"}
                            fontFamily={"bebasNeue"}
                        >
                            #{station.laneNumber}
                        </Typography>

                        <Typography
                            lineHeight={0.9}
                            maxHeight={"6rem"}
                            fontSize={50}
                            fontFamily={"bebasNeue"}
                            textOverflow={"ellipsis"}
                            overflow={"hidden"}
                            noWrap
                        >
                            {station.participant.slice(0, 40)}
                        </Typography>
                        <Typography
                            lineHeight={0.9}
                            maxHeight={"6rem"}
                            fontSize={25}
                            fontFamily={"bebasNeue"}
                            sx={{ textShadow: "0px 0px 15px black" }}
                        >
                            {!!currentRoundReps?.get(0) &&
                                currentRoundReps?.get(4) ===
                                    currentRoundReps?.get(0) &&
                                "✅"}
                        </Typography>
                    </Box>
                    <Box ml={"auto"} px={2} py={0.8}>
                        <Typography
                            p={1}
                            color={"white"}
                            fontSize={"3rem"}
                            lineHeight={"2.4rem"}
                            fontFamily={"bebasNeue"}
                            borderRadius={"10px"}
                            sx={{ backgroundColor: BG_COLOR }}
                        >
                            {repsCompleted}
                        </Typography>
                    </Box>
                </Box>
                {rest ? (
                    <Box
                        width={1}
                        display={"flex"}
                        justifyContent={"space-between"}
                        px={8}
                    >
                        <Box
                            display={"flex"}
                            alignItems={"baseline"}
                            width={0.3}
                            ref={parent}
                        >
                            {!!scoreOfRounds[0] && (
                                <>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"black"}
                                        fontSize={"2.5rem"}
                                        fontFamily={"bebasNeue"}
                                        // sx={{ textShadow: "0px 0px 15px black" }}
                                    >
                                        R1:
                                    </Typography>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"white"}
                                        fontSize={"3.5rem"}
                                        fontFamily={"bebasNeue"}
                                        sx={{
                                            textShadow: "0px 0px 15px black",
                                        }}
                                    >
                                        {scoreOfRounds[0]}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box
                            display={"flex"}
                            alignItems={"baseline"}
                            width={0.3}
                        >
                            {!!currentRoundReps?.get(2) && (
                                <>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"black"}
                                        fontSize={"2.5rem"}
                                        fontFamily={"bebasNeue"}
                                        // sx={{ textShadow: "0px 0px 15px black" }}
                                    >
                                        R2:
                                    </Typography>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"white"}
                                        fontSize={"3.5rem"}
                                        fontFamily={"bebasNeue"}
                                        sx={{
                                            textShadow: "0px 0px 15px black",
                                        }}
                                    >
                                        {scoreOfRounds[1]}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box
                            display={"flex"}
                            alignItems={"baseline"}
                            width={0.3}
                        >
                            {!!currentRoundReps?.get(4) && (
                                <>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"black"}
                                        fontSize={"2.5rem"}
                                        fontFamily={"bebasNeue"}
                                        // sx={{ textShadow: "0px 0px 15px black" }}
                                    >
                                        R3:
                                    </Typography>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"white"}
                                        fontSize={"3.5rem"}
                                        fontFamily={"bebasNeue"}
                                        sx={{
                                            textShadow: "0px 0px 15px black",
                                        }}
                                    >
                                        {scoreOfRounds[2]}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Box
                        width={1}
                        display={"flex"}
                        justifyContent={"space-between"}
                        px={8}
                    >
                        <Box
                            display={"flex"}
                            alignItems={"baseline"}
                            width={0.3}
                            ref={parent}
                        >
                            {!!currentRoundReps?.get(0) && (
                                <>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"black"}
                                        fontSize={"2.5rem"}
                                        fontFamily={"bebasNeue"}
                                        // sx={{ textShadow: "0px 0px 15px black" }}
                                    >
                                        DL:
                                    </Typography>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"white"}
                                        fontSize={"3.5rem"}
                                        fontFamily={"bebasNeue"}
                                        sx={{
                                            textShadow: "0px 0px 15px black",
                                        }}
                                    >
                                        {currentRoundReps?.get(0)}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box
                            display={"flex"}
                            alignItems={"baseline"}
                            width={0.3}
                        >
                            {!!currentRoundReps?.get(2) && (
                                <>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"black"}
                                        fontSize={"2.5rem"}
                                        fontFamily={"bebasNeue"}
                                        // sx={{ textShadow: "0px 0px 15px black" }}
                                    >
                                        MU:
                                    </Typography>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"white"}
                                        fontSize={"3.5rem"}
                                        fontFamily={"bebasNeue"}
                                        sx={{
                                            textShadow: "0px 0px 15px black",
                                        }}
                                    >
                                        {currentRoundReps?.get(2)}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <Box
                            display={"flex"}
                            alignItems={"baseline"}
                            width={0.3}
                        >
                            {!!currentRoundReps?.get(4) && (
                                <>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"black"}
                                        fontSize={"2.5rem"}
                                        fontFamily={"bebasNeue"}
                                        // sx={{ textShadow: "0px 0px 15px black" }}
                                    >
                                        DL:
                                    </Typography>
                                    <Typography
                                        lineHeight={1}
                                        px={1}
                                        color={"white"}
                                        fontSize={"3.5rem"}
                                        fontFamily={"bebasNeue"}
                                        sx={{
                                            textShadow: "0px 0px 15px black",
                                        }}
                                    >
                                        {currentRoundReps?.get(4)}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default SplitMTAthlete;
