import { Button, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

type Row = {
    id: string;
    laneNumber: number;
    ip: string;
    counter: string;
    board: string;
};

const columns = [
    { field: "laneNumber", headerName: "#", width: 80, editable: true },
    {
        field: "id",
        headerName: "id",
        width: 100,
    },
    {
        field: "ip",
        headerName: "Station Ip",
        width: 150,
        editable: true,
    },
    {
        field: "counter",
        headerName: "Counter",
        width: 150,
        editable: true,
    },
    {
        field: "board",
        headerName: "Board",
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
                        `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/stationdevices`,
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

const DevicesUpdate = ({
    stationDevices,
}: {
    stationDevices: StationDevices[];
}) => {
    const [rows, setRows] = useState<Row[]>([]);
    const [newLane, setNewLane] = useState<number>();

    useEffect(() => {
        const rows: Row[] = stationDevices.map((sd, i) => {
            return {
                id: sd._id,
                laneNumber: sd.laneNumber,
                ip: sd.ip,
                counter:
                    sd.devices.find((d) => d.role === "counter")?.mac || "",
                board: sd.devices.find((d) => d.role === "board")?.mac || "",
            };
        });
        setRows(rows);
    }, [stationDevices]);

    const addRow = async () => {
        const laneNumber = newLane;
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/stationdevices`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ laneNumber }),
                }
            );
            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCellEditCommit = async (params: any) => {
        let payload: any = {
            id: params.row.id,
        };
        if (["counter", "board"].includes(params.field)) {
            const actualDevices = [
                {
                    role: "counter",
                    mac:
                        params.field === "counter"
                            ? params.value
                            : params.row.counter,
                    state: params.field === "counter" && "disconnected",
                },
                {
                    role: "board",
                    mac:
                        params.field === "board"
                            ? params.value
                            : params.row.board,
                    state: params.field === "board" && "disconnected",
                },
            ];
            payload.devices = actualDevices;
        } else {
            payload[params.field] = params.value;
        }

        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/stationdevices`,
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
                Devices Update
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

export default DevicesUpdate;
