import AbstractEventsubscription from "./AbstractEventsubscription";
import liveApp from "..";
import WodTimerServices from "../services/WodTimerServices";

class WodTimerSubscription extends AbstractEventsubscription {
    constructor(eventEmitter: WodTimerServices) {
        super(eventEmitter);
    }

    load() {
        this.eventEmitter.on("wodUpdate", async (topic) => {
            console.log(`wod ${topic}`);

            const wodTimerservice = this.eventEmitter as WodTimerServices;

            await liveApp.manager.keyv.set("state", wodTimerservice.state);
            liveApp.manager.websocketMessages.sendGlobalsToAllClients();

            switch (topic) {
                case "countdown":
                    liveApp.manager.sendGlobalsToChannel();
                    // liveApp.manager.mqttServices.send(
                    //     "server/chrono",
                    //     await liveApp.manager.chronoData()
                    // )
                    const { duration, startTime } =
                        await liveApp.manager.chronoData();

                    const countdown = Math.ceil(
                        (startTime - Date.now()) / 1000
                    );

                    liveApp.manager.mqttServices.send(
                        "server/chrono",
                        JSON.stringify({
                            action: "start",
                            duration,
                            countdown,
                        })
                    );
                    break;
                case "start":
                    // liveApp.manager.buzz();
                    liveApp.manager.mqttServices.send("server/buzzer", "buzz");
                    liveApp.manager.sendGlobalsToChannel();
                    const rankInterval = setInterval(() => {
                        liveApp.manager.publishRank();
                    }, 300);
                    liveApp.manager.timeOuts?.push(rankInterval);
                    break;
                case "finish":
                    liveApp.manager.sendGlobalsToChannel();
                    liveApp.manager.clearAlltimeout();
                    setTimeout(() => {
                        liveApp.manager.publishRank();
                    }, 4000);
                    break;
                case "reset":
                    liveApp.manager.clearAlltimeout();
                    liveApp.manager.sendFullConfig("server/wodConfigUpdate");
                    liveApp.manager.websocketMessages.sendStationsToAllClients();
                    // liveApp.manager.mqttServices.send(
                    //     "server/chrono",
                    //     await liveApp.manager.chronoData()
                    // );
                    liveApp.manager.mqttServices.send(
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
