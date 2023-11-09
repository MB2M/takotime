import { z } from "zod";
import { AvailableAdapters } from "./adapters";

declare module "aedes-logging";

type LiveScoreType = "forTime" | "amrap";

//TODO: Make this more generic: optionnals should depend on the LiveScoreType
interface BaseLiveScoreRecord {
    partnerId: string;
    value: string;
    round: number;
    timestamp: number;
}

interface LiveScoreMaxWeightRecord extends BaseLiveScoreRecord {
    state: LiftState;
}

interface LiveScoreClassicRecord extends BaseLiveScoreRecord {}
interface LiveScoreSplitRecord extends BaseLiveScoreRecord {
    repIndex: number;
}

type AvailableScoreRecord =
    | LiveScoreSplitRecord
    | LiveScoreMaxWeightRecord
    | LiveScoreClassicRecord;

type MeasurementType = "maxWeight" | "classic" | "split";

type LiveScoreUnit<T extends LiveScoreType> = T extends "forTime"
    ? "reps"
    : "reps" | "kg";

interface ILiveTime {
    time: number;
    active: boolean;
}

// type ScoreService =
//     | SplitScoreService
//     | MaxWeightScoreService
//     | ForTimeScoreService
//     | AmarapScoreService;

interface EventStation {
    id: string;
    laneNumber: number;
    category: string;
}

interface EventConfig {
    measurements: {
        id: string;
        type: AvailableAdapters["_tag"];
        config: z.infer<AvailableAdapters["_configSchema"]>;
    }[];
    categories: string[];
}

interface EventMeasurement {
    id: string;
    type: MeasurementType;
    config: BaseScoreConfig<LiveScoreType> | SplitScoreConfig<LiveScoreType>;
}

type BaseScoreConfig<T extends LiveScoreType = "amrap"> = T extends "forTime"
    ? {
          timeSize: number;
          maxReps: number;
          minReps: number;
      }
    : object;

type SplitScoreConfig<T extends LiveScoreType> = T extends "forTime"
    ? {
          timeSize: number;
          limits: {
              repIndex: number;
              maxReps: number;
              minReps: number;
          }[];
      }
    : object;

type LiftState = "Cancel" | "Success" | "Fail" | "Try";
