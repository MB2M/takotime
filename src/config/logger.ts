import pino from "pino";

const transport = pino.transport({
    targets: [
        {
            level: "trace",
            target: "pino/file",
            options: { destination: `./live.log` },
            // options: { destination: `/var/log/tako/live.log` },
        },
        {
            level: "info",
            target: "pino-pretty",
            options: {},
        },
    ],
});

export default pino(
    {
        level: process.env.PINO_LOG_LEVEL || "info",
        timestamp: pino.stdTimeFunctions.isoTime,
    },
    transport
    // pino.destination({ dest: `${__dirname}/app.log`, append: true, sync: true })
);
