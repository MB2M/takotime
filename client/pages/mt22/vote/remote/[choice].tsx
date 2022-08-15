import {
    Box,
    Button,
    Container,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Modal,
    Slider,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CropSquareIcon from '@mui/icons-material/CropSquare';

const iconSelect = {
    carre: (
        <CropSquareIcon
            fontSize="inherit"
            sx={{ width: "15em", height: "15em" }}
        />
    ),
    rond: (
        <PanoramaFishEyeIcon
            fontSize="inherit"
            sx={{ width: "15em", height: "15em" }}
        />
    ),
};

const color = {
    carre: "#c6316e",
    rond: "#05c1de",
};

const LaneRemote = () => {
    const router = useRouter();
    const { choice }: any = useMemo(() => router.query, [router]);
    const [buttonDisable, setButtonDisable] = useState<boolean>(false);

    const debounceButton = (duration: number) => {
        setButtonDisable(true);
        setTimeout(() => setButtonDisable(false), duration);
    };

    const handleVote = async () => {
        debounceButton(2000);
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/vote/${choice}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    // body: JSON.stringify({ weight: addWeight, state: "Try" }),
                }
            );
            if (response.ok) {
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <Box
                display="flex"
                justifyContent={"flex-start"}
                textAlign="center"
            ></Box>
            {choice && (
                <Button
                    variant="contained"
                    size="large"
                    sx={{
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: color[choice as "carre" | "rond"],
                        color: "white",
                        "&:hover": {
                            backgroundColor:
                                color[choice as "carre" | "rond"],
                        },
                        "&:disabled": {
                            backgroundColor: "lightgray",
                        },
                    }}
                    // color={"inherit"}
                    onClick={handleVote}
                    disabled={buttonDisable}
                >
                    {iconSelect[choice as "carre" | "rond"]}
                </Button>
            )}
        </>
    );
};

export default LaneRemote;
