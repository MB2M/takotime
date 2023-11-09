import type MqttService from "../../services/mqtt.service";
import type LiveSystem from "../libs/LiveSystem";
import logger from "../../config/logger";
import { EventMessageSchema } from "../libs/zodSchema/eventMessage";
import EventEmitter from "events";

// business logic
export class MqttController {
    constructor(
        private mqttService: MqttService // private liveSystemService: LiveSystem
    ) {}

    register(topic: string, cb: (message: any) => void) {
        this.mqttService.registerListener(topic, cb);

        // this.mqttService.registerListener(
        //     "station/connection",
        //     async (message) => {
        //         await this.liveSystemService.onStationConnection(message);
        //     }
        // );
        //
        // this.mqttService.registerListener("station/buzz", async (message) => {
        //     try {
        //         await this.liveSystemService.onStationBuzz(message);
        //     } catch (error: any) {
        //         logger.error(error);
        //     }
        // });
        //
        // this.mqttService.registerConnectListener(async () => {
        //     await this.liveSystemService.onServerConnection();
        // }, true);
    }

    registerOnConnect(cb: () => void) {
        this.mqttService.registerConnectListener(async () => {
            cb();
        });
    }

    // register to a specific event and send it through mqtt
    listen(eventEmitter: EventEmitter, eventName: string, prefix: string = "") {
        eventEmitter.on(eventName, (message) => {
            try {
                const parsedMessage = EventMessageSchema.parse(message);
                if (typeof parsedMessage === "string") {
                    return this.mqttService.send(
                        `${prefix ? `${prefix}/` : ""}${eventName}`,
                        parsedMessage
                    );
                }

                const { id, ...data } = parsedMessage;

                this.mqttService.send(
                    `${prefix ? `${prefix}/` : ""}${eventName}${
                        id ? `/${id}` : ""
                    }`,
                    JSON.stringify(data)
                );
            } catch (error: any) {
                logger.error(
                    error
                    // "Tried to send a message through MQTT, but it failed"
                );
            }
        });
    }
}
