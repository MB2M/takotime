import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import useChrono from "../../../hooks/useChrono";
import mtLogo from "../../../public/img/logo.png";
import useStationPayload from "../../../hooks/useStationPayload";
import { useCompetitionCornerContext } from "../../../context/competitionCorner/data/competitionCorner";
import Header from "../../../components/mt/Header";
import WodWeightRunningAthlete from "../../../components/mt/WodWeightRunningAthlete";
import { useEffect, useState } from "react";
import useInterval from "../../../hooks/useInterval";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";

const iconSelect = {
    triangle: (
        <ChangeHistoryIcon
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
    triangle: "#c6316e",
    rond: "#05c1de",
};

function Vote() {
    const [votes, setVotes] = useState<any[]>([]);

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
                console.log(json);
                setVotes(json);
            } else {
                setVotes([]);
            }
        } catch (err) {
            console.log(err);
            setVotes([]);
        }
    };
    useInterval(restrieveStationInfo, 1000);
    console.log(votes);
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
                            justifyContent="space-evenly"
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
                                    fontSize="350px"
                                    fontFamily={"CantoraOne"}
                                >
                                    {vote.count}
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
