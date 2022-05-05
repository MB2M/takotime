import noble from "@abandonware/noble";
import EventEmitter from "events";
import { toUSVString } from "util";
import BLEPeripheral from "./BLEPeripheral.js";

const COUNTER_SERVICE_UUID = "364dff7c036546888146b1c0234e7ebb";
const BOARD_SERVICE_UUID = "60060b33e06546ab96d41be77c461ebb";

class BLEServices extends EventEmitter {
    constructor() {
        super();
        this.connectedDevices = [];
        this.requiredPeripherals = [];
        noble.on("discover", this.discoverListener.bind(this));
    }

    allIsConnected() {
        return (
            this.connectedDevices.length === this.requiredPeripherals.length &&
            this.connectedDevices.every(
                (d) => d.peripheral.state === "connected"
            )
        );
    }

    async discoverListener(peripheral) {
        const requiredDevice = this.requiredPeripherals.find(
            (d) => d.id === peripheral.id
        );

        if (!requiredDevice) return;

        await noble.stopScanningAsync();
        const blePeripheral = new BLEPeripheral(
            peripheral,
            requiredDevice.role,
            requiredDevice.cb
        );
        this.connectedDevices.push(blePeripheral);
        blePeripheral.peripheral.once("connect", async () => {
            console.log(`>>> ${blePeripheral.role} connected`);
            if (!this.allIsConnected()) this.scan();
        });

        blePeripheral.peripheral.once("disconnect", async () => {
            console.log(`>>> ${blePeripheral.role} disconnected`);
            this.emit("stateChange", blePeripheral);
            this.scan();
        });

        let subSuccess = false;

        let subtry = 5;

        while (!subSuccess && subtry > 0) {
            subtry--;
            switch (blePeripheral.role) {
                case "counter":
                    subSuccess = await blePeripheral.initAndSubscribe(
                        COUNTER_SERVICE_UUID
                    );
                    break;
                case "board":
                    subSuccess = await blePeripheral.init(BOARD_SERVICE_UUID);
                    break;
                default:
                    break;
            }
    
            if (subSuccess) this.emit("stateChange", blePeripheral);
        }
    }

    async scan() {
        await noble.startScanningAsync().catch(() => {
            noble.on("stateChange", async (state) => {
                if (state === "poweredOn") {
                    await noble.startScanningAsync([
                        COUNTER_SERVICE_UUID,
                        BOARD_SERVICE_UUID,
                    ]);
                }
            });
        });
    }

    async resetConnection(scan = true) {
        for (let i = this.connectedDevices.length - 1; i >= 0; i--) {
            this.connectedDevices[i].peripheral.disconnect();
            this.connectedDevices.splice(i, 1);
        }

        scan && this.scan();
    }

    arrayEquals(a1, a2) {
        const result = a2.filter((e) => {
            return a1.includes(e);
        });
        return Math.max(a1.length, a2.length) === result.length;
    }

    isNewDevices(newDevices) {
        const actualIds = this.connectedDevices.map((d) => d.peripheral.id);
        const newIds = newDevices.map((d) => d.id);
        return !this.arrayEquals(actualIds, newIds);
    }

    connectTo(devices) {
        if (this.isNewDevices(devices)) {
            for (let i = this.connectedDevices.length - 1; i >= 0; i--) {
                this.connectedDevices[i].peripheral.disconnect();
                this.connectedDevices.splice(i, 1);
            }
        }

        this.requiredPeripherals = devices;

        if (!this.allIsConnected()) {
            this.scan();
        } else {
            this.connectedDevices.forEach((d) => this.emit("stateChange", d));
        }
    }
}

export default BLEServices;
