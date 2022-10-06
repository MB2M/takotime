import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Container,
    List,
    ListItem,
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
import useCCWorkouts from "../../../hooks/useCCWorkouts";
import Grid2 from "@mui/material/Unstable_Grid2";
import WorkoutCard from "../../../components/admin/WorkoutCard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const DEFAUT_WORKOUT: Workout = {
    workoutId: "",
    layout: "default",
    duration: 0,
    options: {
        wodtype: "forTime",
        title: true,
        titleType: "heat",
        titlePosition: "top",
        logo: true,
        logoPosition: "topLeft",
        chrono: true,
        chronoPosition: "topRight",
        chronoDirection: "asc",
        rankBy: "repsCount",
        viewMovement: "flash",
        movementFlashDuration: 5,
        showRounds: true,
    },
};

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
    const CCWorkouts = useCCWorkouts(competition?.eventId);
    const [workouts, setWorkouts] = useState<Workout[]>([]);

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
        setWorkouts(competition.workouts);
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
                body: body,

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

    const handleAddWorkout = () => {
        const newWorkouts = [...workouts, DEFAUT_WORKOUT];
        setWorkouts(newWorkouts);
        dispatch({ key: "workouts", value: newWorkouts });
    };

    const handleWorkoutDelete = (index: number) => {
        const newWorkouts = [...workouts];
        newWorkouts.splice(index, 1);
        setWorkouts(newWorkouts);
        dispatch({ key: "workouts", value: newWorkouts });
    };

    const handleWorkoutUpdate = (data: Partial<Workout>, index: number) => {
        const newWorkouts = [...workouts];
        newWorkouts[index] = { ...newWorkouts[index], ...data };
        setWorkouts(newWorkouts);
        dispatch({ key: "workouts", value: newWorkouts });
    };

    return (
        <>
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
                                    src={`public/img/${
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
                    <Box>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>CC workouts available</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {CCWorkouts.map((workout) => (
                                        <ListItem key={workout.id}>
                                            {workout.name} ({workout.id})
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Button onClick={handleAddWorkout}> Add a workout</Button>
                    <Box width={1}>
                        <Grid2 container spacing={2}>
                            {workouts.map((workout, index) => (
                                <Grid2 xs={12} md={4}>
                                    <WorkoutCard
                                        workout={workout}
                                        platformWorkouts={CCWorkouts}
                                        onUpdate={(data) =>
                                            handleWorkoutUpdate(data, index)
                                        }
                                        onDelete={() =>
                                            handleWorkoutDelete(index)
                                        }
                                    />
                                </Grid2>
                            ))}
                        </Grid2>
                    </Box>
                    <Button onClick={updateCompetition}>Save</Button>
                </Box>
            </Container>
        </>
    );
};

export default CompetitionDetail;
