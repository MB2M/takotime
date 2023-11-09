import StationService from "./station.service";

export class StationFactoryService {
    create(data: { laneNumber: number; id: string; category: string }) {
        const { laneNumber, id, category } = data;
        return new StationService(laneNumber, id, category);
    }
}
