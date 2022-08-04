import { Box } from "@mui/system";
import { useLiveDataContext } from "../../context/liveData/livedata";
import useStationPayload from "../../hooks/useStationPayload";
import Header from "../mt/Header";
import mtLogo from "../../public/img/logo.png";
import StationsUpgradedTableDisplay from "./StationsUpgradedTableDisplay";

const HeatResult = () => {
    const { stations, ranks } = useLiveDataContext();

    const stationsUpgraded = useStationPayload(stations, ranks);

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
                textTop={stationsUpgraded?.[0]?.category || ""}
            />
            <StationsUpgradedTableDisplay sortBy={"rank"} />
        </Box>
    );
};

export default HeatResult;
