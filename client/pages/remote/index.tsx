import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useLiveDataContext } from "../../context/liveData/livedata";

const Remote = () => {
    const { stations } = useLiveDataContext();
    const { pathname } = useRouter();
    return (
        <>
            <Typography textAlign={"center"} variant="h3">
                Select your Line
            </Typography>
            <Stack spacing={2} mt={5} alignItems="center">
                {stations
                    ?.sort((a, b) => a.laneNumber - b.laneNumber)
                    .map((station) => (
                        <Box key={station.laneNumber}>
                            <Link href={`${pathname}/${station.laneNumber}`}>
                                <Button
                                    variant="outlined"
                                    sx={{ width: "80vw" }}
                                >
                                    {station.laneNumber} - {station.participant}
                                </Button>
                            </Link>
                        </Box>
                    ))}
            </Stack>
        </>
    );
};

export default Remote;
