import { useState, useRef } from "react";

const useCompetition = () => {
    const [competition, setCompetition] = useState<Competition>();
    const ws = useRef<WebSocket>();

    const handleData = (data: string) => {
        const { topic, data: message } = JSON.parse(data);
        
        switch (topic) {
            case "competition":
                setCompetition(message);
                break;
            default:
                break;
        }
    };

    return { handleData, ws, competition };
};

export default useCompetition;
