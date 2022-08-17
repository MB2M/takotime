import { Box } from "@mui/system";
import { useLiveDataContext } from "../../context/liveData/livedata";
import useStationPayload from "../../hooks/useStationPayload";
import Header from "../mt/Header";
import mtLogo from "../../public/img/logo.png";
import StationsUpgradedTableDisplay from "./StationsUpgradedTableDisplay";
import { useCompetitionCornerContext } from "../../context/competitionCorner/data/competitionCorner";

const HeatResult = () => {
    const { stations, ranks } = useLiveDataContext();

    const stationsUpgraded = useStationPayload(stations, ranks);
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
            <Header
                logo={mtLogo}
                textTop={[
                    ...new Set(
                        stationsUpgraded?.map((station) => station.category)
                    ),
                ].join(" / ")}
                textTopFontSize={"7rem"}
                // textTop={CCData?.epHeat?.[0].heatName}
            />
            <StationsUpgradedTableDisplay sortBy={"rank"} />
        </Box>
    );
};

export default HeatResult;
