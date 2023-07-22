import { Box, Stack, Typography } from "@mui/material";

import Image, { StaticImageData } from "next/image";

const Header = ({
    headerHeight = "155px",
    leftZone,
    imageWidth = "400px",
    textTop,
    textTopFontSize = "9rem",
    textBottom,
    textBottomFontSize = "7rem",
    rightZone,
    rightZoneFontSize = "6rem",
    backgroundColor = "ffffff00",
}: {
    headerHeight?: string;
    leftZone?: StaticImageData | string;
    imageWidth?: string;
    textTop?: string;
    textTopFontSize?: string;
    textBottom?: string;
    textBottomFontSize?: string;
    rightZone?: string;
    rightZoneFontSize?: string;
    backgroundColor?: string;
}) => {
    return (
        <Stack
            direction="row"
            color={"white"}
            sx={{ backgroundColor }}
            height={headerHeight}
        >
            {leftZone && (
                <Box width={imageWidth} ml={3} position={"relative"}>
                    <Image
                        src={leftZone}
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
            {/* <Typography
                fontSize={chronoFontSize}
                fontFamily={"CantoraOne"}
                ml="auto"
                mr="50px"
            >
                {rightZone}
            </Typography> */}
        </Stack>
    );
};

export default Header;
