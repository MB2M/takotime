import AbstractEventSubscription from "./AbstractEventSubscription";
import WodTimer from "../../lib/timer/WodTimer";
import { liveApp } from "../../app";

class WodTimerSubscription extends AbstractEventSubscription {
    constructor(eventEmitter: WodTimer) {
        super(eventEmitter);
    }

    load() {
        this.eventEmitter.on("wodUpdate", async (topic) => {
            console.log(`wod ${topic}`);

            const wodTimerservice = this.eventEmitter as WodTimer;

            await liveApp.keyv.set("state", wodTimerservice.state);
            liveApp.websocketMessages.sendGlobalsToAllClients();

            switch (topic) {
                case "countdown":
                    liveApp.sendGlobalsToChannel();
                    // liveApp.mqttServices.send(
                    //     "server/chrono",
                    //     await liveApp.chronoData()
                    // )
                    const { duration, startTime } = await liveApp.chronoData();

                    const countdown = Math.ceil(
                        (startTime - Date.now()) / 1000
                    );

                    liveApp.mqttServices.send(
                        "server/chrono",
                        JSON.stringify({
                            action: "start",
                            duration,
                            countdown,
                        })
                    );
                    break;
                case "start":
                    liveApp.buzz();
                    liveApp.mqttServices.send("server/buzzer", "buzz");
                    liveApp.sendGlobalsToChannel();
                    const rankInterval = setInterval(() => {
                        liveApp.publishRank();
                    }, 300);
                    liveApp.timeOuts?.push(rankInterval);
                    break;
                case "finish":
                    liveApp.sendGlobalsToChannel();
                    liveApp.clearAlltimeout();
                    setTimeout(() => {
                        liveApp.publishRank();
                    }, 4000);
                    break;
                case "reset":
                    liveApp.clearAlltimeout();
                    liveApp.sendFullConfig("server/wodConfigUpdate");
                    liveApp.websocketMessages.sendStationsToAllClients();
                    // liveApp.mqttServices.send(
                    //     "server/chrono",
                    //     await liveApp.chronoData()
                    // );
                    liveApp.mqttServices.send(
                        "server/chrono",
                        JSON.stringify({
                            action: "reset",
                        })
                    );
                    break;
                default:
                    break;
            }
        });
    }
}

export default WodTimerSubscription;
