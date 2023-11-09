import BaseAdapter from "./baseAdapter";
import { z, ZodSchema } from "zod";
import { ILiveTime } from "../../../types/LiveApp";
import WodTimer from "../../../lib/timer/WodTimer";

export default class Measurement<
    ScoreType = any,
    RecordType extends ZodSchema = any,
    ConfigType extends ZodSchema = any
> {
    private _records: z.infer<RecordType>[] = [];
    private _currentScore: ScoreType | null = null;
    protected _times: ILiveTime[] = [];

    constructor(
        private _id: string,
        private _adapter: BaseAdapter<RecordType, ConfigType, ScoreType>,
        private _config: z.infer<ConfigType>,
        private _timer: WodTimer
    ) {}

    get timer(): WodTimer {
        return this._timer;
    }
    get times(): ILiveTime[] {
        return this._times;
    }
    private getTime(time: number) {
        const foundTime = this._times.find((t) => t.time === time);
        if (!foundTime) throw new Error("Time not found");
        return foundTime;
    }

    private _hasRequiredActiveTime() {
        return this._adapter.hasRequiredActiveTime(this);
    }

    addTime(time: number, active?: boolean) {
        this._times.push({
            time,
            active: active || !this._hasRequiredActiveTime(),
        });
        this.calculateScore();
    }

    toggleTimeState(time: number) {
        const foundTime = this.getTime(time);
        foundTime.active = !foundTime.active;
    }

    getAllActiveTimes() {
        return this._times.filter((t) => t.active);
    }

    get currentScore() {
        return this._currentScore;
    }

    get id() {
        return this._id;
    }

    get records() {
        return this._records;
    }

    get config() {
        return this._config;
    }

    toJSON() {
        return {
            id: this._id,
            type: this._adapter._tag,
            ...this.currentScore,
        };
    }

    private _addRecord(record: z.infer<RecordType>): void {
        const rec = { ...record, timestamp: Date.now() };
        this._records.push(rec);
    }

    addRecord(record: z.infer<RecordType>): void {
        if (this.validateRecord(record)) {
            this._addRecord(record);
            this.calculateScore();
        }
    }

    validateRecord(record: RecordType): boolean {
        const parsedRecord = this._adapter.recordSchema.parse(record);
        return this._adapter.validateRecord(this, parsedRecord);
    }

    calculateScore(): void {
        this._currentScore = this._adapter.toStream(this);
    }
}
