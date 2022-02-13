import mqtt from "mqtt";

class MqttClient {
    client: mqtt.Client;
    connected: boolean;

    constructor(options: object) {
        this.client = this.connect(options);
        this.init();
        this.connected = true;
    }

    connect(options: object) {
        return mqtt.connect("mqtt://localhost:8081", options);
    }

    toggle(callback: any) {
        if (!this.client.connected) {
            this.client.once("connect", () => {
                this.connected = true;
                callback();
            });
            this.client.reconnect();
        } else {
            this.client.end(true, () => {
                this.connected = false;
                callback();
                console.log("after CB");
            });
        }
    }

    init() {
        this.client.on("connect", function () {
            console.log("mqtt client connected");
        });

        this.client.on("close", () => {
            console.log("mqtt client end");
        });

        this.client.on("reconnect", () => {
            console.log("mqtt client reconnect");
        });

        this.client.on("offline", () => {
            console.log("mqtt client offline");
        });
    }
}

export default MqttClient;
