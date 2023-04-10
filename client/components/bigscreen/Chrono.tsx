import { Typography } from "@mui/material";
import { useMemo } from "react";
import { useLiveDataContext } from "../../context/liveData/livedata";
import useChrono from "../../hooks/useChrono";

const Chrono = ({
    fontSize = "6rem",
    reverse = false,
    timeLeft = 10,
    timeLeftColor = "red",
    fontFamily = "CantoraOne",
}: {
    fontSize?: string;
    reverse?: boolean;
    timeLeft?: number;
    fontFamily?: string;
    timeLeftColor?: string;
}) => {
    const { globals } = useLiveDataContext();
    const { timer } = useChrono(globals?.startTime, globals?.duration, reverse);

    const formatedChrono = useMemo(() => {
        if (timer?.toString().slice(0, 1) === "-")
            return timer?.toString().slice(1);

        if (reverse) {
            const ms = Number(timer?.toString().slice(6, 9));
            let chronoArray = timer?.toString().slice(0, 5).split(":") || [];

            if (chronoArray.length !== 2) return "";

            if (chronoArray[1] === "00" && chronoArray[0] === "00" && ms === 0)
                return "00:00";
            if (chronoArray[1] === "59") {
                chronoArray[1] = "00";
                chronoArray[0] = (Number(chronoArray[0]) + 1).toString();
            } else {
                chronoArray[1] = (Number(chronoArray[1]) + 1).toString();
            }
            chronoArray = chronoArray.map(
                (element: string) =>
                    `${element.length === 1 ? "0" : ""}${element}`
            );
            return chronoArray.join(":");
        }

        return timer?.toString().slice(0, 5);
    }, [timer, reverse]);

    const isInTimeLeft = useMemo(() => {
        if (
            reverse &&
            Number(formatedChrono?.replace(":", ".")) <= timeLeft / 100
        )
            return true;
        return (
            !reverse &&
            (globals?.duration || 0) -
                0.4 -
                Number(formatedChrono?.replace(":", ".")) <=
                timeLeft / 100
        );
    }, [formatedChrono, reverse]);

    return (
        <Typography
            fontSize={fontSize}
            fontFamily={fontFamily}
            color={isInTimeLeft ? timeLeftColor : "inherit"}
        >
            {formatedChrono}
        </Typography>
    );
};

export default Chrono;
