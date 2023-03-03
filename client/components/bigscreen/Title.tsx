import { Stack, Typography } from "@mui/material";

const Title = ({
    textTop = "",
    textTopFontSize = "6rem",
    textBottom = "",
    textBottomFontSize = "4.5rem",
}: {
    textTop?: string;
    textTopFontSize?: string;
    textBottom?: string;
    textBottomFontSize?: string;
}) => {
    return (
        <Stack justifyContent={"center"} height={1} ml={5}>
            <Typography
                fontSize={textTopFontSize}
                fontFamily={"Montserrat"}
                lineHeight={0.9}
            >
                {textTop}
            </Typography>
            <Typography
                fontSize={textBottomFontSize}
                fontFamily={"Montserrat"}
                lineHeight={0.9}
            >
                {textBottom}
            </Typography>
        </Stack>
    );
};

export default Title;
