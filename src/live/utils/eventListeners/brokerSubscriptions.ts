import { Aedes } from "aedes";

const brokerSubscription = {
    load: (emitter: Aedes, listener: any) => {
        emitter.on(
            "clientReady", () => 
            listener.sendStationStatusToAllClients()
        );

        emitter.on(
            "clientDisconnect", () =>
            listener.sendStationStatusToAllClients()
        );
    },
};

export default brokerSubscription;
