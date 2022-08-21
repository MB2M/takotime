import { Divider, List, ListItem, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import {
    ReactChild,
    ReactFragment,
    ReactPortal,
    useEffect,
    useState,
} from "react";
import ReactPlayer from "react-player";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useStationPayload from "../../../hooks/useStationPayload";
import styles from "../../../styles/HeatWinner.module.css";
import Header from "../../mt/Header";
import mtLogo from "../../../public/img/logo.png";
import HeatResult from "../HeatResult";

function HeatWinner() {
    const { stations, ranks } = useLiveDataContext();
    const [showWinner, setShowWinner] = useState<boolean>(false);
    const [showVideo, setShowVideo] = useState<boolean>(false);

    const stationsUpgraded = useStationPayload(stations, ranks);

    useEffect(() => {
        setShowVideo(true);
        setShowWinner(true);
        const timeoutVideo = setTimeout(() => {
            setShowVideo(false);
        }, 1700);
        const timeoutWinner = setTimeout(() => {
            setShowWinner(false);
        }, 10000);

        return () => {
            clearTimeout(timeoutVideo);
            clearTimeout(timeoutWinner);
        };
    }, []);

    return (
        <>
            {showVideo && (
                <Box
                    position="absolute"
                    zIndex={1}
                    top={0}
                    left={0}
                    width={"100vw"}
                    height={"100vh"}
                    overflow="hidden"
                    sx={{ backgroundColor: "black" }}
                >
                    <ReactPlayer
                        url={"/mp4/videoTransition.mp4"}
                        playing={true}
                        muted={true}
                        width={1920}
                        height={1080}
                    />
                </Box>
            )}
            <Box
                className="displayZone"
                display={"flex"}
                overflow={"hidden"}
                gap={0}
                sx={{
                    width: 1920,
                    height: 1080,
                    backgroundColor: "#242424",
                    flexDirection: "column",
                }}
            >
                {showWinner ? (
                    <Box
                        height={"100%"}
                        display={"flex"}
                        flexDirection="column"
                        justifyContent={"space-around"}
                    >
                        {[
                            ...new Set(stationsUpgraded.map((s) => s.category)),
                        ].map((category) => {
                            const winnerCategoryRank = stationsUpgraded
                                .filter(
                                    (station) => station.category === category
                                )
                                .map(
                                    (stationFiltered) =>
                                        stationFiltered.rank[
                                            stationFiltered.rank.length - 1
                                        ]
                                )
                                .sort((a, b) => a - b)[0];
                            const winner = stationsUpgraded.find(
                                (station) =>
                                    station.category === category &&
                                    Number(
                                        station.rank[station.rank.length - 1]
                                    ) === winnerCategoryRank
                            );
                            return (
                                <Stack
                                    key={category}
                                    color="white"
                                    alignItems={"center"}
                                    height={"50%"}
                                    justifyContent={"space-between"}
                                >
                                    <Box textAlign="center">
                                        <Typography variant="h1">
                                            Heat Winner
                                        </Typography>
                                        <Typography variant="h2">
                                            {category}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        fontSize={"10rem"}
                                        className={styles.gradiant}
                                    >
                                        {winner?.participant.toUpperCase()}
                                    </Typography>
                                    <Typography variant="h1">
                                        {winner?.result?.slice(
                                            0,
                                            winner.result.length - 1
                                        )}
                                    </Typography>
                                </Stack>
                            );
                        })}
                    </Box>
                ) : (
                    <HeatResult />
                )}
            </Box>
        </>
    );
}

export default HeatWinner;
