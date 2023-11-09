import { Model } from "mongoose";

export default class IpConfigService {
    constructor(private ipConfig: Model<IIpConfig>) {}

    getStation = (id: string) => this.ipConfig.findOne({ id }).exec();

    updateStation = async ({
        id,
        floor,
        laneNumber,
    }: Pick<IIpConfig, "id"> & Partial<Omit<IIpConfig, "id">>) => {
        await this.ipConfig.updateOne(
            { id },
            { floor, laneNumber },
            { upsert: true }
        );
    };

    resetStations = async () => {
        await this.ipConfig.deleteMany();
    };
}
