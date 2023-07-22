import { Box } from "@mui/material";
import Image, { StaticImageData } from "next/image";

const Logo = ({
    logo,
    logoWidth,
}: {
    logo: StaticImageData | string;
    logoWidth: string;
}) => {
    return (
        <Box width={logoWidth} height={1} ml={3} position={"relative"}>
            <Image src={logo} layout={"fill"} objectFit="contain" />
        </Box>
    );
};

export default Logo;
