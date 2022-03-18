import { Button, Grid, Box, TextField, Typography } from "@mui/material";
import { useState, useCallback, useEffect, useRef } from "react";
import {
    DataGrid,
    GridEditRowsModel,
    GridCellValue,
    GridApi,
    GridCellEditCommitParams,
} from "@mui/x-data-grid";

type Row = {
    id: string;
    laneNumber: number;
    ip: string;
    counter: string;
    board: string;
};

const columns = [
    { field: "laneNumber", headerName: "#", width: 80 },
    {
        field: "id",
        headerName: "id",
        width: 100,
    },
    {
        field: "ip",
        headerName: "Station IP",
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
    setStationDevices,
}: {
    stationDevices: StationDevices[];
    setStationDevices: any;
}) => {
    const [rows, setRows] = useState<Row[]>([]);
    const [editRowsModel, setEditRowsModel] = useState({});
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

    // const getRows = () => {
    //     return stationDevices.map((sd, i) => {
    //         return {
    //             lane: sd.lane_number,
    //             station_ip: sd.station_ip,
    //             counter: sd.devices.find((d) => d.role === "counter")?.mac,
    //             board: sd.devices.find((d) => d.role === "board")?.mac,
    //         };
    //     });
    // };

    // const updateServer = async () => {
    //     const data = rows.map((r) => {
    //         return {
    //             lane_number: r.lane,
    //             station_ip: r.station_ip,
    //             devices: [
    //                 {
    //                     role: "counter",
    //                     mac: r.counter,
    //                     state: "disconencted",
    //                 },
    //                 {
    //                     role: "board",
    //                     mac: r.board,
    //                     state: "disconencted",
    //                 },
    //             ],
    //         };
    //     });

    //     try {
    //         const response = await fetch(
    //             `http://${process.env.NEXT_PUBLIC_LIVE_API}/live/api/setDevices`,
    //             {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 mode: "cors",
    //                 body: JSON.stringify(data),
    //             }
    //         );
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

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

    // const handleEditRowsModelChange = (model: GridEditRowsModel) => {
    //     if (!!Object.keys(model).length) {
    //         const lane = parseInt(Object.keys(model)[0]);
    //         const editedData = Object.keys(model[lane])[0] as keyof Row;
    //         const value = model[lane][editedData].value;
    //         updateRows({ lane, editedData, value });
    //     }
    // };

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
            const json = await response.json();
            // if (response.status === 200) {
            //     const newStationDevices = stationDevices;
            //     let index = stationDevices.findIndex(
            //         (sd) => sd._id === json._id
            //     );
            //     newStationDevices[index] = json;
            //     console.log(index)
            //     console.log(json)
            //     console.log(newStationDevices[index]);
            //     console.log(newStationDevices);
            //     setStationDevices(newStationDevices);
            // }
        } catch (error) {
            console.error(error);
        }

        // try {
        //   // Make the HTTP request to save in the backend
        //   const response = await fetch({
        //     id: params.id,
        //     [params.field]: params.value,
        //   });
        //   setSnackbar({ children: 'User successfully saved', severity: 'success' });
        //   setRows((prev) =>
        //     prev.map((row) => (row.id === params.id ? { ...row, ...response } : row)),
        //   );
        // } catch (error) {
        //   setSnackbar({ children: 'Error while saving user', severity: 'error' });
        //   // Restore the row in case of error
        //   setRows((prev) => [...prev]);
        // }
    };

    // const updateRows = (data: {
    //     lane: number;
    //     editedData: keyof Row;
    //     value: GridCellValue;
    // }) => {
    //     const index = rows.findIndex((r) => r.lane === data.lane);
    //     if (index != -1) {
    //         let newRows = [...rows];
    //         console.log(newRows[index]);
    //         (newRows[index][data.editedData] as any) = data.value;
    //         setRows(newRows);
    //     }
    // };

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
                    // getRowId={(row) => row.lane}
                    pageSize={10}
                    onCellEditCommit={handleCellEditCommit}
                    // editRowsModel={editRowsModel}
                    // onEditRowsModelChange={handleEditRowsModelChange}
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
