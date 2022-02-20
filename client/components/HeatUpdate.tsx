import { Button, Grid, Box, TextField, Typography } from "@mui/material";
import { useState } from "react";

const HeatUpdate = ({ stations }: { stations: Station[] }) => {
    return (
        <>
            <Typography gutterBottom variant="h3" component="div">
                Participant Update
            </Typography>
            <Box component="form" noValidate autoComplete="off">
                {stations.map((s, i) => {
                    return (
                        <Grid
                            key={s.lane_number}
                            container
                            justifyContent="flex-start"
                            alignItems="center"
                            spacing={1}
                            sx={{ m: 1 }}
                        >
                            <Grid item xs={1}>
                                <TextField
                                    label="lane"
                                    // onChange={(e) => handleAthleteChange(s, i, e)}
                                    defaultValue={s.lane_number}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="participant"
                                    // onChange={(e) => handleAthleteChange(s, i, e)}
                                    defaultValue={s.athlete}
                                />
                            </Grid>
                            <Grid item>
                                <TextField
                                    label="category"
                                    // onChange={(e) => handleAthleteChange(s, i, e)}
                                    defaultValue={s.category}
                                />
                            </Grid>
                        </Grid>
                    );
                })}
            </Box>
        </>
    );
};

export default HeatUpdate;
