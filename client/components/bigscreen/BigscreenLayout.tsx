import { Box, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { ReactNode } from "react";
import { useCompetitionContext } from "../../context/competition";
import BigscreenBar from "./BigscreenBar";
import Image from "next/image";

const BigscreenLayout = ({
    children,
    headerHeight,
    customTitle,
    workout,
}: {
    children: ReactNode;
    headerHeight: number;
    customTitle?: string;
    workout: Workout;
}) => {
    const competition = useCompetitionContext();

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
                    customTitle={customTitle}
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
                        <Grid2 lg={12} position="relative">
                            {children}
                        </Grid2>
                        {/*<Grid2*/}
                        {/*    hidden*/}
                        {/*    lg={3}*/}
                        {/*    height={1}*/}
                        {/*    maxHeight={1}*/}
                        {/*    display="flex"*/}
                        {/*    flexDirection={"column"}*/}
                        {/*    alignItems="center"*/}
                        {/*    overflow={"hidden"}*/}
                        {/*    // justifyContent={"center"}*/}
                        {/*    sx={{ borderLeft: "1px solid gray" }}*/}
                        {/*    p={2}*/}
                        {/*>*/}
                        {/*    /!* <Typography*/}
                        {/*        fontSize="1.35rem"*/}
                        {/*        lineHeight={1.1}*/}
                        {/*        color="white"*/}
                        {/*        textAlign={"center"}*/}
                        {/*        dangerouslySetInnerHTML={{*/}
                        {/*            __html:*/}
                        {/*                platformWorkout?.description ||*/}
                        {/*                "no workout description",*/}
                        {/*        }}  */}
                        {/*    /> *!/*/}
                        {/*    {previousHeats.slice(0, 21).map((station) => (*/}
                        {/*        <Box*/}
                        {/*            key={`${station.participant}${station.scores?.[0].repCount}`}*/}
                        {/*        >*/}
                        {/*            <Typography*/}
                        {/*                fontSize="2.2rem"*/}
                        {/*                lineHeight={1.2}*/}
                        {/*                color="white"*/}
                        {/*                noWrap*/}
                        {/*                component="div"*/}
                        {/*                sx={{*/}
                        {/*                    ml: 2,*/}
                        {/*                    overflow: "hidden",*/}
                        {/*                    textOverflow: "ellipsis",*/}
                        {/*                    fontFamily: "BebasNeue",*/}
                        {/*                }}*/}
                        {/*                // fontSize={"2.7rem"}*/}
                        {/*                // textAlign={"center"}*/}
                        {/*            >*/}
                        {/*                {`${station.participant}: ${station.scores?.[0].repCount} reps `}*/}
                        {/*            </Typography>*/}
                        {/*        </Box>*/}
                        {/*    ))}*/}
                        {/*</Grid2>*/}
                    </Grid2>
                </Box>
                <Box mt={"auto"} mb={0}>
                    <BigscreenBar
                        position="bottom"
                        height={headerHeight}
                        competition={competition}
                        options={workout?.options}
                        customTitle={customTitle}
                    />
                </Box>
            </Stack>
        </Box>
    );
};

export default BigscreenLayout;
