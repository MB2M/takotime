import { z } from "zod";

export const BaseMeasurementRecordSchema = z.object({
    partnerId: z.string(),
    value: z.string(),
    round: z.number(),
    timestamp: z.number(),
});

export type BaseMeasurementRecord = z.infer<typeof BaseMeasurementRecordSchema>;

export const classicMeasurementRecordSchema = BaseMeasurementRecordSchema.merge(
    z.object({ recordType: z.literal("classic") })
);
export type ClassicMeasurementRecord = z.infer<
    typeof classicMeasurementRecordSchema
>;

export const SplitMeasurementRecordSchema = BaseMeasurementRecordSchema.merge(
    z.object({ repIndex: z.number(), recordType: z.literal("split") })
);
export type SplitMeasurementRecord = z.infer<
    typeof SplitMeasurementRecordSchema
>;

export const MaxWeightMeasurementRecordSchema =
    BaseMeasurementRecordSchema.merge(
        z.object({
            recordType: z.literal("maxWeight"),
            state: z.enum(["Cancel", "Success", "Fail", "Try"]),
        })
    );
export type MaxWeightMeasurementRecord = z.infer<
    typeof MaxWeightMeasurementRecordSchema
>;

export const MeasurementRecordSchema = z.discriminatedUnion("recordType", [
    MaxWeightMeasurementRecordSchema,
    classicMeasurementRecordSchema,
    SplitMeasurementRecordSchema,
]);

export type MeasurementRecord = z.infer<typeof MeasurementRecordSchema>;

type MeasurementRecordType = MeasurementRecord["recordType"];

export type MeasurementRecordDiscriminator<T extends MeasurementRecordType> =
    Extract<MeasurementRecord, { recordType: T }>;
