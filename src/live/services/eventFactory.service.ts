import EventService from "./event.service";
import type { StationFactoryService } from "./stationFactory.service";
import WodTimer from "../../lib/timer/WodTimer";
import { EventInterpreterService } from "./eventInterpreter.service";
import { EventConfig, EventStation } from "../../types/LiveApp";

export class EventFactoryService {
    constructor(private stationFactoryService: StationFactoryService) {}
    create(
        floorId: string,
        eventStations: EventStation[],
        eventConfigs: EventConfig[]
    ) {
        const eventService = new EventService(
            floorId,
            new WodTimer(),
            new EventInterpreterService(eventConfigs),
            this.stationFactoryService
        );

        eventStations.forEach((station) => {
            eventService.addStation({
                id: station.id,
                laneNumber: station.laneNumber,
                category: station.category,
            });
        });

        return eventService;
    }
}
