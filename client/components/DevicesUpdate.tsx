import { Button, Grid, Box, TextField, Typography } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import { DataGrid, GridEditRowsModel, GridCellValue } from "@mui/x-data-grid";

type Row = {
    lane: number;
    station_ip: string;
    counter: string;
    board: string;
};

const columns = [
    { field: "lane", headerName: "#", width: 80 },
    {
        field: "station_ip",
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
];

const DevicesUpdate = ({
    stationDevices,
}: {
    stationDevices: StationDevices[];
}) => {
    const [rows, setRows] = useState<Row[]>([]);
    const [editRowsModel, setEditRowsModel] = useState({});

    useEffect(() => {
        const rows: Row[] = stationDevices.map((sd, i) => {
            return {
                lane: sd.lane_number,
                station_ip: sd.station_ip,
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

    const updateServer = async () => {
        const data = rows.map((r) => {
            return {
                lane_number: r.lane,
                station_ip: r.station_ip,
                devices: [
                    {
                        role: "counter",
                        mac: r.counter,
                        state: "disconencted",
                    },
                    {
                        role: "board",
                        mac: r.board,
                        state: "disconencted",
                    },
                ],
            };
        });

        const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_LIVE_API}/api/setDevices`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            }
        );

        console.log(response);
    };

    const handleEditRowsModelChange = (model: GridEditRowsModel) => {
        if (!!Object.keys(model).length) {
            const lane = parseInt(Object.keys(model)[0]);
            const editedData = Object.keys(model[lane])[0] as keyof Row;
            const value = model[lane][editedData].value;
            updateRows({ lane, editedData, value });
        }
    };

    const updateRows = (data: {
        lane: number;
        editedData: keyof Row;
        value: GridCellValue;
    }) => {
        const index = rows.findIndex((r) => r.lane === data.lane);
        if (index != -1) {
            let newRows = [...rows];
            console.log(newRows[index]);
            (newRows[index][data.editedData] as any) = data.value;
            setRows(newRows);
        }
    };

    console.log(rows);

    return (
        <>
            <Typography gutterBottom variant="h3" component="div">
                Devices Update
            </Typography>

            <Button onClick={updateServer}>Update</Button>

            <div style={{ height: "100%", width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    rowHeight={25}
                    getRowId={(row) => row.lane}
                    pageSize={10}
                    // editRowsModel={editRowsModel}
                    onEditRowsModelChange={handleEditRowsModelChange}
                />
            </div>
        </>
    );
};

export default DevicesUpdate;
