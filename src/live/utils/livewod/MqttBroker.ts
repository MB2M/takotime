import aedes, { Aedes } from "aedes";
import net from "net";
import mongoPersistence from "aedes-persistence-mongodb";

class MqttBroker {
    port: number;
    databaseUrl?: string;
    started?: boolean;
    socket: Aedes;
    server: net.Server;

    constructor(port: number, databaseUrl?: string, start = false) {
        this.port = port;
        this.databaseUrl = databaseUrl;
        this.socket = databaseUrl
            ? aedes({
                  persistence: mongoPersistence({
                      url: this.databaseUrl,
                      // Optional ttl settings
                      ttl: {
                          packets: 300, // Number of seconds
                          subscriptions: 300,
                      },
                  }),
              })
            : aedes();
        this.server = net.createServer(this.socket.handle);
        this.socket.authenticate = function (client, username, password, cb) {
            cb(
                null,
                (process.env.BROKER_USERNAME as string) === username &&
                    (process.env.BROKER_PASSWORD as string) ===
                        password.toString()
            );
        };
        if (start) {
            this.start();
        } else {
            this.started = false;
        }
    }

    toggle(): void {
        this.started ? this.stop() : this.start();
    }

    start(): void {
        this.server.listen(this.port, () => {
            console.log("server started and listening on port ", this.port);
        });
        this.started = true;
        // fired when a client connects
        this.socket.on("client", (client) => {
            console.log(
                "Client Connected: \x1b[33m" +
                    (client ? client.id : client) +
                    "\x1b[0m",
                "to broker",
                this.socket.id
            );
        });

        this.socket.on("clientDisconnect", (client) => {
            console.log(
                "Client Disconnected: \x1b[33m" +
                    (client ? client.id : client) +
                    "\x1b[0m",
                "to broker",
                this.socket.id
            );
        });
    }

    stop(): void {
        // Server accept no more connection but keep active those who exist
        this.server.close(() => {
            console.log("server closed");
        });
        // this.socket.close();                      // using this close connection dans subscriber won't try to reconnect
        this.started = false;
    }
}

export default MqttBroker;
