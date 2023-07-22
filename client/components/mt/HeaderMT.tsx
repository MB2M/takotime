import { Box, Stack, Typography } from "@mui/material";

import Image, { StaticImageData } from "next/image";

const HeaderMT = ({
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
    logo?: StaticImageData | string;
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
        <Stack
            direction="row"
            color={"white"}
            sx={{ backgroundColor }}
            height={155}
        >
            {logo && (
                <Box width={imageWidth} ml={3} position={"relative"}>
                    <Image
                        src={logo}
                        layout={"fill"}
                        objectFit="contain"
                    ></Image>
                </Box>
            )}
            <Stack justifyContent={"space-evenly"} ml={5}>
                <Typography
                    fontSize={textTopFontSize}
                    fontFamily={"CantoraOne"}
                    lineHeight={1}
                >
                    {textTop}
                </Typography>
                <Typography
                    fontSize={textBottomFontSize}
                    fontFamily={"CantoraOne"}
                    lineHeight={1}
                >
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

export default HeaderMT;
