import { Stack, Typography } from "@mui/material";

const Title = ({
    textTop = "",
    textTopFontSize = "5rem",
    textBottom = "",
    textBottomFontSize = "4.5rem",
    fontFamily = "bebasNeue",
}: {
    textTop?: string;
    textTopFontSize?: string;
    textBottom?: string;
    textBottomFontSize?: string;
    fontFamily?: string;
}) => {
    return (
        <Stack justifyContent={"center"} height={1}>
            <Typography
                fontSize={textTopFontSize}
                fontFamily={fontFamily}
                lineHeight={0.9}
            >
                {textTop}
            </Typography>
            <Typography
                fontSize={textBottomFontSize}
                fontFamily={fontFamily}
                lineHeight={0.9}
            >
                {textBottom}
            </Typography>
        </Stack>
    );
};

export default Title;
