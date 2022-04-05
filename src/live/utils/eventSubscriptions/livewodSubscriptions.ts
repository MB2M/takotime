// import LiveWodManager from "../livewod/LiveWodManager";

// const livewodSubscription = {
//     load: (emitter: LiveWodManager, listener: any) => {
//         emitter.on("setDevices", () =>
//             listener.sendStationDevicesToAllClients()
//         );

//         emitter.on("setStationStatics", () => {
//             listener.sendStaticsToAllClients();
//         });

//         emitter.on("setWorkout", () => {
//             listener.sendWorkoutsToAllClients();
//         });

//         emitter.on("setExternalLoad", () => {
//             listener.sendGlobalsToAllClients();
//         });

//         emitter.on("loadWorkout", () => {
//             listener.sendLoadedWorkoutsToAllClients();
//         });

//         emitter.on("station/deviceUpdated", () =>
//             listener.sendStationDevicesToAllClients()
//         );

//         emitter.on("station/dynamicsUpdated", () =>
//             listener.sendStaticsToAllClients()
//         );

//         emitter.on("rank", (stationRanked: StationRanked) => {
//             listener.sendToAllClients("rank", stationRanked || "");
//         });
//     },
// };

// export default livewodSubscription;
