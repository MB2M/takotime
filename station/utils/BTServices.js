import noble from "@abandonware/noble";
import BLEPeripheral from "./BLEPeripheral.js";

const COUNTER_SERVICE_UUID = "364dff7c036546888146b1c0234e7ebb";
const BOARD_SERVICE_UUID = "60060b33e06546ab96d41be77c461ebb";

class BLEServices {
    constructor() {}

    async scan(peripherals) {
        await noble.startScanningAsync().catch(() => {
            noble.on("stateChange", async (state) => {
                if (state === "poweredOn") {
                    await noble.startScanningAsync();
                }
            });
        });

        noble.on("discover", async (peripheral) => {
            console.log("discover: ", peripheral.id);
            if (peripheral.id === peripherals.counter.id) {
                await noble.stopScanningAsync();
                this.counter = new BLEPeripheral(peripheral);
                this.counter.initAndSubscribe(
                    COUNTER_SERVICE_UUID,
                    peripherals.counter.cb
                );
                this.counter.peripheral.once("disconnect", async () => {
                    console.log("disconnected");
                    await noble.startScanningAsync();
                });
                if (!this.board) await noble.startScanningAsync();
            }
            if (peripheral.id === peripherals.board.id) {
                await noble.stopScanningAsync();
                this.board = new BLEPeripheral(peripheral);
                this.board.init(BOARD_SERVICE_UUID);
                console.log("connected to board");
                this.board.peripheral.once("disconnect", async () => {
                    console.log("disconnected");
                    await noble.startScanningAsync();
                });
                if (!this.counter) await noble.startScanningAsync();
            }
        });
    }

    disconnect(peripheralType) {
        switch (peripheralType) {
            case "counter":
                this.counter && this.counter.peripheral.disconnect();
                this.counter = null;
                break;
            case "board":
                this.board && this.board.peripheral.disconnect();
                this.board = null;
                break;

            default:
                break;
        }
    }
}

export default BLEServices;
