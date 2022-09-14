import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { baseConfig } from "./config";

const Remote = () => {
    const {pathname} = useRouter();
    return (
        <>
            <Typography textAlign={"center"} variant="h3">
                Select wod number
            </Typography>
            <Stack spacing={2} mt={5} alignItems="center">
                {[...Array(baseConfig.wodNumber + 1).keys()]
                    .splice(1)
                    .map((wodNumber) => (
                        <Box key={wodNumber}>
                            <Link href={`${pathname}/wod${wodNumber}/remote`}>
                                <Button
                                    variant="outlined"
                                    sx={{ width: "80vw" }}
                                >
                                    Wod {wodNumber}
                                </Button>
                            </Link>
                        </Box>
                    ))}
            </Stack>
        </>
    );
};

export default Remote;
