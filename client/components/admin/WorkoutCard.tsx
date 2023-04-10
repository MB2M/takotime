import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Collapse,
    FormControl,
    IconButton,
    IconButtonProps,
    List,
    ListItem,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    Stack,
    styled,
    TextField,
    Typography,
} from "@mui/material";
import React, { ChangeEvent, useMemo, useState } from "react";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const deleteModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

const WorkoutCard = ({
    platform,
    workout,
    platformWorkouts,
    onUpdate,
    onDelete,
}: {
    platform?: Platform;
    workout: Workout;
    platformWorkouts: ICCWorkout[];
    onUpdate: (data: Partial<Workout>) => any;
    onDelete: () => any;
}) => {
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [openSelectPlatformWorkoutModal, setOpenSelectPlatformWorkoutModal] =
        useState<boolean>(false);
    const [expanded, setExpanded] = useState(false);
    const selectedPlatformWorkout = useMemo(
        () =>
            platformWorkouts.find(
                (platformWorkout) =>
                    platformWorkout.id.toString() === workout.workoutId
            ),
        [platformWorkouts, workout]
    );
    const [name, setName] = useState<string>("");

    const cardName = useMemo(() => {
        switch (platform) {
            case "CompetitionCorner":
                return selectedPlatformWorkout?.name;
            default:
                return workout.workoutId;
        }
    }, [platform, workout, selectedPlatformWorkout]);

    const handleDeleteClick = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const handleConfirmDeleteClick = () => {
        handleCloseDeleteModal();
        onDelete();
    };

    const handleCloseSelectPlatformWorkoutModal = () => {
        setOpenSelectPlatformWorkoutModal(false);
    };

    const handleSelectPlatformWorkoutClick = () => {
        // switch (platform) {
        //     case "CompetitionCorner":
        //         default:
        //             return workout.workoutId;
        //             "break";
        //         }
        setOpenSelectPlatformWorkoutModal(true);
    };

    const handleUpdateWorkout = (data: Partial<Workout>) => {
        onUpdate(data);
        setOpenSelectPlatformWorkoutModal(false);
    };

    const handleUpdateWorkoutOptions = (data: Partial<Workout["options"]>) => {
        const options = { ...workout.options, ...data };
        if (!!options) handleUpdateWorkout({ options });
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    const handleDurationChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleUpdateWorkout({ duration: Number(event.target.value) });
    };

    const handleLayoutChange = (event: ChangeEvent<HTMLInputElement>) => {
        handleUpdateWorkout({ layout: event.target.value });
    };

    const handleWodSwitchIndexMinuteChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        handleUpdateWorkout({
            wodIndexSwitchMinute: Number(event.target.value),
        });
    };

    const handleDataSourceChange = (event: SelectChangeEvent) => {
        handleUpdateWorkout({
            dataSource: event.target.value as Workout["dataSource"],
        });
    };

    const handleWodtypeChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            wodtype: event.target.value as WorkoutOption["wodtype"],
        });
    };

    const handleShowTitle = () => {
        handleUpdateWorkoutOptions({
            title: !workout.options?.title,
        });
    };

    const handleTitleChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            titleType: event.target.value as WorkoutOption["titleType"],
        });
    };

    const handleTitlePositionChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            titlePosition: event.target.value as WorkoutOption["titlePosition"],
        });
    };

    const handleShowLogo = () => {
        handleUpdateWorkoutOptions({
            logo: !workout.options?.logo,
        });
    };

    const handleLogoPositionChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            logoPosition: event.target.value as WorkoutOption["logoPosition"],
        });
    };

    const handleShowChronoClick = () => {
        handleUpdateWorkoutOptions({ chrono: !workout.options?.chrono });
    };

    const handleChronoPositionChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            chronoPosition: event.target
                .value as WorkoutOption["chronoPosition"],
        });
    };

    const handleChronoDirectionChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            chronoDirection: event.target
                .value as WorkoutOption["chronoDirection"],
        });
    };

    const handleRankbyChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            rankBy: event.target.value as WorkoutOption["rankBy"],
        });
    };

    const movementDisplayChange = (event: SelectChangeEvent) => {
        handleUpdateWorkoutOptions({
            viewMovement: event.target.value as WorkoutOption["viewMovement"],
        });
    };

    const handleFlashDurationChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        handleUpdateWorkoutOptions({
            movementFlashDuration: Number(event.target.value),
        });
    };

    const handleShowRounds = () => {
        handleUpdateWorkoutOptions({
            showRounds: !workout.options?.showRounds,
        });
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <>
            <Modal open={openDeleteModal} onClose={handleCloseDeleteModal}>
                <Box sx={deleteModalStyle}>
                    <Typography>Confirm Delete</Typography>
                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={handleConfirmDeleteClick}
                    >
                        Delete
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={openSelectPlatformWorkoutModal}
                onClose={handleCloseSelectPlatformWorkoutModal}
            >
                <Box sx={deleteModalStyle}>
                    {platform === "CompetitionCorner" && (
                        <List>
                            {platformWorkouts?.map((workout) => (
                                <ListItem
                                    onClick={() =>
                                        handleUpdateWorkout({
                                            workoutId: workout.id.toString(),
                                        })
                                    }
                                >
                                    {workout.name} ({workout.id})
                                </ListItem>
                            ))}
                        </List>
                    )}
                    {platform === "None" && (
                        <Stack spacing={2}>
                            <Typography>Choose name:</Typography>
                            <TextField onChange={handleNameChange} />
                            <Button
                                variant="contained"
                                onClick={() =>
                                    handleUpdateWorkout({
                                        workoutId: name,
                                    })
                                }
                            >
                                Save
                            </Button>
                        </Stack>
                    )}
                </Box>
            </Modal>
            <Card>
                <CardHeader
                    title={cardName}
                    action={
                        <IconButton onClick={handleSelectPlatformWorkoutClick}>
                            <FitnessCenterIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
                        <Box display="flex" gap={2} flexDirection={"column"}>
                            <Box>
                                Layout
                                <TextField
                                    type="text"
                                    size="small"
                                    value={workout.layout}
                                    onChange={handleLayoutChange}
                                    fullWidth
                                />
                            </Box>
                            <Box>
                                Duration
                                <TextField
                                    type="number"
                                    size="small"
                                    value={workout.duration}
                                    onChange={handleDurationChange}
                                    fullWidth
                                />
                            </Box>
                            <Box>
                                Switch Index Minute
                                <TextField
                                    type="number"
                                    size="small"
                                    value={workout.wodIndexSwitchMinute}
                                    onChange={handleWodSwitchIndexMinuteChange}
                                    fullWidth
                                />
                            </Box>
                            <Box>
                                Data Source
                                <Select
                                    size="small"
                                    value={workout.dataSource}
                                    onChange={handleDataSourceChange}
                                    fullWidth
                                >
                                    <MenuItem value={"iot"}>
                                        tako counter
                                    </MenuItem>
                                    <MenuItem value={"web"}>phone</MenuItem>
                                </Select>
                            </Box>
                            <Box>
                                Workout type
                                <Select
                                    size="small"
                                    value={workout.options?.wodtype}
                                    onChange={handleWodtypeChange}
                                    fullWidth
                                >
                                    <MenuItem value={"forTime"}>
                                        For Time
                                    </MenuItem>
                                    <MenuItem value={"amrap"}>AMRAP</MenuItem>
                                </Select>
                            </Box>
                            <Box
                                component="span"
                                display="flex"
                                alignItems="center"
                            >
                                <Checkbox
                                    size="small"
                                    checked={workout.options?.title}
                                    onClick={handleShowTitle}
                                />
                                <Typography
                                    onClick={handleShowTitle}
                                    sx={{ cursor: "pointer" }}
                                >
                                    Show title
                                </Typography>
                            </Box>
                            {workout.options?.title && (
                                <Box>
                                    Title type
                                    <Select
                                        size="small"
                                        value={workout.options?.titleType}
                                        onChange={handleTitleChange}
                                        fullWidth
                                    >
                                        <MenuItem value={"category"}>
                                            category
                                        </MenuItem>
                                        <MenuItem value={"heat"}>heat</MenuItem>
                                        <MenuItem value={"heat-category"}>
                                            heat(category)
                                        </MenuItem>
                                        <MenuItem value={"category-heat"}>
                                            category(heat)
                                        </MenuItem>
                                    </Select>
                                </Box>
                            )}
                            {workout.options?.title && (
                                <Box>
                                    Title position
                                    <Select
                                        size="small"
                                        value={workout.options?.titlePosition}
                                        onChange={handleTitlePositionChange}
                                        fullWidth
                                    >
                                        <MenuItem value={"top"}>Top</MenuItem>
                                        <MenuItem value={"bottom"}>
                                            Bottom
                                        </MenuItem>
                                    </Select>
                                </Box>
                            )}
                            <Box
                                component="span"
                                display="flex"
                                alignItems="center"
                            >
                                <Checkbox
                                    size="small"
                                    checked={workout.options?.logo}
                                    onClick={handleShowLogo}
                                />
                                <Typography
                                    onClick={handleShowLogo}
                                    sx={{ cursor: "pointer" }}
                                >
                                    Show logo
                                </Typography>
                            </Box>
                            {workout.options?.logo && (
                                <Box>
                                    Logo position
                                    <Select
                                        size="small"
                                        value={workout.options?.logoPosition}
                                        onChange={handleLogoPositionChange}
                                        fullWidth
                                    >
                                        <MenuItem value={"topLeft"}>
                                            Top left
                                        </MenuItem>
                                        <MenuItem value={"topRight"}>
                                            Top Right
                                        </MenuItem>
                                        <MenuItem value={"background"}>
                                            Background
                                        </MenuItem>
                                        <MenuItem value={"bottomLeft"}>
                                            Bottom Left
                                        </MenuItem>
                                        <MenuItem value={"bottomRight"}>
                                            Bottom Right
                                        </MenuItem>
                                    </Select>
                                </Box>
                            )}
                            <Box
                                component="span"
                                display="flex"
                                alignItems="center"
                            >
                                <Checkbox
                                    size="small"
                                    checked={workout.options?.chrono}
                                    onClick={handleShowChronoClick}
                                />
                                <Typography
                                    onClick={handleShowChronoClick}
                                    sx={{ cursor: "pointer" }}
                                >
                                    Show Chrono
                                </Typography>
                            </Box>
                            {workout.options?.chrono && (
                                <Box>
                                    Chrono position
                                    <Select
                                        size="small"
                                        value={workout.options?.chronoPosition}
                                        onChange={handleChronoPositionChange}
                                        fullWidth
                                    >
                                        <MenuItem value={"topLeft"}>
                                            Top left
                                        </MenuItem>
                                        <MenuItem value={"topRight"}>
                                            Top Right
                                        </MenuItem>
                                        <MenuItem value={"background"}>
                                            Background
                                        </MenuItem>
                                        <MenuItem value={"bottomLeft"}>
                                            Bottom Left
                                        </MenuItem>
                                        <MenuItem value={"bottomRight"}>
                                            Bottom Right
                                        </MenuItem>
                                    </Select>
                                </Box>
                            )}
                            <Box>
                                Chrono direction
                                <Select
                                    size="small"
                                    value={workout.options?.chronoDirection}
                                    onChange={handleChronoDirectionChange}
                                    fullWidth
                                >
                                    <MenuItem value={"asc"}>Ascending</MenuItem>
                                    <MenuItem value={"desc"}>
                                        Descending
                                    </MenuItem>
                                </Select>
                            </Box>
                            <Box>
                                Rank athletes by
                                <Select
                                    size="small"
                                    value={workout.options?.rankBy}
                                    onChange={handleRankbyChange}
                                    fullWidth
                                >
                                    <MenuItem value={"repsCount"}>
                                        Repetitions count
                                    </MenuItem>
                                    <MenuItem value={"laneNumber"}>
                                        Lane number
                                    </MenuItem>
                                </Select>
                            </Box>
                            <Box>
                                Movement display
                                <Select
                                    size="small"
                                    value={workout.options?.viewMovement}
                                    onChange={movementDisplayChange}
                                    fullWidth
                                >
                                    <MenuItem value={"none"}>None</MenuItem>
                                    <MenuItem value={"flash"}>Flash</MenuItem>
                                    <MenuItem value={"split"}>Split</MenuItem>
                                </Select>
                            </Box>
                            {workout.options?.viewMovement === "flash" && (
                                <TextField
                                    value={
                                        workout.options?.movementFlashDuration
                                    }
                                    onChange={handleFlashDurationChange}
                                    type="number"
                                    size="small"
                                    fullWidth
                                />
                            )}
                            <Box
                                component="span"
                                display="flex"
                                alignItems="center"
                            >
                                <Checkbox
                                    size="small"
                                    checked={workout.options?.showRounds}
                                    onClick={handleShowRounds}
                                />
                                <Typography
                                    onClick={handleShowRounds}
                                    sx={{ cursor: "pointer" }}
                                >
                                    Show rounds
                                </Typography>
                            </Box>
                        </Box>
                    </FormControl>
                </CardContent>
                <CardActions disableSpacing>
                    <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography
                            variant="body2"
                            dangerouslySetInnerHTML={{
                                __html:
                                    selectedPlatformWorkout?.description ||
                                    "no workout description",
                            }}
                        ></Typography>
                    </CardContent>
                </Collapse>
            </Card>
        </>
    );
};

export default WorkoutCard;
