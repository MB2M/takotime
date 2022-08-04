import { Box, Stack, Typography } from "@mui/material";

import Image from "next/image";

const Header = ({
    logo,
    textTop,
    textBottom,
    chrono,
}: {
    logo: StaticImageData;
    textTop?: string;
    textBottom?: string;
    chrono?: string;
}) => {
    return (
        <Stack direction="row" color={"white"}>
            <Box width={"400px"}>
                <Image src={logo} layout={"responsive"}></Image>
            </Box>
            <Stack justifyContent={"space-around"}>
                <Typography fontSize={"9rem"} fontFamily={"CantoraOne"}>
                    {textTop}
                </Typography>
                <Typography fontSize={"7rem"} fontFamily={"CantoraOne"}>
                    {textBottom}
                </Typography>
            </Stack>
            <Typography fontSize={"7rem"} fontFamily={"CantoraOne"} ml="auto" mr="50px">{chrono}</Typography>
        </Stack>
    );
};

export default Header;
