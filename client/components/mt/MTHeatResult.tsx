import { Box } from "@mui/system";
import HeaderMT from "./HeaderMT";
import mtLogo from "../../public/img/logo.png";
import MTStationsUpgradedTableDisplay from "./MTStationsUpgradedTableDisplay";
import { useCompetitionCornerContext } from "../../context/competitionCorner/data/competitionCorner";

const MTHeatResult = ({ stations }: { stations: any }) => {
    // const { stations, ranks } = useLiveDataContext();

    const CCData = useCompetitionCornerContext();

    return (
        <Box
            className="displayZone"
            display={"flex"}
            overflow={"hidden"}
            gap={0}
            sx={{
                width: 1920,
                height: 1080,
                backgroundColor: "#242424",
                flexDirection: "column",
            }}
        >
            <HeaderMT logo={mtLogo} textTop={CCData?.epHeat?.[0].heatName} />
            <MTStationsUpgradedTableDisplay
                stations={stations}
                sortBy={"rank"}
            />
        </Box>
    );
};

export default MTHeatResult;
