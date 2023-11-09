abstract class BaseMeasurementService<T> {
    protected _records: T[] = [];
    abstract readonly _type: string;

    constructor(
        protected _id: string // external score id for example // protected config: U
    ) {}

    get id() {
        return this._id;
    }

    get records() {
        return this._records;
    }

    addRecord(record: T): void {
        const rec = { ...record, timestamp: Date.now() };
        this._records.push(rec);
    }

    // abstract validateRecord(record: T): boolean;
}

export default BaseMeasurementService;
