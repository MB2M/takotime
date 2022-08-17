import { List, ListItem, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ReactChild, ReactFragment, ReactPortal } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";
import useStationPayload from "../../hooks/useStationPayload";
import Header from "../mt/Header";
import mtLogo from "../../public/img/logo.png";
import StationsUpgradedTableDisplay from "./StationsUpgradedTableDisplay";

const HeatPresentation = () => {
    const { stations, ranks } = useLiveDataContext();

    const stationsUpgraded = useStationPayload(stations, ranks);

    return (
        <Box
            display={"flex"}
            gap={0}
            overflow={"hidden"}
            sx={{
                flexDirection: "column",
                width: 1920,
                height: 1080,
                backgroundColor: "#242424",
            }}
        >
            <Header
                logo={mtLogo}
                textTop={[...new Set(stationsUpgraded?.map(station => station.category))].join(" / ")}
                textTopFontSize={"7rem"}
                // textTop={stationsUpgraded?.[0]?.category || ""}
            />
            <StationsUpgradedTableDisplay sortBy={"laneNumber"} />
        </Box>
    );
};

export default HeatPresentation;
