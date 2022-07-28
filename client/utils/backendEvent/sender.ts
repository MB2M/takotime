import EventEmitter from "events";

const eventEmitter = new EventEmitter();

eventEmitter.on("update", () => console.log("update"));

export const sender = async (data: any) => {
    eventEmitter.emit("update", data);
};
