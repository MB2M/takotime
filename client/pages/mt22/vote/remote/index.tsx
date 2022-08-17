import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useLiveDataContext } from "../../../../context/liveData/livedata";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";

const Remote = () => {
    return (
        <>
            <Typography textAlign={"center"} variant="h3">
                Select One
            </Typography>
            <Stack spacing={2} mt={5} alignItems="center">
                {["carre", "rond"].map((choice) => (
                    <Box key={choice}>
                        <Link href={`/mt22/vote/remote/${choice}`}>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{ width: "80vw" }}
                            >
                                {choice === "carre" ? (
                                    <CropSquareIcon
                                        color="success"
                                        fontSize="large"
                                    />
                                ) : (
                                    <PanoramaFishEyeIcon
                                        color="warning"
                                        fontSize="large"
                                    />
                                )}
                            </Button>
                        </Link>
                    </Box>
                ))}
            </Stack>
        </>
    );
};

export default Remote;
