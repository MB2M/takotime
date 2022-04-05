// import WebSocket from "ws";
// import StationDevices from "../../models/StationDevices";
// import StationDynamics from "../../models/StationDynamics";
// import StationStatics from "../../models/Station";
// import Workout from "../../models/Workout";
// import keyvInstance from "../../services/keyvMongo";
// import liveApp from "../..";

// class WebsocketSender {
//     wss: WebSocket.Server<WebSocket.WebSocket>;

//     constructor(wss: WebSocket.Server<WebSocket.WebSocket>) {
//         this.wss = wss;
//     }

//     sendToAllClients(topic: string, data: any) {
//         this.wss.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(
//                     JSON.stringify({
//                         topic: topic,
//                         data: data,
//                     })
//                 );
//             }
//         });
//     }

//     async sendStaticsToAllClients() {
//         const stationStatics = await StationStatics.find().exec();
//         this.sendToAllClients("staticsUpdate", stationStatics);
//     }

//     async sendDynamicsToAllClients() {
//         const stationDynamics = await StationDynamics.find().exec();
//         this.sendToAllClients("dynamicsUpdate", stationDynamics);
//     }

//     async sendStationDevicesToAllClients() {
//         const stationDevices = await StationDevices.find().exec();
//         this.sendToAllClients("devicesConfig", stationDevices);
//     }

//     async sendGlobalsToAllClients() {
//         this.sendToAllClients(
//             "globalsUpdate",
//             await liveApp.manager.getGlobals()
//         );
//     }

//     async sendWorkoutsToAllClients() {
//         const workoutIds = await Workout.find(
//             { active: true },
//             "customId"
//         ).exec();
//         this.sendToAllClients("workoutIds", workoutIds);
//     }

//     async sendLoadedWorkoutsToAllClients() {
//         const workoutIds = await keyvInstance.get("workoutIds");
//         const workouts = await Promise.all(
//             workoutIds.map(async (id: string) => {
//                 try {
//                     const workout = await Workout.findById(id).exec();
//                     return workout;
//                 } catch (err) {
//                     return;
//                 }
//             })
//         );
//         this.sendToAllClients("loadedWorkouts", workouts);
//     }

//     sendStationStatusToAllClients() {
//         let clients = {};
//         Object.entries(
//             global.liveWodManager.mqttBroker.socket.clients as object
//         ).forEach(([k, v]) => {
//             clients = { ...clients, [k]: v.connected };
//         });

//         this.sendToAllClients("brokerUpdate", clients);
//     }
// }

// export default WebsocketSender;
