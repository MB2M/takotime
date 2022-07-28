// import { useEffect, useState } from "react";

// export default function usePlanning(eventId: number, interval = 30000) {
//     const [planning, setPlanning] = useState<any[]>([]);

//     async function loadData() {
//         const response = await fetch(
//             "https://competitioncorner.net/api2/v1/schedule/events/" +
//                 eventId +
//                 "/workouts"
//         );
//         const json = await response.json();
//         const workouts = json.workouts;
//         if (workouts) {
//             const planning = await loadPlanning(workouts);
//             setPlanning(planning);
//         }
//     }

//     useEffect(() => {
//         loadData();
//         const timer = setInterval(() => {
//             loadData();
//         }, interval);

//         return () => clearInterval(timer);
//     }, [eventId, interval]);

//     return planning;
// }

// async function loadPlanning(workouts: any) {
//     var heats_all = [];
//     for (var workout of workouts) {
//         if (
//             !workout.name.startsWith("WOD 4") &&
//             !workout.name.startsWith("FLOATER - INDIV")
//         ) {
//             let heats = await loadHeats(workout.id);
//             for (let heat of heats) {
//                 let wod_day = new Date(workout.date).toDateString();
//                 let wod_time = wod_day + " " + heat["time"];
//                 heat["time"] = new Date(wod_time);
//                 heat["workoutId"] = workout.id;
//                 heat["workoutName"] = workout.name;
//             }
//             heats_all.push(heats);
//         }
//     }
//     heats_all = heats_all.flat();
//     heats_all = heats_all.sort((a, b) => a.time - b.time);
//     return heats_all;
// }

// async function loadHeats(workoutId: number) {
//     console.log("requete CC");
//     let response = await fetch(
//         "https://competitioncorner.net/api2/v1/schedule/workout/" + workoutId
//     );
//     let json = response.json();
//     return json;
// }
