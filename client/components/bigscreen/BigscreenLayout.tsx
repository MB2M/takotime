import { Box, Divider, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useMemo, ReactNode } from "react";
import { useCompetitionContext } from "../../context/competition";
import { useCompetitionCornerContext } from "../../context/competitionCorner/data/competitionCorner";
import { useLiveDataContext } from "../../context/liveData/livedata";
import BigscreenBar from "./BigscreenHeader";
import Image from "next/image";
import useCCWorkouts from "../../hooks/useCCWorkouts";

const BigscreenLayout = ({
    children,
    headerHeight,
}: {
    children: ReactNode;
    headerHeight: number;
}) => {
    const { globals } = useLiveDataContext();
    const competition = useCompetitionContext();
    const { heats } = useCompetitionCornerContext();
    const CCWorkouts = useCCWorkouts(competition?.eventId);

    const workout = useMemo(
        () =>
            competition?.workouts.find(
                (workout) =>
                    workout.workoutId === globals?.externalWorkoutId.toString()
            ),
        [competition, globals?.externalWorkoutId]
    );

    const platformWorkout = useMemo(
        () =>
            CCWorkouts.find(
                (platformWorkout) =>
                    platformWorkout.id.toString() === workout?.workoutId
            ),
        [CCWorkouts, workout]
    );

    const heat = useMemo(
        () => heats.find((heat) => heat.id === globals?.externalHeatId),
        [heats, globals]
    );

    return (
        <Box
            overflow={"hidden"}
            sx={{
                height: "100vh",
                backgroundColor: "#101010",
            }}
        >
            <Stack height={1}>
                <BigscreenBar
                    position="top"
                    height={headerHeight}
                    competition={competition}
                    options={workout?.options}
                    heat={heat}
                />
                <Box height={1}>
                    <Box
                        position="absolute"
                        width={0.9}
                        height={0.9}
                        sx={{
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%,-50%)",
                        }}
                    >
                        {workout?.options?.logo &&
                            workout?.options?.logoPosition === "background" && (
                                <Image
                                    src={`/api/images/${competition?.logoUrl}`}
                                    alt="logo"
                                    layout="fill"
                                    objectFit="contain"
                                />
                            )}
                    </Box>
                    <Grid2 container height={1}>
                        <Grid2 lg={9}>{children}</Grid2>
                        <Grid2
                            lg={3}
                            height={1}
                            maxHeight={1}
                            display="flex"
                            alignItems="center"
                            justifyContent={"center"}
                            sx={{ borderLeft: "1px solid gray" }}
                            p={2}
                        >
                            <Typography
                                fontSize="1.35rem"
                                lineHeight={1.1}
                                color="white"
                                textAlign={"center"}
                                dangerouslySetInnerHTML={{
                                    __html:
                                        platformWorkout?.description ||
                                        "no workout description",
                                }}
                            />
                        </Grid2>
                    </Grid2>
                </Box>
                <Box mt={"auto"} mb={0}>
                    <BigscreenBar
                        position="bottom"
                        height={headerHeight}
                        competition={competition}
                        options={workout?.options}
                        heat={heat}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default BigscreenLayout;
