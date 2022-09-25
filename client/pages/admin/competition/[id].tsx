import {
    Box,
    Button,
    Container,
    Input,
    Stack,
    Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useMemo, useReducer, useState } from "react";
import {
    MuiColorInput,
    MuiColorInputColors,
    MuiColorInputValue,
} from "mui-color-input";

const reducer = (state: any, action: { key: any; value: any }) => {
    return { ...state, [action.key]: action.value };
};

const CompetitionDetail = () => {
    const router = useRouter();
    const { id: _id }: any = useMemo(() => router.query, [router]);
    const [competition, setCompetition] = useState<Competition | undefined>();
    const [image, setImage] = useState<File>();
    const [primaryColor, setPrimaryColor] =
        useState<MuiColorInputValue>("#ffffff");
    const [secondaryColor, setSecondaryColor] =
        useState<MuiColorInputValue>("#ffffff");
    const [newData, dispatch] = useReducer(reducer, {});

    const refreshCompetition = async () => {
        if (!_id) {
            setCompetition(undefined);
            return;
        }
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/webapp/competition/${_id}`
            );
            if (response.ok) {
                const json = await response.json();
                setCompetition(json);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const updateCompetition = async () => {
        console.log(newData);
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/webapp/competition/${_id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(newData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            refreshCompetition();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        refreshCompetition();
    }, [_id]);

    useEffect(() => {
        handleLogoLoad();
    }, [image]);

    useEffect(() => {
        if (!competition) return;
        competition.primaryColor && setPrimaryColor(competition.primaryColor);
        competition.secondaryColor &&
            setSecondaryColor(competition.secondaryColor);
    }, [competition]);

    const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
        setImage(undefined);
        if (event.target.files?.[0]) {
            const i = event.target.files[0];
            setImage(i);
        }
    };

    const handleLogoLoad = async (dark?: boolean) => {
        if (!image) return;
        const body = new FormData();
        body.append("file", image);
        try {
            await fetch(`/api/file?_id=${_id}${dark ? "&dark" : ""}`, {
                method: "POST",
                body,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (err) {
            console.error(err);
        }
        refreshCompetition();
    };

    const handlePrimaryColorChange = (
        newValue: string,
        colors: MuiColorInputColors
    ) => {
        setPrimaryColor(newValue);
        dispatch({ key: "primaryColor", value: newValue });
    };
    const handleSecondaryColorChange = (
        newValue: string,
        colors: MuiColorInputColors
    ) => {
        setSecondaryColor(newValue);
        dispatch({ key: "secondaryColor", value: newValue });
    };

    return (
        <Container>
            <Typography variant="h2" textAlign={"center"}>
                {competition?.name}
            </Typography>
            <Box
                mt={5}
                display="flex"
                flexDirection={"column"}
                gap={5}
                alignItems={"center"}
            >
                <Box width={1} textAlign={"center"}>
                    <Box height={200} position={"relative"}>
                        {_id && (
                            <Image
                                src={`/img/${
                                    competition?.logoUrl || "tako.png"
                                }`}
                                layout="fill"
                                objectFit="contain"
                            />
                        )}
                    </Box>
                    <Box>
                        <Button variant="contained" component="label">
                           Change logo
                            <input
                                type="file"
                                onChange={handleLogoChange}
                                hidden
                            />
                        </Button>
                    </Box>
                </Box>
                <Stack gap={2}>
                    <Box>
                        <Typography>Primary Color :</Typography>
                        <MuiColorInput
                            value={primaryColor}
                            onChange={handlePrimaryColorChange}
                            format={"hex8"}
                        />
                    </Box>
                    <Box>
                        <Typography>Secondary Color :</Typography>
                        <MuiColorInput
                            value={secondaryColor}
                            onChange={handleSecondaryColorChange}
                            format={"hex8"}
                        />
                    </Box>
                </Stack>
                <Button onClick={updateCompetition}>Save</Button>
            </Box>
        </Container>
    );
};

export default CompetitionDetail;
