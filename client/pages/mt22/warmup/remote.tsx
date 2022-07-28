import { Button } from "@mui/material";
import { useState } from "react";
import { useLiveDataContext } from "../../../context/liveData/livedata";
import { usePlanning } from "../../../utils/mt/usePlanning";

function WarmupRemote() {
    const { globals, sendMessage } = useLiveDataContext();

    const planning = usePlanning(300000);

    const [selectedId, setSelectedId] = useState<string>("");

    function handleHeatClick(id: number) {
        let title;
        if (selectedId === id.toString()) {
            title = "";
        } else {
            title = id;
        }
        setSelectedId(id.toString());

        sendMessage(
            JSON.stringify({ topic: "client/remoteWarmupHeat", message: title })
        );

        // const requestOptions = {
        //     method: "POST",
        //     headers: {
        //         Accept: "application/json",
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ remoteHeatName: title }),
        // };
        // fetch("/livedata/remote-post", requestOptions);
    }

    return (
        <ul className="list-group">
            {planning.map((h) => {
                return (
                    <Button key={h.id} onClick={() => handleHeatClick(h.id)} variant={"outlined"}>
                        {h.title}
                    </Button>
                );
            })}
        </ul>
    );
}

export default WarmupRemote;
