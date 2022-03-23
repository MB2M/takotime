import Wod from "../livewod/wods/BaseLiveWod";

const wodSubscription = {
    load: (emitter: Wod, listener: any) => {
        // emitter.on("station/updated", () =>
        //     listener.sendStationDataToAllClients()
        // );

        emitter.on("wodUpdate", (type: string) => {
            listener.sendGlobalsToAllClients();
            if (type === "reset") {
                console.log("send statics");
                listener.sendStaticsToAllClients();
            }
        });
    },
};

export default wodSubscription;
