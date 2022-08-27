import { Button, Grid, Box, TextField, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";

type Row = {
    id: string;
    laneNumber: number;
    participant: string;
    category: string;
};

const columns = [
    { field: "laneNumber", headerName: "#", width: 80, editable: true },
    {
        field: "id",
        headerName: "id",
        width: 100,
    },
    {
        field: "participant",
        headerName: "Participant",
        width: 150,
        editable: true,
    },
    {
        field: "category",
        headerName: "Category",
        width: 150,
        editable: true,
    },
    {
        field: "delete",
        headerName: "Delete",
        width: 25,
        renderCell: (params: any) => {
            const deleteRow = async (rowId: string) => {
                try {
                    const response = await fetch(
                        `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/stationstatics`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ id: rowId }),
                        }
                    );
                    const json = await response.json();
                } catch (error) {
                    console.error(error);
                }
            };
            const onClick = (e: any) => {
                e.stopPropagation(); // don't select this row after clicking
                deleteRow(params.row.id);
            };

            return <Button onClick={onClick}>Click</Button>;
        },
    },
];

const StationUpdate = ({ stations }: { stations: Station[] }) => {
    const [rows, setRows] = useState<Row[]>([]);
    const [newLane, setNewLane] = useState<number>();

    useEffect(() => {
        const rows: Row[] = stations.map((setBrokerClients) => {
            return {
                id: setBrokerClients._id,
                laneNumber: setBrokerClients.laneNumber,
                participant: setBrokerClients.participant,
                category: setBrokerClients.category,
            };
        });
        setRows(rows);
    }, [stations]);

    const addRow = async () => {
        const laneNumber = newLane;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/stationstatics`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ laneNumber }),
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    const handleCellEditCommit = async (params: any) => {
        let payload: any = {
            id: params.row.id,
            [params.field]: params.value,
        };

        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/stationstatics`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Typography gutterBottom variant="h3" component="div">
                Participant Update
            </Typography>
            <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                sx={{ m: 1 }}
            >
                <Grid item sm={2}>
                    <TextField
                        label="new lane"
                        size="small"
                        type="number"
                        onChange={(e) => setNewLane(parseInt(e.target.value))}
                    />
                </Grid>
                <Button onClick={addRow}>add row</Button>
            </Grid>
            <div style={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={25}
                    pageSize={10}
                    onCellEditCommit={handleCellEditCommit}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            },
                        },
                    }}
                />
            </div>
        </>
    );
};

export default StationUpdate;
