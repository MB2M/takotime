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

                    break;
                case "start":
                    liveApp.manager.sendGlobalsToChannel();
                    const rankInterval = setInterval(() => {
                        liveApp.manager.publishRank();
                    }, 300);
                    liveApp.manager.timeOuts?.push(rankInterval);
                    break;
                case "finish":
                    liveApp.manager.sendGlobalsToChannel();
                    liveApp.manager.clearAlltimeout();
                    break;
                case "reset":
                    liveApp.manager.clearAlltimeout();
                    liveApp.manager.sendFullConfig("server/wodConfigUpdate");
                    liveApp.manager.websocketMessages.sendStationsToAllClients();
                    break;
                default:
                    break;
            }
        });
    }
}

export default WodTimerSubscription;