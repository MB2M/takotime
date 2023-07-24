import { Container, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import TimerForm from "../components/TimerForm";

const TimerLauncher = () => {
    return (
        <Container sx={{ p: 2, minHeight: "100vh", height: "100vh" }}>
            <Stack
                textAlign={"center"}
                justifyContent={"space-around"}
                height={1}
                fontSize={"2rem"}
            >
                <Typography variant="h3">Wod launcher</Typography>
                <TimerForm />
            </Stack>
        </Container>
    );
};

export default TimerLauncher;
