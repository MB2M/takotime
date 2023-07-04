import { useEffect, useState } from "react";
import { useLiveDataContext } from "../liveData/livedata";

const useCompetition = () => {
    const { registerListener } = useLiveDataContext();
    const [competition, setCompetition] = useState<Competition>();

    useEffect(() => {
        registerListener("competition", (data) => {
            setCompetition(data);
        });
    }, []);

    // const ws = useRef<WebSocket>();
    //
    // const handleData = (data: string) => {
    //     const { topic, data: message } = JSON.parse(data);
    //
    //     switch (topic) {
    //         case "competition":
    //             setCompetition(message);
    //             break;
    //         default:
    //             break;
    //     }
    // };

    return { competition };
};

export default useCompetition;
