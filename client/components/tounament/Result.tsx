import { Checkbox, ListItem, ListItemText, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const regexTimeChange =
    /^[0-5][0-9]:[0-5][0-9](\.[0-9]{0,3})?$|^[0-5][0-9]:[0-5][0-9]$|^[0-5][0-9]:[0-5]$|^[0-5][0-9]:$|^[0-5][0-9]$|^[0-5]$|^$/;

const regexTimeValidation = /^[0-5][0-9]:[0-5][0-9](\.[0-9]{0,3})?$/;

const regexDNF = /^[0-9]*$/;

const Result = ({
    result,
    onChange,
}: {
    result: Result;
    onChange: (result: Result) => any;
}) => {
    const [score, setScore] = useState<string>("");
    const [DNF, setDNF] = useState<boolean>(false);

    useEffect(() => {
        if (result) {
            setScore(result.result || "");
            // setDNF(result.result !== "" & !result.result.includes(':'))
        }
    }, [result]);

    const checkformat = (text: string) => {
        return regexTimeChange.test(text);
    };

    const handleResultChange = (e: any) => {
        const newScore = `${e.target.value}`;
        let passRegex;
        if (DNF) {
            passRegex = regexDNF.test(newScore);
        } else {
            passRegex = regexTimeChange.test(newScore);
        }
        passRegex && setScore(newScore);
    };

    const handleResultFocusOut = (e: { target: { value: any } }) => {
        const newScore = `${e.target.value}`;
        let passRegex;
        if (DNF) {
            passRegex = regexDNF.test(newScore);
        } else {
            passRegex = regexTimeValidation.test(newScore);
        }
        if (passRegex) {
            setScore(newScore);
            result.result = newScore;
            onChange(result);
        }
    };

    const handleCheckboxChange = () => {
        setScore("");
        result.result = "";
        onChange(result);
        setDNF((dnf) => !dnf);
    };

    return (
        <ListItem key={result.station}>
            <ListItemText
                primary={`[${result.station}] ${result.participant.name}`}
            />
            <TextField
                id="result"
                name="result"
                value={score}
                onChange={handleResultChange}
                onBlur={handleResultFocusOut}
                label="score"
                type={"text"}
                variant="outlined"
                size={"small"}
            ></TextField>
            <Checkbox checked={DNF} onChange={handleCheckboxChange}></Checkbox>
            DNF
        </ListItem>
    );
};

export default Result;
