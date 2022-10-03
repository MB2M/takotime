import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import mtLogo from "../../../public/img/logo.png";
import useStationPayload from "../../../hooks/useStationPayload";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import HeaderMT from "../../../components/mt/HeaderMT";
import WodWeightRunningAthlete from "../../../components/mt/WodWeightRunningAthlete";
import { useEffect, useRef, useState } from "react";
import useInterval from "../../../hooks/useInterval";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CropSquareIcon from "@mui/icons-material/CropSquare";

const iconSelect = {
    carre: (
        <CropSquareIcon
            fontSize="inherit"
            sx={{ width: "20em", height: "20em" }}
        />
    ),
    rond: (
        <PanoramaFishEyeIcon
            fontSize="inherit"
            sx={{ width: "20em", height: "20em" }}
        />
    ),
};

const color = {
    rond: "#c6316e",
    carre: "#05c1de",
};

const complex = {
    rond: (
        <div>
            <div>1 Clean</div>
            <div>1 Front Squat</div>
            <div>1 Jerk</div>
        </div>
    ),
    carre: (
        <div>
            <div>1 Deadlift</div>
            <div>1 Clean</div>
            <div>1 Hang Clean</div>
            <div>1 Jerk</div>
        </div>
    ),
};

function Vote() {
    const [votes, setVotes] = useState<any[]>([]);
    const [showRondFlash, setShowRondFlash] = useState<boolean>(false);
    const [showCarreFlash, setShowCarreFlash] = useState<boolean>(false);

    const voteCountCarreRef = useRef();
    const voteCountRondRef = useRef();

    useEffect(() => {
        setShowRondFlash(true);
        const timer = setTimeout(() => {
            setShowRondFlash(false), 500;
        });
        return () => clearTimeout(timer);
    }, [voteCountRondRef.current]);

    useEffect(() => {
        setShowCarreFlash(true);
        setTimeout(() => {
            console.log("aaaaaaaaaaaaaa");
            setShowCarreFlash(false), 500;
        });
    }, [voteCountCarreRef.current]);

    const restrieveStationInfo = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/vote`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                const json = await response.json();
                setVotes(json);
                if (
                    voteCountCarreRef.current !==
                    json.find(
                        (count: { name: string }) => count.name === "carre"
                    ).count
                ) {
                    voteCountCarreRef.current = json.find(
                        (count: { name: string }) => count.name === "carre"
                    ).count;
                }

                if (
                    voteCountRondRef.current !==
                    json.find(
                        (count: { name: string }) => count.name === "rond"
                    ).count
                ) {
                    voteCountRondRef.current = json.find(
                        (count: { name: string }) => count.name === "rond"
                    ).count;
                }
            } else {
                setVotes([]);
            }
        } catch (err) {
            console.log(err);
            setVotes([]);
        }
    };
    useInterval(restrieveStationInfo, 3000);

    const selectIcon = (voteName: string) => {
        if (voteName === "rond" && showRondFlash) {
            return "rondFlash";
        } else if (voteName === "carre" && showCarreFlash) {
            console.log("vvvvvvvvvvvv");
            return "carreFlash";
        } else return voteName;
    };

    return (
        <Grid container color="white" sx={{ width: 1920, height: 1080 }}>
            {votes.map((vote) => {
                return (
                    Object.keys(iconSelect).includes(vote.name) && (
                        <Grid
                            item
                            xs={6}
                            height={"100%"}
                            alignItems={"center"}
                            justifyContent="space-around"
                            display="flex"
                            direction={"column"}
                            sx={{
                                backgroundColor:
                                    color[vote.name as keyof typeof iconSelect],
                            }}
                        >
                            <>
                                {
                                    iconSelect[
                                        vote.name as keyof typeof iconSelect
                                    ] as any
                                }
                                <Typography
                                    fontSize="
                                    5rem"
                                    fontFamily={"CantoraOne"}
                                >
                                    {
                                        complex[
                                            vote.name as keyof typeof iconSelect
                                        ]
                                    }
                                </Typography>
                            </>
                        </Grid>
                    )
                );
            })}
        </Grid>
    );
}

export default Vote;
