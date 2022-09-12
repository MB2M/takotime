import { Box, Stack, Typography } from "@mui/material";

import Image from "next/image";

const Header = ({
    logo,
    imageWidth = "400px",
    textTop,
    textTopFontSize = "9rem",
    textBottom,
    textBottomFontSize = "7rem",
    chrono,
    chronoFontSize = "6rem",
    backgroundColor = "ffffff00",
}: {
    logo?: StaticImageData;
    imageWidth?: string;
    textTop?: string;
    textTopFontSize?: string;
    textBottom?: string;
    textBottomFontSize?: string;
    chrono?: string;
    chronoFontSize?: string;
    backgroundColor?: string;
}) => {
    return (
        <Stack direction="row" color={"white"} sx={{ backgroundColor }} height={155}>
            {logo && (
                <Box width={imageWidth} ml={3}>
                    <Image src={logo} layout={"responsive"}></Image>
                </Box>
            )}
            <Stack justifyContent={"space-around"} ml={5}>
                <Typography
                    fontSize={textTopFontSize}
                    fontFamily={"CantoraOne"}
                >
                    {textTop}
                </Typography>
                <Typography fontSize={"7rem"} fontFamily={"CantoraOne"}>
                    {textBottom}
                </Typography>
            </Stack>
            <Typography
                fontSize={chronoFontSize}
                fontFamily={"CantoraOne"}
                ml="auto"
                mr="50px"
            >
                {chrono}
            </Typography>
        </Stack>
    );
};

export default Header;
