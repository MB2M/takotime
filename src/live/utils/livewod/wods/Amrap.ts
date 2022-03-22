import BaseLiveWod from "./BaseLiveWod.js";
import { State } from "../../libs/State.js";

// class Amrap extends BaseLiveWod {
//     elements: Array<keyof WodData["data"]> = [
//         "state",
//         "reps",
//         "finish",
//         "result",
//         "totalRepsOfMovement",
//         "currentMovement",
//         "repsOfMovement",
//         "nextMovementReps",
//         "nextMovement",
//         "repsTime",
//     ];

//     getWodRank() {
//         const stations: Station[] = this.db.getObject("/stations");
//         let stationRanked = {};

//         stations.forEach((s) => {
//             let count = 0;
//             for (let i = 0; i < stations.length; i++) {
//                 if ((stations[i] || 0) > s.reps) {
//                     count++;
//                 }
//             }
//             stationRanked = { ...stationRanked, [s.lane_number]: count + 1 };
//         });

//         return stationRanked;
//     }

//     update(message: WodData): void {
//         const index = this.db.getIndex(
//             "/stations",
//             message.data.lane_number,
//             "lane_number"
//         );

//         if (message.topic === "blePeripheral") {
//             this.db.push(`/stations[${index}]/configs`, message.data.configs);
//         }

//         if (message.topic === "reps") {
//             this.elements.forEach((e) => {
//                 this.db.push(
//                     `/stations[${index}]/${e}`,
//                     message.data[e],
//                     false
//                 );
//             });
//         }
//     }

//     start(options: Options): void {
//         this.db.push("/globals/duration", options.duration);
//         this.db.push("/globals/startTime", options.startTime);

//         this.updateState(State.Countdown);
//         this.launchTimer(options.duration, options.startTime);

//         this.emit("wodCountdown", options.startTime, options.duration);
//     }
// }

// export default Amrap;
