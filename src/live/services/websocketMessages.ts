import liveApp from "..";
import WebsocketServices from "./websocketServices";

class WebSocketMessages {
    websocketServices: WebsocketServices;

    constructor(websocketServices: WebsocketServices) {
        this.websocketServices = websocketServices;
    }

    async sendStationsToAllClients() {
        const stations = await liveApp.manager.getAllStations();
        this.websocketServices.sendToAllClients("stationUpdate", stations);
    }

    async sendGlobalsToAllClients() {
        const globals = await liveApp.manager.getGlobals();
        this.websocketServices.sendToAllClients("globalsUpdate", globals);
    }

    async sendStationDevicesToAllClients() {
        const stationDevicesList = await liveApp.manager.getAllStationDevices();
        this.websocketServices.sendToAllClients(
            "devicesConfig",
            stationDevicesList
        );
    }

    async sendActiveWorkoutListToAllClients() {
        const workoutIds = await liveApp.manager.getAllWorkouts();
        this.websocketServices.sendToAllClients(
            "activeWorkoutList",
            workoutIds
        );
    }

    async sendLoadedWorkoutsToAllClients() {
        const workouts = await liveApp.manager.getLoadedWorkouts();
        this.websocketServices.sendToAllClients("loadedWorkouts", workouts);
    }

    // async sendBrokerClientStatusToAllClients() {
    //     const clients = await liveApp.manager.getAllBrokerClient();
    //     this.websocketServices.sendToAllClients("brokerUpdate", clients);
    // }
}

export default WebSocketMessages;
