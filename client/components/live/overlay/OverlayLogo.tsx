import { Box } from "@mui/material";
import Image from "next/image";
import mtLogo from "../../../public/img/logo.png";

const OverlayLogo = () => {
    return (
        <Box width={"100vw"} height={"100vh"} position="absolute" display={"flex"} alignItems="end">
            <Box
                position="relative"
                left={"50%"}
                width={"250px"}
                sx={{ transform: "translateX(-50%)" }}
            >
                <Image src={mtLogo} layout={"responsive"}></Image>
            </Box>
        </Box>
    );
};

export default OverlayLogo;
