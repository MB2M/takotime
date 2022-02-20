class BLEPeripheral {
    constructor(peripheral, role, subscribeCallback) {
        this.peripheral = peripheral;
        (this.role = role), (this.subscribeCallback = subscribeCallback);
    }

    async getCharac(serviceUUID) {
        try {
            const service = (
                await this.peripheral.discoverServicesAsync([serviceUUID])
            )[0];
            const charac = (await service.discoverCharacteristicsAsync())[0];
            return charac;
        } catch (err) {
            console.log(err);
        }
    }

    subscribe() {
        this.charac &&
            this.charac.subscribe((error) => {
                console.log("init subscribe");
                this.charac.on("data", (data) => {
                    console.log(data.toString());
                    this.subscribeCallback(data.toString());
                });
            });
    }

    async initAndSubscribe(serviceUUID, cb) {
        try {
            await this.peripheral.connectAsync();
            this.charac = await this.getCharac(serviceUUID);
            this.subscribe();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async init(serviceUUID) {
        try {
            await this.peripheral.connectAsync();
            this.charac = await this.getCharac(serviceUUID);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}

export default BLEPeripheral;
