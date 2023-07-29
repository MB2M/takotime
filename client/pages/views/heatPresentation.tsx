import React from "react";
import { Box } from "@mui/system";

interface Props {
    parent: React.RefCallback<Element>;
    timer: string | number | null;
    plainTimer: number;
    fullStations: DisplayFullStation[];
    workout: Workout;
    workouts: Workout[];
    state: number;
    competition?: Competition;
    categories: string[];
}

const HeatPresentation = ({ fullStations }: Props) => {
    return (
        <Box>
            {fullStations?.map((fullStation) => {
                return (
                    <Box key={fullStation.laneNumber}>
                        {fullStation.participant}
                    </Box>
                );
            })}
        </Box>
    );
};

export default HeatPresentation;
