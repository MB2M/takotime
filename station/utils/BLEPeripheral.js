class BLEPeripheral {
    constructor(peripheral, serviceUUID) {
        this.peripheral = peripheral;
    }

    async getCharac(serviceUUID) {
        const service = (
            await this.peripheral.discoverServicesAsync([serviceUUID])
        )[0];
        const charac = (await service.discoverCharacteristicsAsync())[0];
        return charac;
    }

    subscribe(cb) {
        this.charac.subscribe((error) => {
            console.log("init subscribe");
            this.charac.on("data", (data) => {
                console.log(data.toString());
                cb(data.toString());
            });
        });
    }

    async initAndSubscribe(serviceUUID, cb) {
        await this.peripheral.connectAsync();
        this.charac = await this.getCharac(serviceUUID);
        this.subscribe(cb);
    }

    async init(serviceUUID) {
        await this.peripheral.connectAsync();
        this.charac = await this.getCharac(serviceUUID);
    }
}

export default BLEPeripheral;
