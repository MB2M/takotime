import WebsocketServices from "./websocketServices";
import { liveApp } from "../../app";

class WebSocketMessages {
    websocketServices: WebsocketServices;

    constructor(websocketServices: WebsocketServices) {
        this.websocketServices = websocketServices;
    }

    async sendStationsToAllClients() {
        const stations = await liveApp.getAllStations();
        this.websocketServices.sendToAllClients("stationUpdate", stations);
    }

    async sendGlobalsToAllClients() {
        const globals = await liveApp.getGlobals();
        this.websocketServices.sendToAllClients("globalsUpdate", globals);
    }

    async sendStationDevicesToAllClients() {
        const stationDevicesList = await liveApp.getAllStationDevices();
        this.websocketServices.sendToAllClients(
            "devicesConfig",
            stationDevicesList
        );
    }

    async sendDevicesToAllClients() {
        const devicesList = await liveApp.getAllDevices();
        this.websocketServices.sendToAllClients("devices", devicesList);
    }

    async sendActiveWorkoutListToAllClients() {
        const workoutIds = await liveApp.getAllWorkouts();
        this.websocketServices.sendToAllClients(
            "activeWorkoutList",
            workoutIds
        );
    }

    async sendLoadedWorkoutsToAllClients() {
        const workouts = await liveApp.getLoadedWorkouts();
        this.websocketServices.sendToAllClients("loadedWorkouts", workouts);
    }

    // async sendBrokerClientStatusToAllClients() {
    //     const clients = await liveApp.getAllBrokerClient();
    //     this.websocketServices.sendToAllClients("brokerUpdate", clients);
    // }
}

export default WebSocketMessages;
