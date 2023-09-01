import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";
import React from "react";

interface Props {
    station: DisplayFullStation;
    workouts: Workout[];
    currentCCScore: string[];
    onPostScore: (laneNumber: number) => void;
    results: WodResult["results"][];
    onRepClick: ({
        station,
        value,
        participantId,
        category,
    }: {
        station: number;
        value: number;
        participantId: string;
        category: string;
    }) => void;
}

const HeadTakoStation = ({
    station,
    workouts,
    currentCCScore,
    onPostScore,
    onRepClick,
    results,
}: Props) => {
    const byWods = workouts.map((workout, index) => {
        const endTime = station.scores?.endTimer.at(-1)?.time;

        const repsCompleted =
            station?.scores?.["wodClassic"]
                ?.filter((score) => score.index === workout.workoutId)
                .reduce((total, rep) => total + rep.rep, 0) || 0;

        const isUpToDate =
            currentCCScore[index] === endTime ||
            currentCCScore[index] === `CAP +${repsCompleted}`;

        const currentScore = currentCCScore[index];

        return {
            endTime,
            repsCompleted,
            isUpToDate,
            currentScore,
        };
    });
    // const {
    //     movement: currentMovement,
    //     movementReps: currentMovementReps,
    //     movementTotalReps: currentMovementTotalReps,
    // } = useWebappWorkout(workout[0], repsCompleted);

    const handlePost = (laneNumber: number) => () => {
        onPostScore?.(laneNumber);
    };

    const handleRepsClick = (value: number) => () => {
        onRepClick?.({
            station: station.laneNumber,
            value: value,
            participantId: station.externalId.toString(),
            category: station.category,
        });
    };

    return (
        <Box
            key={station.laneNumber}
            width={1}
            border={"1px solid gray"}
            borderRadius={2}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            p={1}
        >
            <Box display={"flex"} gap={2} height={1} width={150}>
                <Typography
                    fontFamily={"BebasNeue"}
                    fontSize={"1rem"}
                    color={"white"}
                    borderRight={"1px solid gray"}
                    my={"auto"}
                    px={1}
                >
                    {station.laneNumber}
                </Typography>
                <Box>
                    <Typography
                        fontFamily={"BebasNeue"}
                        fontSize={"1rem"}
                        color={"white"}
                        my={"auto"}
                    >
                        {station.participant}
                    </Typography>
                </Box>
            </Box>
            {results.flat().map((r) => (
                <Box>
                    {" "}
                    <Typography
                        px={1}
                        pt={0.5}
                        color={"white"}
                        fontSize={"1.5rem"}
                        fontFamily={"BebasNeue"}
                        borderRadius={"10px"}
                        sx={{
                            textShadow: "0px 0px 15px black",
                        }}
                    >
                        {r.finalScore} {r.units}
                    </Typography>
                    t
                </Box>
            ))}
            {/*{byWods.map((workout, index) => {*/}
            {/*    // console.log(*/}
            {/*    //     station.laneNumber,*/}
            {/*    //     workout.currentScore,*/}
            {/*    //     workout.isUpToDate*/}
            {/*    // );*/}
            {/*    return (*/}
            {/*        <React.Fragment key={index}>*/}
            {/*            <Box>*/}
            {/*                {workout.endTime ? (*/}
            {/*                    <Box*/}
            {/*                        display={"flex"}*/}
            {/*                        justifyContent={"center"}*/}
            {/*                        alignItems={"center"}*/}
            {/*                    >*/}
            {/*                        <Typography*/}
            {/*                            px={1}*/}
            {/*                            pt={0.5}*/}
            {/*                            color={"white"}*/}
            {/*                            fontSize={"1.5rem"}*/}
            {/*                            fontFamily={"BebasNeue"}*/}
            {/*                            borderRadius={"10px"}*/}
            {/*                            sx={{*/}
            {/*                                textShadow: "0px 0px 15px black",*/}
            {/*                            }}*/}
            {/*                        >*/}
            {/*                            {workout.endTime}*/}
            {/*                        </Typography>*/}
            {/*                    </Box>*/}
            {/*                ) : (*/}
            {/*                    <Stack flexGrow={1} pl={10}>*/}
            {/*                        <Box display={"flex"} alignItems={"center"}>*/}
            {/*                            <Typography*/}
            {/*                                fontFamily={"BebasNeue"}*/}
            {/*                                color={"white"}*/}
            {/*                            ></Typography>*/}
            {/*                            <Typography*/}
            {/*                                color={"white"}*/}
            {/*                                fontFamily={"BebasNeue"}*/}
            {/*                            >*/}
            {/*                                /!*{`${currentMovementReps} / ${currentMovementTotalReps} ${currentMovement}`}*!/*/}
            {/*                            </Typography>*/}
            {/*                        </Box>*/}
            {/*                        <Box display={"flex"} gap={1}>*/}
            {/*                            <Button*/}
            {/*                                variant={"contained"}*/}
            {/*                                color="primary"*/}
            {/*                                size="small"*/}
            {/*                                sx={{*/}
            {/*                                    width: "20px",*/}
            {/*                                }}*/}
            {/*                                onClick={handleRepsClick(1)}*/}
            {/*                            >*/}
            {/*                                +*/}
            {/*                            </Button>*/}
            {/*                            <Button*/}
            {/*                                variant={"contained"}*/}
            {/*                                color="secondary"*/}
            {/*                                size="small"*/}
            {/*                                sx={{ width: "20px" }}*/}
            {/*                                onClick={handleRepsClick(-1)}*/}
            {/*                            >*/}
            {/*                                -*/}
            {/*                            </Button>*/}
            {/*                        </Box>*/}
            {/*                    </Stack>*/}
            {/*                )}*/}
            {/*            </Box>*/}
            <Box>
                {/*{workout.isUpToDate ? (*/}
                {/*    <Typography color={"white"}>*/}
                {/*        {workout.currentScore}*/}
                {/*    </Typography>*/}
                {/*) : (*/}
                <Button
                    variant={"contained"}
                    size={"small"}
                    sx={{
                        backgroundColor: "#02abcc",
                        fontSize: "0.7rem",
                    }}
                    onClick={handlePost(station.laneNumber)}
                >
                    Update
                </Button>
                {/*)}*/}
            </Box>
            {/*</React.Fragment>*/}
            );
            {/*})}*/}
        </Box>
    );
};
export default HeadTakoStation;
