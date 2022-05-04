import aedes, { Aedes } from "aedes";
import net from "net";
import mongoPersistence from "aedes-persistence-mongodb";
import aedeslogging from "aedes-logging";

class MqttBroker {
    socket!: Aedes;
    server!: net.Server;

    start(port: number, databaseUrl?: string) {
        this.init(databaseUrl);
        this.server.listen(port, () => {
            console.log("server started and listening on port ", port);
        });
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

    init(databaseUrl?: string) {
        const socket = databaseUrl
            ? aedes({
                  persistence: mongoPersistence({
                      url: databaseUrl,
                      ttl: {
                          packets: 300, // Number of seconds
                          subscriptions: 300,
                      },
                  }),
              })
            : aedes();
        const server = net.createServer(socket.handle);

        this.socket = socket;
        this.server = server;
        aedeslogging({ instance: aedes, server: server });
        return { socket, server };
    }
}

export default new MqttBroker();
